
import { Modal } from '../../feedback/Modal';
import { Button } from '../../';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onManageSubscription: () => void;
}

export const CancelSubscriptionModal = ({ 
  isOpen, 
  onClose, 
  onManageSubscription 
}: CancelSubscriptionModalProps) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Abonnement actif"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Information :</strong> Vous disposez actuellement d'un abonnement premium actif. Vous devez d'abord résilier votre abonnement avant de pouvoir désactiver votre compte.
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Pour résilier votre abonnement, veuillez vous rendre sur la page de gestion de votre abonnement. Une fois l'abonnement résilié, vous pourrez désactiver votre compte.
        </p>

        <div className="flex justify-end space-x-3 mt-6">
          <Button 
            variant="secondary" 
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={onManageSubscription}
          >
            Gérer mon abonnement
          </Button>
        </div>
      </div>
    </Modal>
  );
};
