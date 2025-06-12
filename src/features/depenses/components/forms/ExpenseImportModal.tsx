import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { X, Loader2, Upload, FileText, Image as ImageIcon } from 'lucide-react';

// Components
import Modal from '../../../../components/common/Modal';
import Button from '../../../../components/common/Button';

// Utils
import { logger } from '../../../../utils/logger';

// Types
import { OCRMetadata } from '../../types/index';

// Styles pour la zone de dépôt
const getUploadAreaClasses = (isDragActive: boolean, isDragReject: boolean) => {
  let baseClasses = 'flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer';
  
  if (isDragActive) {
    baseClasses += ' bg-[#e6e1ff] border-[#5b50ff]';
  } else if (isDragReject) {
    baseClasses += ' bg-red-50 border-red-200';
  } else {
    baseClasses += ' bg-gray-50 border-gray-200 hover:bg-[#f0eeff] hover:border-[#5b50ff]';
  }
  
  return baseClasses;
};

// Types de fichiers acceptés
const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png']
};

// Taille maximale du fichier (10 Mo)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface ExpenseImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateExpense: (ocrData: OCRMetadata, file: File) => Promise<void>;
}

const ExpenseImportModal: React.FC<ExpenseImportModalProps> = ({
  isOpen,
  onClose,
  onCreateExpense
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [ocrData, setOcrData] = useState<OCRMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Réinitialiser l'état quand le modal s'ouvre/ferme
  const resetState = useCallback(() => {
    setCurrentFile(null);
    setOcrData(null);
    setError(null);
    setPreviewUrl(null);
  }, []);
  
  // Gérer la fermeture du modal
  const handleClose = () => {
    resetState();
    onClose();
  };
  
  // Vérifier le type de fichier
  const fileValidator = (file: File) => {
    const isValidType = Object.keys(ACCEPTED_FILE_TYPES).some(type => 
      file.type === type || 
      ACCEPTED_FILE_TYPES[type as keyof typeof ACCEPTED_FILE_TYPES]?.some(ext => file.name.endsWith(ext))
    );
    
    if (!isValidType) {
      return {
        code: 'invalid-file-type',
        message: 'Type de fichier non pris en charge. Veuillez utiliser un PDF ou une image (JPG, PNG).'
      };
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return {
        code: 'file-too-large',
        message: 'Le fichier est trop volumineux. La taille maximale est de 10 Mo.'
      };
    }
    
    return null;
  };
  
  // Configuration de la zone de dépôt
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setError(null);
    
    if (fileRejections && fileRejections.length > 0) {
      const rejection = fileRejections[0];
      const errorCode = rejection.errors[0].code;
      if (errorCode === 'file-too-large') {
        setError('Le fichier est trop volumineux. La taille maximale est de 10 Mo.');
      } else if (errorCode === 'file-invalid-type') {
        setError('Type de fichier non pris en charge. Veuillez utiliser un PDF ou une image (JPG, PNG).');
      } else {
        setError('Une erreur est survenue lors du chargement du fichier.');
      }
      return;
    }
    
    const file = acceptedFiles[0];
    if (!file) return;
    
    setCurrentFile(file);
    
    // Créer un aperçu pour les images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
    
    // Traiter le fichier avec OCR
    processFile(file);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    validator: fileValidator,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    noClick: !!currentFile // Désactive le clic si un fichier est déjà sélectionné
  });
  
  // Traiter le fichier avec OCR
  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Récupérer le token d'authentification
      const token = localStorage.getItem('token');
      
      logger.debug('Envoi du fichier pour traitement OCR:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      const response = await fetch('/api/expenses/process-receipt', {
        method: 'POST',
        body: formData,
        headers: {
          // Ne pas définir 'Content-Type' pour FormData, le navigateur le fera automatiquement
          // avec la bonne boundary
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include' // Important pour les cookies d'authentification
      });
      
      const responseData = await response.json().catch(() => ({
        success: false,
        message: 'Réponse invalide du serveur'
      }));
      
      logger.debug('Réponse du serveur OCR:', {
        status: response.status,
        data: responseData
      });
      
      if (!response.ok) {
        throw new Error(
          responseData.message || 
          `Erreur lors du traitement du fichier (${response.status} ${response.statusText})`
        );
      }
      
      // Vérifier que les données reçues correspondent à l'interface OCRMetadata
      const ocrResult = responseData.data || responseData; // Gérer les deux formats de réponse
      
      // Vérifier que les données OCR contiennent au moins une information
      if (!ocrResult.rawExtractedText && !ocrResult.vendorName && !ocrResult.invoiceNumber) {
        logger.warn('Données OCR incomplètes reçues:', ocrResult);
        throw new Error('Impossible d\'extraire des informations de la facture. Veuillez vérifier la qualité de l\'image ou essayer avec un autre fichier.');
      }
      
      setOcrData(ocrResult);
      logger.info('Traitement OCR réussi', { vendor: ocrResult.vendorName, amount: ocrResult.totalAmount });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue';
      logger.error('Erreur lors du traitement OCR:', { error: err, message: errorMessage });
      setError(`Erreur: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Gérer la création de la dépense
  const handleCreateExpense = async () => {
    if (currentFile && ocrData) {
      try {
        setIsProcessing(true);
        // Préparer les données pour la création de la dépense
        const expenseData = {
          title: ocrData.vendorName || 'Dépense sans nom',
          amount: ocrData.totalAmount || 0,
          date: ocrData.invoiceDate || new Date().toISOString().split('T')[0],
          vendor: ocrData.vendorName,
          vendorVatNumber: ocrData.vendorVatNumber,
          invoiceNumber: ocrData.invoiceNumber,
          category: 'OTHER', // Valeur par défaut
          ocrData: {
            ...ocrData,
            // Mapper les anciens noms de champs pour la rétrocompatibilité
            vendor: ocrData.vendorName,
            amount: ocrData.totalAmount,
            date: ocrData.invoiceDate,
            text: ocrData.rawExtractedText || ''
          },
          ocrFile: currentFile
        };
        
        await onCreateExpense(expenseData, currentFile);
        handleClose();
      } catch (error) {
        logger.error('Erreur lors de la création de la dépense:', error);
        setError('Une erreur est survenue lors de la création de la dépense. Veuillez réessayer.');
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  // Supprimer le fichier sélectionné
  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentFile(null);
    setOcrData(null);
    setPreviewUrl(null);
  };

  // Rendu du contenu du modal
  const renderContent = () => {
    if (!currentFile) {
      return (
        <div 
          {...getRootProps()} 
          className={getUploadAreaClasses(isDragActive, isDragReject)}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              {isDragReject ? 'Type de fichier non supporté' : 'Glissez-déposez votre facture ici'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              ou cliquez pour sélectionner un fichier
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Formats acceptés : PDF, JPG, PNG (max. 10 Mo)
            </p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {/* Aperçu du fichier */}
        <div className="border rounded-lg overflow-hidden">
          {previewUrl ? (
            <div className="relative h-48 bg-gray-50 flex items-center justify-center">
              <img 
                src={previewUrl} 
                alt="Aperçu de la facture" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 h-48">
              {currentFile.type === 'application/pdf' ? (
                <FileText size={48} className="text-[#5b50ff] mb-4" />
              ) : (
                <ImageIcon size={48} className="text-[#5b50ff] mb-4" />
              )}
              <p className="text-sm text-gray-500">Aperçu non disponible</p>
            </div>
          )}

          <div className="p-4 border-t flex justify-between items-center">
            <div className="truncate">
              <p className="font-medium text-gray-900 truncate">{currentFile.name}</p>
              <p className="text-sm text-gray-500">
                {(currentFile.size / 1024).toFixed(1)} KB • {currentFile.type}
              </p>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-gray-400 hover:text-gray-500"
              title="Supprimer le fichier"
              disabled={isProcessing}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Résultats de l'OCR */}
        {isProcessing ? (
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
            <Loader2 className="animate-spin h-6 w-6 text-[#5b50ff] mr-2" />
            <span className="text-gray-600">Analyse de la facture en cours...</span>
          </div>
        ) : ocrData ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Informations extraites</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ocrData.vendorName && (
                <div>
                  <p className="text-xs text-gray-500">Fournisseur</p>
                  <p className="font-medium">{ocrData.vendorName}</p>
                </div>
              )}
              {ocrData.totalAmount !== undefined && (
                <div>
                  <p className="text-xs text-gray-500">Montant</p>
                  <p className="font-medium">
                    {ocrData.totalAmount.toFixed(2)} {ocrData.currency || '€'}
                  </p>
                </div>
              )}
              {ocrData.invoiceDate && (
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(ocrData.invoiceDate).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
              {ocrData.invoiceNumber && (
                <div>
                  <p className="text-xs text-gray-500">N° de facture</p>
                  <p className="font-medium">{ocrData.invoiceNumber}</p>
                </div>
              )}
            </div>
          </div>
        ) : error ? (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-start">
            <X size={16} className="flex-shrink-0 mr-2 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : null}
        
        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Annuler
          </Button>
          <Button
            onClick={handleCreateExpense}
            disabled={!ocrData || isProcessing}
            isLoading={isProcessing}
          >
            Créer la dépense
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Importer une facture"
      size="lg"
    >
      {renderContent()}
    </Modal>
  );
};

export default ExpenseImportModal;
