import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts($search: String, $category: String, $page: Int, $limit: Int) {
    products(search: $search, category: $category, page: $page, limit: $limit) {
      products {
        id
        name
        description
        unitPrice
        vatRate
        unit
        category
        reference
        createdAt
        updatedAt
      }
      totalCount
      hasNextPage
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      unitPrice
      vatRate
      unit
      category
      reference
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      unitPrice
      vatRate
      unit
      category
      reference
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      description
      unitPrice
      vatRate
      unit
      category
      reference
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;
