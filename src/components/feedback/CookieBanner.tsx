import React, { useState } from 'react';
import { useCookieConsent } from '../../hooks/useCookieConsent';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/constants';

export const CookieBanner: React.FC = () => {
  const { showBanner, acceptAllCookies, rejectAllCookies, setShowBanner } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9000] bg-white shadow-lg border-t border-gray-200">
      <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex-1 mb-4 md:mb-0 md:mr-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nous respectons votre vie privée</h3>
            <p className="text-sm text-gray-600">
              Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu.
              {!showDetails && (
                <>
                  {' '}
                  <button
                    onClick={() => setShowDetails(true)}
                    className="text-blue-600 hover:underline focus:outline-none"
                  >
                    En savoir plus
                  </button>
                </>
              )}
            </p>
            
            {showDetails && (
              <div className="mt-3 text-sm text-gray-600">
                <p className="mb-2">
                  Les cookies nécessaires sont toujours activés car ils sont essentiels au fonctionnement du site.
                  Les cookies fonctionnels nous aident à mémoriser vos préférences.
                  Les cookies analytiques nous permettent de comprendre comment vous utilisez notre site.
                  Les cookies marketing nous aident à vous proposer des offres pertinentes.
                </p>
                <p>
                  Pour plus d'informations, consultez notre{' '}
                  <Link to={ROUTES.PRIVACY_POLICY} className="text-blue-600 hover:underline">
                    politique de confidentialité
                  </Link>{' '}
                  ou gérez vos{' '}
                  <Link to={ROUTES.COOKIE_PREFERENCES} className="text-blue-600 hover:underline">
                    préférences de cookies
                  </Link>
                  .
                </p>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-blue-600 hover:underline focus:outline-none mt-2"
                >
                  Réduire
                </button>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={rejectAllCookies}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Refuser
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Uniquement nécessaires
            </button>
            <Link
              to={ROUTES.COOKIE_PREFERENCES}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
            >
              Personnaliser
            </Link>
            <button
              onClick={acceptAllCookies}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Tout accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
