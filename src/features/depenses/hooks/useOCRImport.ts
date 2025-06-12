import { useState } from 'react';
import { logger } from '../../../utils/logger';

export const useOCRImport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processReceipt = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/expenses/process-receipt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erreur lors du traitement du fichier');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Erreur lors de l\'import OCR:', error);
      setError(error instanceof Error ? error.message : 'Une erreur inconnue est survenue');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processReceipt,
    isLoading,
    error,
  };
};
