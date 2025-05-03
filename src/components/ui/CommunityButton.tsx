import React, { useState } from 'react';
import { UserGroupIcon } from '@heroicons/react/24/solid';

interface CommunityButtonProps {
  className?: string;
}

export const CommunityButton: React.FC<CommunityButtonProps> = ({ className = '' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const handleClick = () => {
    window.open('https://chat.whatsapp.com/FGLms8EYhpv1o5rkrnIldL', '_blank');
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`group flex items-center justify-center w-14 h-14 rounded-full bg-[#5b50ff] hover:bg-[#4a41cc] shadow-lg transition-all duration-300 transform hover:scale-110 ${className}`}
        title="Rejoindre la communauté"
      >
        <UserGroupIcon className="h-7 w-7 text-white" />
        <span className="absolute w-full h-full rounded-full animate-ping bg-[#5b50ff] opacity-30"></span>
      </button>
      
      {/* Tooltip qui apparaît au survol */}
      <div 
        className={`absolute right-full bottom-0 mr-3 px-3 py-2 bg-gray-800 text-white text-sm font-medium rounded-md whitespace-nowrap shadow-lg transition-opacity duration-200 ${showTooltip ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-l-[6px] border-t-transparent border-b-transparent border-l-gray-800"></div>
        Rejoindre la communauté
      </div>
    </div>
  );
};
