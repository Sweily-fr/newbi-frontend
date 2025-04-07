import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { COOKIE_CATEGORIES, CookieCategory } from '../types/cookie';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/constants';

export const CookiePreferencesPage: React.FC = () => {
  const { consent, updateCookieConsent, acceptAllCookies, rejectAllCookies } = useCookieConsent();
  const [preferences, setPreferences] = useState<Record<CookieCategory, boolean>>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });
  const [saved, setSaved] = useState(false);

  // Initialiser les préférences avec les valeurs actuelles du consentement
  useEffect(() => {
    setPreferences({
      necessary: true, // Toujours activé
      functional: consent.functional,
      analytics: consent.analytics,
      marketing: consent.marketing
    });
  }, [consent]);

  const handleToggle = (category: CookieCategory) => {
    if (category === 'necessary') return; // Ne pas permettre de désactiver les cookies nécessaires

    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // Mettre à jour chaque catégorie de cookies
    Object.entries(preferences).forEach(([category, value]) => {
      updateCookieConsent(category as CookieCategory, value);
    });
    
    setSaved(true);
    
    // Réinitialiser l'état de sauvegarde après 3 secondes
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const handleAcceptAll = () => {
    acceptAllCookies();
    setPreferences({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const handleRejectAll = () => {
    rejectAllCookies();
    setPreferences({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Non défini';
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Helmet>
        <title>Préférences de Cookies | Génération Business</title>
        <meta name="description" content="Gérez vos préférences de cookies sur Génération Business - Contrôlez quels cookies sont utilisés lors de votre navigation sur notre site." />
      </Helmet>
      
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Préférences de Cookies</h1>
          <div className="text-sm text-gray-500">
            Dernière mise à jour: {formatDate(consent.lastUpdated)}
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          Ce centre de préférences vous permet de personnaliser l'utilisation des cookies sur notre site. 
          Nous utilisons différents types de cookies pour optimiser votre expérience et nos services.
          Pour plus d'informations, consultez notre <Link to={ROUTES.PRIVACY_POLICY} className="text-blue-600 hover:underline">politique de confidentialité</Link>.
        </p>
        
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Tout refuser
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Tout accepter
            </button>
          </div>
          
          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6 flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Vos préférences ont été enregistrées avec succès.
            </div>
          )}
          
          <div className="space-y-6">
            {COOKIE_CATEGORIES.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{category.title}</h3>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id={`toggle-${category.id}`}
                      className={`
                        absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer
                        ${preferences[category.id] ? 'right-0 border-blue-500' : 'left-0 border-gray-300'}
                      `}
                      checked={preferences[category.id]}
                      onChange={() => handleToggle(category.id)}
                      disabled={category.id === 'necessary'}
                    />
                    <label
                      htmlFor={`toggle-${category.id}`}
                      className={`
                        block overflow-hidden h-6 rounded-full cursor-pointer
                        ${preferences[category.id] ? 'bg-blue-500' : 'bg-gray-300'}
                        ${category.id === 'necessary' ? 'opacity-70 cursor-not-allowed' : ''}
                      `}
                    ></label>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{category.description}</p>
                
                {category.id === 'necessary' && (
                  <div className="bg-blue-50 text-blue-800 text-sm px-4 py-2 rounded">
                    Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
                  </div>
                )}
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Cookies utilisés :</h4>
                  <div className="bg-gray-50 rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fournisseur</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objectif</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {category.cookies.map((cookie, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900">{cookie.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{cookie.provider}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{cookie.purpose}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{cookie.expiry}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Enregistrer mes préférences
          </button>
        </div>
      </div>
    </div>
  );
};
