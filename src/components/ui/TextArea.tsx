import React from 'react';
import { TextAreaProps } from '../../types/ui';

/**
 * Composant TextArea réutilisable
 * Compatible avec React Hook Form ou utilisable de manière standard
 */
export const TextArea: React.FC<TextAreaProps> = ({
  id,
  name,
  label,
  register,
  error,
  required = false,
  disabled = false,
  placeholder = '',
  className = '',
  helpText,
  rows = 4,
  validation = {},
  value,
  onChange,
  ...rest
}) => {
  // Ajouter la validation required si nécessaire
  if (required && validation) {
    validation.required = `${label} est requis`;
  }

  // Déterminer les props à passer au textarea en fonction du mode d'utilisation
  const textareaProps = register 
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
      <textarea
        id={id}
        rows={rows}
        {...textareaProps}
        {...rest}
        className={`block w-full rounded-lg border bg-white py-3 px-4 text-base ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-[#5b50ff] focus:ring-[#5b50ff] focus:ring-opacity-50 focus:ring-2 active:border-[#5b50ff] transition-all duration-300 ease-in-out'
        }`}
        placeholder={placeholder}
        disabled={disabled}
      />
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
