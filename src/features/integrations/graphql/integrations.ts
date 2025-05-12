import { gql } from '@apollo/client';

export const CONNECT_STRIPE = gql`
  mutation ConnectStripe($apiKey: String!) {
    connectStripe(apiKey: $apiKey) {
      success
      message
      integration {
        id
        provider
        isConnected
        lastUpdated
      }
    }
  }
`;

export const DISCONNECT_STRIPE = gql`
  mutation DisconnectStripe {
    disconnectStripe {
      success
      message
    }
  }
`;

export const GET_INTEGRATIONS = gql`
  query GetIntegrations {
    integrations {
      id
      provider
      isConnected
      lastUpdated
    }
  }
`;
