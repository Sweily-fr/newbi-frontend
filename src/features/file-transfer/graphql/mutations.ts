import { gql } from '@apollo/client';

export const CREATE_FILE_TRANSFER = gql`
  mutation CreateFileTransfer(
    $files: [Upload!]!
    $input: FileTransferInput
  ) {
    createFileTransfer(
      files: $files
      input: $input
    ) {
      fileTransfer {
        id
        shareLink
        accessKey
        expiryDate
        status
        isPaymentRequired
        paymentAmount
        paymentCurrency
        isPaid
        totalSize
        files {
          id
          fileName
          originalName
          mimeType
          size
        }
      }
      shareLink
      accessKey
    }
  }
`;

export const CREATE_FILE_TRANSFER_BASE64 = gql`
  mutation CreateFileTransferBase64(
    $files: [Base64FileInput!]!
    $input: FileTransferInput
  ) {
    createFileTransferBase64(
      files: $files
      input: $input
    ) {
      success
      message
      fileTransfer {
        id
        shareLink
        accessKey
        expiryDate
        status
        isPaymentRequired
        paymentAmount
        paymentCurrency
        isPaid
        totalSize
        files {
          id
          fileName
          originalName
          mimeType
          size
        }
      }
      shareLink
      accessKey
    }
  }
`;

/**
 * Mutations pour le système de chunking (découpage en morceaux)
 * Ces mutations permettent de gérer l'upload de fichiers volumineux (jusqu'à 100Go)
 * en les découpant en petits morceaux envoyés séquentiellement
 */

export const UPLOAD_FILE_CHUNK = gql`
  mutation UploadFileChunk($input: FileChunkInput!) {
    uploadFileChunk(input: $input) {
      success
      message
      chunkIndex
      sessionId
    }
  }
`;

export const COMPLETE_FILE_UPLOAD = gql`
  mutation CompleteFileUpload($sessionId: ID!, $input: FileTransferInput) {
    completeFileUpload(sessionId: $sessionId, input: $input) {
      success
      message
      fileTransfer {
        id
        shareLink
        accessKey
        expiryDate
        status
        isPaymentRequired
        paymentAmount
        paymentCurrency
        isPaid
        totalSize
        files {
          id
          fileName
          originalName
          mimeType
          size
        }
      }
      sessionId
    }
  }
`;

export const DELETE_FILE_TRANSFER = gql`
  mutation DeleteFileTransfer($id: ID!) {
    deleteFileTransfer(id: $id)
  }
`;

export const GENERATE_FILE_TRANSFER_PAYMENT_LINK = gql`
  mutation GenerateFileTransferPaymentLink($shareLink: String!, $accessKey: String!) {
    generateFileTransferPaymentLink(shareLink: $shareLink, accessKey: $accessKey) {
      success
      message
      checkoutUrl
    }
  }
`;
