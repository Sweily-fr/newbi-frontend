import { gql } from '@apollo/client';

export const GET_EXPENSES = gql(`
  query GetExpenses {
    expenses {
      expenses {
        id
        amount
        vatAmount
        vatRate
        date
        description
        category
        currency
        status
      }
      totalCount
      hasNextPage
    }
  }
`);

export const GET_COMPLETED_INVOICES = gql`
  query GetCompletedInvoices($startDate: String!, $endDate: String!) {
    invoices(
      status: COMPLETED,
      startDate: $startDate,
      endDate: $endDate,
      limit: 1000
    ) {
      invoices {
        id
        number
        issueDate
        dueDate
        status
        totalTTC
        totalHT
        totalVAT
        client {
          id
          name
        }
      }
      totalCount
    }
  }
`;