import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContext, useState } from 'react';
import { SubscriptionContext } from '../../context/SubscriptionContext.context';
import { Dropdown, Avatar } from '../ui';
import { Logo } from '../../assets/logo';
import { ButtonLink } from '../ui/ButtonLink';
import { useQuery } from '@apollo/client';
import { GET_PROFILE } from '../../graphql/profile';
import axios from 'axios';
import { UserCircleIcon, CreditCardIcon, ArrowRightOnRectangleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
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

  // Construire les éléments du menu déroulant en fonction de l'état d'authentification et d'abonnement
  const dropdownItems = [
    {
      label: 'Mon profil',
      onClick: handleProfileClick,
      icon: <UserCircleIcon className="h-5 w-5 text-gray-500" />
    }
  ];
  
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

  // Ajouter l'option d'abonnement
  if (subscription?.stripeCustomerId) {
    const isPremium = subscription.licence;
    dropdownItems.push({
      label: isPremium ? 'Gérer mon abonnement' : 'Passer Premium',
      onClick: () => {
        if (isPremium) {
          // Si l'utilisateur est déjà premium, ouvrir la session de portail client
          handleSubscription();
        } else {
          // Sinon, ouvrir la modal pour passer premium
          setIsPremiumModalOpen(true);
        }
      },
      hasDivider: true,
      icon: <CreditCardIcon className="h-5 w-5 text-gray-500" />
    });
  }
  
  // Ajouter l'option de support
  dropdownItems.push({
    label: 'Support',
    onClick: () => {
      window.location.href = 'mailto:contact@sweily.fr?subject=Demande de support - Génération Business';
    },
    icon: <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500" />,
    hasDivider: true
  });
  
  // Ajouter l'option de déconnexion
  dropdownItems.push({
    label: 'Déconnexion',
    onClick: handleLogout,
    icon: <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-500" />
  });

  // Construire le nom pour l'avatar à partir des données du profil
  const firstName = userData?.me?.profile?.firstName || '';
  const lastName = userData?.me?.profile?.lastName || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  
  // Récupérer l'URL de la photo de profil si elle existe
  const profilePicture = import.meta.env.VITE_API_URL + userData?.me?.profile?.profilePicture || null;
  
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
      <nav className="bg-white z-[500] shadow-sm">
        <div className="max-w-full mx-auto py-2 px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center h-24">
                <Logo variant="black" withText={true} className="scale-110 transform-gpu" />
              </Link>
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
                      <div className="flex items-center justify-center">
                        <CheckBadgeIcon className="h-6 w-6 mr-1 text-yellow-400" />
                        <span className="text-xs text-gray-400 font-light">Premium</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                {!isAuthenticated && (
                  <ButtonLink
                    to="/auth"
                    className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Inscription/Connexion
                  </ButtonLink>
                )}
                
                {isAuthenticated && (
                  <div className="relative flex items-center ml-2 z-[9999]">
                    <Dropdown
                      trigger={avatarTrigger}
                      items={dropdownItems}
                      position="right"
                      width="w-72"
                    />
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
