import { gql } from '@apollo/client';

export const GET_EXPENSES = gql(`
  query GetExpenses {
    expenses {
      expenses {
        id
        amount
        date
        description
        category
      }
      totalCount
      hasNextPage
    }
  }
`);