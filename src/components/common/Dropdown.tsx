import React, { useState, useRef, useEffect } from 'react';
import { DropdownProps } from '../../types/ui';

/**
 * Composant Dropdown réutilisable
 * Redesigné pour correspondre au style moderne de Newbi
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
          className={`absolute ${positionClass} top-full mt-2 ${width} rounded-lg bg-white border border-gray-100 z-[9999] transform origin-top-${position} transition-all duration-200 ease-out ${className}`}
          style={{ boxShadow: '0 4px 20px rgba(91, 80, 255, 0.15)' }}
        >
          <div className="py-0">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors duration-150 
                  ${item.variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-[#f0eeff]'}
                  ${item.hasDivider ? 'border-t border-gray-100 mt-1 pt-3' : ''} 
                  ${item.className || ''}`}
                disabled={item.disabled}
                title={item.tooltip}
              >
                {item.icon && (
                  <span className="flex items-center justify-center w-5 h-5">
                    {item.icon}
                  </span>
                )}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;