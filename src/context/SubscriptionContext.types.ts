import { ApolloError } from '@apollo/client';

// Interface pour les informations d'abonnement
export interface Subscription {
  licence: boolean;
  trial: boolean;
  stripeCustomerId?: string;
}

// Interface pour le contexte d'abonnement
export interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  error: ApolloError | undefined;
  hasActiveSubscription: boolean;
  refetchSubscription: () => Promise<unknown>;
}

// Valeurs par défaut pour le contexte
export const defaultSubscriptionContext: SubscriptionContextType = {
  subscription: null,
  loading: false,
  error: undefined,
  hasActiveSubscription: false,
  refetchSubscription: async () => null,
};
