import { gql } from '@apollo/client';

export const GET_SUPPLIERS = gql`
  query GetSuppliers {
    suppliers {
      id
      name
      email
      phone
      address {
        street
        complement
        city
        postalCode
        country
      }
      siret
      vatNumber
      website
      notes
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_SUPPLIER = gql`
  query GetSupplier($id: ID!) {
    supplier(id: $id) {
      id
      name
      email
      phone
      address {
        street
        complement
        city
        postalCode
        country
      }
      siret
      vatNumber
      website
      notes
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_SUPPLIER = gql`
  mutation CreateSupplier($input: SupplierInput!) {
    createSupplier(input: $input) {
      id
      name
      email
      phone
      address {
        street
        complement
        city
        postalCode
        country
      }
      siret
      vatNumber
      website
      notes
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SUPPLIER = gql`
  mutation UpdateSupplier($id: ID!, $input: SupplierInput!) {
    updateSupplier(id: $id, input: $input) {
      id
      name
      email
      phone
      address {
        street
        complement
        city
        postalCode
        country
      }
      siret
      vatNumber
      website
      notes
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_SUPPLIER = gql`
  mutation DeleteSupplier($id: ID!) {
    deleteSupplier(id: $id) {
      id
      name
    }
  }
`;
