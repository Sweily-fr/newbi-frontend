import { useState, useEffect } from 'react';
import { useMutation, ApolloError } from '@apollo/client';
import { useForm, SubmitHandler, FieldValues, FieldErrors } from 'react-hook-form';
import { REGISTER_MUTATION } from '../../../graphql/auth';
import { Form, TextField, Button, Checkbox } from '../../../components/ui';
import { PasswordField } from '../../../components/ui/PasswordField';
import { PasswordStrengthIndicator, PasswordRequirement } from '../../../components/ui/PasswordStrengthIndicator';
import { getEmailValidationRules } from '../../../constants/formValidations';
import { Link } from 'react-router-dom';

interface RegisterFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

// Interface pour les erreurs GraphQL par champ
interface GraphQLFieldErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string; // Pour les erreurs générales qui ne sont pas liées à un champ spécifique
}

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const { 
    register, 
    handleSubmit: hookFormSubmit, 
    watch, 
    formState: { errors }, 
    setError: setFormError
  } = useForm<RegisterFormInputs & { terms: boolean }>({    
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  });
  
  const [error, setError] = useState('');
  const [graphQLErrors, setGraphQLErrors] = useState<GraphQLFieldErrors>({});
  
  // Observer les valeurs du formulaire pour les validations en temps réel
  const password = watch('password');
  const termsAccepted = watch('terms');
  
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([
    { id: 'minLength', label: 'Au moins 8 caractères', isMet: false },
    { id: 'uppercase', label: 'Au moins 1 majuscule', isMet: false },
    { id: 'lowercase', label: 'Au moins 1 minuscule', isMet: false },
    { id: 'number', label: 'Au moins 1 chiffre', isMet: false },
    { id: 'special', label: 'Au moins 1 caractère spécial', isMet: false },
  ]);

  // Fonction pour analyser les erreurs GraphQL et les associer aux champs correspondants
  const parseGraphQLErrors = (error: ApolloError) => {
    const newErrors: GraphQLFieldErrors = {};
    const errorMessage = error.message.toLowerCase();
    
    // Réinitialiser les erreurs GraphQL et les erreurs du formulaire
    setGraphQLErrors({});
    
    console.log('Analyse des erreurs GraphQL:', error);
    
    // Analyser le message d'erreur pour déterminer à quel champ il est associé
    if (errorMessage.includes('email') && (errorMessage.includes('existe déjà') || errorMessage.includes('already exists'))) {
      const emailError = 'Cette adresse email est déjà utilisée';
      newErrors.email = emailError;
      setFormError('email', { type: 'manual', message: emailError });
      console.log('Erreur email détectée:', emailError);
    } else if (errorMessage.includes('mot de passe') || errorMessage.includes('password')) {
      const passwordError = 'Le mot de passe ne respecte pas les exigences de sécurité';
      newErrors.password = passwordError;
      setFormError('password', { type: 'manual', message: passwordError });
      console.log('Erreur mot de passe détectée:', passwordError);
    } else {
      // Erreur générale
      newErrors.general = error.message;
      console.log('Erreur générale détectée:', error.message);
    }
    
    // Mettre à jour l'état des erreurs GraphQL
    setGraphQLErrors(newErrors);
    console.log('GraphQL errors mis à jour:', newErrors);
    return newErrors;
  };
  
  const [registerUser, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      // Récupérer le message depuis la réponse de l'API
      const successMessage = data.register.message;
      
      // Utiliser la navigation programmatique pour rediriger vers la page de connexion avec le message
      window.location.href = `/auth?message=${encodeURIComponent(successMessage)}`;
    },
    onError: (error) => {
      // Analyser les erreurs GraphQL et les associer aux champs correspondants
      // sans afficher de notifications (elles seront gérées par l'errorLink d'Apollo)
      parseGraphQLErrors(error);
    },
  });

  // Mettre à jour les exigences du mot de passe en fonction de la valeur actuelle
  useEffect(() => {
    setPasswordRequirements([
      { id: 'minLength', label: 'Au moins 8 caractères', isMet: password.length >= 8 },
      { id: 'uppercase', label: 'Au moins 1 majuscule', isMet: /[A-Z]/.test(password) },
      { id: 'lowercase', label: 'Au moins 1 minuscule', isMet: /[a-z]/.test(password) },
      { id: 'number', label: 'Au moins 1 chiffre', isMet: /[0-9]/.test(password) },
      { id: 'special', label: 'Au moins 1 caractère spécial', isMet: /[_@$!%*?&#\-+.~\[\]{}()\\^\/]/.test(password) },
    ]);
  }, [password]);

  const onSubmit: SubmitHandler<RegisterFormInputs & { terms: boolean }> = async (data) => {
    // Réinitialiser toutes les erreurs
    setError('');
    setGraphQLErrors({});

    if (data.password !== data.confirmPassword) {
      const errorMsg = 'Les mots de passe ne correspondent pas';
      setFormError('confirmPassword', { type: 'manual', message: errorMsg });
      // Ne pas afficher de notification ici pour éviter les doublons
      return;
    }

    // Vérifier que toutes les exigences du mot de passe sont respectées
    const allRequirementsMet = passwordRequirements.every(req => req.isMet);
    if (!allRequirementsMet) {
      const errorMsg = `Le mot de passe ne respecte pas toutes les exigences de sécurité`;
      setFormError('password', { type: 'manual', message: errorMsg });
      // Ne pas afficher de notification ici pour éviter les doublons
      return;
    }
    
    // Vérifier que les conditions d'utilisation ont été acceptées
    if (!data.terms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    try {
      await registerUser({
        variables: {
          input: {
            email: data.email,
            password: data.password,
          },
        },
      });
    } catch (err) {
      // Error est déjà géré par onError
      console.error('Erreur lors de l\'inscription:', err);
    }
  };

  return (
    <div className="py-6 px-4 w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-700 mb-2">Inscription</h1>
        <p className="text-gray-500 text-lg">Créez votre compte pour commencer</p>
      </div>

    <Form onSubmit={hookFormSubmit(onSubmit)} spacing="normal" className="max-w-lg mx-auto">
            <TextField
              id="email"
              type="email"
              placeholder="ahmed@gmail.com"
              error={errors.email?.message || graphQLErrors.email}
              {...register('email', getEmailValidationRules())}
            />

            <PasswordField
              id="password"
              placeholder="••••••••"
              error={errors.password?.message || graphQLErrors.password}
              {...register('password', {
                required: 'Le mot de passe est requis',
                minLength: {
                  value: 8,
                  message: 'Le mot de passe doit contenir au moins 8 caractères'
                }
              })}
            />
            
            <PasswordStrengthIndicator 
              password={password} 
              requirements={passwordRequirements}
            />

            <PasswordField
              id="confirmPassword"
              placeholder="••••••••"
              error={errors.confirmPassword?.message || graphQLErrors.confirmPassword}
              {...register('confirmPassword', {
                required: 'Veuillez confirmer votre mot de passe',
                validate: (value) => value === watch('password') || 'Les mots de passe ne correspondent pas'
              })}
            />

            <div className="flex items-center mb-4 mt-2">
              <Checkbox
                id="terms"
                name="terms"
                variant="blue"
                label={<span>J'accepte les <a href="/conditions-generales-de-vente" className="text-blue-500">Conditions d'utilisation</a> et <a href="/politique-de-confidentialite" className="text-blue-500">Politique de confidentialité</a></span>}
                checked={termsAccepted}
                {...register('terms')}
              />
            </div>
            {!termsAccepted && error.includes('conditions d\'utilisation') && (
              <div className="text-red-500 text-sm mt-1 mb-2">
                Vous devez accepter les conditions d'utilisation
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              isLoading={loading}
              fullWidth
              className="bg-[#5b50ff] hover:bg-[#4a41d0] py-3 rounded-lg"
            >
              S'inscrire
            </Button>
            
            <div className="text-sm text-center mt-6">
              <span className="text-gray-600">Déja un compte ?</span>{' '}
              <button
                onClick={onSwitchToLogin}
                className="font-medium text-blue-500 hover:text-blue-400 border-none bg-transparent cursor-pointer p-0"
              >
                Se connecter
              </button>
            </div>
    </Form>
    </div>
  );
};
