import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { DISABLE_ACCOUNT } from '../graphql';
import { Modal } from '../../../components/';
import { Form, PasswordField, Button } from '../../../components/';
import { Notification } from '../../../components/';

interface DisableAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisableAccountModal = ({ isOpen, onClose }: DisableAccountModalProps) => {
  const [error, setError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      password: '',
    }
  });

  const [disableAccount, { loading }] = useMutation(DISABLE_ACCOUNT, {
    onCompleted: (data) => {
      if (data.disableAccount.success) {
        Notification.success(data.disableAccount.message, {
          duration: 5000,
          position: 'bottom-left'
        });
        reset();
        onClose();
        // Rediriger vers la page de connexion après désactivation
        setTimeout(() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(data.disableAccount.message);
      }
    },
    onError: (error) => {
      setError(error.message);
      Notification.error(`Erreur: ${error.message}`, {
        duration: 8000,
        position: 'bottom-left'
      });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    try {
      await disableAccount({
        variables: {
          password: data.password,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la désactivation du compte:', error);
    }
  });

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title="Désactiver mon compte"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Attention :</strong> La désactivation de votre compte rendra celui-ci inaccessible. Vous pourrez le réactiver ultérieurement en tentant de vous connecter avec vos identifiants habituels.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <Form onSubmit={onSubmit}>
          <p className="text-sm text-gray-600 mb-4">
            Pour confirmer la désactivation de votre compte, veuillez saisir votre mot de passe actuel.
          </p>
          
          <PasswordField
            id="password"
            name="password"
            label="Mot de passe"
            register={register}
            validation={{
              required: 'Le mot de passe est requis',
            }}
            error={errors.password}
          />
          
          <div className="mt-6">
            <div className="flex space-x-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="danger"
                isLoading={loading}
              >
                {loading ? "Désactivation en cours..." : "Désactiver mon compte"}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
};
