import React from 'react';
import { EmailSignatureManager } from '../components/business/EmailSignature/EmailSignatureManager';
import { PageHeader } from '../components/layout/PageHeader';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

const EmailSignaturesPage: React.FC = () => {
  // Le gestionnaire de signatures gère maintenant l'état et les actions

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Signatures Email"
        description="Créez et gérez vos signatures email professionnelles"
        icon={<EnvelopeIcon className="h-8 w-8 text-indigo-600" />}
      />

      <div className="mt-6">
        <EmailSignatureManager />
      </div>

      {/* Le formulaire est maintenant géré par le composant EmailSignatureManager */}
    </div>
  );
};

export default EmailSignaturesPage;
