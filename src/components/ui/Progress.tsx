import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className = '',
  indicatorClassName = 'bg-[#5b50ff]',
}) => {
  const percentage = Math.min(Math.max(value, 0), max);
  
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
      <div 
        className={`h-full rounded-full transition-all duration-300 ${indicatorClassName}`}
        style={{ width: `${(percentage / max) * 100}%` }}
      />
    </div>
  );
};

export default Progress;
