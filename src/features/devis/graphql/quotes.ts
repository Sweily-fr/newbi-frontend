import { gql } from '@apollo/client';

export const QUOTE_FRAGMENT = gql`
  fragment QuoteFields on Quote {
    id
    prefix
    number
    issueDate
    validUntil
    status
    headerNotes
    footerNotes
    termsAndConditions
    termsAndConditionsLinkTitle
    termsAndConditionsLink
    discount
    discountType
    discountAmount
    totalHT
    totalTTC
    totalVAT
    finalTotalHT
    finalTotalTTC
    createdAt
    updatedAt
    companyInfo {
      name
      email
      phone
      website
      siret
      vatNumber
      logo
      address {
        street
        city
        postalCode
        country
      }
      bankDetails {
        iban
        bic
        bankName
      }
    }
    client {
      id
      name
      email
      type
      address {
        street
        city
        postalCode
        country
      }
      siret
      vatNumber
      firstName
      lastName
    }
    items {
      description
      quantity
      unitPrice
      vatRate
      unit
      discount
      discountType
      details
    }
    customFields {
      key
      value
    }
    convertedToInvoice {
      id
      prefix
      number
      status
      finalTotalTTC
    }
    linkedInvoices {
      id
      prefix
      number
      status
      finalTotalTTC
    }
  }
`;

export const GET_NEXT_QUOTE_NUMBER = gql`
  query NextQuoteNumber($prefix: String) {
    nextQuoteNumber(prefix: $prefix)
  }
`;

export const GET_QUOTES = gql`
  query GetQuotes(
    $startDate: String
    $endDate: String
    $status: QuoteStatus
    $search: String
    $page: Int
    $limit: Int
  ) {
    quotes(
      startDate: $startDate
      endDate: $endDate
      status: $status
      search: $search
      page: $page
      limit: $limit
    ) {
      quotes {
        ...QuoteFields
      }
      totalCount
      hasNextPage
    }
  }
  ${QUOTE_FRAGMENT}
`;

export const GET_QUOTE = gql`
  query GetQuote($id: ID!) {
    quote(id: $id) {
      ...QuoteFields
    }
  }
  ${QUOTE_FRAGMENT}
`;

export const CREATE_QUOTE_MUTATION = gql`
  mutation CreateQuote($input: CreateQuoteInput!) {
    createQuote(input: $input) {
      ...QuoteFields
    }
  }
  ${QUOTE_FRAGMENT}
`;

export const UPDATE_QUOTE_MUTATION = gql`
  mutation UpdateQuote($id: ID!, $input: UpdateQuoteInput!) {
    updateQuote(id: $id, input: $input) {
      ...QuoteFields
    }
  }
  ${QUOTE_FRAGMENT}
`;

export const DELETE_QUOTE_MUTATION = gql`
  mutation DeleteQuote($id: ID!) {
    deleteQuote(id: $id)
  }
`;

export const CHANGE_QUOTE_STATUS_MUTATION = gql`
  mutation ChangeQuoteStatus($id: ID!, $status: QuoteStatus!) {
    changeQuoteStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`;

export const CONVERT_QUOTE_TO_INVOICE_MUTATION = gql`
  mutation ConvertQuoteToInvoice($id: ID!, $distribution: [Float], $isDeposit: Boolean, $skipValidation: Boolean) {
    convertQuoteToInvoice(id: $id, distribution: $distribution, isDeposit: $isDeposit, skipValidation: $skipValidation) {
      id
      number
      prefix
      status
      totalHT
      totalTTC
      totalVAT
      isDeposit
      createdAt
      client {
        id
      }
      items {
        description
        quantity
        unitPrice
      }
    }
  }
`;

export const GET_QUOTE_STATS = gql`
  query GetQuoteStats {
    quoteStats {
      totalCount
      draftCount
      pendingCount
      canceledCount
      completedCount
      totalAmount
    }
  }
`;
