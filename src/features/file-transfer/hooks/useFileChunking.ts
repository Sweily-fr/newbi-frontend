import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { UPLOAD_FILE_CHUNK, COMPLETE_FILE_UPLOAD } from '../graphql/mutations';
import { 
  UploadProgress, 
  ChunkedUploadOptions,
  ChunkedUploadResult
} from '../types/chunking';
import { logger } from '../../../utils/logger';

/**
 * Taille par défaut des chunks (5MB)
 * Cette valeur est un bon compromis entre performance et fiabilité
 */
const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Hook pour gérer l'upload de fichiers volumineux par chunks
 * Permet de télécharger des fichiers jusqu'à 100Go en les découpant en petits morceaux
 */
export const useFileChunking = () => {
  const [uploadChunk] = useMutation(UPLOAD_FILE_CHUNK);
  const [completeUpload] = useMutation(COMPLETE_FILE_UPLOAD);
  const [progress, setProgress] = useState<Record<string, UploadProgress>>({});

  /**
   * Télécharge un fichier en le découpant en chunks
   * @param file Fichier à télécharger
   * @param options Options de téléchargement
   * @returns Résultat du téléchargement
   */
  const uploadFile = useCallback(async (
    file: File,
    options: ChunkedUploadOptions = {}
  ): Promise<ChunkedUploadResult> => {
    const {
      chunkSize = DEFAULT_CHUNK_SIZE,
      maxRetries = 3,
      onProgress
    } = options;

    // Générer un ID de session unique pour ce fichier
    const sessionId = generateSessionId();
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    logger.info(`Début de l'upload par chunks pour ${file.name} (${formatFileSize(file.size)})`, {
      sessionId,
      totalChunks,
      chunkSize: formatFileSize(chunkSize)
    });

    // Initialiser la progression
    const fileProgress: UploadProgress = {
      filename: file.name,
      loaded: 0,
      total: file.size,
      percentage: 0,
      status: 'pending'
    };

    /**
     * Met à jour la progression de l'upload
     * @param updates Mises à jour à appliquer
     */
    const updateProgress = (updates: Partial<UploadProgress>) => {
      fileProgress.status = updates.status || fileProgress.status;
      fileProgress.loaded = updates.loaded ?? fileProgress.loaded;
      fileProgress.percentage = Math.round((fileProgress.loaded / fileProgress.total) * 100);
      if (updates.error) fileProgress.error = updates.error;
      
      setProgress(prev => ({ ...prev, [sessionId]: { ...fileProgress } }));
      onProgress?.({ ...fileProgress });
    };

    try {
      updateProgress({ status: 'uploading' });
      
      // Découper le fichier en chunks et les envoyer séquentiellement
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const end = Math.min(file.size, start + chunkSize);
        const chunk = file.slice(start, end);
        
        logger.info(`Traitement du chunk ${chunkIndex + 1}/${totalChunks} pour ${file.name}`, {
          chunkSize: formatFileSize(chunk.size),
          start: formatFileSize(start),
          end: formatFileSize(end)
        });
        
        let retryCount = 0;
        let success = false;
        
        // Tentatives avec backoff exponentiel
        while (retryCount < maxRetries && !success) {
          try {
            // Convertir le chunk en base64
            const base64Chunk = await fileToBase64(chunk);
            
            // Utiliser le système de chunking pour ce fichier
            const result = await uploadChunk({
              variables: {
                input: {
                  sessionId,
                  chunkIndex,
                  totalChunks,
                  chunkSize: chunk.size,
                  totalSize: file.size,
                  filename: file.name,
                  mimeType: file.type || 'application/octet-stream',
                  data: base64Chunk
                }
              }
            });
            
            if (!result.data?.uploadFileChunk?.success) {
              throw new Error(result.data?.uploadFileChunk?.message || 'Échec de l\'upload du chunk');
            }
            
            // Mettre à jour la progression
            updateProgress({ loaded: Math.min(start + chunk.size, file.size) });
            success = true;
            
            logger.info(`Chunk ${chunkIndex + 1}/${totalChunks} envoyé avec succès pour ${file.name}`);
          } catch (error) {
            retryCount++;
            if (retryCount >= maxRetries) {
              logger.error(`Échec définitif pour le chunk ${chunkIndex + 1}/${totalChunks} après ${maxRetries} tentatives`, error);
              throw error;
            }
            
            const backoffTime = 1000 * Math.pow(2, retryCount - 1); // Backoff exponentiel: 1s, 2s, 4s, ...
            logger.warn(`Tentative ${retryCount}/${maxRetries} échouée pour le chunk ${chunkIndex + 1}/${totalChunks}. Nouvelle tentative dans ${backoffTime/1000}s`, error);
            await new Promise(resolve => setTimeout(resolve, backoffTime));
          }
        }
      }

      // Convertir le fichier complet en base64
      logger.info(`Conversion du fichier complet ${file.name} en base64...`);
      const base64Content = await fileToBase64(file);

      // Tous les chunks ont été envoyés, finaliser l'upload
      logger.info(`Tous les chunks (${totalChunks}) ont été envoyés avec succès pour ${file.name}, finalisation de l'upload...`);
      
      const result = await completeUpload({
        variables: { 
          sessionId,
          input: options.input
        }
      });

      if (!result.data?.completeFileUpload?.success) {
        throw new Error(result.data?.completeFileUpload?.message || 'Échec de la finalisation de l\'upload');
      }

      updateProgress({ status: 'completed' });
      
      logger.info(`Upload de ${file.name} terminé avec succès!`, {
        fileTransferId: result.data?.completeFileUpload?.fileTransfer?.id,
        shareLink: result.data?.completeFileUpload?.fileTransfer?.shareLink
      });
      
      return {
        success: true,
        message: 'Fichier téléchargé avec succès',
        fileTransferId: result.data?.completeFileUpload?.fileTransfer?.id,
        sessionId,
        base64Content
      };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'upload du fichier';
      logger.error(`Erreur lors de l'upload du fichier ${file.name}:`, error);
      
      updateProgress({ 
        status: 'error',
        error: errorMessage
      });
      
      return {
        success: false,
        message: errorMessage,
        sessionId
      };
    }
  }, [uploadChunk, completeUpload]);

  return { uploadFile, progress };
};

/**
 * Convertit un blob en base64
 * @param chunk Blob à convertir
 * @returns Chaîne base64
 */
const fileToBase64 = (chunk: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const result = reader.result as string;
        if (!result || typeof result !== 'string') {
          reject(new Error('Résultat de conversion invalide'));
          return;
        }
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = error => reject(error);
    reader.readAsDataURL(chunk);
  });
};

/**
 * Génère un ID de session unique
 * @returns ID de session au format UUID
 */
const generateSessionId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Formate une taille de fichier en unité lisible
 * @param bytes Taille en octets
 * @returns Chaîne formatée (ex: "5.2 MB")
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
