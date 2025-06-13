import { useState, useMemo } from "react";
import { TOOLS } from "../constants/tools";
import { ToolCard } from "../features/outils/components";
import { Button, SearchInput, Modal } from "../components";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../hooks/useSubscription";
import { PremiumModal } from "../components/specific/subscription/PremiumModal";
import { Add, ArrowDown2, ArrowUp2, Building, Category, InfoCircle, Verify, CloseCircle } from 'iconsax-react';
import { SEOHead } from "../components/specific/SEO/SEOHead";
import { useCompany } from "../features/profile/hooks/useCompany";
import { seoConfig } from "../config/seoConfig";

export const ToolsPage = () => {
  // État pour le tri et la recherche
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortType, setSortType] = useState<"category" | "name">("category"); // Par défaut, tri par catégorie
  const [searchQuery, setSearchQuery] = useState<string>("");

  // États pour les modals
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isCompanyInfoModalOpen, setIsCompanyInfoModalOpen] = useState(false);

  // Récupérer les informations d'authentification et d'abonnement
  const { isAuthenticated } = useAuth();
  const { subscription, hasActiveSubscription } = useSubscription();
  
  // Récupérer les informations d'entreprise
  const { company } = useCompany();
  
  // Vérifier si les informations d'entreprise essentielles sont remplies
  const hasRequiredCompanyInfo = useMemo(() => {
    if (!company) return false;
    
    // Vérifier les champs obligatoires de l'entreprise
    return !!company.name && 
           !!company.siret && 
           !!company.address && 
           !!company.address.street && 
           !!company.address.city && 
           !!company.address.postalCode;
  }, [company]);

  // La fonction handleToolClick est maintenant définie à l'intérieur du useMemo

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <SEOHead
        title={seoConfig.tools.title}
        description={seoConfig.tools.description}
        keywords={seoConfig.tools.keywords}
        schemaType={seoConfig.tools.schemaType}
        canonicalUrl={seoConfig.tools.canonicalUrl}
        additionalSchemaData={{
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'Web'
        }}
        schemaPrice="0" // Mise à jour pour refléter que l'outil est gratuit
        isPremium={true}
      />
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec options de vue et tri */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Trier par</span>
            <button
              className={`flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm ${
                sortType === "category"
                  ? "bg-purple-50 border-purple-200 text-[#5b50ff]"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
              onClick={() => setSortType("category")}
              title="Trier par catégorie"
            >
              <Category size="16" variant="Linear" color={sortType === "category" ? "#5b50ff" : "#6b7280"} className="mr-1"/>
              <span>Catégorie</span>
            </button>
            <button
              className={`flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm ${
                sortType === "name" && sortDirection === "asc"
                  ? "bg-purple-50 border-purple-200 text-[#5b50ff]"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
              onClick={() => {
                setSortType("name");
                setSortDirection("asc");
              }}
              title="Trier de A à Z"
            >
              <span>A → Z</span>
             <ArrowDown2 size="16" variant="Linear" color={sortType === "name" && sortDirection === "asc" ? "#5b50ff" : "#6b7280"}/>
            </button>
            <button
              className={`flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm ${
                sortType === "name" && sortDirection === "desc"
                  ? "bg-purple-50 border-purple-200 text-[#5b50ff]"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
              onClick={() => {
                setSortType("name");
                setSortDirection("desc");
              }}
              title="Trier de Z à A"
            >
              <span>Z → A</span>
              <ArrowUp2 size="16" variant="Linear" color={sortType === "name" && sortDirection === "desc" ? "#5b50ff" : "#6b7280"}/>
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
          // Fonction pour gérer les URL des outils
          const getToolUrl = (isPremium: boolean, href: string, toolId: string) => {
            // Vérifier si l'outil est un outil de facturation (factures ou devis)
            const isInvoicingTool = toolId === "invoices" || toolId === "quotes";
            
            // Si l'utilisateur est authentifié mais n'a pas d'abonnement premium et que l'outil est premium
            if (
              isAuthenticated &&
              subscription &&
              !hasActiveSubscription &&
              isPremium &&
              !searchQuery // Ne pas ouvrir la popup si une recherche est en cours
            ) {
              return "#"; // Empêcher la navigation pour les outils premium
            }
            
            // Si c'est un outil de facturation et que les informations d'entreprise ne sont pas complètes
            if (isAuthenticated && isInvoicingTool && !hasRequiredCompanyInfo && !searchQuery) {
              return "#"; // Empêcher la navigation pour les outils de facturation sans infos entreprise
            }
            
            // Sinon, permettre la navigation normale
            return href;
          };
          
          // Fonction pour gérer le clic sur un outil
          const handleToolCardClick = (tool: typeof TOOLS[0]) => {
            // Vérifier si l'outil est un outil de facturation (factures ou devis)
            const isInvoicingTool = tool.id === "invoices" || tool.id === "quotes";
            
            // Si l'utilisateur est authentifié mais n'a pas d'abonnement premium et que l'outil est premium
            if (
              isAuthenticated &&
              subscription &&
              !hasActiveSubscription &&
              tool.premium &&
              !searchQuery // Ne pas ouvrir la popup si une recherche est en cours
            ) {
              // Ouvrir la modal premium
              setIsPremiumModalOpen(true);
              return;
            }
            
            // Si c'est un outil de facturation et que les informations d'entreprise ne sont pas complètes
            if (isAuthenticated && isInvoicingTool && !hasRequiredCompanyInfo && !searchQuery) {
              // Ouvrir la modal d'information sur les informations d'entreprise requises
              setIsCompanyInfoModalOpen(true);
              return;
            }
          };

          // Filtrer les outils en fonction de la recherche
          const allFilteredTools = TOOLS.filter((tool) => {
            if (!searchQuery) return true;

            const query = searchQuery.toLowerCase();
            return (
              tool.name.toLowerCase().includes(query) ||
              tool.description.toLowerCase().includes(query) ||
              tool.category.toLowerCase().includes(query)
            );
          });
          
          // Utiliser tous les outils filtrés (les outils en développement sont maintenant dans la catégorie "À venir")
          const filteredTools = allFilteredTools;

          // Trier les outils si nécessaire
          let sortedTools = [...filteredTools];
          
          if (sortType === "name") {
            // Tri par nom
            sortedTools = sortedTools.sort((a, b) => {
              const nameA = a.name.toLowerCase();
              const nameB = b.name.toLowerCase();
              return sortDirection === "asc"
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);
            });
          } else {
            // Tri par catégorie puis par nom à l'intérieur de chaque catégorie
            sortedTools = sortedTools.sort((a, b) => {
              const categoryA = a.category.toLowerCase();
              const categoryB = b.category.toLowerCase();
              const nameA = a.name.toLowerCase();
              const nameB = b.name.toLowerCase();
              
              // D'abord comparer les catégories
              const categoryComparison = categoryA.localeCompare(categoryB);
              
              // Si les catégories sont différentes, retourner la comparaison des catégories
              if (categoryComparison !== 0) {
                return categoryComparison;
              }
              
              // Si les catégories sont identiques, trier par nom
              return nameA.localeCompare(nameB);
            });
          }
          
          // Regrouper les outils par catégorie pour l'affichage
          const toolsByCategory = sortedTools.reduce((acc, tool) => {
            if (!acc[tool.category]) {
              acc[tool.category] = [];
            }
            acc[tool.category].push(tool);
            return acc;
          }, {} as Record<string, typeof sortedTools>);
          
          // Obtenir les catégories triées avec Facturation en premier et À venir en dernier
          const categories = Object.keys(toolsByCategory).sort((a, b) => {
            // Mettre Facturation en premier
            if (a === "Facturation") return -1;
            if (b === "Facturation") return 1;
            
            // Mettre À venir en dernier
            if (a === "À venir") return 1;
            if (b === "À venir") return -1;
            
            // Tri alphabétique pour les autres catégories
            return a.localeCompare(b);
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
              {/* Affichage des outils */}
              {sortType === "name" ? (
                // Affichage en grille simple quand trié par nom
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedTools.map((tool, index) => (
                    <ToolCard
                      key={tool.id}
                      tool={{
                        ...tool,
                        // Ajouter des propriétés supplémentaires pour correspondre à l'image
                        id: `${index + 1}`.padStart(2, "0"),
                        // Modifier l'URL pour intercepter les clics sur les outils premium
                        href: getToolUrl(tool.premium === true, tool.href, tool.id),
                      }}
                      onClick={() => handleToolCardClick(tool)}
                    />
                  ))}
                </div>
              ) : (
                // Affichage par catégorie
                <div className="space-y-16">
                  {categories.map((category) => (
                    <div key={category} className="mb-8">
                      {/* Titre de la catégorie */}
                      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2">
                        {category}
                      </h2>
                      {/* Grille d'outils pour cette catégorie */}
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {toolsByCategory[category].map((tool, index) => (
                          <ToolCard
                            key={tool.id}
                            tool={{
                              ...tool,
                              // Ajouter des propriétés supplémentaires pour correspondre à l'image
                              id: `${index + 1}`.padStart(2, "0"),
                              // Modifier l'URL pour intercepter les clics sur les outils premium
                              href: getToolUrl(tool.premium === true, tool.href, tool.id),
                            }}
                            onClick={() => handleToolCardClick(tool)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {sortedTools.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-gray-500">
                    Aucun outil ne correspond à votre recherche.
                  </p>
                </div>
              )}

              {/* Section Suggérer un outil */}
              <div className="mt-16 border-t border-gray-200 py-10">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <a
                      href="mailto:contact@newbi.fr?subject=Suggestion%20d'un%20nouvel%20outil&body=Bonjour,%0A%0AJ'aimerais%20suggérer%20un%20nouvel%20outil%20pour%20la%20plateforme%20Newbi.%0A%0ANom%20de%20l'outil%20:%20%0A%0ADescription%20:%20%0A%0AUtilisation%20principale%20:%20%0A%0AMerci%20de%20prendre%20en%20considération%20ma%20suggestion.%0A%0ACordialement,"
                      className="inline-flex items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-2xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
                    >
                      <Add size="20" variant="Linear" color="gray" className="mr-2" />
                      Suggérer un outil
                    </a>
                  </div>
                </div>
              </div>
            </>
          );
        }, [
          searchQuery,
          sortDirection,
          sortType,
          isAuthenticated,
          subscription,
          hasActiveSubscription,
          hasRequiredCompanyInfo,
          setIsPremiumModalOpen,
          setIsCompanyInfoModalOpen,
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
        
        {/* Modal Informations d'entreprise manquantes */}
        <Modal
          isOpen={isCompanyInfoModalOpen}
          onClose={() => setIsCompanyInfoModalOpen(false)}
          title="Informations d'entreprise requises"
        >
          <div className="p-6">
            <div className="flex items-center justify-center mb-6 text-[#5b50ff]">
              <div className="bg-[#f0eeff] p-4 rounded-full">
                <Building size="32" variant="Bold" color="#5b50ff" />
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Complétez vos informations d'entreprise
              </h3>
              <p className="text-sm text-gray-500">
                Pour utiliser les outils de facturation (factures et devis), vous devez d'abord renseigner les informations essentielles de votre entreprise.
              </p>
            </div>
            
            <div className="bg-[#f0eeff] border border-[#5b50ff]/20 p-4 mb-6 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <InfoCircle size="18" variant="Linear" color="#5b50ff"/>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    Ces informations sont nécessaires pour générer des factures et devis conformes à la législation.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  setIsCompanyInfoModalOpen(false);
                  window.location.href = "/profile?tab=company";
                }}
                className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-[#5b50ff] hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
              >
                Compléter mes informations
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              
              <button
                onClick={() => setIsCompanyInfoModalOpen(false)}
                className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
              >
                <CloseCircle size="16" variant="Linear" color="#6b7280" className="mr-2" />
                Fermer
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
