import React, { useState, useEffect } from 'react';
import { RadioProps } from '../../types/ui';

/**
 * Composant Radio réutilisable
 * Compatible avec React Hook Form ou utilisable de manière standard
 */
export const Radio: React.FC<RadioProps> = ({
  id,
  name,
  label,
  value,
  register,
  error,
  disabled = false,
  className = '',
  helpText,
  checked,
  onChange,
  ...rest
}) => {
  // État local pour suivre l'état du radio
  const [isCheckedState, setIsCheckedState] = useState(checked || false);
  
  // Mettre à jour l'état local lorsque la prop checked change
  useEffect(() => {
    if (checked !== undefined) {
      setIsCheckedState(checked);
    }
  }, [checked]);
  
  // Déterminer les props à passer à l'input en fonction du mode d'utilisation
  const radioProps = register 
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
          type="radio"
          value={value}
          {...radioProps}
          {...rest}
          className="absolute opacity-0 w-0 h-0"
          disabled={disabled}
        />
        <label 
          htmlFor={id} 
          className={`flex items-center justify-center w-5 h-5 border border-gray-300 rounded-full cursor-pointer transition-colors ${
            isCheckedState 
              ? 'border-[#5b50ff]' 
              : disabled 
                ? 'bg-gray-100 border-gray-200 cursor-not-allowed' 
                : 'bg-white hover:border-[#4a41e0]'
          }`}
        >
          {isCheckedState && (
            <span className={`w-2.5 h-2.5 rounded-full ${
              disabled ? 'bg-gray-400' : 'bg-[#5b50ff]'
            }`}></span>
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

export default Radio;
