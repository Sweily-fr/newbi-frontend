import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg overflow-hidden ${className}`} style={{ boxShadow: '0 4px 20px rgba(91, 80, 255, 0.15)' }}>
      {children}
    </div>
  );
};
