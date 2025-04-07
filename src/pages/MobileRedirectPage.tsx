import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/constants';

const MobileRedirectPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md">
        {/* Logo de l'entreprise */}
        <div className="mb-6">
          <img 
            src="/logo.png" 
            alt="Logo Generation Business" 
            className="h-12 mx-auto" 
            onError={(e) => {
              // Fallback si l'image n'est pas trouvée
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.style.display = 'none';
            }}
          />
        </div>
        <div className="mb-8">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-20 h-20 mx-auto text-blue-500 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <div className="absolute top-0 right-1/3 -mr-1">
              <div className="animate-ping absolute h-3 w-3 rounded-full bg-blue-400 opacity-75"></div>
              <div className="relative rounded-full h-2.5 w-2.5 bg-blue-500"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Version mobile en développement</h1>
        </div>
        
        <p className="text-gray-600 mb-6">
          Notre plateforme est actuellement optimisée pour les ordinateurs de bureau. 
          Une application mobile est en cours de développement pour vous offrir une expérience optimale sur votre appareil.
        </p>
        
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Lancement prévu : Été 2026</span>
          </div>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-left">
          <p className="text-blue-700">
            <span className="font-semibold">Conseil :</span> Pour une meilleure expérience, veuillez accéder à notre plateforme depuis un ordinateur.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="font-semibold text-gray-800 mb-2">Fonctionnalités à venir</h2>
            <ul className="text-gray-600 text-left space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Interface adaptée aux écrans tactiles
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Gestion des factures et devis en déplacement
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Notifications en temps réel
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 space-y-4">
          <a 
            href="https://generation-business.fr" 
            className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Accéder au site sur ordinateur
          </a>
          
          <div className="text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Generation Business. Tous droits réservés.</p>
            <div className="mt-2 space-x-3">
              <Link to={ROUTES.LEGAL_NOTICE} className="text-gray-500 hover:text-blue-600">Mentions légales</Link>
              <Link to={ROUTES.PRIVACY_POLICY} className="text-gray-500 hover:text-blue-600">Confidentialité</Link>
              <Link to={ROUTES.CONTACT} className="text-gray-500 hover:text-blue-600">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileRedirectPage;
