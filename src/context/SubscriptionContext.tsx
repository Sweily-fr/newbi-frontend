import { useState, useEffect, ReactNode } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useAuth } from './AuthContext';
import { SubscriptionContext } from './SubscriptionContext.context';
import { Subscription, SubscriptionContextType } from './SubscriptionContext.types';

// Définir la requête pour récupérer les informations d'abonnement
const GET_USER_SUBSCRIPTION = gql`
  query GetUserSubscription {
    me {
      id
      subscription {
        licence
        trial
        stripeCustomerId
      }
    }
  }
`;

// Provider pour le contexte d'abonnement
export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  
  // Requête pour récupérer les informations d'abonnement
  const { loading, error, data, refetch } = useQuery(GET_USER_SUBSCRIPTION, {
    skip: !isAuthenticated, // Ne pas exécuter la requête si l'utilisateur n'est pas authentifié
    fetchPolicy: 'cache-and-network', // Toujours récupérer les données les plus récentes
  });

  // Mettre à jour les informations d'abonnement lorsque les données changent
  useEffect(() => {
    if (data?.me?.subscription) {
      setSubscription(data.me.subscription);
    }
  }, [data]);

  // Vérifier si l'utilisateur a un abonnement actif (licence ou période d'essai)
  const hasActiveSubscription = Boolean(
    subscription && (subscription.licence === true || subscription.trial === true)
  );

  // Valeur du contexte
  const value: SubscriptionContextType = {
    subscription,
    loading,
    error,
    hasActiveSubscription,
    refetchSubscription: refetch,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
