import { useContext } from 'react';
import { EmailSignatureContext } from './EmailSignatureContext';

// Hook personnalisé pour utiliser le contexte
export const useEmailSignature = () => {
  const context = useContext(EmailSignatureContext);
  if (context === undefined) {
    throw new Error('useEmailSignature doit être utilisé à l\'intérieur d\'un EmailSignatureProvider');
  }
  return context;
};
