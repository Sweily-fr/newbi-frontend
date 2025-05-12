import React from 'react';

interface CircularProgressBarProps {
  progress: number; // 0 à 100
  size?: number;
  strokeWidth?: number;
  circleColor?: string;
  progressColor?: string;
  textColor?: string;
  showText?: boolean;
}

/**
 * Composant de barre de progression circulaire
 * Affiche une progression en pourcentage dans un cercle
 */
export const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  progress,
  size = 64,
  strokeWidth = 4,
  circleColor = '#E3E2E5',
  progressColor = '#5b50ff',
  textColor = '#333',
  showText = true
}) => {
  // Limiter le progrès entre 0 et 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  // Calculer les propriétés du cercle
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;
  
  // Position du centre du cercle
  const center = size / 2;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Cercle de fond */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={circleColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Cercle de progression */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Texte au centre */}
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-baseline">
            <span className="text-[9px] font-semibold" style={{ color: textColor }}>
              {Math.round(normalizedProgress)}
            </span>
            <span className="text-[7px] ml-0.5" style={{ color: textColor }}>
              %
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
