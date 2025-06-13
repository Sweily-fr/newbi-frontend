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

export const useMyFileTransfers = (page: number = 1, limit: number = 10) => {
  const { loading, error, data, refetch } = useQuery(MY_FILE_TRANSFERS, {
    variables: { page, limit },
    fetchPolicy: 'cache-and-network'
  });
  
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
  const fileTransfers = data?.myFileTransfers?.items 
    ? data.myFileTransfers.items.map((transfer: { status: string; id: string; userId: string; files: File[]; totalSize: number; shareLink: string; accessKey: string; expiryDate: string; isPaymentRequired: boolean; paymentAmount?: number; paymentCurrency?: string; isPaid: boolean; downloadCount: number; createdAt: string; updatedAt: string }) => ({
        ...transfer,
        status: mapStatusToEnum(transfer.status)
      }))
    : [];
  
  // Extraire les informations de pagination
  const pagination = data?.myFileTransfers ? {
    totalItems: data.myFileTransfers.totalItems || 0,
    currentPage: data.myFileTransfers.currentPage || page,
    totalPages: data.myFileTransfers.totalPages || 1,
    hasNextPage: data.myFileTransfers.hasNextPage || false
  } : {
    totalItems: 0,
    currentPage: page,
    totalPages: 1,
    hasNextPage: false
  };
  
  const refetchWithPagination = (newPage: number, newLimit: number = limit) => {
    return refetch({ page: newPage, limit: newLimit });
  };
  
  return {
    loading,
    error,
    fileTransfers: fileTransfers as FileTransfer[],
    pagination,
    refetch: refetchWithPagination
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
    reader.readAsDataURL(file); // Utilise readAsDataURL qui inclut déjà l'en-tête MIME
    reader.onload = () => {
      const result = reader.result as string;
      // readAsDataURL retourne déjà le format "data:mime/type;base64,content"
      // Vérifier que le résultat est bien au format attendu
      if (!result || typeof result !== 'string') {
        reject(new Error('Échec de la conversion en base64'));
        return;
      }
      
      // S'assurer que le format est correct
      if (!result.includes(';base64,')) {
        logger.error('Format base64 incorrect:', result.substring(0, 50));
        reject(new Error('Format base64 incorrect'));
        return;
      }
      
      resolve(result);
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
          // Debug: Afficher les informations du fichier original
          logger.info('Fichier original:', file.name, file.size, file.type);
          
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
          
          // Debug: Vérifier la longueur du base64 et son début
          logger.info(`Base64 length: ${base64.length}`);
          logger.info(`Base64 start: ${base64.substring(0, 100)}...`);
          
          // Vérifier que le format est correct
          if (!base64.includes(';base64,')) {
            logger.error(`Format base64 incorrect pour le fichier ${file.name}`);
            throw new Error(`Format base64 incorrect pour le fichier ${file.name}`);
          }
          
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
      
      // Debug: Afficher le nombre de fichiers à envoyer
      logger.info(`Envoi de ${base64Files.length} fichiers au serveur`);
      
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
      
      // Debug: Vérifier la réponse du serveur
      logger.info('Réponse du serveur:', result.data?.createFileTransferBase64);
      
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
