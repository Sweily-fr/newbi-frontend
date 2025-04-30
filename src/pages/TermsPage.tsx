import React from 'react';
import { SEOHead } from '../components/SEO/SEOHead';

export const TermsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SEOHead
        title="Conditions Générales de Vente | Newbi"
        description="Conditions générales de vente de Newbi - Modalités d'utilisation de nos services et de souscription à nos offres."
        schemaType="Organization"
      />
      
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Conditions Générales de Vente</h1>
        <p className="text-gray-600 mb-6">
          Dernière mise à jour : 31 mars 2025
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">1. Préambule</h2>
          <p className="text-gray-600 mb-3">
            Les présentes conditions générales de vente (ci-après les "CGV") régissent les relations contractuelles entre :
          </p>
          <p className="text-gray-600 mb-3">
            <strong>Génération Business</strong>, SAS au capital de 1 000 euros, immatriculée au Registre du Commerce et des Sociétés de Paris 
            sous le numéro 123 456 789, dont le siège social est situé 123 Avenue des Entrepreneurs, 75001 Paris, France, 
            représentée par son Président en exercice (ci-après "Génération Business"),
          </p>
          <p className="text-gray-600 mb-3">
            Et toute personne physique ou morale souhaitant bénéficier des services proposés par Génération Business (ci-après "le Client").
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">2. Objet</h2>
          <p className="text-gray-600 mb-3">
            Les présentes CGV ont pour objet de définir les modalités et conditions dans lesquelles Génération Business met à disposition 
            du Client ses services de gestion d'entreprise en ligne, comprenant notamment la création de factures, devis, signatures email 
            et autres outils de gestion (ci-après "les Services").
          </p>
          <p className="text-gray-600 mb-3">
            Toute utilisation des Services implique l'acceptation pleine et entière des présentes CGV par le Client. 
            Les CGV prévalent sur tout autre document du Client.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">3. Description des services</h2>
          <p className="text-gray-600 mb-3">
            Génération Business propose une plateforme en ligne permettant aux entrepreneurs et aux entreprises de gérer leur activité 
            à travers différents outils, notamment :
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li className="mb-2">Création et gestion de factures</li>
            <li className="mb-2">Création et gestion de devis</li>
            <li className="mb-2">Création de signatures email professionnelles</li>
            <li className="mb-2">Autres outils de gestion d'entreprise</li>
          </ul>
          <p className="text-gray-600 mb-3">
            Les Services sont accessibles en ligne, 24 heures sur 24 et 7 jours sur 7, sauf en cas de maintenance programmée ou d'incident.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">4. Modalités d'accès aux services</h2>
          <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">4.1 Inscription</h3>
          <p className="text-gray-600 mb-3">
            Pour accéder aux Services, le Client doit créer un compte en fournissant les informations requises dans le formulaire d'inscription. 
            Le Client s'engage à fournir des informations exactes, complètes et à jour.
          </p>
          
          <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">4.2 Formules d'abonnement</h3>
          <p className="text-gray-600 mb-3">
            Génération Business propose différentes formules d'abonnement :
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li className="mb-2">
              <strong>Formule Gratuite :</strong> Accès limité à certaines fonctionnalités de base.
            </li>
            <li className="mb-2">
              <strong>Formule Premium :</strong> Accès complet à l'ensemble des fonctionnalités, au tarif de 14,99€ HT par mois ou 143,90€ HT par an (soit 11,99€ HT par mois avec 20% de réduction).
            </li>
          </ul>
          <p className="text-gray-600 mb-3">
            Les détails des fonctionnalités incluses dans chaque formule sont disponibles sur le site.
          </p>
          
          <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">4.3 Période d'essai</h3>
          <p className="text-gray-600 mb-3">
            Une période d'essai gratuite d'un mois est proposée pour la formule Premium. À l'issue de cette période, 
            l'abonnement sera automatiquement converti en abonnement payant, sauf résiliation par le Client avant la fin de la période d'essai.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">5. Tarifs et modalités de paiement</h2>
          <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">5.1 Tarifs</h3>
          <p className="text-gray-600 mb-3">
            Les tarifs des Services sont indiqués en euros hors taxes sur le site. Génération Business se réserve le droit de modifier 
            ses tarifs à tout moment. Les nouveaux tarifs entreront en vigueur pour tout nouvel abonnement ou renouvellement d'abonnement.
          </p>
          
          <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">5.2 Modalités de paiement</h3>
          <p className="text-gray-600 mb-3">
            Le paiement s'effectue par carte bancaire ou prélèvement SEPA, selon la périodicité choisie (mensuelle ou annuelle). 
            Les paiements sont sécurisés et gérés par notre prestataire de paiement.
          </p>
          
          <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">5.3 Facturation</h3>
          <p className="text-gray-600 mb-3">
            Une facture est automatiquement générée et mise à disposition du Client dans son espace personnel après chaque paiement.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">6. Durée et résiliation</h2>
          <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">6.1 Durée</h3>
          <p className="text-gray-600 mb-3">
            L'abonnement est conclu pour une durée indéterminée, avec une période minimale d'engagement correspondant à la périodicité 
            choisie (mensuelle ou annuelle).
          </p>
          
          <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">6.2 Résiliation par le Client</h3>
          <p className="text-gray-600 mb-3">
            Le Client peut résilier son abonnement à tout moment depuis son espace personnel ou en contactant le service client. 
            La résiliation prendra effet à la fin de la période d'abonnement en cours, sans remboursement prorata temporis.
          </p>
          
          <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">6.3 Résiliation par Génération Business</h3>
          <p className="text-gray-600 mb-3">
            Génération Business se réserve le droit de résilier l'abonnement du Client en cas de non-respect des présentes CGV, 
            notamment en cas de non-paiement. Dans ce cas, la résiliation sera effective immédiatement et sans préavis.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">7. Propriété intellectuelle</h2>
          <p className="text-gray-600 mb-3">
            Tous les éléments des Services (textes, logos, images, éléments graphiques, etc.) sont la propriété exclusive de Génération Business 
            ou de ses partenaires et sont protégés par les lois relatives à la propriété intellectuelle.
          </p>
          <p className="text-gray-600 mb-3">
            Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments des Services, 
            quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Génération Business.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">8. Responsabilité</h2>
          <p className="text-gray-600 mb-3">
            Génération Business s'engage à mettre en œuvre tous les moyens nécessaires pour assurer un accès continu et de qualité aux Services. 
            Toutefois, Génération Business ne peut être tenue responsable des difficultés ou impossibilités momentanées d'accès aux Services 
            qui auraient pour origine des circonstances extérieures, la force majeure, ou encore qui seraient dues à des perturbations du réseau Internet.
          </p>
          <p className="text-gray-600 mb-3">
            Le Client est seul responsable des données qu'il saisit dans les Services et des documents qu'il génère. 
            Génération Business ne saurait être tenue responsable de l'inexactitude des informations fournies par le Client 
            ou des conséquences qui en découleraient.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">9. Protection des données personnelles</h2>
          <p className="text-gray-600 mb-3">
            Génération Business s'engage à respecter la confidentialité des données personnelles communiquées par le Client 
            et à les traiter conformément à la législation en vigueur. Pour plus d'informations, veuillez consulter notre 
            <a href="/politique-de-confidentialite" className="text-blue-600 hover:underline ml-1">Politique de Confidentialité</a>.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">10. Service client</h2>
          <p className="text-gray-600 mb-3">
            Pour toute question ou réclamation concernant les Services, le Client peut contacter le service client de Génération Business :
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li className="mb-2">Par email : <a href="mailto:support@generation-business.fr" className="text-blue-600 hover:underline">support@generation-business.fr</a></li>
            <li className="mb-2">Par téléphone : +33 1 23 45 67 89 (du lundi au vendredi, de 9h à 18h)</li>
            <li className="mb-2">Par courrier : Génération Business - Service Client, 123 Avenue des Entrepreneurs, 75001 Paris, France</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">11. Droit applicable et juridiction compétente</h2>
          <p className="text-gray-600 mb-3">
            Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">12. Modification des CGV</h2>
          <p className="text-gray-600 mb-3">
            Génération Business se réserve le droit de modifier les présentes CGV à tout moment. Les nouvelles CGV seront applicables 
            dès leur publication sur le site. Le Client sera informé des modifications par email ou via son espace personnel.
          </p>
        </section>
      </div>
    </div>
  );
};
