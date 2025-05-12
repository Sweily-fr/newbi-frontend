import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { CreditCardIcon, CubeIcon, ArrowsRightLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { StripeIntegrationModal } from './StripeIntegrationModal';
import { GET_INTEGRATIONS, DISCONNECT_STRIPE } from '../graphql';
import { ConfirmationModal } from '../../../components/feedback/ConfirmationModal';
import { Notification } from '../../../components/feedback/Notification';

// Interface pour les outils d'intégration
interface IntegrationTool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'not_connected' | 'coming_soon';
  url: string;
}

export const IntegrationsManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  
  // Récupération des intégrations depuis l'API GraphQL
  const { data, refetch } = useQuery(GET_INTEGRATIONS, {
    fetchPolicy: 'network-only' // Toujours récupérer les données fraîches du serveur
  });
  
  const [integrationTools, setIntegrationTools] = useState<IntegrationTool[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Intégrez votre compte Stripe pour synchroniser vos paiements et factures',
      icon: <CreditCardIcon className="h-8 w-8 text-white" />,
      status: 'not_connected',
      url: 'https://stripe.com'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connectez vos outils préférés et automatisez vos flux de travail',
      icon: <ArrowsRightLeftIcon className="h-8 w-8 text-white" />,
      status: 'coming_soon',
      url: 'https://zapier.com'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Synchronisez vos clients et prospects avec votre CRM HubSpot',
      icon: <CubeIcon className="h-8 w-8 text-white" />,
      status: 'coming_soon',
      url: 'https://hubspot.com'
    }
  ]);

  // Filtrer les outils en fonction de la recherche
  const filteredTools = integrationTools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fonction pour gérer le changement dans la barre de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Fonction pour gérer la connexion à un outil
  const handleConnect = (toolId: string) => {
    const tool = integrationTools.find(t => t.id === toolId);
    if (!tool || tool.status === 'coming_soon') return;
    
    if (toolId === 'stripe') {
      if (tool.status === 'connected') {
        // Si Stripe est déjà connecté, on propose la déconnexion
        handleStripeDisconnect();
      } else {
        // Sinon, on ouvre la modal de connexion
        setIsStripeModalOpen(true);
      }
    }
  };
  
  // Mettre à jour l'état des intégrations lorsque les données GraphQL changent
  useEffect(() => {
    if (data?.integrations) {
      // Trouver l'intégration Stripe dans les données
      const stripeIntegration = data.integrations.find(
        (i: { provider: string; isConnected: boolean }) => i.provider === 'stripe'
      );
      
      // Mettre à jour l'état des outils d'intégration
      setIntegrationTools(prevTools => 
        prevTools.map(tool => {
          if (tool.id === 'stripe' && stripeIntegration) {
            return { 
              ...tool, 
              status: stripeIntegration.isConnected ? 'connected' as const : 'not_connected' as const 
            };
          }
          return tool;
        })
      );
    }
  }, [data]);
  
  // Fonction pour connecter Stripe avec la clé API
  const handleStripeConnect = () => {
    // Afficher une notification de succès
    Notification.success('Connexion à Stripe réussie', {
      position: 'bottom-left',
      duration: 5000
    });
    // Rafraîchir les données après la connexion
    refetch();
  };

  // Fonction pour déconnecter Stripe
  const [disconnectStripe, { loading: disconnectLoading }] = useMutation(DISCONNECT_STRIPE, {
    onCompleted: (data) => {
      if (data.disconnectStripe.success) {
        // Afficher une notification de succès
        Notification.success('Déconnexion de Stripe réussie', {
          position: 'bottom-left',
          duration: 5000
        });
        // Rafraîchir les données après la déconnexion
        refetch();
      } else {
        console.error('Erreur lors de la déconnexion de Stripe:', data.disconnectStripe.message);
        // Afficher une notification d'erreur
        Notification.error(data.disconnectStripe.message || 'Erreur lors de la déconnexion de Stripe', {
          position: 'bottom-left',
          duration: 5000
        });
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la déconnexion de Stripe:', error);
      // Afficher une notification d'erreur
      Notification.error('Erreur lors de la déconnexion de Stripe', {
        position: 'bottom-left',
        duration: 5000
      });
    }
  });

  const handleStripeDisconnect = () => {
    setIsConfirmationModalOpen(true);
  };
  
  const confirmStripeDisconnect = () => {
    disconnectStripe();
    setIsConfirmationModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
        Intégrations
      </h2>
      
      {/* Barre de recherche */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Rechercher une intégration..."
          value={searchQuery}
          onChange={handleSearchChange}
          ref={searchInputRef}
        />
      </div>
      
      {/* Liste des outils d'intégration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredTools.map((tool) => (
          <div key={tool.id} className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col h-full ${tool.status === 'coming_soon' ? 'opacity-60' : ''}`}>
            <div className="p-4 flex-grow">
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center ${tool.id === 'stripe' ? 'bg-indigo-600' : tool.id === 'zapier' ? 'bg-gray-400' : 'bg-gray-400'}`}>
                  {tool.icon}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{tool.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{tool.description}</p>
                  {tool.status === 'coming_soon' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                      Bientôt disponible
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 pt-0 mt-auto border-t border-gray-100">
              <button
                onClick={() => handleConnect(tool.id)}
                disabled={tool.status === 'coming_soon'}
                className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm transition-all duration-300 ${tool.status === 'coming_soon' 
                  ? 'text-gray-500 bg-gray-200 cursor-not-allowed' 
                  : tool.status === 'connected' && tool.id === 'stripe'
                    ? 'text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                    : 'text-white bg-[#5b50ff] hover:bg-[#4a41cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]'}`}
              >
                {tool.status === 'connected' 
                  ? (tool.id === 'stripe' ? 'Déconnexion' : 'Gérer la connexion')
                  : tool.status === 'coming_soon' 
                    ? 'Bientôt disponible' 
                    : 'Connecter'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredTools.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune intégration trouvée pour "{searchQuery}"</p>
        </div>
      )}
      
      {/* Modal de connexion Stripe */}
      <StripeIntegrationModal 
        isOpen={isStripeModalOpen} 
        onClose={() => setIsStripeModalOpen(false)} 
        onConnect={handleStripeConnect}
      />
      
      {/* Modal de confirmation pour la déconnexion de Stripe */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmStripeDisconnect}
        title="Déconnecter Stripe"
        message="Êtes-vous sûr de vouloir déconnecter votre compte Stripe ? Cette action supprimera votre clé API de notre base de données."
        confirmButtonText="Déconnecter"
        confirmButtonVariant="danger"
        isLoading={disconnectLoading}
      />
    </div>
  );
};
