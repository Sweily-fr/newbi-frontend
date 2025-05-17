import { useState, useMemo } from "react";
import { TOOLS } from "../constants/tools";
import { ToolCard } from "../features/outils/components";
import { Button, SearchInput } from "../components";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../hooks/useSubscription";
import { PremiumModal } from "../components/specific/subscription/PremiumModal";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { ArrowDown, ArrowDown2, ArrowUp2, Building, InfoCircle, Verify } from 'iconsax-react';
import { SEOHead } from "../components/specific/SEO/SEOHead";

export const ToolsPage = () => {
  // État pour le tri et la recherche
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // État pour la modal premium
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Récupérer les informations d'authentification et d'abonnement
  const { isAuthenticated } = useAuth();
  const { subscription, hasActiveSubscription } = useSubscription();

  // La fonction handleToolClick est maintenant définie à l'intérieur du useMemo

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <SEOHead
        title="Outils pour entrepreneurs | Newbi"
        description="Découvrez tous les outils Newbi pour gérer votre entreprise efficacement - factures, devis, signatures email et plus encore."
        keywords="outils entreprise, outils entrepreneurs, factures, devis, signature email, gestion entreprise"
        schemaType="WebApplication"
        canonicalUrl="https://newbi.fr/outils"
        additionalSchemaData={{
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'Web'
        }}
        schemaPrice="14.99"
        isPremium={true}
      />
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec options de vue et tri */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Trier par</span>
            <button
              className={`flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm ${
                sortDirection === "asc"
                  ? "bg-purple-50 border-purple-200 text-[#5b50ff]"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
              onClick={() => setSortDirection("asc")}
              title="Trier de A à Z"
            >
              <span>A → Z</span>
             <ArrowDown2 size="16" variant="Linear" color="#5b50ff"/>
            </button>
            <button
              className={`flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm ${
                sortDirection === "desc"
                  ? "bg-purple-50 border-purple-200 text-[#5b50ff]"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
              onClick={() => setSortDirection("desc")}
              title="Trier de Z à A"
            >
              <span>Z → A</span>
              <ArrowUp2 size="16" variant="Linear" color="#5b50ff"/>
            </button>
          </div>

          <SearchInput
            placeholder="Rechercher des outils"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            width="w-64"
          />

          <Button
            className="flex items-center gap-2 relative"
            onClick={() => {
              // Vérifier si l'utilisateur a une licence active
              if (isAuthenticated && subscription && !hasActiveSubscription) {
                // Ouvrir la modal premium si l'utilisateur n'a pas de licence active
                setIsPremiumModalOpen(true);
              } else {
                // Rediriger vers la page des paramètres entreprise si l'utilisateur a une licence
                window.location.href = "/profile?tab=company";
              }
            }}
          >
            {/* Badge Premium */}
            {isAuthenticated && subscription && !hasActiveSubscription && (
              <span className="absolute -top-4 -right-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs p-1 rounded-full font-semibold shadow-sm">
                <Verify size="16" variant="Linear" color="#5b50ff"/>
              </span>
            )}
            <Building color="currentColor" size="16" variant="Outline" />
            Paramètres entreprise
          </Button>
        </div>

        {/* Filtrer les outils en fonction de la recherche */}
        {useMemo(() => {
          // Fonction pour gérer le clic sur un outil
          const handleToolClick = (isPremium: boolean, href: string) => {
            // Si l'utilisateur est authentifié mais n'a pas d'abonnement premium et que l'outil est premium
            // Et qu'aucune recherche n'est en cours
            if (
              isAuthenticated &&
              subscription &&
              !hasActiveSubscription &&
              isPremium &&
              !searchQuery // Ne pas ouvrir la popup si une recherche est en cours
            ) {
              // Ouvrir la modal premium au lieu de naviguer
              setIsPremiumModalOpen(true);
              return "#"; // Empêcher la navigation
            }
            // Sinon, permettre la navigation normale
            return href;
          };

          // Filtrer les outils en fonction de la recherche
          const filteredTools = TOOLS.filter((tool) => {
            if (!searchQuery) return true;

            const query = searchQuery.toLowerCase();
            return (
              tool.name.toLowerCase().includes(query) ||
              tool.description.toLowerCase().includes(query) ||
              tool.category.toLowerCase().includes(query)
            );
          });

          // Trier les outils si nécessaire
          const sortedTools = [...filteredTools].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return sortDirection === "asc"
              ? nameA.localeCompare(nameB)
              : nameB.localeCompare(nameA);
          });

          return (
            <>
              {/* Compteur de résultats */}
              <div className="mb-6">
                <p className="text-sm text-gray-500">
                  {sortedTools.length}{" "}
                  {sortedTools.length > 1
                    ? "outils disponibles"
                    : "outil disponible"}
                  {searchQuery && ` pour "${searchQuery}"`}
                </p>
              </div>
              {/* Note d'information pour les outils de facture et devis */}
              {isAuthenticated && (
                <div className="bg-purple-50 border border-[#5b50ff]/20 p-4 mb-6 rounded-2xl shadow-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <InfoCircle size="24" variant="Linear" color="#5b50ff"/>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-md font-medium text-[#5b50ff]">
                        Information importante
                      </h3>
                      <div className="mt-1 text-sm text-gray-700">
                        <p>
                          Pour une meilleure expérience d'utilisation de l'ensemble des outils, notamment les <strong>factures</strong>{" "}
                          et les <strong>devis</strong>, nous vous recommandons de
                          compléter les informations de votre entreprise dans les{" "}
                          <a
                            href="#"
                            className="underline font-medium text-[#5b50ff] hover:text-[#4a41cc]"
                            onClick={(e) => {
                              e.preventDefault();
                              // Vérifier si l'utilisateur a une licence active
                              if (
                                isAuthenticated &&
                                subscription &&
                                !hasActiveSubscription
                              ) {
                                // Ouvrir la modal premium si l'utilisateur n'a pas de licence active
                                setIsPremiumModalOpen(true);
                              } else {
                                // Rediriger vers la page des paramètres entreprise si l'utilisateur a une licence
                                window.location.href = "/profile?tab=company";
                              }
                            }}
                          >
                            paramètres entreprise
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Grille de cartes */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedTools.map((tool, index) => (
                  <ToolCard
                    key={tool.id}
                    tool={{
                      ...tool,
                      // Ajouter des propriétés supplémentaires pour correspondre à l'image
                      id: `${index + 1}`.padStart(2, "0"),
                      // Modifier l'URL pour intercepter les clics sur les outils premium
                      href: handleToolClick(tool.premium === true, tool.href),
                    }}
                    onClick={() => {
                      // Si l'utilisateur est authentifié mais n'a pas d'abonnement premium et que l'outil est premium
                      // Et qu'aucune recherche n'est en cours
                      if (
                        isAuthenticated &&
                        subscription &&
                        !hasActiveSubscription &&
                        tool.premium &&
                        !searchQuery // Ne pas ouvrir la popup si une recherche est en cours
                      ) {
                        // Ouvrir la modal premium
                        setIsPremiumModalOpen(true);
                      }
                    }}
                  />
                ))}

                {sortedTools.length === 0 && (
                  <div className="col-span-3 py-12 text-center">
                    <p className="text-gray-500">
                      Aucun outil ne correspond à votre recherche.
                    </p>
                  </div>
                )}
              </div>

              {/* Section Outils à venir */}
              <div className="mt-16 border-t border-gray-200 py-10">
                <div className="text-center">
                  <div className="flex justify-center items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-500">
                      Outils à venir
                    </h3>
                    <a
                      href="mailto:contact@newbi.fr?subject=Suggestion%20d'un%20nouvel%20outil&body=Bonjour,%0A%0AJ'aimerais%20suggérer%20un%20nouvel%20outil%20pour%20la%20plateforme%20Newbi.%0A%0ANom%20de%20l'outil%20:%20%0A%0ADescription%20:%20%0A%0AUtilisation%20principale%20:%20%0A%0AMerci%20de%20prendre%20en%20considération%20ma%20suggestion.%0A%0ACordialement,"
                      className="ml-4 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
                    >
                      <svg
                        className="-ml-1 mr-2 h-4 w-4 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Suggérer un outil
                    </a>
                  </div>
                  <div className="flex justify-center mb-6">
                    <svg
                      className="h-32 w-32 text-gray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 max-w-2xl mx-auto">
                    De nouveaux outils sont en cours de développement pour vous
                    aider à gérer votre entreprise plus efficacement. Restez à
                    l'écoute pour les prochaines mises à jour.
                  </p>
                </div>
              </div>
            </>
          );
        }, [
          searchQuery,
          sortDirection,
          isAuthenticated,
          subscription,
          hasActiveSubscription,
          setIsPremiumModalOpen,
        ])}

        {/* Modal Premium */}
        <PremiumModal
          isOpen={isPremiumModalOpen}
          onClose={() => setIsPremiumModalOpen(false)}
          onSubscribe={() => {
            // Rediriger vers la page d'authentification ou de paiement
            window.location.href = "/auth";
          }}
        />
      </div>
    </div>
  );
};
