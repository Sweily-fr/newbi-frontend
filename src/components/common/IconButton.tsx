import React from 'react';
import styled from 'styled-components';

export type IconButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

export interface IconButtonProps {
  variant?: IconButtonVariant;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
}

const StyledButton = styled.button<{ 
  variant: IconButtonVariant;
  size: string;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  transition: all 0.2s;
  cursor: pointer;
  
  /* Taille */
  ${props => {
    switch (props.size) {
      case 'sm':
        return `
          width: 2rem;
          height: 2rem;
          font-size: 0.875rem;
        `;
      case 'lg':
        return `
          width: 3rem;
          height: 3rem;
          font-size: 1.125rem;
        `;
      default: // md
        return `
          width: 2.5rem;
          height: 2.5rem;
          font-size: 1rem;
        `;
    }
  }}
  
  /* Variantes */
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #5b50ff;
          color: white;
          border: none;
          
          &:hover {
            background-color: #4a41e0;
          }
          
          &:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(91, 80, 255, 0.3);
          }
          
          &:disabled {
            background-color: #c7c5f0;
            cursor: not-allowed;
          }
        `;
      case 'secondary':
        return `
          background-color: #f0eeff;
          color: #5b50ff;
          border: none;
          
          &:hover {
            background-color: #e6e1ff;
          }
          
          &:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(91, 80, 255, 0.2);
          }
          
          &:disabled {
            background-color: #f8f7ff;
            color: #c7c5f0;
            cursor: not-allowed;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: #5b50ff;
          border: 1px solid #5b50ff;
          
          &:hover {
            background-color: #f0eeff;
          }
          
          &:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(91, 80, 255, 0.2);
          }
          
          &:disabled {
            color: #c7c5f0;
            border-color: #c7c5f0;
            cursor: not-allowed;
          }
        `;
      case 'danger':
        return `
          background-color: #ef4444;
          color: white;
          border: none;
          
          &:hover {
            background-color: #dc2626;
          }
          
          &:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
          }
          
          &:disabled {
            background-color: #fca5a5;
            cursor: not-allowed;
          }
        `;
      default:
        return '';
    }
  }}
`;

export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'primary',
  onClick,
  children,
  className = '',
  disabled = false,
  size = 'md',
  type = 'button'
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      onClick={onClick}
      className={className}
      disabled={disabled}
      size={size}
    >
      {children}
    </StyledButton>
  );
};

export default IconButton;
