import React from 'react';
import { SelectProps } from '../../types/ui';

/**
 * Composant Select réutilisable
 * Compatible avec React Hook Form ou utilisable de manière standard
 */
export const Select: React.FC<SelectProps> = ({
  id,
  name,
  label,
  options,
  register,
  error,
  required = false,
  disabled = false,
  placeholder = 'Sélectionner une option',
  className = '',
  selectClassName = '',
  helpText,
  value,
  onChange,
  ...rest
}) => {
  // Déterminer les props à passer au select en fonction du mode d'utilisation
  const selectProps = register 
    ? { ...register(name, { required: required ? `${label} est requis` : false }) } // Mode React Hook Form
    : { // Mode standard
        name,
        value,
        onChange,
        required
      };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          {...selectProps}
          {...rest}
          className={`w-full h-10 px-3 py-2 border text-base appearance-none placeholder:text-sm pr-10 ${
            error
              ? 'border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
              : 'border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent'
          } ${selectClassName}`}
          disabled={disabled}
        >
          {/* N'afficher l'option placeholder que si aucune valeur n'est sélectionnée */}
          {(!value || value === '') && (
            <option value="">{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-0 top-1/2 transform -translate-y-1/2 px-3">
          <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
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

export default Select;
