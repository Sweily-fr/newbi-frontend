import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { Notification } from '../../../components/feedback/Notification';
import { REQUEST_PASSWORD_RESET_MUTATION } from '../../../graphql/auth';
import { Form, TextField, Button } from '../../../components/ui';
import { EMAIL_PATTERN, EMAIL_ERROR_MESSAGE } from '../../../constants/formValidations';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const navigate = useNavigate();

  const [requestReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET_MUTATION, {
    onCompleted: (data) => {
      if (data.requestPasswordReset) {
        setSuccess(true);
        setError('');
        // Déclencher l'animation de succès
        setShowAnimation(true);
      } else {
        setError(data.requestPasswordReset.message);
      }
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      setEmailError('L\'email est requis');
      return false;
    } else if (!EMAIL_PATTERN.test(email)) {
      setEmailError(EMAIL_ERROR_MESSAGE);
      return false;
    }
    
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Valider l'email lors de la saisie, mais seulement si l'utilisateur a déjà essayé de soumettre
    // ou s'il y avait déjà une erreur affichée
    if (emailError) {
      validateEmail(newEmail);
    }
  };

  // Rediriger vers la page de connexion
  const handleBackToLogin = () => {
    navigate('/auth');
  };
  
  // Fonction pour renvoyer l'email avec notification
  const handleResendEmail = async () => {
    try {
      // Afficher la notification de chargement
      const loadingNotification = Notification.info('Envoi en cours...', {
        duration: Infinity, // Reste affiché jusqu'à ce qu'on le ferme manuellement
        position: 'bottom-left'
      });
      
      // Exécuter la requête
      const response = await requestReset({ variables: {input: { email }} });
      
      // Fermer la notification de chargement
      Notification.dismiss(loadingNotification.id);
      
      // Vérifier la réponse
      if (!response.data?.requestPasswordReset) {
        Notification.error('Échec de l\'envoi. Veuillez réessayer.', {
          position: 'bottom-left'
        });
        return;
      }
      
      // Afficher la notification de succès
      Notification.success('Email renvoyé avec succès !', {
        position: 'bottom-left'
      });
    } catch (error) {
      // Afficher la notification d'erreur
      Notification.error('Échec de l\'envoi. Veuillez réessayer.', {
        position: 'bottom-left'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Valider l'email avant de soumettre
    if (!validateEmail(email)) {
      return;
    }

    try {
      await requestReset({
        variables: { 
          input: { email },
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="py-6 px-4 w-full mx-auto">
      
      {success ? (
        <div className="max-w-lg mx-auto text-center">
          <div className={`transition-all duration-500 ease-in-out transform ${showAnimation ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            {/* Animation de succès */}
            <div className="mb-6 flex flex-col items-center">
              <div className="rounded-full bg-green-100 p-4 mb-4 relative overflow-hidden animate-bounce-in">
                {/* Animation d'un cercle qui se remplit */}
                <div className="absolute inset-0 bg-green-200 rounded-full scale-0 animate-ping opacity-30"></div>
                
                {/* Animation de la coche avec effet de dessin progressif */}
                <svg className="h-16 w-16 text-green-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="3" 
                    d="M5 13l4 4L19 7"
                    strokeDasharray="50"
                    strokeDashoffset="50"
                    className="animate-draw-check"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Email envoyé !</h2>
              <p className="text-gray-600 mb-6">
                Un email de réinitialisation a été envoyé à <span className="font-semibold">{email}</span>.
                <br />Veuillez vérifier votre boîte de réception et suivre les instructions.
              </p>
              
              {/* <div className="mt-4 animate-pulse mb-8">
                <svg className="h-10 w-10 text-blue-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div> */}
            </div>
            
            <Button
              onClick={handleBackToLogin}
              fullWidth
              className="bg-blue-500 hover:bg-blue-600 py-3 rounded-lg"
            >
              Retour à la connexion
            </Button>
            
            <button 
              onClick={handleResendEmail}
              className="mt-4 text-blue-500 hover:text-blue-700 hover:underline text-sm font-medium transition-colors duration-200"
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Vous n\'avez pas reçu l\'email ? Cliquez ici pour renvoyer'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-700 mb-2">Mot de passe oublié</h1>
        <p className="text-gray-500 text-lg">Entrez votre email pour réinitialiser votre mot de passe</p>
      </div>
        <Form onSubmit={handleSubmit} spacing="normal" className="max-w-lg mx-auto">

          <TextField
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="ahmed@gmail.com"
            value={email}
            onChange={handleEmailChange}
            error={emailError ? { message: emailError } : undefined}
          />

          <Button
            type="submit"
            disabled={loading}
            isLoading={loading}
            loaderPosition="left"
            fullWidth
            className="bg-[#5b50ff] hover:bg-[#4a41d0] py-3 rounded-lg"
          >
            Envoyer le lien de réinitialisation
          </Button>
          
          <div className="text-sm text-center mt-6">
            <span className="text-gray-600">Vous vous souvenez de votre mot de passe?</span>{' '}
            <Link
              to="/auth"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Connexion
            </Link>
          </div>
        </Form>
        </div>
      )}
    </div>
  );
};
