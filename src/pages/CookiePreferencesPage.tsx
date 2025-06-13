import React, { useState, useEffect } from 'react';
import { SEOHead } from '../components/specific/SEO/SEOHead';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { COOKIE_CATEGORIES, CookieCategory } from '../types/cookie';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/constants';
import { Notification } from '../components/common/Notification';

export const CookiePreferencesPage: React.FC = () => {
  const navigate = useNavigate();
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
    
    // Afficher une notification de succès en bas à gauche
    Notification.success('Vos préférences de cookies ont été enregistrées avec succès', {
      position: 'bottom-left',
      duration: 3000,
      onClose: () => {
        // Rediriger vers la page d'accueil après la fermeture de la notification
        navigate(ROUTES.HOME);
      }
    });
    
    // Rediriger vers la page d'accueil après un court délai
    setTimeout(() => {
      navigate(ROUTES.HOME);
    }, 300);
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
      <SEOHead 
        title="Préférences de Cookies | Newbi"
        description="Gérez vos préférences de cookies sur Newbi - Contrôlez quels cookies sont utilisés lors de votre navigation sur notre site et personnalisez votre expérience."
        keywords="cookies, préférences cookies, RGPD, confidentialité, paramètres, vie privée"
        schemaType="WebPage"
        noindex={true}
        additionalSchemaData={{
          'specialty': 'Privacy Settings'
        }}
        ogImage="https://www.newbi.fr/images/PNG/Logo_Texte_Purple.png"
        canonicalUrl="https://www.newbi.fr/preferences-cookies"
      />
      
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
          Pour plus d'informations, consultez notre <Link to={ROUTES.PRIVACY_POLICY} className="text-[#5b50ff] hover:underline">politique de confidentialité</Link>.
        </p>
        
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
            >
              Tout refuser
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5b50ff] hover:bg-[#4a40e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
            >
              Tout accepter
            </button>
          </div>

          
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
                        ${preferences[category.id] ? 'right-0 border-[#5b50ff]' : 'left-0 border-gray-300'}
                      `}
                      checked={preferences[category.id]}
                      onChange={() => handleToggle(category.id)}
                      disabled={category.id === 'necessary'}
                    />
                    <label
                      htmlFor={`toggle-${category.id}`}
                      className={`
                        block overflow-hidden h-6 rounded-full cursor-pointer
                        ${preferences[category.id] ? 'bg-[#5b50ff]' : 'bg-gray-300'}
                        ${category.id === 'necessary' ? 'opacity-70 cursor-not-allowed' : ''}
                      `}
                    ></label>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{category.description}</p>
                
                {category.id === 'necessary' && (
                  <div className="bg-[#f5f4ff] text-[#5b50ff] text-sm px-4 py-2 rounded">
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
        
        <div className="flex justify-between items-center mt-8">
          <div className="space-x-4">
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
            >
              Tout refuser
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#4a41e0] hover:bg-[#3a32d0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
            >
              Tout accepter
            </button>
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#5b50ff] hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
          >
            Enregistrer mes préférences
          </button>
        </div>
      </div>
    </div>
  );
};
