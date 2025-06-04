import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { 
  MY_FILE_TRANSFERS, 
  FILE_TRANSFER_BY_ID, 
  GET_FILE_TRANSFER_BY_LINK 
} from '../graphql/queries';
import { 
  CREATE_FILE_TRANSFER_BASE64,
  DELETE_FILE_TRANSFER, 
  GENERATE_FILE_TRANSFER_PAYMENT_LINK 
} from '../graphql/mutations';
import { 
  FileTransfer, 
  FileTransferResponse, 
  FileTransferPaymentResponse,
  FileUploadProgress,
  FileTransferStatus
} from '../types';

// Utilitaire de logging personnalisé
import { logger } from '../../../utils/logger';

export const useMyFileTransfers = () => {
  const { loading, error, data, refetch } = useQuery(MY_FILE_TRANSFERS);
  
  // Mapper les statuts du backend (minuscules) vers le frontend (majuscules)
  const mapStatusToEnum = (status: string): FileTransferStatus => {
    switch(status.toLowerCase()) {
      case 'active': return FileTransferStatus.ACTIVE;
      case 'expired': return FileTransferStatus.EXPIRED;
      case 'deleted': return FileTransferStatus.DELETED;
      default: return FileTransferStatus.ACTIVE;
    }
  };

  // Transformer les données pour s'assurer que les statuts sont correctement mappés
  const fileTransfers = data?.myFileTransfers 
    ? data.myFileTransfers.map((transfer: { status: string; id: string; userId: string; files: File[]; totalSize: number; shareLink: string; accessKey: string; expiryDate: string; isPaymentRequired: boolean; paymentAmount?: number; paymentCurrency?: string; isPaid: boolean; downloadCount: number; createdAt: string; updatedAt: string }) => ({
        ...transfer,
        status: mapStatusToEnum(transfer.status)
      }))
    : [];
  
  return {
    loading,
    error,
    fileTransfers: fileTransfers as FileTransfer[],
    refetch
  };
};

export const useFileTransferById = (id: string) => {
  const { loading, error, data } = useQuery(FILE_TRANSFER_BY_ID, {
    variables: { id },
    skip: !id
  });
  
  return {
    loading,
    error,
    fileTransfer: data?.fileTransferById as FileTransfer
  };
};

export const useFileTransferByLink = (shareLink: string, accessKey: string) => {
  const { loading, error, data } = useQuery(GET_FILE_TRANSFER_BY_LINK, {
    variables: { shareLink, accessKey },
    skip: !shareLink || !accessKey
  });
  
  return {
    loading,
    error,
    success: data?.getFileTransferByLink?.success || false,
    message: data?.getFileTransferByLink?.message,
    fileTransfer: data?.getFileTransferByLink?.fileTransfer || null
  };
};

// Fonction utilitaire pour convertir un fichier en base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Utilise readAsDataURL pour inclure l'en-tête MIME
    reader.onload = () => {
      const result = reader.result as string;
      // Vérifier que le résultat contient bien l'en-tête MIME
      if (!result.includes(';base64,')) {
        // Si l'en-tête est absent, l'ajouter manuellement
        const mimeHeader = `data:${file.type || 'application/octet-stream'};base64,`;
        resolve(mimeHeader + result);
      } else {
        resolve(result);
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const useCreateFileTransfer = () => {
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress[]>([]);
  
  const [createFileTransferBase64, { loading, error, data }] = useMutation(CREATE_FILE_TRANSFER_BASE64);
  
  const upload = async (
    files: File[], 
    expiryDays?: number,
    isPaymentRequired?: boolean,
    paymentAmount?: number,
    paymentCurrency?: string,
    recipientEmail?: string
  ) => {
    // Initialiser le suivi de progression pour chaque fichier
    setUploadProgress(
      files.map(file => ({
        fileName: file.name,
        progress: 0,
        status: 'pending'
      }))
    );
    
    try {
      // Convertir les fichiers en base64
      const base64Files = [];
      let currentFileIndex = 0;
      
      for (const file of files) {
        try {
          // Mettre à jour la progression pour montrer que le fichier est en cours de traitement
          setUploadProgress(prev => 
            prev.map((item, index) => 
              index === currentFileIndex 
                ? { ...item, progress: 10, status: 'uploading' } 
                : item
            )
          );
          
          // Convertir le fichier en base64
          const base64 = await fileToBase64(file);
          
          // Ajouter le fichier converti à la liste
          base64Files.push({
            name: file.name,
            type: file.type,
            size: file.size,
            base64
          });
          
          // Mettre à jour la progression pour montrer que le fichier est prêt à être envoyé
          setUploadProgress(prev => 
            prev.map((item, index) => 
              index === currentFileIndex 
                ? { ...item, progress: 50, status: 'uploading' } 
                : item
            )
          );
          
          currentFileIndex++;
        } catch (error) {
          logger.error(`Erreur lors de la conversion du fichier ${file.name} en base64:`, error);
          throw error;
        }
      }
      
      // Envoyer les fichiers en base64 au serveur
      const result = await createFileTransferBase64({
        variables: {
          files: base64Files,
          input: {
            expiryDays,
            isPaymentRequired,
            paymentAmount,
            paymentCurrency,
            recipientEmail
          }
        }
      });
      
      // Marquer tous les fichiers comme téléchargés avec succès
      setUploadProgress(prev => 
        prev.map(item => ({ ...item, progress: 100, status: 'success' }))
      );
      
      return result.data?.createFileTransferBase64 as FileTransferResponse;
    } catch (err) {
      // Marquer les fichiers comme ayant échoué
      setUploadProgress(prev => 
        prev.map(item => ({ 
          ...item, 
          status: 'error', 
          error: err instanceof Error ? err.message : 'Une erreur est survenue'
        }))
      );
      
      logger.error('Erreur lors de la création du transfert de fichiers:', err);
      throw err;
    }
  };
  
  return {
    upload,
    uploadProgress,
    loading,
    error,
    data: data?.createFileTransfer as FileTransferResponse
  };
};

export const useDeleteFileTransfer = () => {
  const [deleteFileTransfer, { loading, error, data }] = useMutation(DELETE_FILE_TRANSFER, {
    refetchQueries: [{ query: MY_FILE_TRANSFERS }]
  });
  
  const deleteTransfer = async (id: string) => {
    try {
      const result = await deleteFileTransfer({
        variables: { id }
      });
      
      return result.data?.deleteFileTransfer;
    } catch (err) {
      logger.error('Erreur lors de la suppression du transfert de fichiers:', err);
      throw err;
    }
  };
  
  return {
    deleteTransfer,
    loading,
    error,
    success: data?.deleteFileTransfer
  };
};

export const useGeneratePaymentLink = () => {
  const [generatePaymentLink, { loading, error, data }] = useMutation(GENERATE_FILE_TRANSFER_PAYMENT_LINK);
  
  const getPaymentLink = async (shareLink: string, accessKey: string) => {
    try {
      const result = await generatePaymentLink({
        variables: { shareLink, accessKey }
      });
      
      return result.data?.generateFileTransferPaymentLink as FileTransferPaymentResponse;
    } catch (err) {
      logger.error('Erreur lors de la génération du lien de paiement:', err);
      throw err;
    }
  };
  
  return {
    getPaymentLink,
    loading,
    error,
    data: data?.generateFileTransferPaymentLink as FileTransferPaymentResponse
  };
};
