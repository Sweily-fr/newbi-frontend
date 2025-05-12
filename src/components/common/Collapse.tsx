import React, { useState, ReactNode, useRef } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { 
  DocumentTextIcon, 
  UserIcon, 
  BuildingOfficeIcon, 
  ShoppingCartIcon, 
  CalculatorIcon, 
  DocumentIcon 
} from '@heroicons/react/24/outline';

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
  description?: string;
  icon?: 'document' | 'user' | 'company' | 'products' | 'calculator' | 'notes' | React.ReactNode;
}

export const Collapse: React.FC<CollapseProps> = ({
  title,
  children,
  defaultOpen = true,
  titleClassName = 'font-semibold text-grey-800',
  contentClassName = 'pt-4 px-4 bg-white rounded-b-lg',
  containerClassName = 'mb-6 rounded-lg overflow-hidden',
  headerClassName = 'flex justify-between items-center p-4 cursor-pointer',
  onToggle,
  hasError = false,
  description,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || hasError);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const contentRef = useRef<HTMLDivElement>(null);
  
  const getIcon = () => {
    if (!icon) return null;
    
    if (typeof icon !== 'string') {
      return icon;
    }
    
    const iconClasses = "h-5 w-5 text-[#5b50ff]";
    
    switch (icon) {
      case 'document':
        return <DocumentTextIcon className={iconClasses} />;
      case 'user':
        return <UserIcon className={iconClasses} />;
      case 'company':
        return <BuildingOfficeIcon className={iconClasses} />;
      case 'products':
        return <ShoppingCartIcon className={iconClasses} />;
      case 'calculator':
        return <CalculatorIcon className={iconClasses} />;
      case 'notes':
        return <DocumentIcon className={iconClasses} />;
      default:
        return null;
    }
  };
  
  return (
    <div 
      className={`${containerClassName} ${hasError 
        ? 'border border-[#5b50ff] shadow-md shadow-[#f0eeff]/30 transition-all duration-300' 
        : ''}`}
    >
      <div 
        className={`${headerClassName} ${isOpen 
          ? 'border border-gray-200 border-b-0 rounded-t-lg' 
          : 'border border-gray-200 rounded-lg'} ${hasError 
            ? 'bg-[#f0eeff] border-[#5b50ff]' 
            : ''}`}
        onClick={handleToggle}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            {hasError && (
              <ExclamationCircleIcon className="h-5 w-5 text-[#5b50ff] animate-pulse" aria-hidden="true" />
            )}
            <div className="flex items-center gap-2">
              {getIcon() && (
                <span className="flex-shrink-0">
                  {getIcon()}
                </span>
              )}
              <h3 className={`${titleClassName} ${isOpen ? 'text-xl' : 'text-lg'} ${hasError ? 'text-[#5b50ff]' : ''} transition-all duration-300 ease-in-out`}>{title}</h3>
            </div>
          </div>
          {description && !isOpen && (
            <p className="text-sm text-gray-500 mt-1 ml-7">{description}</p>
          )}
        </div>
        <button 
          type="button"
          className={`${hasError 
            ? 'text-[#5b50ff] hover:text-[#4a41e0]' 
            : 'text-gray-500 hover:text-gray-700'} focus:outline-none transition-transform duration-300`}
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
        className={`overflow-hidden border border-gray-200 pb-4 ${contentClassName} ${hasError 
          ? 'border-[#5b50ff] border-t-0 bg-white/95' 
          : ''}`}
        style={{
          display: isOpen ? 'block' : 'none',
          animation: isOpen ? 'collapseIn 0.3s ease-out' : 'none',
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes collapseIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}} />
        {children}
      </div>
    </div>
  );
};

export default Collapse;