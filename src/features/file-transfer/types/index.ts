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

export interface FileTransferPaymentInfo {
  isPaymentRequired: boolean;
  isPaid: boolean;
  paymentAmount?: number;
  paymentCurrency?: string;
  paymentLink?: string;
  stripeSessionId?: string;
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
  isPaid: boolean;
  paymentAmount?: number;
  paymentCurrency?: string;
  paymentLink?: string;
  recipientEmail?: string;
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
  expiryDays?: number;
  isPaymentRequired?: boolean;
  paymentAmount?: number;
  paymentCurrency?: string;
  recipientEmail?: string;
}

export interface FileUploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}
