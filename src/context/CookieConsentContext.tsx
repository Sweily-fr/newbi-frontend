import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { CookieConsent, DEFAULT_COOKIE_CONSENT, CookieCategory } from '../types/cookie';
import { getCookie, setCookie, initializeTrackingScripts } from '../utils';

interface CookieConsentContextType {
  consent: CookieConsent;
  isConsentGiven: boolean;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
  acceptAllCookies: () => void;
  rejectAllCookies: () => void;
  saveCookiePreferences: (preferences: Partial<CookieConsent>) => void;
  updateCookieConsent: (category: CookieCategory, value: boolean) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

interface CookieConsentProviderProps {
  children: ReactNode;
}

// Nom du cookie utilisé pour stocker les préférences
const COOKIE_CONSENT_NAME = 'cookie_consent';

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children }) => {
  const [consent, setConsent] = useState<CookieConsent>(DEFAULT_COOKIE_CONSENT);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isConsentGiven, setIsConsentGiven] = useState<boolean>(false);

  // Charger les préférences de cookies au démarrage
  useEffect(() => {
    const storedConsent = getCookie(COOKIE_CONSENT_NAME);
    
    if (storedConsent) {
      try {
        const parsedConsent = JSON.parse(storedConsent);
        setConsent(parsedConsent);
        setIsConsentGiven(true);
        
        // Initialiser les scripts de suivi si le consentement a déjà été donné
        initializeTrackingScripts();
      } catch (error) {
        console.error('Erreur lors du parsing des préférences de cookies:', error);
        setShowBanner(true);
      }
    } else {
      // Aucun consentement stocké, afficher la bannière
      setShowBanner(true);
    }
  }, []);

  // Sauvegarder les préférences de cookies
  const saveCookiePreferences = (preferences: Partial<CookieConsent>) => {
    const newConsent = {
      ...consent,
      ...preferences,
      necessary: true, // Toujours activé
      lastUpdated: Date.now()
    };

    setConsent(newConsent);
    setCookie(COOKIE_CONSENT_NAME, JSON.stringify(newConsent), 365); // Expire dans 1 an
    setIsConsentGiven(true);
    setShowBanner(false);
    
    // Initialiser les scripts de suivi en fonction des nouveaux consentements
    initializeTrackingScripts();
  };

  // Accepter tous les cookies
  const acceptAllCookies = () => {
    saveCookiePreferences({
      functional: true,
      analytics: true,
      marketing: true
    });
  };

  // Rejeter tous les cookies optionnels
  const rejectAllCookies = () => {
    saveCookiePreferences({
      functional: false,
      analytics: false,
      marketing: false
    });
  };

  // Mettre à jour une catégorie spécifique de cookies
  const updateCookieConsent = (category: CookieCategory, value: boolean) => {
    if (category === 'necessary' && !value) {
      return; // Les cookies nécessaires ne peuvent pas être désactivés
    }

    saveCookiePreferences({
      [category]: value
    });
  };

  const value = {
    consent,
    isConsentGiven,
    showBanner,
    setShowBanner,
    acceptAllCookies,
    rejectAllCookies,
    saveCookiePreferences,
    updateCookieConsent
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};

// Exporter le contexte pour pouvoir créer le hook dans un fichier séparé
export { CookieConsentContext };
