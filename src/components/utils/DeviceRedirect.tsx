import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { ROUTES } from '../../routes/constants';

// Définition d'une route pour la page mobile
const MOBILE_ROUTE = '/mobile';

// Liste des routes qui devraient toujours être accessibles même sur mobile
// Par exemple, les pages légales, la page de redirection mobile elle-même, etc.
const ALLOWED_MOBILE_ROUTES = [
  MOBILE_ROUTE,
  ROUTES.LEGAL_NOTICE,
  ROUTES.PRIVACY_POLICY,
  ROUTES.TERMS,
  ROUTES.CONTACT,
  ROUTES.COOKIE_PREFERENCES
];

export const DeviceRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobile, isTablet } = useDeviceDetection();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Si l'utilisateur est sur mobile ou tablette et n'est pas déjà sur une route autorisée
    if ((isMobile || isTablet) && !ALLOWED_MOBILE_ROUTES.some(route => location.pathname.startsWith(route))) {
      // Rediriger vers la page mobile
      navigate(MOBILE_ROUTE, { replace: true });
    }
  }, [isMobile, isTablet, navigate, location.pathname]);

  return <>{children}</>;
};
