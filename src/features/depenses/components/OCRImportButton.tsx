import React, { useRef, useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Loader2, Upload, X } from 'lucide-react';
import { logger } from '../../../utils/logger';

interface OCRImportButtonProps {
  onImportComplete: (data: any) => void;
  onError?: (error: Error) => void;
}

export const OCRImportButton: React.FC<OCRImportButtonProps> = ({ onImportComplete, onError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf')) {
      onError?.(new Error('Format de fichier non supporté. Veuillez utiliser une image (JPG, PNG) ou un PDF.'));
      return;
    }

    setSelectedFile(file);
    await processFile(file);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/expenses/process-receipt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors du traitement du fichier');
      }

      const result = await response.json();
      onImportComplete(result.data);
    } catch (error) {
      logger.error('Erreur lors du traitement OCR:', error);
      onError?.(error as Error);
    } finally {
      setIsProcessing(false);
      // Réinitialiser l'input pour permettre la sélection du même fichier
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSelectedFile(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf"
        className="hidden"
        disabled={isProcessing}
      />
      <Button
        type="button"
        variant="outline"
        className="border-[#5b50ff] text-[#5b50ff] hover:bg-[#f0eeff] relative overflow-hidden"
        onClick={handleButtonClick}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            {selectedFile ? selectedFile.name : 'Importer une facture'}
            {selectedFile && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="ml-2 text-gray-500 hover:text-gray-700"
                aria-label="Supprimer le fichier"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </>
        )}
      </Button>
    </div>
  );
};

export default OCRImportButton;
