
import { ProductsManager } from '../features/products/components/business/ProductsManager';
import { SEOHead } from '../components/specific/SEO/SEOHead';
import { useSubscription } from '../hooks/useSubscription';

export const CatalogPage = () => {
  const { hasActiveSubscription } = useSubscription();

  if (!hasActiveSubscription) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-2xl p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-6">
            La gestion du catalogue de produits et services est disponible uniquement pour les comptes Premium.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEOHead
        title="Mon catalogue | Newbi"
        description="Gérez votre catalogue de produits et services pour vos factures et devis"
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mon catalogue</h1>
        <p className="mt-2 text-gray-600">
          Gérez vos produits et services pour les intégrer facilement à vos factures et devis.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-2xl">
        <div className="px-4 py-5 sm:p-6">
          <div className="bg-[#f0eeff] p-3 rounded-2xl border border-[#e6e1ff] mb-6">
            <p className="text-sm text-gray-600">
              <span className="text-[#5b50ff] font-medium">
                Astuce :
              </span>{" "}
              Créez et organisez votre catalogue de produits et services pour les intégrer automatiquement, avec calcul
              des taxes et des remises, dans vos factures et devis.
            </p>
          </div>
          
          <ProductsManager />
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
