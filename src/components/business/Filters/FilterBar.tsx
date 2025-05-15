import React, { useState } from 'react';
import { FilterButton } from './FilterButton';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterBarProps {
  options: FilterOption[];
  onFilterChange: (filterId: string) => void;
  defaultActiveFilter?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  options, 
  onFilterChange, 
  defaultActiveFilter = 'all' 
}) => {
  const [activeFilter, setActiveFilter] = useState<string>(defaultActiveFilter);

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    onFilterChange(filterId);
  };

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {options.map((option) => (
        <FilterButton
          key={option.id}
          label={option.label}
          count={option.count}
          isActive={activeFilter === option.id}
          onClick={() => handleFilterClick(option.id)}
        />
      ))}
    </div>
  );
};
