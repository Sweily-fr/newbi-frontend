import React from 'react';
import { EmailSignatureManager } from '../features/email-signatures/components/EmailSignatureManager';
import { PageHeader } from '../components/layout/PageHeader';
import { SEOHead } from '../components/SEO/SEOHead';

const EmailSignaturesPage: React.FC = () => {
  // Le gestionnaire de signatures gère maintenant l'état et les actions

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

      <main className="mt-6" role="main" aria-label="Gestionnaire de signatures email">
        <EmailSignatureManager />
      </main>

      {/* Le formulaire est maintenant géré par le composant EmailSignatureManager */}
    </div>
  );
};

export default EmailSignaturesPage;
