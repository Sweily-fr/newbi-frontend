import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_FILE_TRANSFER_BY_DOWNLOAD_LINK } from '../graphql/queries';
import { FileTransferPaymentCheckout } from '../components/FileTransferPaymentCheckout';
import { logger } from '../../../utils/logger';
import { Spinner } from '../../../components/common/Spinner';
import { Button } from '../../../components/common/Button';
import { ArrowDown, TickCircle } from 'iconsax-react';

// Composant pour la page de téléchargement de fichiers
export const FileTransferDownloadPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPaid, setIsPaid] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Récupérer le lien et la clé d'accès depuis les paramètres de recherche
  const downloadLink = searchParams.get('link') || '';
  const accessKey = searchParams.get('key') || '';

  // Vérifier si le paiement a été effectué (via query param après redirection de Stripe)
  useEffect(() => {
    const paymentStatus = searchParams.get('payment_status');
    
    if (paymentStatus === 'success') {
      setIsPaid(true);
      // Nettoyer l'URL en supprimant les paramètres de paiement
      searchParams.delete('payment_status');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  // Ajouter des logs pour déboguer
  console.log('Paramètres URL:', { downloadLink, accessKey });

  // Récupérer les informations du transfert de fichier
  const { loading, error, data } = useQuery(GET_FILE_TRANSFER_BY_DOWNLOAD_LINK, {
    variables: { downloadLink, accessKey },
    fetchPolicy: 'network-only', // Important pour obtenir les dernières informations de paiement
    skip: !accessKey || !downloadLink, // Ne pas exécuter la requête si la clé d'accès ou le lien de téléchargement n'est pas disponible
    onError: (error) => {
      logger.error('Erreur lors de la récupération du transfert de fichier:', error);
    }
  });

  // Gérer le téléchargement des fichiers
  const handleDownload = async () => {
    if (!data?.getFileTransferByLink?.fileTransfer || !fileTransfer.isAccessible) return;
    
    setIsDownloading(true);
    
    try {
      logger.info('Début du téléchargement des fichiers');
      
      // Appel à l'API pour télécharger les fichiers en utilisant des query params
      const response = await fetch(`/api/file-transfer/download-all?link=${downloadLink}&key=${accessKey}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`Erreur HTTP ${response.status}: ${errorText}`);
        throw new Error(`Erreur lors du téléchargement des fichiers (${response.status})`);
      }
      
      // Vérifier le type de contenu de la réponse
      const contentType = response.headers.get('content-type');
      logger.info(`Type de contenu reçu: ${contentType}`);
      
      // Récupérer le blob
      const blob = await response.blob();
      logger.info(`Taille du blob reçu: ${blob.size} octets`);
      
      // Vérifier si le blob est vide ou trop petit
      if (blob.size === 0) {
        throw new Error('Le fichier téléchargé est vide');
      }
      
      // Créer l'URL du blob et le lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Déterminer le nom du fichier
      let fileName = 'fichiers.zip'; // Nom par défaut
      
      // Essayer de récupérer le nom du fichier depuis l'en-tête Content-Disposition
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"|filename=([^;]+)/i);
        if (filenameMatch) {
          fileName = filenameMatch[1] || filenameMatch[2];
        }
      } else if (fileTransfer.files && fileTransfer.files.length > 0) {
        // Utiliser le nom du premier fichier si disponible
        fileName = fileTransfer.files.length > 1 
          ? 'fichiers.zip' 
          : fileTransfer.files[0].originalName;
      }
      
      logger.info(`Téléchargement du fichier: ${fileName}`);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      logger.info('Téléchargement terminé avec succès');
    } catch (err) {
      logger.error('Erreur lors du téléchargement des fichiers:', err);
      // Afficher une alerte à l'utilisateur
      alert(`Erreur lors du téléchargement: ${err instanceof Error ? err.message : 'Une erreur est survenue'}`);
    } finally {
      setIsDownloading(false);
    }
  };

  // Gérer le succès du paiement
  const handlePaymentSuccess = () => {
    setIsPaid(true);
  };

  // Formater la taille du fichier
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Vérifier si les paramètres nécessaires sont disponibles
  if (!downloadLink || !accessKey) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Paramètres manquants</h2>
        <p className="text-gray-700">
          Le lien de téléchargement est incomplet. Veuillez vérifier l'URL ou contacter l'expéditeur pour obtenir un lien valide.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Détails techniques: {!downloadLink ? 'Lien de téléchargement manquant' : 'Clé d\'accès manquante'}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Gérer les erreurs de requête ou les réponses négatives du serveur
  if (error || !data?.getFileTransferByLink || !data?.getFileTransferByLink.success || !data?.getFileTransferByLink.fileTransfer) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
        <p className="text-gray-700">
          {data?.getFileTransferByLink?.message || 
           "Le lien de téléchargement est invalide ou a expiré. Veuillez contacter l'expéditeur pour obtenir un nouveau lien."}
        </p>
      </div>
    );
  }

  const fileTransfer = data.getFileTransferByLink.fileTransfer;
  
  // Ajouter des logs pour déboguer
  console.log('Données du transfert:', JSON.stringify(fileTransfer, null, 2));
  console.log('Infos de paiement:', JSON.stringify(fileTransfer.paymentInfo, null, 2));
  console.log('Conditions de paiement:', {
    isPaymentRequired: fileTransfer.paymentInfo?.isPaymentRequired,
    typeOfIsPaymentRequired: typeof fileTransfer.paymentInfo?.isPaymentRequired,
    isPaidState: isPaid,
    typeOfIsPaidState: typeof isPaid,
    isPaidFromServer: fileTransfer.paymentInfo?.isPaid,
    typeOfIsPaidFromServer: typeof fileTransfer.paymentInfo?.isPaid,
    conditionResult: fileTransfer.paymentInfo?.isPaymentRequired && !isPaid && !fileTransfer.paymentInfo?.isPaid
  });
  
  // Afficher un message de débogage si le transfert ne nécessite pas de paiement ou est déjà payé
  if (fileTransfer.paymentInfo?.isPaymentRequired === false || fileTransfer.paymentInfo?.isPaid === true) {
    console.log('Pas de paiement requis ou déjà payé:', {
      isPaymentRequired: fileTransfer.paymentInfo?.isPaymentRequired,
      isPaid: fileTransfer.paymentInfo?.isPaid
    });
  }

  // Si un paiement est requis et n'a pas encore été effectué
  if (fileTransfer.paymentInfo?.isPaymentRequired && !isPaid && !fileTransfer.paymentInfo?.isPaid) {
    return (
      <div className="container mx-auto py-10 px-4">
        <FileTransferPaymentCheckout
          transferId={fileTransfer.id}
          amount={fileTransfer.paymentInfo.paymentAmount}
          currency={fileTransfer.paymentInfo.paymentCurrency || 'eur'}
          fileName={fileTransfer.files && fileTransfer.files.length > 0 ? fileTransfer.files[0].originalName : 'Fichiers'}
          fileSize={formatFileSize(fileTransfer.totalSize || 0)}
          senderName={'Expéditeur'} // Utiliser une valeur par défaut car le champ n'est pas disponible
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    );
  }

  // Si le paiement a été effectué ou n'est pas requis
  // Vérifier si le transfert est accessible
  const canDownload = fileTransfer.isAccessible || isPaid;
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Téléchargement de fichiers</h2>
          <p className="text-gray-600">
            Un utilisateur vous a partagé {fileTransfer.files && fileTransfer.files.length > 1 ? 'des fichiers' : 'un fichier'}
          </p>
        </div>

        <div className="bg-[#f0eeff] rounded-lg p-4 mb-6">
          <div className="mb-3">
            <h3 className="font-medium text-gray-800">Détails du transfert</h3>
          </div>
          <div>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Nom:</span> {fileTransfer.files && fileTransfer.files.length > 0 ? fileTransfer.files[0].originalName : 'Fichiers'}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Taille:</span> {formatFileSize(fileTransfer.totalSize || 0)}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Nombre de fichiers:</span> {fileTransfer.files ? fileTransfer.files.length : 1}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Expire le:</span> {new Date(fileTransfer.expiryDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {fileTransfer.paymentInfo?.isPaymentRequired && isPaid && (
          <div className="flex items-center mb-4 p-3 bg-green-50 text-green-700 rounded-md">
            <TickCircle size="20" className="mr-2" />
            <span>Paiement effectué avec succès</span>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            onClick={handleDownload}
            disabled={isDownloading || !canDownload}
            className="bg-[#5b50ff] hover:bg-[#4a41e0] text-white py-3 px-6 rounded-full flex items-center justify-center transition-all"
          >
            {isDownloading ? (
              <Spinner size="sm" className="mr-2" />
            ) : (
              <>
                Télécharger
                <ArrowDown size="20" className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
