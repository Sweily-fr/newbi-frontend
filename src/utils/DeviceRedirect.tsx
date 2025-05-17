import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { ROUTES } from '../routes/constants';

// Définition d'une route pour la page mobile
const MOBILE_ROUTE = '/mobile';

// Clé pour stocker la dernière page visitée dans le localStorage
const LAST_VISITED_PAGE_KEY = 'newbi_last_visited_page';

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
  const { isMobile, isTablet, isDesktop } = useDeviceDetection();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Utiliser useRef au lieu de useState pour éviter les rendus supplémentaires
  const previousDeviceStateRef = useRef<{ isMobile: boolean; isTablet: boolean }>({ 
    isMobile: false, 
    isTablet: false 
  });
  
  // Effet pour gérer la redirection vers la page mobile
  useEffect(() => {
    // Si l'utilisateur est sur mobile ou tablette et n'est pas déjà sur une route autorisée
    if ((isMobile || isTablet) && !ALLOWED_MOBILE_ROUTES.some(route => location.pathname.startsWith(route))) {
      // Sauvegarder la page actuelle avant la redirection
      if (location.pathname !== MOBILE_ROUTE) {
        localStorage.setItem(LAST_VISITED_PAGE_KEY, location.pathname + location.search);
      }
      
      // Rediriger vers la page mobile
      navigate(MOBILE_ROUTE, { replace: true });
    }
  }, [isMobile, isTablet, navigate, location.pathname, location.search]);
  
  // Effet séparé pour gérer le retour à la dernière page visitée
  useEffect(() => {
    const wasMobileOrTablet = previousDeviceStateRef.current.isMobile || previousDeviceStateRef.current.isTablet;
    
    // Si l'utilisateur revient à une taille d'écran de bureau après avoir été sur mobile/tablette
    if (isDesktop && wasMobileOrTablet && location.pathname === MOBILE_ROUTE) {
      // Récupérer la dernière page visitée
      const lastVisitedPage = localStorage.getItem(LAST_VISITED_PAGE_KEY) || ROUTES.HOME;
      
      // Rediriger vers la dernière page visitée
      navigate(lastVisitedPage, { replace: true });
    }
    
    // Mettre à jour l'état précédent de l'appareil
    previousDeviceStateRef.current = { isMobile, isTablet };
  }, [isMobile, isTablet, isDesktop, navigate, location.pathname]);

  return <>{children}</>;
};
