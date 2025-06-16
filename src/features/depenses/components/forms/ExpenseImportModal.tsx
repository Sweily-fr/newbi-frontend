import React, { useState, useRef } from 'react';
import Modal from '../../../../components/common/Modal';
import Button from '../../../../components/common/Button';
import { DocumentUpload, CloseCircle, Receipt2 } from 'iconsax-react';
import { logger } from '../../../../utils/logger';
import { OCRMetadata } from '../../types';
import { useExpenses } from '../../hooks/useExpenses';

// Styles définis avec Tailwind CSS directement dans les composants
const getUploadAreaClasses = (isDragging: boolean) => {
  return `
    flex flex-col items-center justify-center p-8
    ${isDragging ? 'bg-[#e6e1ff]' : 'bg-gray-50'}
    rounded-lg
    border-2 border-dashed ${isDragging ? 'border-[#5b50ff]' : 'border-gray-200'}
    transition-all duration-200
    cursor-pointer
    hover:bg-[#f0eeff] hover:border-[#5b50ff]
  `;
};

interface ExpenseImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateExpense: (ocrData: OCRMetadata, file: File) => void;
}

const ExpenseImportModal: React.FC<ExpenseImportModalProps> = ({
  isOpen,
  onClose,
  onCreateExpense
}) => {
  const { processOCRFile } = useExpenses();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [ocrData, setOcrData] = useState<OCRMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };
  
  const handleFileUpload = async (file: File) => {
    // Réinitialiser les états
    setError(null);
    setOcrData(null);
    
    // Vérifier le type de fichier (PDF, images)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Type de fichier non pris en charge. Veuillez télécharger un PDF ou une image (JPG, PNG).');
      return;
    }
    
    // Vérifier la taille du fichier (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('Le fichier est trop volumineux. La taille maximale est de 10MB.');
      return;
    }
    
    setCurrentFile(file);
    setUploading(true);
    setUploadProgress(0);
    
    // Simuler la progression du téléchargement
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 90 ? 90 : newProgress;
      });
    }, 200);
    
    try {
      // Traiter le fichier avec OCR
      const result = await processOCRFile(file);
      
      // Compléter la progression
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Afficher les données OCR
      setTimeout(() => {
        setUploading(false);
        setOcrData(result);
      }, 500);
    } catch (error) {
      logger.error('Erreur lors du traitement OCR du fichier:', error);
      clearInterval(progressInterval);
      setUploading(false);
      setCurrentFile(null);
      setUploadProgress(0);
      setError('Une erreur est survenue lors du traitement OCR. Veuillez réessayer.');
    }
  };
  
  const cancelUpload = () => {
    setUploading(false);
    setCurrentFile(null);
    setUploadProgress(0);
    setError(null);
  };
  
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleCreateExpense = () => {
    if (ocrData && currentFile) {
      onCreateExpense(ocrData, currentFile);
    }
  };
  
  const resetForm = () => {
    setOcrData(null);
    setCurrentFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Importer une dépense"
      size="lg"
    >
      <div className="flex flex-col gap-4 p-4">
        <p className="text-gray-600 mb-4">
          Téléchargez une facture ou un reçu pour créer automatiquement une dépense grâce à la technologie OCR.
        </p>
        
        {!uploading && !ocrData ? (
          <div
            className={getUploadAreaClasses(isDragging)}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[rgba(91,80,255,0.1)] text-[#5b50ff] mb-4">
              <Receipt2 size={24} variant="Bold" color="#5b50ff" />
            </div>
            <p className="text-gray-600 mb-2 text-center">
              Glissez-déposez une facture ou un reçu ici ou cliquez pour parcourir
            </p>
            <p className="text-gray-400 text-sm text-center">
              Formats acceptés : PDF, JPG, PNG (max. 10MB)
            </p>
            <Button 
              variant="outline" 
              onClick={e => {
                e.stopPropagation();
                handleClick();
              }}
              className="mt-4"
            >
              Parcourir
            </Button>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        ) : uploading ? (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h4 className="m-0 text-base font-medium text-gray-900 flex items-center gap-2">
                <DocumentUpload size={24} variant="Bold" color="#5b50ff" />
                Traitement OCR en cours...
              </h4>
              <button 
                className="bg-transparent border-none text-gray-500 cursor-pointer flex items-center p-0 hover:text-red-500"
                onClick={cancelUpload}
              >
                <CloseCircle size={20} color="#9ca3af" />
              </button>
            </div>
            
            {/* Barre de progression personnalisée */}
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#5b50ff] rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>{currentFile?.name}</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
          </div>
        ) : null}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}
        
        {ocrData && (
          <div className="mt-4">
            <h3 className="text-[#5b50ff] text-lg font-semibold mb-4">Données extraites</h3>
            <div className="bg-[#f0eeff] p-4 rounded-lg border border-[#e6e1ff] mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ocrData.vendorName && (
                  <div>
                    <span className="text-sm text-gray-500">Fournisseur:</span>
                    <p className="font-medium">{ocrData.vendorName}</p>
                  </div>
                )}
                
                {ocrData.invoiceNumber && (
                  <div>
                    <span className="text-sm text-gray-500">Numéro de facture:</span>
                    <p className="font-medium">{ocrData.invoiceNumber}</p>
                  </div>
                )}
                
                {ocrData.invoiceDate && (
                  <div>
                    <span className="text-sm text-gray-500">Date:</span>
                    <p className="font-medium">{ocrData.invoiceDate}</p>
                  </div>
                )}
                
                {ocrData.totalAmount !== undefined && (
                  <div>
                    <span className="text-sm text-gray-500">Montant total:</span>
                    <p className="font-medium">{ocrData.totalAmount} {ocrData.currency || 'EUR'}</p>
                  </div>
                )}
                
                {ocrData.vatAmount !== undefined && (
                  <div>
                    <span className="text-sm text-gray-500">Montant TVA:</span>
                    <p className="font-medium">{ocrData.vatAmount} {ocrData.currency || 'EUR'}</p>
                  </div>
                )}
                
                {ocrData.vendorVatNumber && (
                  <div>
                    <span className="text-sm text-gray-500">Numéro TVA:</span>
                    <p className="font-medium">{ocrData.vendorVatNumber}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  resetForm();
                }}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleCreateExpense}
                className="bg-[#5b50ff] border-[#5b50ff] hover:bg-[#4a41e0] hover:border-[#4a41e0]"
              >
                Créer une dépense
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ExpenseImportModal;
