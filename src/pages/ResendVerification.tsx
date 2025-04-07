import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { CheckCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Form, TextField, Button } from '../components/ui';
import { Notification } from '../components/feedback/Notification';

// Définition de la mutation GraphQL
const RESEND_VERIFICATION_EMAIL = gql`
  mutation ResendVerificationEmail($email: String!) {
    resendVerificationEmail(email: $email)
  }
`;

type FormValues = {
  email: string;
};

const ResendVerification: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || '';
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
    defaultValues: {
      email: emailFromState
    }
  });
  
  // Mettre à jour l'email si il est fourni dans l'état de navigation
  useEffect(() => {
    if (emailFromState) {
      setValue('email', emailFromState);
    }
  }, [emailFromState, setValue]);

  const [resendVerificationEmail, { loading }] = useMutation(RESEND_VERIFICATION_EMAIL, {
    onCompleted: () => {
      setIsSubmitted(true);
      // Pas de notification visible pour éviter de confirmer l'existence de l'email
      // mais on peut logger pour des raisons de débogage
      console.log('Email de vérification envoyé');
    },
    onError: (error) => {
      console.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
      // On affiche quand même le message de succès pour des raisons de sécurité
      // (ne pas indiquer si l'email existe ou non)
      setIsSubmitted(true);
    }
  });

  const onSubmit = (data: FormValues) => {
    resendVerificationEmail({
      variables: { email: data.email }
    });
  };

  return (
    <div className="py-6 px-4 w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-700 mb-2">Renvoyer l'email de vérification</h1>
        <p className="text-gray-500 text-lg">Saisissez votre adresse email pour recevoir un nouveau lien de vérification</p>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {!isSubmitted ? (
            <Form onSubmit={handleSubmit(onSubmit)} spacing="normal">
              <TextField
                id="email"
                label="Adresse email"
                type="email"
                placeholder="votre@email.com"
                leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
                {...register('email', {
                  required: 'L\'adresse email est requise',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Adresse email invalide'
                  }
                })}
                error={errors.email}
              />

              <Button
                type="submit"
                disabled={loading}
                isLoading={loading}
                loaderPosition="left"
                fullWidth
                className="mt-4"
              >
                Envoyer l'email de vérification
              </Button>

              <div className="text-sm text-center mt-6">
                <Link to="/login" className="font-medium text-blue-500 hover:text-blue-400">
                  Retour à la page de connexion
                </Link>
              </div>
            </Form>
          ) : (
            <div className="flex flex-col items-center space-y-6 py-4">
              <CheckCircleIcon className="h-20 w-20 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-800">Email envoyé</h3>
              <p className="text-center text-gray-600 mb-4">
                Si votre adresse email existe dans notre système et n'est pas encore vérifiée, un nouvel email de vérification a été envoyé. Veuillez vérifier votre boîte de réception.
              </p>
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/login')}
              >
                Retour à la page de connexion
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;
