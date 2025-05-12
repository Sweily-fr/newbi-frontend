import React, { useState, useEffect } from 'react';
import { CheckboxProps } from '../../types/ui';

/**
 * Composant Checkbox réutilisable
 * Compatible avec React Hook Form ou utilisable de manière standard
 * Design épuré avec la couleur principale de Newbi (#5b50ff)
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
  // État local pour suivre l'état de la checkbox
  const [isCheckedState, setIsCheckedState] = useState(checked || false);
  
  // Mettre à jour l'état local lorsque la prop checked change
  useEffect(() => {
    if (checked !== undefined) {
      setIsCheckedState(checked);
    }
  }, [checked]);
  
  // Déterminer les props à passer à l'input en fonction du mode d'utilisation
  const checkboxProps = register 
    ? { ...register(name) } // Mode React Hook Form
    : { // Mode standard
        name,
        checked: isCheckedState,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          setIsCheckedState(e.target.checked);
          if (onChange) onChange(e);
        }
      };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative inline-flex">
        <input
          id={id}
          type="checkbox"
          {...checkboxProps}
          {...rest}
          className="absolute opacity-0 w-0 h-0"
          disabled={disabled}
        />
        <label 
          htmlFor={id} 
          className={`flex items-center justify-center w-5 h-5 border rounded-md cursor-pointer transition-colors ${
            isCheckedState 
              ? 'bg-[#5b50ff] border-[#5b50ff]' 
              : disabled 
                ? 'bg-gray-100 border-gray-200 cursor-not-allowed' 
                : 'bg-white border-gray-300 hover:border-[#4a41e0]'
          }`}
        >
          {isCheckedState && (
            <svg className="w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
          {isCheckedState === false && variant === 'minus' && (
            <svg className="w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          )}
        </label>
      </div>
      <div className="ml-2 text-sm">
        <label htmlFor={id} className={`font-medium ${
          disabled ? 'text-gray-400' : 'text-gray-700'
        } text-sm`}>
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

export default Checkbox;
