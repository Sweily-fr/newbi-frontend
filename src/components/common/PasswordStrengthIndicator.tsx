import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export interface PasswordRequirement {
  id: string;
  label: string;
  isMet: boolean;
}

export interface PasswordStrengthIndicatorProps {
  password: string;
  requirements?: PasswordRequirement[];
  className?: string;
}

/**
 * Composant pour afficher les indicateurs de force du mot de passe
 */
export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  requirements = [],
  className = '',
}) => {
  // Calculer le niveau de force du mot de passe (0-5)
  const getStrengthLevel = (): number => {
    if (!password) return 0;
    
    const metRequirements = requirements.filter(req => req.isMet).length;
    return Math.min(Math.floor((metRequirements / requirements.length) * 5), 5);
  };

  // Obtenir la couleur et le texte en fonction du niveau de force
  const getStrengthInfo = () => {
    const level = getStrengthLevel();
    
    switch (level) {
      case 0:
        return { color: 'bg-red-500', text: 'Mot de passe très faible. Doit contenir :' };
      case 1:
        return { color: 'bg-red-500', text: 'Mot de passe faible. Doit contenir :' };
      case 2:
        return { color: 'bg-orange-500', text: 'Mot de passe moyen. Considérez ajouter :' };
      case 3:
        return { color: 'bg-yellow-500', text: 'Mot de passe acceptable. Considérez ajouter :' };
      case 4:
        return { color: 'bg-green-400', text: 'Mot de passe fort' };
      case 5:
        return { color: 'bg-green-600', text: 'Mot de passe très fort' };
      default:
        return { color: 'bg-red-500', text: 'Mot de passe faible. Doit contenir :' };
    }
  };

  const strengthInfo = getStrengthInfo();
  const strengthLevel = getStrengthLevel();

  return (
    <div className={`mt-2 ${className}`}>
      {/* Indicateur de force visuel */}
      <div className="flex h-1.5 w-full space-x-1 mb-2">
        <div className={`flex-1 rounded-full ${strengthLevel >= 1 ? strengthInfo.color : 'bg-gray-200'}`}></div>
        <div className={`flex-1 rounded-full ${strengthLevel >= 2 ? strengthInfo.color : 'bg-gray-200'}`}></div>
        <div className={`flex-1 rounded-full ${strengthLevel >= 3 ? strengthInfo.color : 'bg-gray-200'}`}></div>
        <div className={`flex-1 rounded-full ${strengthLevel >= 4 ? strengthInfo.color : 'bg-gray-200'}`}></div>
        <div className={`flex-1 rounded-full ${strengthLevel >= 5 ? strengthInfo.color : 'bg-gray-200'}`}></div>
      </div>
      
      {/* Texte de force */}
      <p className="text-sm text-gray-600 mb-2">{strengthInfo.text}</p>
      
      {/* Liste des exigences */}
      <ul className="space-y-1">
        {requirements.map((requirement) => (
          <li key={requirement.id} className="flex items-center text-sm">
            {requirement.isMet ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
            )}
            <span className="text-gray-600">{requirement.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;
