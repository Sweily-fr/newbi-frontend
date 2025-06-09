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
