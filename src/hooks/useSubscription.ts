import { useContext } from 'react';
import { SubscriptionContext } from '../context/SubscriptionContext.context';

// Hook pour utiliser le contexte d'abonnement
export const useSubscription = () => useContext(SubscriptionContext);
