import { gql } from '@apollo/client';

// Fragment pour les données de base d'une dépense
export const EXPENSE_FRAGMENT = gql`
  fragment ExpenseFragment on Expense {
    id
    title
    description
    amount
    currency
    category
    date
    vendor
    vendorVatNumber
    invoiceNumber
    vatAmount
    vatRate
    isVatDeductible
    status
    paymentMethod
    paymentDate
    notes
    tags
    createdAt
    updatedAt
    createdBy {
      id
      email
      profile {
        firstName
        lastName
      }
    }
  }
`;

// Fragment pour les fichiers associés à une dépense
export const EXPENSE_FILE_FRAGMENT = gql`
  fragment ExpenseFileFragment on ExpenseFile {
    id
    filename
    originalFilename
    mimetype
    path
    size
    url
    ocrProcessed
    createdAt
    updatedAt
  }
`;

// Fragment pour les métadonnées OCR
export const OCR_METADATA_FRAGMENT = gql`
  fragment OCRMetadataFragment on OCRMetadata {
    vendorName
    vendorAddress
    vendorVatNumber
    invoiceNumber
    invoiceDate
    totalAmount
    vatAmount
    currency
    confidenceScore
    rawExtractedText
  }
`;

// Requête pour récupérer une dépense par son ID
export const GET_EXPENSE = gql`
  query GetExpense($id: ID!) {
    expense(id: $id) {
      ...ExpenseFragment
      files {
        ...ExpenseFileFragment
        ocrData {
          ...OCRMetadataFragment
        }
      }
      ocrMetadata {
        ...OCRMetadataFragment
      }
    }
  }
  ${EXPENSE_FRAGMENT}
  ${EXPENSE_FILE_FRAGMENT}
  ${OCR_METADATA_FRAGMENT}
`;

// Requête pour récupérer une liste paginée de dépenses avec filtres
export const GET_EXPENSES = gql`
  query GetExpenses(
    $startDate: String
    $endDate: String
    $category: ExpenseCategory
    $status: ExpenseStatus
    $search: String
    $tags: [String!]
    $page: Int
    $limit: Int
  ) {
    expenses(
      startDate: $startDate
      endDate: $endDate
      category: $category
      status: $status
      search: $search
      tags: $tags
      page: $page
      limit: $limit
    ) {
      expenses {
        ...ExpenseFragment
        files {
          id
          filename
          url
          ocrProcessed
        }
      }
      totalCount
      hasNextPage
    }
  }
  ${EXPENSE_FRAGMENT}
`;

// Requête pour récupérer les statistiques des dépenses
export const GET_EXPENSE_STATS = gql`
  query GetExpenseStats($startDate: String, $endDate: String) {
    expenseStats(startDate: $startDate, endDate: $endDate) {
      totalAmount
      totalCount
      byCategory {
        category
        amount
        count
      }
      byMonth {
        month
        amount
        count
      }
      byStatus {
        status
        amount
        count
      }
    }
  }
`;

// Mutation pour créer une nouvelle dépense
export const CREATE_EXPENSE = gql`
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      ...ExpenseFragment
    }
  }
  ${EXPENSE_FRAGMENT}
`;

// Mutation pour mettre à jour une dépense existante
export const UPDATE_EXPENSE = gql`
  mutation UpdateExpense($id: ID!, $input: UpdateExpenseInput!) {
    updateExpense(id: $id, input: $input) {
      ...ExpenseFragment
      files {
        ...ExpenseFileFragment
      }
    }
  }
  ${EXPENSE_FRAGMENT}
  ${EXPENSE_FILE_FRAGMENT}
`;

// Mutation pour supprimer une dépense
export const DELETE_EXPENSE = gql`
  mutation DeleteExpense($id: ID!) {
    deleteExpense(id: $id)
  }
`;

// Mutation pour changer le statut d'une dépense
export const CHANGE_EXPENSE_STATUS = gql`
  mutation ChangeExpenseStatus($id: ID!, $status: ExpenseStatus!) {
    changeExpenseStatus(id: $id, status: $status) {
      id
      status
      paymentDate
    }
  }
`;

// Mutation pour ajouter un fichier à une dépense
export const ADD_EXPENSE_FILE = gql`
  mutation AddExpenseFile($expenseId: ID!, $input: FileUploadInput!) {
    addExpenseFile(expenseId: $expenseId, input: $input) {
      id
      files {
        ...ExpenseFileFragment
        ocrData {
          ...OCRMetadataFragment
        }
      }
      ocrMetadata {
        ...OCRMetadataFragment
      }
    }
  }
  ${EXPENSE_FILE_FRAGMENT}
  ${OCR_METADATA_FRAGMENT}
`;

// Mutation pour supprimer un fichier d'une dépense
export const REMOVE_EXPENSE_FILE = gql`
  mutation RemoveExpenseFile($expenseId: ID!, $fileId: ID!) {
    removeExpenseFile(expenseId: $expenseId, fileId: $fileId) {
      id
      files {
        id
      }
    }
  }
`;

// Mutation pour mettre à jour les métadonnées OCR d'une dépense
export const UPDATE_EXPENSE_OCR_METADATA = gql`
  mutation UpdateExpenseOCRMetadata($expenseId: ID!, $metadata: OCRMetadataInput!) {
    updateExpenseOCRMetadata(expenseId: $expenseId, metadata: $metadata) {
      id
      ocrMetadata {
        ...OCRMetadataFragment
      }
    }
  }
  ${OCR_METADATA_FRAGMENT}
`;

// Mutation pour déclencher manuellement l'analyse OCR d'un fichier
export const PROCESS_EXPENSE_FILE_OCR = gql`
  mutation ProcessExpenseFileOCR($expenseId: ID!, $fileId: ID!) {
    processExpenseFileOCR(expenseId: $expenseId, fileId: $fileId) {
      id
      files {
        id
        ocrProcessed
        ocrData {
          ...OCRMetadataFragment
        }
      }
      ocrMetadata {
        ...OCRMetadataFragment
      }
    }
  }
  ${OCR_METADATA_FRAGMENT}
`;

// Mutation pour appliquer les données OCR aux champs de la dépense
export const APPLY_OCR_DATA_TO_EXPENSE = gql`
  mutation ApplyOCRDataToExpense($expenseId: ID!) {
    applyOCRDataToExpense(expenseId: $expenseId) {
      ...ExpenseFragment
    }
  }
  ${EXPENSE_FRAGMENT}
`;
