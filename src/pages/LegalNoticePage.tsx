import React from 'react';
import { SEOHead } from '../components/SEO/SEOHead';

export const LegalNoticePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SEOHead
        title="Mentions Légales | Newbi"
        description="Mentions légales de Newbi - Informations légales sur notre société et notre site web."
        schemaType="Organization"
      />
      
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mentions Légales</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">1. Informations légales</h2>
          <p className="text-gray-600 mb-3">
            Le site Newbi est édité par la société Sweily, SAS au capital de 1 000 euros, 
            immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456 789.
          </p>
          <p className="text-gray-600 mb-3">
            <strong>Siège social :</strong> 123 Avenue des Entrepreneurs, 75001 Paris, France
          </p>
          <p className="text-gray-600 mb-3">
            <strong>Numéro de TVA intracommunautaire :</strong> FR 12 345 678 901
          </p>
          <p className="text-gray-600 mb-3">
            <strong>Directeur de la publication :</strong> Jean Dupont, Président
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">2. Hébergement</h2>
          <p className="text-gray-600 mb-3">
            Le site Newbi est hébergé par OVH SAS, société au capital de 10 174 560 €,
            RCS Lille Métropole 424 761 419 00045.
          </p>
          <p className="text-gray-600 mb-3">
            <strong>Siège social :</strong> 2 rue Kellermann, 59100 Roubaix, France
          </p>
          <p className="text-gray-600 mb-3">
            <strong>Téléphone :</strong> +33 9 72 10 10 07
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">3. Propriété intellectuelle</h2>
          <p className="text-gray-600 mb-3">
            L'ensemble des éléments constituant le site Newbi (textes, graphismes, logiciels, photographies, 
            images, vidéos, sons, plans, logos, marques, etc.) ainsi que le site lui-même, sont la propriété exclusive 
            de Newbi ou de ses partenaires. Ces éléments sont protégés par les lois relatives à la propriété 
            intellectuelle et notamment le droit d'auteur.
          </p>
          <p className="text-gray-600 mb-3">
            Toute reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce soit, de tout ou 
            partie des éléments du site sans l'accord écrit préalable de Newbi est strictement interdite 
            et constituerait un acte de contrefaçon sanctionné par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">4. Données personnelles</h2>
          <p className="text-gray-600 mb-3">
            Les informations concernant la collecte et le traitement des données personnelles sont détaillées 
            dans notre <a href="/politique-de-confidentialite" className="text-blue-600 hover:underline">Politique de Confidentialité</a>.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">5. Cookies</h2>
          <p className="text-gray-600 mb-3">
            Le site Newbi utilise des cookies pour améliorer l'expérience utilisateur. Pour plus d'informations 
            sur l'utilisation des cookies, veuillez consulter notre <a href="/politique-de-confidentialite" className="text-blue-600 hover:underline">Politique de Confidentialité</a>.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">6. Liens hypertextes</h2>
          <p className="text-gray-600 mb-3">
            Le site Newbi peut contenir des liens hypertextes vers d'autres sites internet. 
            Newbi n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">7. Droit applicable et juridiction compétente</h2>
          <p className="text-gray-600 mb-3">
            Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">8. Contact</h2>
          <p className="text-gray-600 mb-3">
            Pour toute question concernant les présentes mentions légales, vous pouvez nous contacter à l'adresse suivante : 
            <a href="mailto:contact@newbi.fr" className="text-blue-600 hover:underline ml-1">contact@newbi.fr</a>
          </p>
        </section>
      </div>
    </div>
  );
};
