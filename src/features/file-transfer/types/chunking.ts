/**
 * Types pour le système de chunking (découpage en morceaux) des fichiers volumineux
 * Ce système permet de gérer des fichiers jusqu'à 100Go en les découpant en petits morceaux
 */

export interface FileChunk {
  chunkIndex: number;     // Index du morceau actuel (0-based)
  totalChunks: number;    // Nombre total de morceaux
  chunkSize: number;      // Taille du morceau en octets
  totalSize: number;      // Taille totale du fichier en octets
  filename: string;       // Nom du fichier
  mimeType: string;       // Type MIME du fichier
  sessionId: string;      // ID de session unique pour ce fichier
  data: string;           // Contenu du morceau en base64
}

export interface ChunkedFileMetadata {
  filename: string;       // Nom du fichier
  mimeType: string;       // Type MIME du fichier
  size: number;           // Taille totale du fichier en octets
  totalChunks: number;    // Nombre total de morceaux
  sessionId: string;      // ID de session unique pour ce fichier
}

export interface UploadProgress {
  filename: string;       // Nom du fichier
  loaded: number;         // Octets chargés
  total: number;          // Taille totale du fichier
  percentage: number;     // Pourcentage de progression (0-100)
  status: 'pending' | 'uploading' | 'completed' | 'error'; // État actuel
  error?: string;         // Message d'erreur éventuel
}

export interface ChunkedUploadOptions {
  chunkSize?: number;     // Taille de chaque morceau en octets (défaut: 5MB)
  maxRetries?: number;    // Nombre de tentatives en cas d'échec
  onProgress?: (progress: UploadProgress) => void; // Callback de progression
  input?: {              // Paramètres pour la création du transfert de fichier
    expiryDays?: number;
    isPaymentRequired?: boolean;
    paymentAmount?: number;
    paymentCurrency?: string;
    recipientEmail?: string;
  };
}

export interface ChunkedUploadResult {
  success: boolean;       // Succès de l'opération
  message?: string;       // Message éventuel
  fileTransferId?: string; // ID du transfert de fichier créé
  sessionId: string;      // ID de session utilisé
  base64Content: string;  // Contenu du fichier en base64
}
