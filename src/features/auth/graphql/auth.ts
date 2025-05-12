import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      message
      user {
        id
        email
      }
    }
  }
`;

export const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation RequestPasswordReset($input: ResetPasswordInput!) {
    requestPasswordReset(input: $input)
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: UpdatePasswordInput!) {
    resetPassword(input: $input) {
      success
      message
    }
  }
`;

// Définition de la mutation GraphQL
export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
    }
  }
`;

export const REACTIVATE_ACCOUNT = gql`
  mutation ReactivateAccount($email: String!, $password: String!) {
    reactivateAccount(email: $email, password: $password) {
      success
      message
      user {
        id
        email
        profile {
          firstName
          lastName
        }
      }
    }
  }
`;
