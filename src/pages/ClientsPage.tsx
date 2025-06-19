import { ClientsManager } from "../features/clients/components/business/ClientsManager";
import { SEOHead } from "../components/specific/SEO/SEOHead";

/**
 * Page de gestion des clients
 */
export const ClientsPage = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <SEOHead
        title="Gestion des clients | Newbi"
        description="Gérez facilement votre base de clients avec Newbi. Ajoutez, modifiez et suivez vos clients en un seul endroit."
        keywords="gestion clients, base de données clients, fiches clients, relation client, CRM"
        canonicalUrl="https://www.newbi.fr/clients"
      />
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow-sm rounded-2xl">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Gestion des clients
            </h1>
            <div className="bg-[#f0eeff] p-3 rounded-2xl border border-[#e6e1ff] mb-6">
              <p className="text-sm text-gray-600">
                <span className="text-[#5b50ff] font-medium">
                  Astuce :
                </span>{" "}
                Gérez efficacement vos clients en un seul endroit. Une base de
                clients bien organisée vous permettra d'utiliser tous les outils
                de Newbi de manière optimale. Les informations de vos clients
                sont automatiquement intégrées dans vos factures, devis et autres
                documents, vous faisant gagner un temps précieux dans vos tâches
                administratives.
              </p>
            </div>
            <ClientsManager />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
