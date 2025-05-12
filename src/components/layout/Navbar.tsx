import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContext, useState } from 'react';
import { SubscriptionContext } from '../../context/SubscriptionContext.context';
import { Dropdown, Avatar } from '../';
import { Logo } from '../../assets/logo';
import { ButtonLink } from '../';
import { useQuery } from '@apollo/client';
import { GET_PROFILE } from '../../features/profile/graphql';
import axios from 'axios';
import { UserCircleIcon, CreditCardIcon, ArrowRightOnRectangleIcon, QuestionMarkCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { PremiumModal } from '../subscription/PremiumModal';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { subscription } = useContext(SubscriptionContext);
  const navigate = useNavigate();
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  
  // Récupérer les informations du profil utilisateur
  const { data: userData } = useQuery(GET_PROFILE, {
    skip: !isAuthenticated,
    fetchPolicy: 'cache-and-network'
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // La navbar s'affiche toujours, mais avec des options différentes selon l'état d'authentification

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

  // Construire les éléments du menu déroulant
  const isPremium = subscription?.licence;
  
  // Créer un tableau d'éléments pour le dropdown
  const dropdownItems = [
    // Profil utilisateur
    {
      label: 'Mon profil',
      onClick: handleProfileClick,
      icon: <UserCircleIcon className="h-5 w-5 text-gray-500" />
    }
  ];
  
  // Ajouter l'option d'abonnement si l'utilisateur a un ID client Stripe
  if (subscription?.stripeCustomerId) {

    
    // Ajouter l'option de gestion d'abonnement
    dropdownItems.push({
      label: isPremium ? 'Gérer mon abonnement' : 'Passer Premium',
      onClick: () => {
        if (isPremium) {
          handleSubscription();
        } else {
          setIsPremiumModalOpen(true);
        }
      },
      icon: <CreditCardIcon className="h-5 w-5 text-gray-500" />
    });
    
    // Ajouter l'option Communauté uniquement pour les membres premium
    if (isPremium) {
      dropdownItems.push({
        label: (
          <div className="flex items-center">
            <span>Communauté</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        ),
        onClick: () => {
          window.open('https://chat.whatsapp.com/FGLms8EYhpv1o5rkrnIldL', '_blank');
        },
        icon: <UserGroupIcon className="h-5 w-5 text-gray-500" />
      });
    }
  }
  

  
  // Ajouter l'option de support
  dropdownItems.push({
    label: 'Support',
    onClick: () => {
      window.location.href = 'mailto:contact@newbi.fr?subject=Demande de support - Newbi';
    },
    icon: <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500" />
  });
  
  // Ajouter l'option de déconnexion
  dropdownItems.push({
    label: 'Déconnexion',
    onClick: handleLogout,
    icon: <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-500" />,
    hasDivider: true
  });

  // Construire le nom pour l'avatar à partir des données du profil
  const firstName = userData?.me?.profile?.firstName || '';
  const lastName = userData?.me?.profile?.lastName || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  
  // Récupérer l'URL de la photo de profil si elle existe
  const profilePicture = import.meta.env.VITE_API_URL + '/' + userData?.me?.profile?.profilePicture || '';
  
  const avatarTrigger = (
    <Avatar 
      size="lg"
      hasRing={true}
      ringColor="white"
      name={fullName}
      src={profilePicture}
      onClick={() => {}}
    />
  );

  return (
    <>
      <nav className="bg-white z-[999] shadow-sm fixed top-0 left-0 w-full">
        <div className="max-w-full mx-auto py-2 px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center h-24">
                <Logo variant="black" withText={true} className="scale-110 transform-gpu" />
              </Link>
              <span className="ml-3 text-xs font-medium text-[#5b50ff] border border-[#5b50ff] rounded-full px-2 py-0.5">
                Version Beta
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex md:items-center space-x-5">
                {isAuthenticated && (
                  <>
                    <ButtonLink
                      to="/outils"
                      variant="outline"
                      size="md"
                      className="shadow-sm transform hover:translate-y-[-2px]"
                    >
                      Accéder aux outils
                    </ButtonLink>
                    
                    {/* Bouton Premium uniquement pour les utilisateurs sans licence premium */}
                    {isAuthenticated && subscription && !subscription.licence ? (
                      <ButtonLink
                        to="#"
                        variant="primary"
                        size="md"
                        className="ml-2 shadow-md transform hover:translate-y-[-2px]"
                        onClick={() => setIsPremiumModalOpen(true)}
                      >
                        <span className="flex items-center">
                          <CheckBadgeIcon className="h-4 w-4 mr-1" />
                          Passer premium
                        </span>
                      </ButtonLink>
                    ) : (
                      <div className="relative">
                        {/* Espace vide pour maintenir l'alignement */}
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                {!isAuthenticated && (
                  <ButtonLink
                    to="/auth"
                    className="bg-[#5b50ff] text-white hover:bg-[#4a41d0] px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Inscription/Connexion
                  </ButtonLink>
                )}
                
                {isAuthenticated && (
                  <div className="relative flex items-center ml-2 z-[9999]">
                    <div className="relative">
                      <Dropdown
                        trigger={avatarTrigger}
                        items={dropdownItems}
                        position="right"
                        width="w-72"
                      />
                      {subscription && subscription.licence && (
                        <div className="absolute -bottom-1 -right-1">
                          <CheckBadgeIcon className="h-5 w-5 text-yellow-400 drop-shadow-md" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Modal pour passer à la version premium */}
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        onSubscribe={() => {
          setIsPremiumModalOpen(false);
          handleSubscription();
        }} 
      />
    </>
  );
};
