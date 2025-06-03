export enum FileTransferStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  DELETED = 'DELETED'
}

export interface File {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  filePath: string;
}

export interface FileTransfer {
  id: string;
  userId: string;
  files: File[];
  totalSize: number;
  shareLink: string;
  accessKey: string;
  expiryDate: string;
  status: FileTransferStatus;
  isPaymentRequired: boolean;
  paymentAmount?: number;
  paymentCurrency?: string;
  isPaid: boolean;
  paymentSessionId?: string;
  paymentSessionUrl?: string;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  zipDownloadUrl?: string;
}

export interface FileTransferResponse {
  fileTransfer: FileTransfer;
  shareLink: string;
  accessKey: string;
}

export interface FileTransferPaymentResponse {
  success: boolean;
  message?: string;
  checkoutUrl: string;
}

export interface FileTransferPaymentInfo {
  isPaymentRequired: boolean;
  paymentAmount?: number;
  paymentCurrency?: string;
  isPaid: boolean;
  checkoutUrl?: string;
}

export interface FileTransferInfo {
  id: string;
  files: File[];
  totalSize: number;
  expiryDate: string;
  paymentInfo: FileTransferPaymentInfo;
  isAccessible: boolean;
}

export interface FileTransferAccessResponse {
  success: boolean;
  message?: string;
  fileTransfer: FileTransferInfo;
}

export interface CreateFileTransferInput {
  files: File[];
  isPaymentRequired?: boolean;
  paymentAmount?: number;
  paymentCurrency?: string;
}

export interface FileUploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}
