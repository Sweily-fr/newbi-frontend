import React from "react";
import { Tool } from "../../../constants/tools";
import { CheckBadgeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { ButtonLink } from "../../../components/ui/ButtonLink";
import { useAuth } from "../../../context/AuthContext";
import { useSubscription } from "../../../hooks/useSubscription";

interface ToolCardProps {
  tool: Tool;
  onClick?: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {

  const { isAuthenticated } = useAuth();
  const { hasActiveSubscription } = useSubscription();



  return (
    <div
      className={`relative group bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-200 overflow-hidden cursor-pointer
        hover:shadow-2xl hover:scale-[1.035] hover:border-primary-600
        ${tool.premium ? 'border-2 border-gradient-to-r from-blue-400 to-pink-400' : ''}
        ${tool.comingSoon ? 'opacity-70 grayscale pointer-events-none' : ''}
      `}
    >
      <div className="p-5 flex flex-col h-full justify-between">
        {/* En-tête avec logo, titre et catégorie alignés horizontalement */}
        <div className="flex items-center gap-4 mb-4 pl-2">
          {/* Icône dans un cercle avec fond blanc */}
          <div className={`
            h-16 w-16 rounded-full bg-white
            flex items-center justify-center
            border-2 border-gray-200 group-hover:border-[#5b50ff] transition-all flex-shrink-0
            shadow-md
          `}>
            <div className="w-8 h-8 flex items-center justify-center">
              <div className="transform scale-150">{tool.icon}</div>
            </div>
          </div>
          
          {/* Titre et catégorie */}
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 tracking-wide">
              {tool.name}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-xs text-blue-500 font-medium">{tool.category}</p>
              
              {/* Badge premium stylisé */}
              {tool.premium && (
                <div className="flex items-center justify-center p-1 rounded-full bg-transparent border-2 border-[#5b50ff] text-[#5b50ff] shadow-sm">
                  <CheckBadgeIcon className="w-4 h-4 text-[#5b50ff]" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-3 min-h-[48px]">
          {tool.comingSoon
            ? <span className="italic text-blue-400 font-semibold">{tool.name} bientôt disponible</span>
            : <span className="text-gray-500 text-sm">{tool.description}</span>}
        </div>

        {/* Statut et badges - Uniquement pour les outils à venir */}
        {tool.comingSoon && (
          <div className="flex items-start gap-2 mb-4">
            <div className="text-xs px-3 py-1 rounded-full bg-transparent border-2 border-[#5b50ff] text-[#5b50ff] font-semibold shadow-sm animate-pulse">
              Bientôt disponible
            </div>
          </div>
        )}

        {/* Bouton Visit */}
        <div className="mt-auto pt-3">
          <ButtonLink
            to={tool.href}
            variant="primary"
            className="rounded-xl font-semibold text-base py-3 px-6"
            disabled={tool.comingSoon}
            onClick={onClick}
          >
            {tool.comingSoon ? (
              "Vous serez notifié au lancement"
            ) : (
              <div className="flex items-center justify-center gap-2">
                {tool.premium && isAuthenticated && !hasActiveSubscription && (
                  <LockClosedIcon className="h-4 w-4 text-yellow-200" />
                )}
                <span>{tool.name}</span>
              </div>
            )}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
};
