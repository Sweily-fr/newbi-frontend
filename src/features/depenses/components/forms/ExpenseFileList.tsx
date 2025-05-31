import React, { useState } from 'react';
import Button from '../../../../components/common/Button';
import Tooltip from '../../../../components/common/Tooltip';
import { ConfirmDialog } from '../../../../components/common/ConfirmDialog';
import { ExpenseFile } from '../../types';
import { useExpenses } from '../../hooks/useExpenses';
import { 
  DocumentText, 
  Gallery, 
  Trash, 
  Document 
} from 'iconsax-react';
import { logger } from '../../../../utils/logger';

// Pas besoin de styled-components avec Tailwind CSS

// Fonction pour formater la taille du fichier
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Fonction pour obtenir l'icône en fonction du type de fichier
const getFileIcon = (mimetype: string) => {
  if (mimetype.startsWith('image/')) {
    return <Gallery size={24} variant="Bold" color="#5b50ff" />;
  }
  return <DocumentText size={24} variant="Bold" color="#5b50ff" />;
};

interface ExpenseFileListProps {
  expenseId: string;
  files: ExpenseFile[];
  onFileRemoved?: () => void;
  onProcessOCR?: (fileId: string) => void;
}

const ExpenseFileList: React.FC<ExpenseFileListProps> = ({
  expenseId,
  files,
  onFileRemoved,
  onProcessOCR
}) => {
  const { removeExpenseFile, processExpenseFileOCR, loading } = useExpenses();
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [processingOCR, setProcessingOCR] = useState<string | null>(null);
  
  const handleRemoveFile = async () => {
    if (!fileToDelete) return;
    
    try {
      await removeExpenseFile(expenseId, fileToDelete);
      setFileToDelete(null);
      if (onFileRemoved) onFileRemoved();
    } catch (error) {
      logger.error('Erreur lors de la suppression du fichier:', error);
    }
  };
  
  const handleProcessOCR = async (fileId: string) => {
    setProcessingOCR(fileId);
    
    try {
      await processExpenseFileOCR(expenseId, fileId);
      if (onProcessOCR) onProcessOCR(fileId);
    } catch (error) {
      logger.error('Erreur lors du traitement OCR:', error);
    } finally {
      setProcessingOCR(null);
    }
  };
  
  if (!files || files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[rgba(91,80,255,0.1)] text-[#5b50ff] mb-4">
          <DocumentText size={24} variant="Bold" color="#5b50ff" />
        </div>
        <p className="text-gray-500 m-0">Aucun fichier attaché à cette dépense</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-3">
      {files.map(file => (
        <div 
          key={file.id}
          className="flex items-center justify-between p-3 px-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-[#f0eeff] hover:border-[#e6e1ff] transition-colors"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[rgba(91,80,255,0.1)] text-[#5b50ff]">
              {getFileIcon(file.mimetype)}
            </div>
            <div className="flex flex-col">
              <div className="font-medium text-gray-900">{file.originalFilename}</div>
              <div className="text-xs text-gray-500 mt-0.5">{formatFileSize(file.size)}</div>
            </div>
            {file.ocrProcessed && (
              <div className="flex items-center gap-1 bg-[#e6e1ff] text-[#5b50ff] rounded px-2 py-0.5 text-xs font-medium ml-2">
                <Document size={12} variant="Bold" color="#5b50ff" />
                OCR
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Tooltip content="Voir le fichier">
              <a 
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                Voir
              </a>
            </Tooltip>
            
            {!file.ocrProcessed && (
              <Tooltip content="Traiter avec OCR">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleProcessOCR(file.id)}
                  isLoading={processingOCR === file.id}
                  disabled={loading}
                >
                  OCR
                </Button>
              </Tooltip>
            )}
            
            <Tooltip content="Supprimer">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setFileToDelete(file.id)}
                disabled={loading}
              >
                <Trash size={16} color="#ffffff" />
              </Button>
            </Tooltip>
          </div>
        </div>
      ))}
      
      <ConfirmDialog
        isOpen={!!fileToDelete}
        onClose={() => setFileToDelete(null)}
        onConfirm={handleRemoveFile}
        title="Supprimer le fichier"
        message="Êtes-vous sûr de vouloir supprimer ce fichier ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
};

export default ExpenseFileList;
