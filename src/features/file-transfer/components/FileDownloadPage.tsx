import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useFileTransferByLink } from '../hooks/useFileTransfer';
import { formatFileSize, formatExpiryDate, isImage } from '../utils/fileUtils';
import { ArrowDown2, Calendar, CloseCircle, DocumentText, Image as ImageIcon, Lock1, MoneyRecive } from 'iconsax-react';
import { logger } from '../../../utils/logger';
import { File as FileType, FileTransfer, FileTransferPaymentInfo } from '../types';

// Type pour la réponse du hook useFileTransferByLink
interface FileTransferAccessResponse {
  fileTransfer: (FileTransfer & {
    isAccessible: boolean;
    paymentInfo: FileTransferPaymentInfo;
    files: FileType[];
    totalSize: number;
    expiryDate: string;
  }) | null;
  loading: boolean;
  error: Error | null;
}

const FileDownloadPage: React.FC = () => {
  const location = useLocation();
  const [shareLink, setShareLink] = useState<string>('');
  const [accessKey, setAccessKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [downloadingFiles, setDownloadingFiles] = useState<{[key: string]: boolean}>({});
  
  // Gérer le téléchargement d'un fichier
  const handleDownload = useCallback(async (file: FileType) => {
    if (!file?.id) {
      logger.error('ID de fichier manquant pour le téléchargement');
      return;
    }

    try {
      // Mettre à jour l'état de téléchargement pour ce fichier
      setDownloadingFiles(prev => ({ ...prev, [file.id]: true }));
      
      // Appeler l'API de téléchargement avec responseType blob pour éviter les problèmes d'encodage
      const response = await fetch(`/api/file-transfer/download/${shareLink}/${accessKey}/${file.id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': '*/*',  // Accepter tous les types de contenu
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      // Vérifier le type de contenu
      const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
      const contentDisposition = response.headers.get('Content-Disposition') || '';
      const contentLength = Number(response.headers.get('Content-Length')) || 0;
      
      // Extraire le nom de fichier du header Content-Disposition si disponible
      let fileName = file.originalName || 'fichier';
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches && matches[1]) {
        fileName = matches[1].replace(/['"]*/g, '');
      }
      
      logger.info(`Téléchargement de ${fileName} (${contentType}, ${contentLength} octets)`);
      
      // Obtenir le blob directement de la réponse
      const blob = await response.blob();
      
      // Vérifier que le blob a la bonne taille
      if (contentLength > 0 && blob.size !== contentLength) {
        logger.warn(`Taille du fichier téléchargé (${blob.size}) différente de la taille attendue (${contentLength})`);
      }
      
      // Créer un objet URL pour le blob
      const url = window.URL.createObjectURL(blob);
      
      // Créer un élément de lien pour déclencher le téléchargement
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer après un court délai pour s'assurer que le téléchargement a commencé
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        // Réinitialiser l'état de téléchargement après un délai
        setTimeout(() => {
          setDownloadingFiles(prev => ({ ...prev, [file.id]: false }));
        }, 1000);
      }, 100);
      
      logger.info(`Fichier téléchargé avec succès: ${fileName}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      logger.error('Erreur lors du téléchargement du fichier:', errorMessage);
      
      // Réinitialiser l'état de téléchargement
      setDownloadingFiles(prev => ({ ...prev, [file.id]: false }));
      
      // Afficher une notification d'erreur à l'utilisateur
      alert(`Erreur lors du téléchargement: ${errorMessage}. Veuillez réessayer.`);
    } finally {
      // Réinitialiser l'état de téléchargement
      if (file?.id) {
        setDownloadingFiles(prev => ({ ...prev, [file.id]: false }));
      }
    }
  }, [shareLink, accessKey]);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const link = params.get('link');
    const key = params.get('key');
    
    if (link && key) {
      setShareLink(link);
      setAccessKey(key);
      setIsLoading(false);
    }
  }, [location]);
  
  // Appel du hook avec typage correct
  const { loading, error, fileTransfer } = useFileTransferByLink(
    shareLink, 
    accessKey
  ) as unknown as FileTransferAccessResponse;
  
  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-[#f0eeff] rounded-full mb-4"></div>
          <div className="h-4 bg-[#f0eeff] rounded w-48 mb-2"></div>
          <div className="h-3 bg-[#f0eeff] rounded w-32"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    logger.error('Erreur lors du chargement du transfert de fichiers:', error);
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <CloseCircle size="48" color="#EF4444" variant="Bulk" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Lien invalide</h2>
          <p className="text-red-600 mb-4">
            Ce lien de téléchargement est invalide ou a expiré.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5b50ff] hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }
  
  if (!fileTransfer) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <CloseCircle size="48" color="#EF4444" variant="Bulk" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Transfert introuvable</h2>
          <p className="text-red-600 mb-4">
            Ce transfert de fichiers n'existe pas ou a été supprimé.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5b50ff] hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }
  
  if (!fileTransfer.isAccessible) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <Calendar size="48" color="#F59E0B" variant="Bulk" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-amber-700 mb-2">Transfert expiré</h2>
          <p className="text-amber-600 mb-4">
            Ce transfert de fichiers a expiré et n'est plus disponible au téléchargement.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5b50ff] hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }
  
  if (fileTransfer.paymentInfo?.isPaymentRequired && !fileTransfer.paymentInfo.isPaid) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-[#f0eeff]">
            <h2 className="text-xl font-semibold text-gray-900">Téléchargement protégé</h2>
            <p className="text-sm text-gray-600 mt-1">
              Ce transfert de fichiers nécessite un paiement pour être téléchargé
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-[#f0eeff] flex items-center justify-center">
                <Lock1 size="32" color="#5b50ff" variant="Bulk" />
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Fichiers protégés
              </h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Taille totale</span>
                  <span className="text-sm font-medium">{formatFileSize(fileTransfer.totalSize)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Expiration</span>
                  <span className="text-sm font-medium">{formatExpiryDate(fileTransfer.expiryDate)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <a
                href={fileTransfer.paymentInfo.checkoutUrl || '#'}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#5b50ff] hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
              >
                <MoneyRecive size="20" className="mr-2" />
                Procéder au paiement
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-[#f0eeff]">
          <h2 className="text-xl font-semibold text-gray-900">Téléchargement protégé</h2>
          <p className="text-sm text-gray-600 mt-1">
            Ce transfert de fichiers nécessite un paiement pour être téléchargé
          </p>
        </div>
        
        <div className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto" data-testid="file-list">
              {fileTransfer.files.map((file: FileType) => (
                <div key={file.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[#f0eeff] mr-3">
                      {isImage(file.mimeType) ? (
                        <ImageIcon size="20" color="#5b50ff" variant="Bulk" />
                      ) : (
                        <DocumentText size="20" color="#5b50ff" variant="Bulk" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.originalName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {file.mimeType || 'Type inconnu'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(file)}
                    disabled={downloadingFiles[file.id]}
                    className={`flex-shrink-0 ml-2 p-2 rounded-full ${downloadingFiles[file.id] ? 'bg-gray-100' : 'bg-[#f0eeff] hover:bg-[#e6e1ff]'} transition-colors`}
                    aria-label={`Télécharger ${file.originalName}`}
                  >
                    {downloadingFiles[file.id] ? (
                      <div className="animate-spin">
                        <ArrowDown2 size="18" color="#9ca3af" />
                      </div>
                    ) : (
                      <ArrowDown2 size="18" color="#5b50ff" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDownloadPage;
