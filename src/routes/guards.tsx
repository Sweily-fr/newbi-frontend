import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { ROUTES } from './constants';

// Props pour les routes protégées et publiques
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

interface PublicRouteProps extends ProtectedRouteProps {
  restricted?: boolean;
}

// Composant pour les routes protégées (nécessite authentification)
export const ProtectedRoute = ({ children, redirectTo = ROUTES.AUTH }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <div>{children}</div> : <Navigate to={redirectTo} replace />;
};

// Composant pour les routes publiques (optionnellement restreintes aux utilisateurs non connectés)
export const PublicRoute = ({ children, restricted = false, redirectTo = ROUTES.TOOLS }: PublicRouteProps) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated && restricted ? <Navigate to={redirectTo} replace /> : <>{children}</>;
};

// Props pour les routes nécessitant un abonnement
interface SubscriptionRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

// Composant pour les routes nécessitant un abonnement actif (licence ou période d'essai)
export const SubscriptionRoute = ({ children, redirectTo = ROUTES.TOOLS }: SubscriptionRouteProps) => {
  const { hasActiveSubscription, loading } = useSubscription();
  
  // Afficher un indicateur de chargement pendant la vérification de l'abonnement
  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  // Rediriger si l'utilisateur n'a pas d'abonnement actif
  return hasActiveSubscription ? <>{children}</> : <Navigate to={redirectTo} replace />;
};
