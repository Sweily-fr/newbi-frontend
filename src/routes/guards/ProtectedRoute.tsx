import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../constants';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

/**
 * Composant de garde qui vérifie si l'utilisateur est authentifié
 * avant de lui permettre d'accéder à la route
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  // Rediriger vers la page d'authentification si l'utilisateur n'est pas connecté
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  // Autoriser l'accès si l'utilisateur est authentifié
  return children;
};
