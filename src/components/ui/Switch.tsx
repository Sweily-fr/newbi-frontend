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
        <span className="mr-3 text-sm font-medium text-gray-900">{leftLabel}</span>
      )}
      
      <div className="form-switch inline-block align-middle">
        <input 
          type="checkbox" 
          name={name} 
          id={id} 
          className="form-switch-checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
        />
        <label 
          className={`form-switch-label w-16 h-8 rounded-full cursor-pointer transition-colors duration-200 ease-in-out flex items-center px-1 ${
            disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200'
          }`} 
          htmlFor={id}
        >
          <span className="sr-only">Toggle switch</span>
          <span className={`form-switch-indicator block w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
            disabled ? 'opacity-75' : ''
          }`}></span>
        </label>
      </div>
      
      {rightLabel && (
        <span className="ml-3 text-sm font-medium text-gray-500">{rightLabel}</span>
      )}
    </div>
  );
};

export default Switch;
