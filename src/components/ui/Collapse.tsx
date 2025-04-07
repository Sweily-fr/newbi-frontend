import React, { useState, ReactNode, useRef } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface CollapseProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  titleClassName?: string;
  contentClassName?: string;
  containerClassName?: string;
  headerClassName?: string;
  onToggle?: (isOpen: boolean) => void;
  hasError?: boolean;
}

const Collapse: React.FC<CollapseProps> = ({
  title,
  children,
  defaultOpen = true,
  titleClassName = 'text-2xl font-semibold text-grey-800',
  contentClassName = 'pt-4 px-4 bg-white rounded-b-lg',
  containerClassName = 'mb-6 rounded-lg overflow-hidden',
  headerClassName = 'flex justify-between items-center p-4 cursor-pointer',
  onToggle,
  hasError = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const contentRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className={`${containerClassName} ${hasError ? 'border-2 border-red-500' : ''}`}>
      <div 
        className={`${headerClassName} ${isOpen ? 'border border-gray-200 border-b-0 rounded-t-lg' : 'border border-gray-200 rounded-lg'}`}
        onClick={handleToggle}
      >
        <h3 className={titleClassName}>{title}</h3>
        <button 
          type="button"
          className="text-gray-500 hover:text-gray-700 focus:outline-none transition-transform duration-300"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Réduire la section' : 'Développer la section'}
        >
          {isOpen ? (
            <ChevronUpIcon className="h-6 w-6 transform transition-transform duration-300" />
          ) : (
            <ChevronDownIcon className="h-6 w-6 transform transition-transform duration-300" />
          )}
        </button>
      </div>
      <div 
        ref={contentRef}
        className={`overflow-hidden border border-gray-200 pb-4 ${contentClassName}`}
        style={{
          display: isOpen ? 'block' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Collapse;
