import React, { useState } from 'react';
import { TextFieldProps } from '../../types/ui';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

/**
 * Composant réutilisable pour les champs de mot de passe avec toggle de visibilité
 * Compatible avec React Hook Form ou utilisable de manière standard
 */
export const PasswordField: React.FC<TextFieldProps> = ({
  id,
  label,
  name,
  register,
  error,
  placeholder = '',
  required = false,
  className = '',
  helpText,
  disabled = false,
  validation = {},
  value,
  onChange,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Ajouter la validation required si nécessaire
  if (required && validation) {
    validation.required = `${label} est requis`;
  }

  // Déterminer les props à passer à l'input en fonction du mode d'utilisation
  const inputProps = register 
    ? { ...register(name, validation) } // Mode React Hook Form
    : { // Mode standard
        name,
        value,
        onChange,
        required
      };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative mt-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          {...inputProps}
          {...rest}
          className={`block w-full rounded-lg border bg-white py-3 pl-10 pr-10 text-base
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 focus:ring-1'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          placeholder={placeholder}
          disabled={disabled}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          ) : (
            <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          )}
        </button>
      </div>
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600 font-medium">
          {typeof error === 'string' ? error : error.message}
        </p>
      )}
    </div>
  );
};
