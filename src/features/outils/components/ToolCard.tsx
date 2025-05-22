import React from "react";
import { Tool } from "../../../constants/tools";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { Button } from "../../../components";
import { useAuth } from "../../../context/AuthContext";
import { useSubscription } from "../../../hooks/useSubscription";
import { Link } from "react-router-dom";
import { ArrowRight2, Verify } from "iconsax-react";

interface ToolCardProps {
  tool: Tool;
  onClick?: () => void;
  className?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick, className = '' }) => {
  const { isAuthenticated } = useAuth();
  const { hasActiveSubscription } = useSubscription();

  // Vérifier si l'utilisateur a accès à l'outil
  const hasAccess = !tool.premium || (isAuthenticated && hasActiveSubscription);

  // Tous les tags de catégorie sont en violet (couleur principale de Newbi)

  return (
    <Link
      to={tool.href}
      className={`relative group bg-white rounded-2xl shadow-md border transition-all duration-300 overflow-hidden block
        hover:shadow-xl hover:border-gray-300 hover:bg-gray-50 hover:transform hover:scale-[1.01]
        ${tool.premium ? 'border-gray-200 bg-gray-50/30' : 'border-gray-100'}
        ${tool.comingSoon ? 'opacity-75 grayscale pointer-events-none' : ''}
        ${!tool.comingSoon && hasAccess ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      aria-label={`Accéder à l'outil ${tool.name}${tool.premium ? ' (Premium)' : ''}`}
    >
      {/* Aucun indicateur premium en haut à droite */}
      
      <div className="p-5 flex flex-col h-full justify-between">
        {/* En-tête avec logo, titre et catégorie alignés horizontalement */}
        <div className="flex items-center gap-4 mb-4 pl-1">
          {/* Icône dans un cercle avec fond et effet de brillance */}
          <div className="flex-shrink-0 relative">
            {/* L'icône est déjà dans un div avec un fond coloré */}
            <div className="transition-transform duration-300 group-hover:scale-110">
              {tool.icon}
            </div>
          </div>
          
          {/* Titre et catégorie */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold tracking-wide text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
              {tool.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#f0eeff] text-[#5b50ff] shadow-sm transition-all duration-300 group-hover:shadow">{tool.category}</p>
                {tool.premium && (
                  <p className="text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1" style={{ color: '#ffd700' }}>
                    <Verify size="12" variant="Bold" color="#ffd700" />
                    <span>Premium</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm mb-4 min-h-[42px]">
          {tool.comingSoon ? (
            <div className="flex items-center gap-2">
              <span className="italic text-gray-600 font-medium">{tool.name} bientôt disponible</span>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-700 line-clamp-2">{tool.description}</p>
              {/* Informations pertinentes supplémentaires */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Utilisation rapide</span>
                </div>
                {tool.premium && (
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Modèles personnalisables</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bouton avec transition secondary -> primary au survol */}
        <div className="mt-auto pt-3">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            className={`font-medium transition-all duration-300 rounded-2xl relative overflow-hidden
              group-hover:bg-[#5b50ff] group-hover:text-white group-hover:border-transparent group-hover:shadow-md
            `}
            disabled={tool.comingSoon}
          >
            {tool.comingSoon ? (
              "Vous serez notifié au lancement"
            ) : (
              <div className="flex items-center justify-center gap-2">
                {tool.premium && isAuthenticated && !hasActiveSubscription ? (
                  <>
                    <LockClosedIcon className="h-4 w-4" />
                    <span>Débloquer</span>
                  </>
                ) : (
                  <>
                    <span>Explorer</span>
                    <ArrowRight2 
                      size="16" 
                      color="currentColor" 
                      variant="Linear" 
                      className="ml-1 transition-all duration-300 group-hover:translate-x-1 relative z-10" 
                    />
                  </>
                )}
              </div>
            )}
          </Button>
        </div>
      </div>
    </Link>
  );
};
