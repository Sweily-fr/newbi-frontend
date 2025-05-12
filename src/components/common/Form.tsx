import React from 'react';
import { FormProps } from '../../types/ui';

/**
 * Composant Form réutilisable
 */
export const Form: React.FC<FormProps> = ({
  children,
  spacing = 'normal',
  className = '',
  ...props
}) => {
  const spacingClasses = {
    tight: 'space-y-4',
    normal: 'space-y-6',
    loose: 'space-y-8',
  };

  return (
    <form className={`${spacingClasses[spacing]} ${className} w-full`} {...props}>
      {children}
    </form>
  );
};

export default Form;
