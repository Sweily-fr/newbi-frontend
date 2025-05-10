import React from 'react';
// Import du nouveau composant avec la disposition sur deux colonnes
import { EmailSignatureFormLayout } from '../features/email-signatures/components/EmailSignatureFormLayout';
//import { EmailSignatureFormLayout } from '../features/email-signatures/components/EmailSignatureFormLayout/EmailSignatureFormLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { SEOHead } from '../components/SEO/SEOHead';

const EmailSignaturesPage: React.FC = () => {

  return (
    <div className="container mx-auto px-4 py-8">
      <SEOHead 
        title="Créateur de Signatures Email Professionnelles | Newbi"
        description="Créez des signatures email professionnelles et personnalisées pour votre entreprise. Outil facile à utiliser et hautement personnalisable."
        keywords="signatures email, signature professionnelle, créateur de signature, email marketing, branding, signature d'entreprise"
        schemaType="WebApplication"
        schemaName="Créateur de Signatures Email Professionnelles"
        schemaPrice="14.99"
        ogImage="https://newbi.fr/images/PNG/Logo_Texte_Purple.png"
        canonicalUrl="https://newbi.fr/signatures-email"
        isPremium={true}
        additionalSchemaData={{
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'Web'
        }}
      />
      <PageHeader
        title="Signatures Email"
        description="Créez et gérez vos signatures email professionnelles"
      />

      {/* Composant original commenté 
      <main className="mt-6" role="main" aria-label="Gestionnaire de signatures email">
        <EmailSignatureManager />
      </main>
      */}
      
      {/* Nouvelle disposition sur deux colonnes */}
      <main className="mt-6" role="main" aria-label="Éditeur de signatures email">
        <div className="container mx-auto">
          <EmailSignatureFormLayout
            defaultNewbiLogoUrl="/images/logo_newbi/SVG/Logo_Texte_Purple.svg"
          />
        </div>
      </main>

      {/* Le formulaire est maintenant géré par le composant EmailSignatureManager */}
    </div>
  );
};

export default EmailSignaturesPage;
