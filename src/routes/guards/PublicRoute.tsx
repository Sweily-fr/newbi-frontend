import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../constants';

interface PublicRouteProps {
  children: React.ReactElement;
  restricted?: boolean;
}

/**
 * Composant de garde pour les routes publiques
 * Si restricted est true, les utilisateurs authentifiés seront redirigés vers la page des outils
 */
export const PublicRoute = ({ children, restricted = false }: PublicRouteProps) => {
  const { isAuthenticated } = useAuth();

  // Rediriger vers la page des outils si l'utilisateur est connecté et que la route est restreinte
  if (isAuthenticated && restricted) {
    return <Navigate to={ROUTES.TOOLS} replace />;
  }

  // Autoriser l'accès dans tous les autres cas
  return children;
};
