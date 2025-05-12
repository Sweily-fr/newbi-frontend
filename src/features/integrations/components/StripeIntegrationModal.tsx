import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Modal } from '../../../components/feedback/Modal';
import { TextField } from '../../../components/';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { CONNECT_STRIPE } from '../graphql';
import { Notification } from '../../../components/feedback/Notification';

interface StripeIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (apiKey: string) => void;
}

export const StripeIntegrationModal = ({ isOpen, onClose, onConnect }: StripeIntegrationModalProps) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Utilisation de la mutation GraphQL pour connecter Stripe
  const [connectStripe, { loading: isLoading }] = useMutation(CONNECT_STRIPE, {
    onCompleted: (data) => {
      if (data.connectStripe.success) {
        // Notification de succès gérée dans le composant parent
        onConnect(apiKey);
        onClose();
      } else {
        const errorMessage = data.connectStripe.message || 'Une erreur est survenue lors de la connexion à Stripe';
        setError(errorMessage);
        // Afficher une notification d'erreur
        Notification.error(errorMessage, {
          position: 'bottom-left',
          duration: 5000
        });
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la connexion à Stripe:', error);
      const errorMessage = 'Une erreur est survenue lors de la connexion à Stripe';
      setError(errorMessage);
      // Afficher une notification d'erreur
      Notification.error(errorMessage, {
        position: 'bottom-left',
        duration: 5000
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('La clé API est requise');
      return;
    }

    setError(null);
    
    // Exécution de la mutation GraphQL pour connecter Stripe
    connectStripe({
      variables: {
        apiKey: apiKey.trim()
      }
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Connecter Stripe"
      titleIcon={<CreditCardIcon className="h-6 w-6 text-indigo-600" />}
      size="md"
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Connectez votre compte Stripe pour synchroniser automatiquement vos paiements et factures.
          </p>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800 font-medium">Important</p>
            <p className="text-sm text-blue-700 mt-1">
              Veuillez entrer votre <span className="font-semibold">clé secrète</span> (Secret Key) Stripe, qui commence par <code className="bg-blue-100 px-1 py-0.5 rounded">sk_</code>. 
              La clé publique ne fonctionnera pas pour cette intégration.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            id="apiKey"
            name="apiKey"
            label="Clé secrète Stripe (Secret Key)"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk_test_... ou sk_live_..."
            disabled={isLoading}
            helpText="Vous pouvez trouver votre clé secrète dans le tableau de bord Stripe sous Développeurs > Clés API. Assurez-vous d'utiliser la clé qui commence par 'sk_'."
            className="w-full"
            error={error || undefined}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:ring-offset-2"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex justify-center rounded-lg border border-transparent bg-[#5b50ff] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#4a41cc] focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion en cours...' : 'Connecter'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
