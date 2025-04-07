import React, { useState } from "react";
import { Tool } from "../../../constants/tools";
import { CheckBadgeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { ButtonLink } from "../../../components/ui/ButtonLink";
import { useAuth } from "../../../context/AuthContext";
import { useSubscription } from "../../../hooks/useSubscription";

interface ToolCardProps {
  tool: Tool;
  saved?: boolean;
  onClick?: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, saved = false, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth();
  const { hasActiveSubscription } = useSubscription();

  // Détermine le statut (comme dans l'image)
  const getStatus = () => {
    const statuses = [
      { label: "À jour", color: "bg-green-100 text-green-800" },
      { label: "Populaire", color: "bg-orange-100 text-orange-800" },
    ];
    return saved ? statuses[0] : statuses[1];
  };

  const status = getStatus();

  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow duration-200 border border-gray-200 ${tool.comingSoon ? 'opacity-80' : ''}`}>
      <div className="p-5">
        {/* En-tête avec logo et ID */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-12 w-12 rounded-lg ${
                tool.id === "01"
                  ? "bg-blue-100"
                  : tool.id === "02"
                  ? "bg-orange-100"
                  : "bg-purple-100"
              } flex items-center justify-center overflow-hidden text-gray-700`}
            >
              {tool.icon}
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-500">{tool.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
              {tool.id}
            </div>
            {tool.premium && (
              <div className="w-6 h-6 flex items-center justify-center">
                <CheckBadgeIcon className="w-6 h-6 text-blue-600" />
              </div>
            )}
          </div>
        </div>

        <div className="text-lg text-gray-700 py-2 mb-2">
          {tool.comingSoon 
            ? `${tool.name} bientôt disponible` 
            : tool.description}
        </div>

        {/* Statut et badges */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`text-xs px-3 py-1 rounded-full ${status.color}`}>
            {tool.category}
          </div>
          {tool.comingSoon ? (
            <div className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 animate-pulse">
              Bientôt disponible
            </div>
          ) : (
            <div
              className={`text-xs px-3 py-1 rounded-full ${
                saved
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {saved ? "À jour" : "Populaire"}
            </div>
          )}
        </div>

        {/* Bouton Visit */}
        <div className="mt-5">
          <ButtonLink
            to={tool.href}
            variant={isHovered ? "primary" : "outline"}
            fullWidth
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={tool.comingSoon}
            onClick={onClick}
          >
            {tool.comingSoon ? (
              "Vous serez notifié au lancement"
            ) : (
              <div className="flex items-center justify-center gap-2">
                {tool.premium && isAuthenticated && !hasActiveSubscription && (
                  <LockClosedIcon className="h-4 w-4 text-gray-500" />
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
