import React, { useState, useRef, useEffect } from 'react';
import { DropdownProps } from '../../types/ui';

/**
 * Composant Dropdown réutilisable
 */
export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  position = 'right',
  width = 'w-48',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const positionClass = position === 'left' ? 'left-0' : 'right-0';

  return (
    <div className="relative">
      <div ref={triggerRef} onClick={toggleDropdown}>
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          ref={dropdownRef}
          className={`absolute ${positionClass} top-full mt-2 ${width} rounded-md shadow-lg bg-white border border-gray-200 z-[9999] transform origin-top-${position} transition-all duration-200 ease-out ${className}`}
        >
          <div className="py-1 max-h-60 overflow-y-auto">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-blue-50 ${item.hasDivider ? 'border-t border-gray-100' : ''} ${item.className || ''}`}
              >
                <div className="flex items-center">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
