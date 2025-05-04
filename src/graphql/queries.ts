import { gql } from '@apollo/client';

export const GET_USER_INFO = gql`
  query GetUserInfo {
    me {
      id
      company {
        name
        email
        phone
        website
        siret
        vatNumber
        logo
        transactionCategory
        rcs
        capitalSocial
        companyStatus
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
    }
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

export { GET_CLIENTS } from './client';
