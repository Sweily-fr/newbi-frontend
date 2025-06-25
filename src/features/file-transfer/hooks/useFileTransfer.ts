import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { 
  MY_FILE_TRANSFERS, 
  FILE_TRANSFER_BY_ID, 
  GET_FILE_TRANSFER_BY_LINK,
  CREATE_FILE_TRANSFER_BASE64,
  DELETE_FILE_TRANSFER, 
  GENERATE_FILE_TRANSFER_PAYMENT_LINK
} from '../graphql/queries';
import { 
  FileTransfer, 
  FileTransferPaymentResponse,
  FileUploadProgress,
  FileTransferStatus
} from '../types';

// Types pour les mutations GraphQL
interface CreateFileTransferBase64Mutation {
  createFileTransferBase64: {
    fileTransfer: FileTransfer;
  };
}

interface CreateFileTransferBase64MutationVariables {
  input: {
    name: string;
    type: string;
    size: number;
    file: File;
  };
}

// Options pour le transfert de fichiers
interface FileTransferOptions {
  expiryDays?: number;
  isPaymentRequired?: boolean;
  paymentAmount?: number;
  paymentCurrency?: string;
  recipientEmail?: string;
  onProgress?: (progress: {
    totalFiles: number;
    completedFiles: number;
    currentFile: string;
    progress: number;
  }) => void;
}

// Type pour le résultat de l'upload
interface UploadResult {
  downloadUrl?: string;
}

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

// Fonction pour uploader un fichier avec FormData via la mutation GraphQL
const uploadFileWithFormData = async (file: File, onProgress?: (progress: number) => void): Promise<UploadResult> => {
  const formData = new FormData();
  const operations = {
    query: `
      mutation CreateFileTransferBase64($input: CreateFileTransferBase64Input!) {
        createFileTransferBase64(input: $input) {
          fileTransfer {
            id
            name
            downloadUrl
          }
        }
      }
    `,
    variables: {
      input: {
        name: file.name,
        type: file.type,
        size: file.size
      }
    }
  };

  formData.append('operations', JSON.stringify(operations));
  formData.append('map', JSON.stringify({ '0': ['variables.input.file'] }));
  formData.append('0', file);

  const xhr = new XMLHttpRequest();
  const uploadPromise = new Promise<UploadResult>((resolve, reject) => {
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          const fileTransfer = response.data?.createFileTransferBase64?.fileTransfer;
          if (fileTransfer) {
            resolve({ downloadUrl: fileTransfer.downloadUrl });
          } else {
            reject(new Error('Format de réponse invalide'));
          }
        } catch (error) {
          reject(new Error('Réponse du serveur invalide'));
        }
      } else {
        reject(new Error(`Erreur serveur: ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Erreur réseau lors de l\'upload'));
    };
  });

  xhr.open('POST', '/graphql', true);
  xhr.send(formData);

  return uploadPromise;
};

export const useCreateFileTransfer = () => {
  const [createFileTransferBase64] = useMutation<CreateFileTransferBase64Mutation, CreateFileTransferBase64MutationVariables>(
    CREATE_FILE_TRANSFER_BASE64
  );

  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress[]>([]);

  const upload = async (files: File[], options?: FileTransferOptions): Promise<FileTransfer[]> => {
    const results: FileTransfer[] = [];
    const errors: Error[] = [];
    const totalFiles = files.length;
    let completedFiles = 0;

    // Initialiser le suivi de progression
    setUploadProgress(
      files.map(file => ({
        fileName: file.name,
        progress: 0,
        status: 'pending'
      }))
    );

    // Traiter chaque fichier
    const filePromises = files.map(async (file, index) => {
      try {
        let uploadResult: UploadResult;

        // Mettre à jour le statut en 'uploading'
        setUploadProgress(prev => 
          prev.map((p, i) => i === index ? { ...p, status: 'uploading', progress: 0 } : p)
        );

        // Utiliser uniquement uploadFileWithFormData
        logger.info(`Utilisation de FormData pour ${file.name} (${Math.round(file.size / (1024 * 1024))}MB)`);
        uploadResult = await uploadFileWithFormData(file, (progress) => {
          setUploadProgress(prev => 
            prev.map((p, i) => i === index ? { ...p, status: 'uploading', progress } : p)
          );
        });

        // Créer le transfert de fichier
        const response = await createFileTransferBase64({
          variables: {
            input: {
              name: file.name,
              base64: uploadResult.base64Content || '',
              type: file.type,
              size: file.size,
              downloadUrl: uploadResult.downloadUrl
            }
          }
        });

        if (!response.data?.createFileTransferBase64?.fileTransfer) {
          throw new Error('Réponse invalide du serveur');
        }

        const fileTransfer = response.data.createFileTransferBase64.fileTransfer;
        results.push(fileTransfer);

        // Mettre à jour la progression
        completedFiles++;
        const progress = Math.round((completedFiles / totalFiles) * 100);
        setUploadProgress(prev => 
          prev.map((p, i) => i === index ? { ...p, status: 'success', progress: 100 } : p)
        );

        // Notifier de la progression globale si des options sont fournies
        options?.onProgress?.({ 
          totalFiles,
          completedFiles,
          currentFile: file.name,
          progress
        });

        return fileTransfer;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        logger.error(`Erreur lors de la création du transfert: ${error}`);
        setUploadProgress(prev => 
          prev.map((p, i) => i === index ? { ...p, status: 'error', progress: 0, error: errorMessage } : p)
        );
        errors.push(new Error(`Échec du transfert de ${file.name}: ${errorMessage}`));
        throw error;
      }
    });

    await Promise.all(filePromises);

    if (errors.length > 0) {
      throw new Error(`Échec du transfert de fichiers: ${errors.map(e => e.message).join(', ')}`);
    }

    return results;
  };

  return { upload, uploadProgress };
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
