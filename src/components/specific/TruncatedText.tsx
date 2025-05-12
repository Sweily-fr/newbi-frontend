import React, { useState, useRef, useEffect } from 'react';

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
}

/**
 * Composant qui tronque le texte s'il dépasse une longueur maximale
 * et affiche une infobulle (tooltip) au survol avec le texte complet
 */
export const TruncatedText: React.FC<TruncatedTextProps> = ({ 
  text, 
  maxLength = 15 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const positionTooltip = () => {
      if (textRef.current && tooltipRef.current && showTooltip) {
        const textRect = textRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        
        // Position horizontale centrée par rapport au texte
        const left = textRect.left + textRect.width / 2 - tooltipRect.width / 2;
        
        // Position verticale au-dessus du texte
        const top = textRect.top - tooltipRect.height - 5;
        
        // Ajuster si le tooltip sort de l'écran
        const adjustedLeft = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
        const adjustedTop = top < 10 ? textRect.bottom + 5 : top;
        
        tooltipRef.current.style.left = `${adjustedLeft}px`;
        tooltipRef.current.style.top = `${adjustedTop}px`;
      }
    };
    
    if (showTooltip) {
      positionTooltip();
      window.addEventListener('scroll', positionTooltip);
      window.addEventListener('resize', positionTooltip);
    }
    
    return () => {
      window.removeEventListener('scroll', positionTooltip);
      window.removeEventListener('resize', positionTooltip);
    };
  }, [showTooltip]);
  
  if (!text || text.length <= maxLength) {
    return <span>{text}</span>;
  }

  return (
    <div className="inline-block">
      <span 
        ref={textRef}
        className="truncate cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {text.substring(0, maxLength)}...
      </span>
      {showTooltip && (
        <div 
          ref={tooltipRef}
          className="fixed z-50 bg-gray-900 text-white text-sm rounded p-2 shadow-lg max-w-xs whitespace-normal"
        >
          {text}
        </div>
      )}
    </div>
  );
};
