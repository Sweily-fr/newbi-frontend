import { gql } from '@apollo/client';

export const GET_CLIENTS = gql`
  query GetClients($page: Int, $limit: Int, $search: String) {
    clients(page: $page, limit: $limit, search: $search) {
      items {
        id
        name
        email
        type
        firstName
        lastName
        address {
          street
          city
          postalCode
          country
        }
        siret
        vatNumber
      }
      totalItems
      currentPage
      totalPages
    }
  }
`;

export const CREATE_CLIENT = gql`
  mutation CreateClient($input: ClientInput!) {
    createClient(input: $input) {
      id
      name
      email
      type
      firstName
      lastName
      address {
        street
        city
        postalCode
        country
      }
      siret
      vatNumber
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($id: ID!, $input: ClientInput!) {
    updateClient(id: $id, input: $input) {
      id
      name
      email
      type
      firstName
      lastName
      address {
        street
        city
        postalCode
        country
      }
      siret
      vatNumber
    }
  }
`;

export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id)
  }
`;

// Requêtes pour la recherche d'entreprises françaises
export const SEARCH_COMPANY_BY_SIRET = gql`
  query SearchCompanyBySiret($siret: String!) {
    searchCompanyBySiret(siret: $siret) {
      name
      siret
      vatNumber
      address {
        street
        city
        postalCode
        country
      }
    }
  }
`;

export const SEARCH_COMPANIES_BY_NAME = gql`
  query SearchCompaniesByName($name: String!) {
    searchCompaniesByName(name: $name) {
      name
      siret
      siren
    }
  }
`;
