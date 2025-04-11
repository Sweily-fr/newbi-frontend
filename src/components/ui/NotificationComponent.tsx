import React from 'react';

interface NotificationComponentProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export const NotificationComponent: React.FC<NotificationComponentProps> = ({ 
  type, 
  message, 
  onClose 
}) => {
  return (
    <div 
      className={`fixed bottom-4 left-4 z-50 flex items-center p-4 mb-4 rounded-lg ${
        type === 'success' 
          ? 'text-green-800 bg-green-50 border-green-200' 
          : 'text-red-800 bg-red-50 border-red-200'
      } border`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 rounded-lg">
        {type === 'success' ? (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        )}
      </div>
      <div className="ml-3 text-sm font-medium">{message}</div>
      <button
        type="button"
        className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 ${
          type === 'success' 
            ? 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-400' 
            : 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-400'
        }`}
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Fermer</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );
};

export default NotificationComponent;
