import { createContext } from 'react';
import { SubscriptionContextType, defaultSubscriptionContext } from './SubscriptionContext.types';

// Créer et exporter le contexte d'abonnement
export const SubscriptionContext = createContext<SubscriptionContextType>(defaultSubscriptionContext);
