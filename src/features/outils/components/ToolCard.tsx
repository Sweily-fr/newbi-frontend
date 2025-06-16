import React from "react";
import { Tool } from "../../../constants/tools";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { Button } from "../../../components";
import { useAuth } from "../../../context/AuthContext";
import { useSubscription } from "../../../hooks/useSubscription";
import { Link } from "react-router-dom";
import { ArrowRight2, Verify, Setting4 } from "iconsax-react";

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
      className={`relative group bg-white rounded-2xl border border-gray-200 overflow-hidden block
        ${tool.premium ? 'border-gray-200 bg-gray-50/30' : 'border-gray-100'}
        ${tool.comingSoon ? 'opacity-75 grayscale pointer-events-none' : ''}
        ${tool.maintenance ? 'opacity-90 pointer-events-none' : ''}
        ${!tool.comingSoon && !tool.maintenance && hasAccess ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      aria-label={`Accéder à l'outil ${tool.name}${tool.premium ? ' (Premium)' : ''}${tool.maintenance ? ' (En maintenance)' : ''}`}
    >
      {/* Indicateur de maintenance en haut à droite */}
      {tool.maintenance && (
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center gap-1 z-10 shadow-sm">
            <Setting4 size="16" variant="Bold" className="animate-spin-slow" />
            <span className="text-xs font-medium">Maintenance</span>
          </div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-50/80 rotate-45 z-0"></div>
        </div>
      )}
      
      <div className="p-5 flex flex-col h-full justify-between">
        {/* En-tête avec logo, titre et catégorie alignés horizontalement */}
        <div className="flex items-center gap-4 pl-1">
          {/* Icône dans un cercle avec fond et effet de brillance */}
          <div className="flex-shrink-0 relative">
            {/* L'icône est déjà dans un div avec un fond coloré */}
            <div>
              {tool.icon}
            </div>
          </div>
          
          {/* Titre et catégorie */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold tracking-wide text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
              {tool.name}
            </h3>
            {/* <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#f0eeff] text-[#5b50ff] shadow-sm transition-all duration-300 group-hover:shadow">{tool.category}</p>
                {tool.premium && (
                  <p className="text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1" style={{ color: '#ffd700' }}>
                    <Verify size="12" variant="Bold" color="#ffd700" />
                    <span>Premium</span>
                  </p>
                )}
              </div>
            </div> */}
        <div className="text-sm">
          {tool.comingSoon ? (
            <div className="flex items-center gap-2">
              <span className="italic text-gray-600 font-medium">{tool.name} bientôt disponible</span>
            </div>
          ) : tool.maintenance ? (
            <div className="space-y-2">
              <p className="text-gray-700 line-clamp-2">{tool.description}</p>
              <div className="flex items-center gap-1 mt-2 text-yellow-700 text-xs">
                <Setting4 size="14" variant="Bold" className="inline-block" />
                <span>Temporairement indisponible pour maintenance</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-700 line-clamp-2">{tool.description}</p>
            </div>
          )}
        </div>
          </div>
        </div>


        {/* Bouton avec transition secondary -> primary au survol */}
        {/* <div className="mt-auto pt-3">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            className={`font-medium transition-all duration-300 rounded-2xl relative overflow-hidden
              ${!tool.maintenance && !tool.comingSoon ? 'group-hover:bg-[#5b50ff] group-hover:text-white group-hover:border-transparent group-hover:shadow-md' : ''}
            `}
            disabled={tool.comingSoon || tool.maintenance}
          >
            {tool.comingSoon ? (
              "Vous serez notifié au lancement"
            ) : tool.maintenance ? (
              <div className="flex items-center justify-center gap-2">
                <Setting4 size="16" variant="Bold" className="animate-spin-slow" />
                <span>En maintenance</span>
              </div>
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
        </div> */}
      </div>
    </Link>
  );
};
