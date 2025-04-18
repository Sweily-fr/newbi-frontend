import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';
import { ROUTES } from '../constants';
import { Spinner } from '../../components/feedback/Spinner';

interface SubscriptionRouteProps {
  children: React.ReactElement;
}

/**
 * Composant de garde qui vérifie si l'utilisateur a un abonnement actif
 * (licence: true ou trial: true) avant de lui permettre d'accéder à la route
 */
export const SubscriptionRoute = ({ children }: SubscriptionRouteProps) => {
  const { hasActiveSubscription, loading } = useSubscription();

  // Afficher un spinner pendant le chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Rediriger vers la page des outils si l'utilisateur n'a pas d'abonnement actif
  if (!hasActiveSubscription) {
    return <Navigate to={ROUTES.TOOLS} replace />;
  }

  // Autoriser l'accès si l'utilisateur a un abonnement actif
  return children;
};
