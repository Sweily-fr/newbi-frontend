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
        address {
          street
          city
          postalCode
          country
        }
        hasDifferentShippingAddress
        shippingAddress {
          street
          city
          postalCode
          country
        }
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
        address {
          street
          city
          postalCode
          country
        }
        hasDifferentShippingAddress
        shippingAddress {
          street
          city
          postalCode
          country
        }
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

export const GET_INVOICES = gql`
  query GetInvoices($startDate: String, $endDate: String, $status: InvoiceStatus, $search: String, $page: Int, $limit: Int) {
    invoices(startDate: $startDate, endDate: $endDate, status: $status, search: $search, page: $page, limit: $limit) {
      invoices {
        id
        number
        prefix
        purchaseOrderNumber
        isDeposit
        status
        headerNotes
        footerNotes
        termsAndConditions
        termsAndConditionsLinkTitle
        termsAndConditionsLink
        issueDate
        executionDate
        dueDate
        totalHT
        totalTTC
        totalVAT
        discount
        discountType
        discountAmount
        finalTotalHT
        finalTotalTTC
        customFields {
          key
          value
        }
        createdAt
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
          address {
            street
            city
            postalCode
            country
          }
          hasDifferentShippingAddress
          shippingAddress {
            street
            city
            postalCode
            country
          }
          siret
          vatNumber
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
      totalCount
      hasNextPage
    }
    invoiceStats {
      totalCount
      draftCount
      pendingCount
      completedCount
      totalAmount
    }
  }
`;
