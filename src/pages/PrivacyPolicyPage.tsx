import React from 'react';
import { Helmet } from 'react-helmet';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Helmet>
        <title>Politique de Confidentialité | Génération Business</title>
        <meta name="description" content="Politique de confidentialité de Génération Business - Comment nous collectons, utilisons et protégeons vos données personnelles." />
      </Helmet>
      
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Politique de Confidentialité</h1>
        <p className="text-gray-600 mb-6">
          Dernière mise à jour : 31 mars 2025
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-3">
            Génération Business s'engage à protéger votre vie privée et vos données personnelles. Cette politique de confidentialité 
            explique comment nous collectons, utilisons, partageons et protégeons vos informations lorsque vous utilisez notre site web 
            et nos services.
          </p>
          <p className="text-gray-600 mb-3">
            En utilisant notre site et nos services, vous consentez à la collecte et à l'utilisation de vos informations conformément 
            à cette politique de confidentialité.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">2. Informations que nous collectons</h2>
          <p className="text-gray-600 mb-3">
            Nous collectons les types d'informations suivants :
          </p>
          <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">2.1 Informations que vous nous fournissez</h3>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li className="mb-2">Informations de compte : nom, prénom, adresse email, mot de passe lors de la création d'un compte.</li>
            <li className="mb-2">Informations de profil : photo de profil, numéro de téléphone, adresse postale.</li>
            <li className="mb-2">Informations d'entreprise : nom de l'entreprise, numéro SIRET, numéro de TVA, logo, adresse.</li>
            <li className="mb-2">Informations de paiement : lors de la souscription à nos services premium, nous collectons les informations nécessaires au traitement du paiement via notre prestataire de paiement sécurisé.</li>
            <li className="mb-2">Contenu généré : factures, devis, et autres documents que vous créez en utilisant nos services.</li>
          </ul>
          
          <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">2.2 Informations collectées automatiquement</h3>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li className="mb-2">Données d'utilisation : pages visitées, temps passé sur le site, actions effectuées.</li>
            <li className="mb-2">Informations techniques : adresse IP, type de navigateur, appareil utilisé, système d'exploitation.</li>
            <li className="mb-2">Cookies et technologies similaires : nous utilisons des cookies pour améliorer votre expérience sur notre site.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">3. Comment nous utilisons vos informations</h2>
          <p className="text-gray-600 mb-3">
            Nous utilisons vos informations pour les finalités suivantes :
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li className="mb-2">Fournir, maintenir et améliorer nos services.</li>
            <li className="mb-2">Traiter vos paiements et gérer votre abonnement.</li>
            <li className="mb-2">Vous envoyer des informations techniques, des mises à jour et des messages de support.</li>
            <li className="mb-2">Vous envoyer des communications marketing (avec votre consentement).</li>
            <li className="mb-2">Détecter, prévenir et résoudre les problèmes techniques et de sécurité.</li>
            <li className="mb-2">Respecter nos obligations légales.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">4. Partage de vos informations</h2>
          <p className="text-gray-600 mb-3">
            Nous ne vendons pas vos données personnelles à des tiers. Nous pouvons partager vos informations dans les situations suivantes :
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li className="mb-2">Avec des prestataires de services qui nous aident à fournir nos services (hébergement, traitement des paiements, support client).</li>
            <li className="mb-2">Pour se conformer à la loi, à une procédure judiciaire ou à une demande gouvernementale.</li>
            <li className="mb-2">Pour protéger nos droits, notre propriété ou notre sécurité, ainsi que ceux de nos utilisateurs ou du public.</li>
            <li className="mb-2">Dans le cadre d'une fusion, acquisition ou vente d'actifs, auquel cas nous vous en informerons.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">5. Conservation des données</h2>
          <p className="text-gray-600 mb-3">
            Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales. 
            Si vous supprimez votre compte, nous supprimerons ou anonymiserons vos données personnelles, sauf si nous devons les conserver pour des raisons légales.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">6. Sécurité des données</h2>
          <p className="text-gray-600 mb-3">
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles contre la perte, 
            l'accès non autorisé, la divulgation, l'altération et la destruction.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">7. Vos droits</h2>
          <p className="text-gray-600 mb-3">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants concernant vos données personnelles :
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li className="mb-2">Droit d'accès : vous pouvez demander une copie de vos données personnelles.</li>
            <li className="mb-2">Droit de rectification : vous pouvez demander la correction de données inexactes.</li>
            <li className="mb-2">Droit à l'effacement : vous pouvez demander la suppression de vos données dans certaines circonstances.</li>
            <li className="mb-2">Droit à la limitation du traitement : vous pouvez demander de limiter l'utilisation de vos données.</li>
            <li className="mb-2">Droit à la portabilité des données : vous pouvez demander le transfert de vos données à un autre service.</li>
            <li className="mb-2">Droit d'opposition : vous pouvez vous opposer au traitement de vos données dans certaines circonstances.</li>
          </ul>
          <p className="text-gray-600 mb-3">
            Pour exercer ces droits, veuillez nous contacter à <a href="mailto:privacy@generation-business.fr" className="text-blue-600 hover:underline">privacy@generation-business.fr</a>.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">8. Cookies</h2>
          <p className="text-gray-600 mb-3">
            Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur notre site, analyser notre trafic et personnaliser notre contenu.
            Vous pouvez contrôler l'utilisation des cookies via les paramètres de votre navigateur.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">9. Modifications de notre politique de confidentialité</h2>
          <p className="text-gray-600 mb-3">
            Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement important 
            en publiant la nouvelle politique de confidentialité sur cette page et en vous envoyant un email si nécessaire.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">10. Contact</h2>
          <p className="text-gray-600 mb-3">
            Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à :
          </p>
          <p className="text-gray-600 mb-3">
            <a href="mailto:privacy@generation-business.fr" className="text-blue-600 hover:underline">privacy@generation-business.fr</a>
          </p>
          <p className="text-gray-600 mb-3">
            Génération Business<br />
            123 Avenue des Entrepreneurs<br />
            75001 Paris, France
          </p>
        </section>
      </div>
    </div>
  );
};
