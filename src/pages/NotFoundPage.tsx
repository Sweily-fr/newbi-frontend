import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/constants';
import { SEOHead } from '../components/SEO/SEOHead';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Page non trouvée | Newbi"
        description="La page que vous recherchez n'existe pas ou a été déplacée."
        canonicalUrl="/404"
        noindex={true}
      />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 bg-white">
        <div className="text-center max-w-md">
          {/* Illustration stylisée aux couleurs de Newbi */}
          <svg
            width="180"
            height="180"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto mb-8"
          >
            {/* Fond circulaire */}
            <circle cx="100" cy="100" r="90" fill="#f0eeff" />
            
            {/* Visage du smiley */}
            <circle cx="100" cy="100" r="70" fill="#5b50ff" />
            
            {/* Œil gauche avec croix */}
            <line x1="65" y1="75" x2="85" y2="95" stroke="#f0eeff" strokeWidth="6" strokeLinecap="round" />
            <line x1="85" y1="75" x2="65" y2="95" stroke="#f0eeff" strokeWidth="6" strokeLinecap="round" />
            
            {/* Œil droit avec croix */}
            <line x1="115" y1="75" x2="135" y2="95" stroke="#f0eeff" strokeWidth="6" strokeLinecap="round" />
            <line x1="135" y1="75" x2="115" y2="95" stroke="#f0eeff" strokeWidth="6" strokeLinecap="round" />
            
            {/* Bouche vers le bas */}
            <path
              d="M70 140 Q100 120 130 140"
              stroke="#f0eeff"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-[#5b50ff] mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page non trouvée</h2>
            <p className="text-gray-600">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </div>
          
          <Link
            to={ROUTES.HOME}
            className="inline-block px-6 py-3 font-medium text-white transition-colors rounded-lg bg-[#5b50ff] hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:ring-opacity-50"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
