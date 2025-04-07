import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui';
import { VERIFY_EMAIL } from '../graphql/auth';


const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  const [verifyEmail] = useMutation(VERIFY_EMAIL, {
    variables: { token },
    onCompleted: (data) => {
      setStatus(data.verifyEmail.success ? 'success' : 'error');
      setMessage(data.verifyEmail.message);
    },
    onError: (error) => {
      setStatus('error');
      setMessage(error.message);
    }
  });

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Token de vérification manquant.');
    }
  }, [token, verifyEmail]);

  return (
    <div className="py-6 px-4 w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-700 mb-2">Vérification de votre email</h1>
        <p className="text-gray-500 text-lg">Confirmez votre adresse email pour accéder à votre compte</p>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="flex flex-col items-center justify-center space-y-6">
            {status === 'loading' && (
              <div className="flex flex-col items-center space-y-4 py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-gray-700 text-lg">Vérification de votre adresse email en cours...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center space-y-6 py-4 w-full">
                <CheckCircleIcon className="h-20 w-20 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-800">Vérification réussie</h2>
                <p className="text-center text-gray-600 mb-2">{message}</p>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate('/auth')}
                  className="mt-4"
                >
                  Se connecter
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center space-y-6 py-4 w-full">
                <XCircleIcon className="h-20 w-20 text-red-500" />
                <h2 className="text-xl font-semibold text-gray-800">Échec de la vérification</h2>
                <p className="text-center text-gray-600 mb-2">{message}</p>
                <div className="flex flex-col space-y-3 w-full mt-4">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/auth')}
                  >
                    Retour à la page de connexion
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/resend-verification')}
                  >
                    Renvoyer l'email de vérification
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
