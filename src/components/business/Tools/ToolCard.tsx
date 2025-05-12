import React from "react";
import { Tool } from "../../../constants/tools";
import { CheckBadgeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { Button } from "../../ui/Button";
import { useAuth } from "../../../context/AuthContext";
import { useSubscription } from "../../../hooks/useSubscription";
import { Link } from "react-router-dom";

interface ToolCardProps {
  tool: Tool;
  onClick?: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  const { isAuthenticated } = useAuth();
  const { hasActiveSubscription } = useSubscription();

  // Vérifier si l'utilisateur a accès à l'outil
  const hasAccess = !tool.premium || (isAuthenticated && hasActiveSubscription);

  return (
    <Link
      to={tool.href}
      className={`relative group bg-white rounded-2xl shadow-md border transition-all duration-200 overflow-hidden block
        hover:shadow-lg hover:border-[#5b50ff] hover:bg-[#f0eeff]/30
        ${tool.premium ? 'border-[#5b50ff]/40 bg-[#f0eeff]/20' : 'border-gray-100'}
        ${tool.comingSoon ? 'opacity-70 grayscale pointer-events-none' : ''}
        ${!tool.comingSoon && hasAccess ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      <div className="p-4 flex flex-col h-full justify-between">
        {/* En-tête avec logo, titre et catégorie alignés horizontalement */}
        <div className="flex items-center gap-3 mb-3 pl-1">
          {/* Icône dans un cercle avec fond blanc */}
          <div className={`
            h-14 w-14 rounded-full
            flex items-center justify-center
            border transition-all flex-shrink-0
            shadow-sm
            ${tool.premium ? 'bg-[#f0eeff] border-[#5b50ff]/40' : 'bg-white border-gray-200'}
            group-hover:border-[#5b50ff] group-hover:bg-[#e6e1ff]
          `}>
            <div className="w-7 h-7 flex items-center justify-center">
              <div className={`transform scale-125 ${tool.premium ? 'text-[#5b50ff]' : ''}`}>{tool.icon}</div>
            </div>
          </div>
          
          {/* Titre et catégorie */}
          <div className="flex flex-col">
            <h3 className={`text-lg font-medium tracking-wide text-gray-800`}>
              {tool.name}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-xs text-[#5b50ff] font-medium">{tool.category}</p>
              
              {/* Badge premium stylisé */}
              {tool.premium && (
                <div className="flex items-center justify-center p-0.5 rounded-full bg-[#f0eeff] border border-[#5b50ff] text-[#5b50ff]">
                  <CheckBadgeIcon className="w-4 h-4 text-[#5b50ff]" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm mb-3 min-h-[42px]">
          {tool.comingSoon
            ? <span className="italic text-[#4a41e0] font-semibold">{tool.name} bientôt disponible</span>
            : <span className={`${tool.premium ? 'text-gray-600' : 'text-gray-500'}`}>{tool.description}</span>}
        </div>

        {/* Bouton décoratif (n'est pas un vrai lien, juste visuel) */}
        <div className="mt-auto pt-3">
          <Button
            variant="outline"
            className={`rounded-lg font-medium text-sm py-2.5 px-5 w-full transition-all duration-300 
              ${tool.premium ? 'border-[#5b50ff] text-[#5b50ff]' : ''}
              group-hover:bg-[#5b50ff] group-hover:text-white group-hover:border-transparent group-hover:shadow-md group-hover:transform group-hover:translate-y-[-2px]
              pointer-events-none
            `}
            disabled={tool.comingSoon}
          >
            {tool.comingSoon ? (
              "Vous serez notifié au lancement"
            ) : (
              <div className="flex items-center justify-center gap-2">
                {tool.premium && isAuthenticated && !hasActiveSubscription && (
                  <LockClosedIcon className="h-4 w-4 text-[#e6e1ff]" />
                )}
                <span>{tool.name}</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </Link>
  );
};
