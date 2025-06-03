import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { 
  MY_FILE_TRANSFERS, 
  FILE_TRANSFER_BY_ID, 
  GET_FILE_TRANSFER_BY_LINK 
} from '../graphql/queries';
import { 
  CREATE_FILE_TRANSFER, 
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
    ? data.myFileTransfers.map((transfer: any) => ({
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

export const useCreateFileTransfer = () => {
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress[]>([]);
  const [createFileTransfer, { loading, error, data }] = useMutation(CREATE_FILE_TRANSFER);
  
  const upload = async (
    files: File[], 
    expiryDays?: number, 
    isPaymentRequired?: boolean,
    paymentAmount?: number,
    paymentCurrency?: string
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
      // Créer un tableau de promesses pour suivre la progression de chaque fichier
      const result = await createFileTransfer({
        variables: {
          files,
          expiryDays,
          isPaymentRequired,
          paymentAmount,
          paymentCurrency
        },
        context: {
          fetchOptions: {
            useUpload: true,
            onProgress: (progress: number, fileName: string) => {
              // Mettre à jour la progression du fichier spécifique
              setUploadProgress(prev => 
                prev.map(item => 
                  item.fileName === fileName 
                    ? { ...item, progress, status: 'uploading' } 
                    : item
                )
              );
            }
          }
        }
      });
      
      // Marquer tous les fichiers comme téléchargés avec succès
      setUploadProgress(prev => 
        prev.map(item => ({ ...item, progress: 100, status: 'success' }))
      );
      
      return result.data?.createFileTransfer as FileTransferResponse;
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
