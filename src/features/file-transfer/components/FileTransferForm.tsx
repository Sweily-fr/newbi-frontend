import React, { useState, useEffect } from 'react';
import { useCreateFileTransfer } from '../hooks/useFileTransfer';
import FileDropzone from './FileDropzone';
import FilePreview from './FilePreview';
import { logger } from '../../../utils/logger';
import UploadProgress from './UploadProgress';
import { ArrowRight, Copy, Link1, TickCircle, InfoCircle } from 'iconsax-react';
import Checkbox from '../../../components/common/Checkbox';
import Modal from '../../../components/common/Modal';
import StripeConnectOnboarding from './StripeConnectOnboarding';
import { useMutation } from '@apollo/client';
import { CHECK_STRIPE_CONNECT_ACCOUNT_STATUS } from '../graphql/stripe-connect-mutations';

const FileTransferForm: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isPaymentRequired, setIsPaymentRequired] = useState<boolean>(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(5);
  const [paymentCurrency, setPaymentCurrency] = useState<string>('EUR');
  const [shareLink, setShareLink] = useState<string>('');
  const [accessKey, setAccessKey] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isStripeConnectModalOpen, setIsStripeConnectModalOpen] = useState<boolean>(false);
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [stripeAccountStatus, setStripeAccountStatus] = useState<{
    isOnboarded: boolean;
    payoutsEnabled: boolean;
    chargesEnabled: boolean;
  } | null>(null);
  
  const { upload, uploadProgress, loading, error, data } = useCreateFileTransfer();
  
  // Mutation pour vérifier le statut du compte Stripe Connect
  const [checkStripeConnectStatus] = useMutation(CHECK_STRIPE_CONNECT_ACCOUNT_STATUS, {
    onCompleted: (data) => {
      if (data.checkStripeConnectAccountStatus.success) {
        setStripeAccountStatus({
          isOnboarded: data.checkStripeConnectAccountStatus.isOnboarded,
          payoutsEnabled: data.checkStripeConnectAccountStatus.payoutsEnabled,
          chargesEnabled: data.checkStripeConnectAccountStatus.chargesEnabled
        });
      } else {
        logger.error('Erreur lors de la vérification du statut du compte Stripe:', data.checkStripeConnectAccountStatus.message);
      }
    },
    onError: (error) => {
      logger.error('Erreur lors de la vérification du statut du compte Stripe:', error);
    }
  });
  
  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles([...files, ...selectedFiles]);
  };
  
  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };
  
  // Vérifier si l'utilisateur a un compte Stripe Connect configuré lorsqu'il active l'option de paiement
  useEffect(() => {
    if (isPaymentRequired && stripeAccountId) {
      checkStripeConnectStatus({
        variables: {
          accountId: stripeAccountId
        }
      });
    }
  }, [isPaymentRequired, stripeAccountId, checkStripeConnectStatus]);

  const handlePaymentRequiredChange = (checked: boolean) => {
    setIsPaymentRequired(checked);
    
    // Si l'utilisateur active l'option de paiement et n'a pas de compte Stripe Connect configuré
    if (checked && !stripeAccountId) {
      setIsStripeConnectModalOpen(true);
    }
  };
  
  const handleStripeAccountCreated = (accountId: string) => {
    setStripeAccountId(accountId);
    // Vérifier immédiatement le statut du compte
    checkStripeConnectStatus({
      variables: {
        accountId
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) return;
    
    // Vérifier si l'utilisateur a besoin de configurer son compte Stripe pour les paiements
    if (isPaymentRequired && (!stripeAccountStatus?.isOnboarded || !stripeAccountStatus?.chargesEnabled)) {
      setIsStripeConnectModalOpen(true);
      return;
    }
    
    try {
      // S'assurer que nous avons des objets File natifs
      const nativeFiles = files.filter(file => file instanceof File);
      
      if (nativeFiles.length !== files.length) {
        logger.error('Certains fichiers ne sont pas des objets File valides');
        return;
      }
      
      // Utiliser la nouvelle structure avec l'objet input
      const result = await upload(
        nativeFiles,
        48, // expiryDays: 48 heures par défaut
        isPaymentRequired,
        isPaymentRequired ? paymentAmount : undefined,
        isPaymentRequired ? paymentCurrency : undefined,
        undefined // recipientEmail (optionnel)
        // Note: stripeAccountId sera ajouté côté backend via le contexte utilisateur
      );
      
      if (result) {
        setShareLink(result.shareLink);
        setAccessKey(result.accessKey);
        // Ouvrir la modal pour afficher le lien de téléchargement
        setIsModalOpen(true);
      }
    } catch (error) {
      logger.error('Erreur lors de la création du transfert:', error);
    }
  };
  
  const copyToClipboard = () => {
    const fullLink = `${window.location.origin}/file-transfer/download?link=${shareLink}&key=${accessKey}`;
    navigator.clipboard.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const isUploadComplete = data && shareLink && accessKey;
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Modal pour afficher le lien de téléchargement */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Transfert réussi !"
        size="md"
        titleIcon={<TickCircle size="24" color="#10B981" variant="Bulk" />}
      >
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-4">
            Vos fichiers ont été transférés avec succès. Voici le lien à partager avec vos destinataires :
          </p>
          
          <div className="flex">
            <div className="flex-grow relative">
              <div className="flex items-center absolute left-3 top-1/2 transform -translate-y-1/2">
                <Link1 size="16" color="#718096" />
              </div>
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/file-transfer/download?link=${shareLink}&key=${accessKey}`}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-[#5b50ff]"
              />
            </div>
            <button
              type="button"
              onClick={copyToClipboard}
              className="inline-flex items-center px-4 py-2 border border-gray-300 border-l-0 rounded-r-md shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-[#5b50ff]"
            >
              {copied ? (
                <>
                  <TickCircle size="16" color="#10B981" variant="Bulk" className="mr-2" />
                  Copié
                </>
              ) : (
                <>
                  <Copy size="16" className="mr-2" />
                  Copier
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(false);
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
          >
            Fermer
          </button>
          
          <a
            href={`/file-transfer/download?link=${shareLink}&key=${accessKey}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5b50ff] hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
          >
            Ouvrir le lien
            <ArrowRight size="16" className="ml-2" />
          </a>
        </div>
      </Modal>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-[#f0eeff]">
          <h2 className="text-xl font-semibold text-gray-900">Transfert de fichiers volumineux</h2>
          <p className="text-sm text-gray-600 mt-1">
            Partagez des fichiers jusqu'à 100GB avec vos clients ou collaborateurs
          </p>
        </div>
        
        {!isUploadComplete ? (
          <form onSubmit={handleSubmit} className="p-6">
            <FileDropzone 
              onFilesSelected={handleFilesSelected}
              maxFiles={20}
              maxSize={10 * 1024 * 1024 * 1024} // 10GB
              className="mb-6"
            />
            
            <FilePreview 
              files={files} 
              onRemove={handleRemoveFile}
              className="mb-6" 
            />
            
            <div className="mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée de validité
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  48 heures
                </div>
                <p className="text-xs text-gray-500 mt-1">Les fichiers sont automatiquement supprimés après 48 heures</p>
              </div>
              
              <div className="mt-4 border-t pt-4">
                <Checkbox
                  id="payment-required"
                  name="payment-required"
                  checked={isPaymentRequired}
                  onChange={(e) => handlePaymentRequiredChange(e.target.checked)}
                  label="Demander un paiement pour accéder aux fichiers"
                />
              
              {isPaymentRequired && stripeAccountStatus && (
                <div className="mt-2 ml-6">
                  {stripeAccountStatus.isOnboarded && stripeAccountStatus.chargesEnabled ? (
                    <div className="flex items-center text-sm text-green-700">
                      <TickCircle size="16" color="#10B981" variant="Bulk" className="mr-1" />
                      Compte Stripe Connect configuré
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-amber-700">
                      <InfoCircle size="16" color="#F59E0B" variant="Bulk" className="mr-1" />
                      <button 
                        type="button" 
                        className="text-[#5b50ff] underline"
                        onClick={() => setIsStripeConnectModalOpen(true)}
                      >
                        Terminer la configuration de votre compte Stripe
                      </button>
                    </div>
                  )}
                </div>
              )}
                
                {isPaymentRequired && (
                  <div className="flex mt-2">
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      min={1}
                      step={0.01}
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-[#5b50ff]"
                    />
                    <select
                      value={paymentCurrency}
                      onChange={(e) => setPaymentCurrency(e.target.value)}
                      className="px-3 py-2 border border-gray-300 border-l-0 rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-[#5b50ff]"
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            
            <UploadProgress progressItems={uploadProgress} className="mb-6" />
            
            {error && (
              <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">
                  Une erreur est survenue lors du transfert de fichiers. Veuillez réessayer.
                </p>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={files.length === 0 || loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5b50ff] hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>Transfert en cours...</>
                ) : (
                  <>
                    Transférer les fichiers
                    <ArrowRight size="16" className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="p-5 bg-green-50 border border-green-100 rounded-lg mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <TickCircle size="24" color="#10B981" variant="Bulk" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Transfert réussi !
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Vos fichiers ont été transférés avec succès. Partagez le lien ci-dessous avec les destinataires.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lien de partage
              </label>
              <div className="flex">
                <div className="flex-grow relative">
                  <div className="flex items-center absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Link1 size="16" color="#718096" />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/file-transfer/download?link=${shareLink}&key=${accessKey}`}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-[#5b50ff]"
                  />
                </div>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 border-l-0 rounded-r-md shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-[#5b50ff]"
                >
                  {copied ? (
                    <>
                      <TickCircle size="16" color="#10B981" variant="Bulk" className="mr-2" />
                      Copié
                    </>
                  ) : (
                    <>
                      <Copy size="16" className="mr-2" />
                      Copier
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setFiles([]);
                  setShareLink('');
                  setAccessKey('');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
              >
                Nouveau transfert
              </button>
              
              <a
                href={`/file-transfer/download?link=${shareLink}&key=${accessKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5b50ff] hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
              >
                Voir la page de téléchargement
                <ArrowRight size="16" className="ml-2" />
              </a>
            </div>
          </div>
        )}
      </div>
      {/* Modal d'onboarding Stripe Connect */}
      <StripeConnectOnboarding
        isOpen={isStripeConnectModalOpen}
        onClose={() => setIsStripeConnectModalOpen(false)}
        onAccountCreated={handleStripeAccountCreated}
      />
    </div>
  );
};

export default FileTransferForm;
