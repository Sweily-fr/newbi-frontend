import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  icon, 
  actions 
}) => {
  return (
    <div className="border-b border-gray-200 pb-5 mb-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {icon && (
            <div className="mr-4 flex-shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex-shrink-0 flex">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
