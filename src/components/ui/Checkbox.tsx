import React from 'react';
import { CheckboxProps } from '../../types/ui';

/**
 * Composant Checkbox réutilisable
 * Compatible avec React Hook Form ou utilisable de manière standard
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  label,
  register,
  error,
  disabled = false,
  className = '',
  helpText,
  checked,
  onChange,
  variant = 'default',
  ...rest
}) => {
  // Déterminer les props à passer à l'input en fonction du mode d'utilisation
  const checkboxProps = register 
    ? { ...register(name) } // Mode React Hook Form
    : { // Mode standard
        name,
        checked,
        onChange
      };

  // Styles spécifiques en fonction du variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'blue':
        return 'hidden peer';
      case 'minus':
        return 'hidden peer';
      default:
        return `h-4 w-4 rounded ${error ? 'border-red-300 text-red-600' : 'border-gray-300 text-blue-600'}`;
    }
  };

  // Générer le custom checkbox pour les variants spéciaux
  const renderCustomCheckbox = () => {
    if (variant === 'blue') {
      // Utiliser l'état local pour suivre l'état de la checkbox
      const [isCheckedState, setIsCheckedState] = React.useState(checked || false);
      
      // Mettre à jour l'état local lorsque la prop checked change
      React.useEffect(() => {
        setIsCheckedState(checked || false);
      }, [checked]);
      
      return (
        <div className="relative inline-flex">
          <input
            id={id}
            type="checkbox"
            {...checkboxProps}
            {...rest}
            className="absolute opacity-0 w-0 h-0"
            disabled={disabled}
            checked={isCheckedState}
            onChange={(e) => {
              setIsCheckedState(e.target.checked);
              if (onChange) onChange(e);
            }}
          />
          <label 
            htmlFor={id} 
            className={`flex items-center justify-center w-5 h-5 border rounded cursor-pointer transition-colors ${isCheckedState ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}`}
          >
            {isCheckedState && (
              <svg className="w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </label>
        </div>
      );
    } else if (variant === 'minus') {
      // Utiliser l'état local pour suivre l'état de la checkbox
      const [isCheckedState, setIsCheckedState] = React.useState(checked || false);
      
      // Mettre à jour l'état local lorsque la prop checked change
      React.useEffect(() => {
        setIsCheckedState(checked || false);
      }, [checked]);
      
      return (
        <div className="relative inline-flex">
          <input
            id={id}
            type="checkbox"
            {...checkboxProps}
            {...rest}
            className="absolute opacity-0 w-0 h-0"
            disabled={disabled}
            checked={isCheckedState}
            onChange={(e) => {
              setIsCheckedState(e.target.checked);
              if (onChange) onChange(e);
            }}
          />
          <label 
            htmlFor={id} 
            className={`flex items-center justify-center w-5 h-5 border rounded cursor-pointer transition-colors ${isCheckedState ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}`}
          >
            {isCheckedState && (
              <svg className="w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            )}
          </label>
        </div>
      );
    } else {
      return (
        <input
          id={id}
          type="checkbox"
          {...checkboxProps}
          {...rest}
          className={getVariantStyles()}
          disabled={disabled}
        />
      );
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {renderCustomCheckbox()}
      <div className="ml-2 text-sm">
        <label htmlFor={id} className="font-medium text-gray-700 text-sm">
          {label}
        </label>
        {helpText && !error && (
          <p className="text-gray-500 text-sm">{helpText}</p>
        )}
        {error && (
          <p className="text-red-600 text-sm font-medium">{error.message}</p>
        )}
      </div>
    </div>
  );
};
