import React from 'react';
import { TextFieldProps } from '../../types/ui';

/**
 * Composant réutilisable pour les champs de texte dans les formulaires
 * Compatible avec React Hook Form ou utilisable de manière standard
 */
export const TextField: React.FC<TextFieldProps> = ({
  id,
  label,
  name,
  register,
  error,
  type = 'text',
  placeholder = '',
  required = false,
  className = '',
  inputClassName = '',
  helpText,
  disabled = false,
  validation = {},
  value,
  onChange,
  ...rest
}) => {
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

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {type === 'email' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">@</span>
          </div>
        )}
        <input
          id={id}
          type={type}
          {...inputProps}
          {...rest}
          className={`block w-full rounded-lg border bg-white py-3 px-4 text-base ${type === 'email' ? 'pl-8' : ''} ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-[#5b50ff] focus:ring-[#5b50ff] focus:ring-opacity-50 focus:ring-2 active:border-[#5b50ff] transition-all duration-300 ease-in-out'
          } ${inputClassName}`}
          placeholder={placeholder}
          disabled={disabled}
        />
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
