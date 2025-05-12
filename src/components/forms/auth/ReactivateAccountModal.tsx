import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { REACTIVATE_ACCOUNT } from '../../../graphql/profile';
import { Modal } from '../../feedback/Modal';
import { Form, TextField, PasswordField, Button } from '../../';
import { Notification } from '../../feedback';

interface ReactivateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export const ReactivateAccountModal = ({ isOpen, onClose, email = '' }: ReactivateAccountModalProps) => {
  const [error, setError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      email: email,
      password: '',
    }
  });

  const [reactivateAccount, { loading }] = useMutation(REACTIVATE_ACCOUNT, {
    onCompleted: (data) => {
      if (data.reactivateAccount.success) {
        Notification.success(data.reactivateAccount.message, {
          duration: 5000,
          position: 'bottom-left'
        });
        reset();
        onClose();
      } else {
        setError(data.reactivateAccount.message);
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
      await reactivateAccount({
        variables: {
          email: data.email,
          password: data.password,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la réactivation du compte:', error);
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
      title="Réactiver mon compte"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Votre compte a été désactivé. Veuillez saisir votre email et votre mot de passe pour le réactiver.
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
          <TextField
            id="email"
            name="email"
            label="Email"
            type="email"
            register={register}
            validation={{
              required: 'L\'email est requis',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Adresse email invalide',
              },
            }}
            error={errors.email}
          />
          
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
                variant="primary"
                isLoading={loading}
              >
                {loading ? "Réactivation en cours..." : "Réactiver mon compte"}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
};
