import { gql } from '@apollo/client';
import { EMAIL_SIGNATURE_FIELDS } from './mutations';

// Requête pour récupérer toutes les signatures email
export const GET_EMAIL_SIGNATURES = gql`
  query GetEmailSignatures($page: Int, $limit: Int, $search: String) {
    emailSignatures(page: $page, limit: $limit, search: $search) {
      signatures {
        ...EmailSignatureFields
      }
      totalCount
      hasNextPage
    }
  }
  ${EMAIL_SIGNATURE_FIELDS}
`;

// Requête pour récupérer une signature email spécifique
export const GET_EMAIL_SIGNATURE = gql`
  query GetEmailSignature($id: ID!) {
    emailSignature(id: $id) {
      ...EmailSignatureFields
    }
  }
  ${EMAIL_SIGNATURE_FIELDS}
`;

// Requête pour récupérer la signature email par défaut
export const GET_DEFAULT_EMAIL_SIGNATURE = gql`
  query GetDefaultEmailSignature {
    defaultEmailSignature {
      ...EmailSignatureFields
    }
  }
  ${EMAIL_SIGNATURE_FIELDS}
`;
