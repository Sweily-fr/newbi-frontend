import React, { useState, useRef } from 'react';
import Button from '../../../../components/common/Button';
import { ExpenseFile } from '../../types';
import { useExpenses } from '../../hooks/useExpenses';
import { DocumentUpload, CloseCircle } from 'iconsax-react';
import { logger } from '../../../../utils/logger';
import ExpenseFileList from './ExpenseFileList';

// Fonction utilitaire pour obtenir les classes CSS de la zone de dépôt
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

interface ExpenseFileUploadProps {
  expenseId: string;
  files: ExpenseFile[];
  onOCRComplete?: () => void;
}

const ExpenseFileUpload: React.FC<ExpenseFileUploadProps> = ({
  expenseId,
  files,
  onOCRComplete
}) => {
  const { addExpenseFile } = useExpenses();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
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
    // Vérifier le type de fichier (PDF, images)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Type de fichier non pris en charge. Veuillez télécharger un PDF ou une image (JPG, PNG).');
      return;
    }
    
    // Vérifier la taille du fichier (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('Le fichier est trop volumineux. La taille maximale est de 10MB.');
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
      // Télécharger le fichier avec traitement OCR
      await addExpenseFile(expenseId, {
        file,
        processOCR: true
      });
      
      // Compléter la progression
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Réinitialiser après un court délai
      setTimeout(() => {
        setUploading(false);
        setCurrentFile(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (onOCRComplete) {
          onOCRComplete();
        }
      }, 500);
    } catch (error) {
      logger.error('Erreur lors du téléchargement du fichier:', error);
      clearInterval(progressInterval);
      setUploading(false);
      setCurrentFile(null);
      setUploadProgress(0);
      alert('Une erreur est survenue lors du téléchargement du fichier. Veuillez réessayer.');
    }
  };
  
  const cancelUpload = () => {
    setUploading(false);
    setCurrentFile(null);
    setUploadProgress(0);
  };
  
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="flex flex-col gap-4">
      {!uploading ? (
        <>
          <div
            className={getUploadAreaClasses(isDragging)}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[rgba(91,80,255,0.1)] text-[#5b50ff] mb-4">
              <DocumentUpload size={24} variant="Bold" color="#5b50ff" />
            </div>
            <p className="text-gray-600 mb-2 text-center">
              Glissez-déposez un fichier ici ou cliquez pour parcourir
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
          
          {files && files.length > 0 && (
            <ExpenseFileList 
              expenseId={expenseId} 
              files={files} 
              onProcessOCR={() => {
                if (onOCRComplete) onOCRComplete();
              }}
            />
          )}
        </>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h4 className="m-0 text-base font-medium text-gray-900 flex items-center gap-2">
              <DocumentUpload size={20} variant="Bold" color="#5b50ff" />
              Téléchargement en cours...
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
      )}
    </div>
  );
};

export default ExpenseFileUpload;
