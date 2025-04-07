import { gql } from '@apollo/client';

export const CREATE_INVOICE_MUTATION = gql`
  mutation CreateInvoice($input: CreateInvoiceInput!) {
    createInvoice(input: $input) {
      id
      number
      prefix
      purchaseOrderNumber
      isDeposit
      status
      issueDate
      executionDate
      dueDate
      headerNotes
      footerNotes
      termsAndConditions
      termsAndConditionsLinkTitle
      termsAndConditionsLink
      discount
      discountType
      totalHT
      totalTTC
      totalVAT
      finalTotalHT
      finalTotalTTC
      customFields {
        key
        value
      }
      createdAt
      client {
        id
        name
        email
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
    }
  }
`;

export const UPDATE_INVOICE_MUTATION = gql`
  mutation UpdateInvoice($id: ID!, $input: UpdateInvoiceInput!) {
    updateInvoice(id: $id, input: $input) {
      id
      number
      prefix
      purchaseOrderNumber
      isDeposit
      status
      issueDate
      executionDate
      dueDate
      headerNotes
      footerNotes
      termsAndConditions
      termsAndConditionsLinkTitle
      termsAndConditionsLink
      discount
      discountType
      totalHT
      totalTTC
      totalVAT
      finalTotalHT
      finalTotalTTC
      customFields {
        key
        value
      }
      updatedAt
      client {
        id
        name
        email
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
    }
  }
`;

export const DELETE_INVOICE_MUTATION = gql`
  mutation DeleteInvoice($id: ID!) {
    deleteInvoice(id: $id)
  }
`;

export const CHANGE_INVOICE_STATUS_MUTATION = gql`
  mutation ChangeInvoiceStatus($id: ID!, $status: InvoiceStatus!) {
    changeInvoiceStatus(id: $id, status: $status) {
      id
      status
      updatedAt
      customFields {
        key
        value
      }
    }
  }
`;

export const GET_NEXT_INVOICE_NUMBER = gql`
  query GetNextInvoiceNumber($prefix: String) {
    nextInvoiceNumber(prefix: $prefix)
  }
`;
