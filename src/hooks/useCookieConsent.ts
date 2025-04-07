import { useContext } from 'react';
import { CookieConsentContext } from '../context/CookieConsentContext';

/**
 * Hook personnalisé pour accéder au contexte de consentement des cookies
 * @returns Le contexte de consentement des cookies
 * @throws Une erreur si utilisé en dehors d'un CookieConsentProvider
 */
export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  
  if (context === undefined) {
    throw new Error('useCookieConsent doit être utilisé à l\'intérieur d\'un CookieConsentProvider');
  }
  
  return context;
};
