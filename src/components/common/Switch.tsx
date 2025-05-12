import React from 'react';

interface SwitchProps {
  id?: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Composant Switch réutilisable
 * Design épuré avec la couleur principale de Newbi (#5b50ff)
 */
export const Switch: React.FC<SwitchProps> = ({
  id = 'switch',
  name,
  checked,
  onChange,
  leftLabel,
  rightLabel,
  className = '',
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {leftLabel && (
        <span className={`mr-3 text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{leftLabel}</span>
      )}
      
      <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
        <input 
          type="checkbox" 
          name={name} 
          id={id} 
          className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer focus:outline-none transition-transform duration-200 ease-in-out"
          style={{
            transform: checked ? 'translateX(100%)' : 'translateX(0)',
            borderColor: checked ? '#5b50ff' : 'transparent',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            top: '0',
            left: '0',
          }}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
        />
        <label 
          className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${disabled ? 'cursor-not-allowed' : ''}`}
          style={{
            backgroundColor: checked 
              ? disabled ? '#c7c4ff' : '#5b50ff' 
              : disabled ? '#e5e7eb' : '#cbd5e1',
          }}
          htmlFor={id}
        >
          <span className="sr-only">Toggle switch</span>
        </label>
      </div>
      
      {rightLabel && (
        <span className={`ml-3 text-sm font-medium ${disabled ? 'text-gray-400' : checked ? 'text-gray-700' : 'text-gray-500'}`}>{rightLabel}</span>
      )}
    </div>
  );
};

export default Switch;
