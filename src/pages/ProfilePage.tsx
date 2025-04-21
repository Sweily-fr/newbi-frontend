import { useQuery } from '@apollo/client';
import { useState, useContext, useEffect } from 'react';
import { GET_PROFILE } from '../graphql/profile';
import { PersonalInfoForm } from '../components/forms/profile/PersonalInfoForm';
import { CompanyInfoForm } from '../components/forms/profile/CompanyInfoForm';
import { ClientsManager } from '../components/business/clients/ClientsManager';
import { ProductsManager } from '../components/business/products/ProductsManager';
import { TabNavigation, TabItem } from '../components/navigation/TabNavigation';
import { UserIcon, BuildingOfficeIcon, CreditCardIcon, ShoppingBagIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { SubscriptionContext } from '../context/SubscriptionContext.context';
import { Button } from '../components/ui';
import { PremiumModal } from '../components/subscription/PremiumModal';
import axios from 'axios';

export const ProfilePage = () => {
  const { loading, error, data } = useQuery(GET_PROFILE);
  const [activeTab, setActiveTab] = useState<string | null>('profile');
  const { subscription } = useContext(SubscriptionContext);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Vérifier si un onglet est spécifié dans l'URL ou le localStorage
  useEffect(() => {
    // D'abord vérifier l'URL (priorité la plus haute)
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    
    if (tabParam && ['profile', 'company', 'payment', 'products', 'security'].includes(tabParam)) {
      // Mettre à jour l'onglet actif et le sauvegarder dans localStorage
      setActiveTab(tabParam);
      localStorage.setItem('profileActiveTab', tabParam);
    } else {
      // Si aucun onglet n'est spécifié dans l'URL, essayer de récupérer du localStorage
      const savedTab = localStorage.getItem('profileActiveTab');
      if (savedTab && ['profile', 'company', 'payment', 'products', 'security'].includes(savedTab)) {
        setActiveTab(savedTab);
      }
    }
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Une erreur est survenue</div>;

  // Initialiser des objets vides si les données sont manquantes
  const profileData = data?.me?.profile || {};
  const companyData = data?.me?.company || {};

  // Nous n'avons plus besoin de cette icône personnalisée car nous utilisons directement CheckBadgeIcon

  // Définir les onglets en fonction de l'état d'abonnement
  const tabs: TabItem[] = [
    { 
      id: 'profile', 
      label: 'Profile',
      icon: <UserIcon className="w-5 h-5" />
    },
  ];
  
  // Ajouter l'onglet Entreprise uniquement pour les utilisateurs premium
  if (subscription?.licence) {
    tabs.push({ 
      id: 'company', 
      label: 'Entreprise',
      icon: (
        <div className="flex items-center justify-between w-full">
          <BuildingOfficeIcon className="w-5 h-5" />
          <CheckBadgeIcon className="w-5 h-5 text-yellow-500 ml-4 absolute right-8" />
        </div>
      )
    });
    
    // Ajouter l'onglet Catalogue Produits/Services pour les utilisateurs premium
    tabs.push({ 
      id: 'products', 
      label: 'Catalogue',
      icon: (
        <div className="flex items-center justify-between w-full">
          <ShoppingBagIcon className="w-5 h-5" />
          <CheckBadgeIcon className="w-5 h-5 text-yellow-500 ml-4 absolute right-8" />
        </div>
      )
    });
  } else {
    // Pour les utilisateurs non premium, ajouter un onglet désactivé
    tabs.push({ 
      id: 'company_locked', 
      label: 'Entreprise',
      icon: (
        <div className="flex items-center justify-between w-full">
          <BuildingOfficeIcon className="w-5 h-5" />
          <LockClosedIcon className="w-4 h-4 text-gray-400 ml-4" />
        </div>
      )
    });
    
    // Ajouter l'onglet Catalogue Produits/Services désactivé pour les utilisateurs non premium
    tabs.push({ 
      id: 'products_locked', 
      label: 'Catalogue',
      icon: (
        <div className="flex items-center justify-between w-full">
          <ShoppingBagIcon className="w-5 h-5" />
          <LockClosedIcon className="w-4 h-4 text-gray-400 ml-4" />
        </div>
      )
    });
  }

  const handleTabChange = (tabId: string | null) => {
    // Si l'utilisateur clique sur un onglet verrouillé, ouvrir la modal premium
    if (tabId === 'company_locked' || tabId === 'products_locked') {
      setIsPremiumModalOpen(true);
      return;
    }
    
    // Mettre à jour l'onglet actif
    setActiveTab(tabId);
    
    if (tabId) {
      // Sauvegarder l'onglet actif dans localStorage
      localStorage.setItem('profileActiveTab', tabId);
      
      // Mettre à jour l'URL sans recharger la page
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.pushState({}, '', url.toString());
    }
  };

  // Fonction pour gérer l'abonnement premium
  const handleSubscription = async () => {
    try {
      // Récupérer le token d'authentification
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Aucun token d\'authentification trouvé');
        return;
      }
      
      // Appeler l'endpoint pour créer une session de portail client
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-customer-portal-session`,
        {},
        {
          headers: {
            Authorization: token
          }
        }
      );
      
      // Rediriger vers l'URL de la session
      if (response.data.url) {
        window.open(response.data.url, '_blank');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la session de portail client:', error);
      alert('Une erreur est survenue lors de la création de la session de portail client.');
    }
  };

  // Fonction pour gérer le clic sur le bouton premium
  const handlePremiumClick = () => {
    const isPremium = subscription?.licence;
    if (isPremium) {
      // Si l'utilisateur est déjà premium, ouvrir la session de portail client
      handleSubscription();
    } else {
      // Sinon, ouvrir la modal pour passer premium
      setIsPremiumModalOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Mon Espace</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gérez vos informations personnelles et professionnelles
            </p>
          </div>
          {subscription?.stripeCustomerId && (
            <Button
              onClick={handlePremiumClick}
              variant={subscription?.licence ? "secondary" : "primary"}
              className="flex items-center gap-2"
            >
              <CreditCardIcon className="h-5 w-5" />
              {subscription?.licence ? "Gérer mon abonnement" : "Passer Premium"}
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Navigation à gauche */}
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="sticky top-[100px] bg-white shadow-sm rounded-lg p-4">
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative mb-2">
                   {data?.me?.profile?.profilePicture ? (
                      <img 
                      src={import.meta.env.VITE_API_URL + data.me.profile.profilePicture} 
                      alt={`${data?.me?.profile?.firstName || ''} ${data?.me?.profile?.lastName || ''}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    data?.me?.profile?.avatar ? (
                    <img 
                      src={data.me.profile.avatar} 
                      alt={`${data?.me?.profile?.firstName || ''} ${data?.me?.profile?.lastName || ''}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    data?.me?.profile?.firstName?.[0] || data?.me?.profile?.lastName?.[0] ? (
                      <span className="text-2xl font-bold text-gray-400">
                        {data?.me?.profile?.firstName?.[0] || ''}
                        {data?.me?.profile?.lastName?.[0] || ''}
                      </span>
                    ) : (
                      <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )
                  ))}
                  {data?.me?.unreadNotifications > 0 && (
                    <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                        {data.me.unreadNotifications}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 text-lg">
                  {data?.me?.profile?.firstName || ''} {data?.me?.profile?.lastName || ''}
                </h3>
                <p className="text-sm text-gray-500 mb-6">{data?.me?.profile?.title || 'Utilisateur'}</p>
              </div>
              <TabNavigation 
                tabs={tabs} 
                activeTab={activeTab} 
                onTabChange={handleTabChange} 
                className="flex-col items-center space-y-3 space-x-0" 
                variant="default"
              />
            </div>
          </div>

          {/* Contenu à droite */}
          <div className="flex-grow space-y-8">
            {activeTab === 'profile' && (
              <>
                {/* Informations personnelles */}
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                      Informations personnelles
                    </h2>
                    <PersonalInfoForm initialData={profileData} />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'company' && subscription?.licence && (
              <>
                {/* Informations de l'entreprise */}
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                      Informations de l'entreprise
                    </h2>
                    <CompanyInfoForm initialData={companyData} />
                  </div>
                </div>

                {/* Gestion des clients */}
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <ClientsManager />
                  </div>
                </div>
              </>
            )}

            {(activeTab === 'company_locked' || activeTab === 'products_locked') && (
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6 flex flex-col items-center justify-center text-center">
                  <CheckBadgeIcon className="w-12 h-12 text-yellow-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Fonctionnalité Premium</h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                    {activeTab === 'company_locked' 
                      ? 'La gestion des informations de votre entreprise est disponible uniquement pour les comptes Premium.'
                      : 'La gestion du catalogue de produits et services est disponible uniquement pour les comptes Premium.'}
                  </p>
                  <Button
                    onClick={() => setIsPremiumModalOpen(true)}
                    variant="primary"
                    className="flex items-center gap-2"
                  >
                    <CreditCardIcon className="h-5 w-5" />
                    Passer Premium
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'products' && subscription?.licence && (
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <ProductsManager />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modal Premium */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onSubscribe={handleSubscription}
      />
    </div>
  );
};
