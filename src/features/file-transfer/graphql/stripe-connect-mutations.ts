import { gql } from '@apollo/client';

export const CREATE_STRIPE_CONNECT_ACCOUNT = gql`
  mutation CreateStripeConnectAccount {
    createStripeConnectAccount {
      success
      message
      accountId
    }
  }
`;

export const GENERATE_STRIPE_ONBOARDING_LINK = gql`
  mutation GenerateStripeOnboardingLink($accountId: String!, $returnUrl: String!) {
    generateStripeOnboardingLink(accountId: $accountId, returnUrl: $returnUrl) {
      success
      message
      url
    }
  }
`;

export const CHECK_STRIPE_CONNECT_ACCOUNT_STATUS = gql`
  mutation CheckStripeConnectAccountStatus($accountId: String!) {
    checkStripeConnectAccountStatus(accountId: $accountId) {
      success
      message
      isOnboarded
      accountStatus
      payoutsEnabled
      chargesEnabled
    }
  }
`;

export const CREATE_PAYMENT_SESSION_FOR_FILE_TRANSFER = gql`
  mutation CreatePaymentSessionForFileTransfer($transferId: ID!) {
    createPaymentSessionForFileTransfer(transferId: $transferId) {
      success
      message
      sessionUrl
      sessionId
    }
  }
`;
