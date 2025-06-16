import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_STRIPE_CONNECT_ACCOUNT, GENERATE_STRIPE_ONBOARDING_LINK } from '../graphql/stripe-connect-mutations';
import { Modal } from '../../../components/common/Modal';
import { logger } from '../../../utils/logger';
import { ArrowRight, InfoCircle } from 'iconsax-react';

interface StripeConnectOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountCreated: (accountId: string) => void;
}

const StripeConnectOnboarding: React.FC<StripeConnectOnboardingProps> = ({ 
  isOpen, 
  onClose,
  onAccountCreated 
}) => {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mutation pour créer un compte Stripe Connect
  const [createStripeConnectAccount, { loading: creatingAccount }] = useMutation(CREATE_STRIPE_CONNECT_ACCOUNT, {
    onCompleted: (data) => {
      if (data.createStripeConnectAccount.success) {
        setAccountId(data.createStripeConnectAccount.accountId);
        onAccountCreated(data.createStripeConnectAccount.accountId);
      } else {
        setError(data.createStripeConnectAccount.message || 'Une erreur est survenue lors de la création du compte Stripe Connect');
      }
      setIsCreatingAccount(false);
    },
    onError: (error) => {
      logger.error('Erreur lors de la création du compte Stripe Connect:', error);
      setError('Une erreur est survenue lors de la création du compte Stripe Connect');
      setIsCreatingAccount(false);
    }
  });

  // Mutation pour générer un lien d'onboarding Stripe
  const [generateOnboardingLink, { loading: generatingLink }] = useMutation(GENERATE_STRIPE_ONBOARDING_LINK, {
    onCompleted: (data) => {
      if (data.generateStripeOnboardingLink.success && data.generateStripeOnboardingLink.url) {
        // Rediriger l'utilisateur vers le lien d'onboarding Stripe
        window.location.href = data.generateStripeOnboardingLink.url;
      } else {
        setError(data.generateStripeOnboardingLink.message || 'Une erreur est survenue lors de la génération du lien d\'onboarding');
      }
    },
    onError: (error) => {
      logger.error('Erreur lors de la génération du lien d\'onboarding:', error);
      setError('Une erreur est survenue lors de la génération du lien d\'onboarding');
    }
  });

  const handleCreateAccount = async () => {
    setIsCreatingAccount(true);
    setError(null);
    
    await createStripeConnectAccount();
  };

  const handleStartOnboarding = async () => {
    if (!accountId) return;
    
    setError(null);
    
    await generateOnboardingLink({
      variables: {
        accountId,
        returnUrl: `${window.location.origin}/file-transfer`
      }
    });
  };

  const isLoading = creatingAccount || generatingLink || isCreatingAccount;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurer les paiements pour vos transferts"
      size="md"
    >
      <div className="space-y-6">
        <div className="bg-[#f0eeff] p-4 rounded-lg border border-[#e6e1ff]">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <InfoCircle size="20" color="#5b50ff" variant="Bulk" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                Pour recevoir des paiements lors du transfert de fichiers, vous devez configurer un compte Stripe Connect. 
                Ce processus est simple et ne prend que quelques minutes.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Comment ça fonctionne :</h3>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#5b50ff] text-white flex items-center justify-center text-xs font-medium mr-2">1</span>
              <span className="text-sm text-gray-600">Nous créons automatiquement un compte Stripe Connect pour vous</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#5b50ff] text-white flex items-center justify-center text-xs font-medium mr-2">2</span>
              <span className="text-sm text-gray-600">Vous complétez un formulaire d'inscription simplifié (coordonnées bancaires et informations légales)</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#5b50ff] text-white flex items-center justify-center text-xs font-medium mr-2">3</span>
              <span className="text-sm text-gray-600">Vous pouvez immédiatement demander des paiements pour vos transferts de fichiers</span>
            </li>
          </ol>
        </div>

        {error && (
          <div className="bg-red-50 p-3 rounded-md border border-red-100">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          {!accountId ? (
            <button
              type="button"
              onClick={handleCreateAccount}
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5b50ff] hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
            >
              {isLoading ? (
                'Création du compte en cours...'
              ) : (
                <>
                  Créer mon compte Stripe Connect
                  <ArrowRight size="16" className="ml-2" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartOnboarding}
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5b50ff] hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
            >
              {isLoading ? (
                'Génération du lien en cours...'
              ) : (
                <>
                  Configurer mon compte
                  <ArrowRight size="16" className="ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default StripeConnectOnboarding;
