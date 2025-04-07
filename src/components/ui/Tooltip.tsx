import React, { useState, ReactNode, useRef, useEffect } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Calcule la position de l'infobulle en fonction de la position de l'élément déclencheur
  const updateTooltipPosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let top = 0;
    let left = 0;
    
    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        left = triggerRect.right + 8;
        break;
      case 'bottom':
        top = triggerRect.bottom + 8;
        left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        left = triggerRect.left - tooltipRect.width - 8;
        break;
    }
    
    // Assure que l'infobulle reste dans la fenêtre
    const padding = 10;
    if (left < padding) left = padding;
    if (top < padding) top = padding;
    if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding;
    }
    if (top + tooltipRect.height > window.innerHeight - padding) {
      top = window.innerHeight - tooltipRect.height - padding;
    }
    
    setTooltipPosition({ top, left });
  };
  
  // Met à jour la position lorsque l'infobulle devient visible
  useEffect(() => {
    if (isVisible) {
      // Petit délai pour s'assurer que l'infobulle est rendue avant de calculer sa position
      const timeoutId = setTimeout(() => {
        updateTooltipPosition();
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isVisible]);
  
  // Gère le redimensionnement de la fenêtre
  useEffect(() => {
    if (isVisible) {
      const handleResize = () => updateTooltipPosition();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize, true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize, true);
      };
    }
  }, [isVisible]);
  
  return (
    <div className="inline-block h-6 w-6">
      <div 
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex"
      >
        {children}
      </div>
      
      {isVisible && (
        <div 
          ref={tooltipRef}
          className="fixed z-50 px-3 py-2 text-xs text-white bg-gray-800 rounded-md shadow-md max-w-xs"
          role="tooltip"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            wordWrap: 'break-word'
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
