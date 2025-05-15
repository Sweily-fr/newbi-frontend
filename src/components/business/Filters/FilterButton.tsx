import React from 'react';

interface FilterButtonProps {
  label: string;
  count?: number;
  isActive?: boolean;
  onClick: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ 
  label, 
  count, 
  isActive = false, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`${isActive ? 'bg-yellow-100' : 'bg-gray-100'} px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 hover:bg-yellow-50`}
    >
      {label}
      {count !== undefined && (
        <span className="text-xs text-gray-500 ml-1">{count}</span>
      )}
    </button>
  );
};
