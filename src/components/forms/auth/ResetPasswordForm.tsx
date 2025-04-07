import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { RESET_PASSWORD_MUTATION } from '../../../graphql/auth';
import { Form, TextField, Button } from '../../../components/ui';
import { PasswordField } from '../../../components/ui/PasswordField';
import { PasswordStrengthIndicator, PasswordRequirement } from '../../../components/ui/PasswordStrengthIndicator';
import { getEmailValidationRules } from '../../../constants/formValidations';

interface ResetPasswordFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

export const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit: hookFormSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormInputs>();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([
    { id: 'minLength', label: 'Au moins 8 caractères', isMet: false },
    { id: 'uppercase', label: 'Au moins 1 majuscule', isMet: false },
    { id: 'lowercase', label: 'Au moins 1 minuscule', isMet: false },
    { id: 'number', label: 'Au moins 1 chiffre', isMet: false },
    { id: 'special', label: 'Au moins 1 caractère spécial', isMet: false },
  ]);

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION, {
    onCompleted: (data) => {
      if (data.resetPassword.success) {
        navigate('/auth', { 
          state: { message: data.resetPassword.message } 
        });
      } else {
        setError(data.resetPassword.message);
      }
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  // Mettre à jour les exigences du mot de passe en fonction de la valeur actuelle
  useEffect(() => {
    setPasswordRequirements([
      { id: 'minLength', label: 'Au moins 8 caractères', isMet: formData.password.length >= 8 },
      { id: 'uppercase', label: 'Au moins 1 majuscule', isMet: /[A-Z]/.test(formData.password) },
      { id: 'lowercase', label: 'Au moins 1 minuscule', isMet: /[a-z]/.test(formData.password) },
      { id: 'number', label: 'Au moins 1 chiffre', isMet: /[0-9]/.test(formData.password) },
      { id: 'special', label: 'Au moins 1 caractère spécial', isMet: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
    ]);
  }, [formData.password]);
  
  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    setError('');

    if (!token) {
      setError('Token de réinitialisation invalide');
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Vérifier que toutes les exigences du mot de passe sont respectées
    const allRequirementsMet = passwordRequirements.every(req => req.isMet);
    if (!allRequirementsMet) {
      const missingRequirements = passwordRequirements
        .filter(req => !req.isMet)
        .map(req => req.label)
        .join(', ');
      setError(`Le mot de passe ne respecte pas toutes les exigences de sécurité: ${missingRequirements}`);
      return;
    }

    try {
      await resetPassword({
        variables: {
          input: {
            token,
            newPassword: data.password,
          }
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="py-6 px-4 w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-700 mb-2">Réinitialiser votre mot de passe</h1>
        <p className="text-gray-500 text-lg">Créez un nouveau mot de passe sécurisé</p>
      </div>
          
      <Form onSubmit={hookFormSubmit(onSubmit)} spacing="normal" className="max-w-lg mx-auto">
        <TextField
          id="email"
          type="email"
          placeholder="ahmed@gmail.com"
          error={errors.email?.message}
          {...register('email', {
            ...getEmailValidationRules(),
            onChange: (e) => setFormData({ ...formData, email: e.target.value })
          })}
        />

        <PasswordField
          id="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', {
            required: 'Le mot de passe est requis',
            minLength: {
              value: 8,
              message: 'Le mot de passe doit contenir au moins 8 caractères'
            },
            onChange: (e) => setFormData({ ...formData, password: e.target.value })
          })}
        />
            
        <PasswordStrengthIndicator 
          password={formData.password} 
          requirements={passwordRequirements}
        />

        <PasswordField
          id="confirmPassword"
          placeholder="Confirmer le mot de passe"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Veuillez confirmer votre mot de passe',
            validate: (value) => value === watch('password') || 'Les mots de passe ne correspondent pas',
            onChange: (e) => setFormData({ ...formData, confirmPassword: e.target.value })
          })}
        />

        <Button
          type="submit"
          disabled={loading}
          isLoading={loading}
          fullWidth
          className="bg-blue-500 hover:bg-blue-600 py-3 rounded-lg"
        >
          Réinitialiser le mot de passe
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
  );
};
