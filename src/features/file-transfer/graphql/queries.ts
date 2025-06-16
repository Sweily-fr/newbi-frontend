import { gql } from '@apollo/client';

export const GET_FILE_TRANSFER_BY_DOWNLOAD_LINK = gql`
  query GetFileTransferByDownloadLink($downloadLink: String!, $accessKey: String!) {
    getFileTransferByLink(shareLink: $downloadLink, accessKey: $accessKey) {
      success
      message
      fileTransfer {
        id
        files {
          id
          fileName
          originalName
          size
          filePath
        }
        totalSize
        expiryDate
        paymentInfo {
          isPaymentRequired
          paymentAmount
          paymentCurrency
          isPaid
          checkoutUrl
        }
        isAccessible
      }
    }
  }
`;

export const MY_FILE_TRANSFERS = gql`
  query MyFileTransfers($page: Int, $limit: Int) {
    myFileTransfers(page: $page, limit: $limit) {
      items {
        id
        shareLink
        accessKey
        expiryDate
        status
        isPaymentRequired
        paymentAmount
        paymentCurrency
        isPaid
        downloadCount
        createdAt
        totalSize
        files {
          id
          fileName
          originalName
          mimeType
          size
          filePath
        }
      }
      totalItems
      currentPage
      totalPages
      hasNextPage
    }
  }
`;

export const FILE_TRANSFER_BY_ID = gql`
  query FileTransferById($id: ID!) {
    fileTransferById(id: $id) {
      id
      shareLink
      accessKey
      expiryDate
      status
      isPaymentRequired
      paymentAmount
      paymentCurrency
      isPaid
      downloadCount
      createdAt
      totalSize
      files {
        id
        fileName
        originalName
        mimeType
        size
        filePath
      }
    }
  }
`;

export const GET_FILE_TRANSFER_BY_LINK = gql`
  query GetFileTransferByLink($shareLink: String!, $accessKey: String!) {
    getFileTransferByLink(shareLink: $shareLink, accessKey: $accessKey) {
      success
      message
      fileTransfer {
        id
        files {
          id
          fileName
          originalName
          mimeType
          size
          filePath
        }
        totalSize
        expiryDate
        paymentInfo {
          isPaymentRequired
          paymentAmount
          paymentCurrency
          isPaid
          checkoutUrl
        }
        isAccessible
      }
    }
  }
`;
