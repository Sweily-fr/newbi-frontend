import { gql } from '@apollo/client';

export const GET_CLIENTS = gql`
  query GetClients {
    clients {
      id
      name
      email
      type
      firstName
      lastName
      siret
      vatNumber
    }
  }
`;
