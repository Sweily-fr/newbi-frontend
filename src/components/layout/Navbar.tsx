import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useContext, useState } from "react";
import { SubscriptionContext } from "../../context/SubscriptionContext.context";
import { Dropdown, Avatar, Button } from "../";
import { Logo } from "../../assets/logo";
import { ButtonLink } from "../";
import { useQuery } from "@apollo/client";
import { GET_PROFILE } from "../../features/profile/graphql";
import axios from "axios";
import { PremiumModal } from "../specific/subscription/PremiumModal";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import {
  ArrowRight,
  Verify,
  Profile,
  LogoutCurve,
  People,
  Card,
  InfoCircle,
  HomeTrendUp,
} from "iconsax-react";

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { subscription } = useContext(SubscriptionContext);
  const navigate = useNavigate();
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Récupérer les informations du profil utilisateur
  const { data: userData } = useQuery(GET_PROFILE, {
    skip: !isAuthenticated,
    fetchPolicy: "cache-and-network",
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  // La navbar s'affiche toujours, mais avec des options différentes selon l'état d'authentification

  // Fonction pour gérer l'abonnement premium
  const handleSubscription = async () => {
    try {
      // Récupérer le token d'authentification
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Aucun token d'authentification trouvé");
        return;
      }

      // Appeler l'endpoint pour créer une session de portail client
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-customer-portal-session`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // Rediriger vers l'URL de la session
      if (response.data.url) {
        window.open(response.data.url, "_blank");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la création de la session de portail client:",
        error
      );
      alert(
        "Une erreur est survenue lors de la création de la session de portail client."
      );
    }
  };

  // Construire les éléments du menu déroulant
  const isPremium = subscription?.licence;

  // Créer un tableau d'éléments pour le dropdown
  const dropdownItems = [
    // Tableau de bord (désactivé)
    // {
    //   label: "Tableau de bord",
    //   onClick: () => {}, // Fonction vide pour désactiver la navigation
    //   icon: <HomeTrendUp size="20" variant="Linear" color="#c7c7c7" />,
    //   disabled: true, // Marquer comme désactivé
    // },
    // Profil utilisateur
    {
      label: "Mon profil",
      onClick: handleProfileClick,
      icon: <Profile size="20" variant="Linear" color="#5b50ff" />,
    },
  ];

  // Ajouter l'option d'abonnement si l'utilisateur a un ID client Stripe
  if (subscription?.stripeCustomerId) {
    // Ajouter l'option de gestion d'abonnement
    dropdownItems.push({
      label: isPremium ? "Gérer mon abonnement" : "Passer Premium",
      onClick: () => {
        if (isPremium) {
          handleSubscription();
        } else {
          setIsPremiumModalOpen(true);
        }
      },
      icon: <Card size="20" variant="Linear" color="#5b50ff" />,
    });
  }
  // Ajouter l'option Communauté uniquement pour les membres premium
  if (isPremium) {
    dropdownItems.push({
      label: "Communauté",
      onClick: () => {
        window.open(
          "https://chat.whatsapp.com/FGLms8EYhpv1o5rkrnIldL",
          "_blank"
        );
      },
      icon: <People size="20" variant="Linear" color="#5b50ff" />,
    });
  }

  // Ajouter l'option Aide
  dropdownItems.push({
    label: "Aide",
    onClick: () => {
      window.open("https://chat.whatsapp.com/FGLms8EYhpv1o5rkrnIldL", "_blank");
    },
    icon: <InfoCircle size="20" variant="Linear" color="#5b50ff" />,
  });

  // Ajouter l'option de déconnexion
  dropdownItems.push({
    label: "Déconnexion",
    onClick: handleLogout,
    icon: <LogoutCurve size="20" variant="Linear" color="#ef4444" />,
    hasDivider: true,
    variant: "danger",
  });

  // Construire le nom pour l'avatar à partir des données du profil
  const firstName = userData?.me?.profile?.firstName || "";
  const lastName = userData?.me?.profile?.lastName || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  // Récupérer l'URL de la photo de profil si elle existe
  const profilePicture =
    import.meta.env.VITE_API_URL +
      "/" +
      userData?.me?.profile?.profilePicture || "";

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
                <Logo
                  variant="black"
                  withText={true}
                  className="scale-110 transform-gpu"
                />
              </Link>
              <span className="ml-3 text-xs font-medium text-[#5b50ff] border border-[#5b50ff] rounded-full px-2 py-0.5">
                Version Beta
              </span>
            </div>

            <div className="flex items-center">
              <div className="hidden md:flex md:items-center space-x-5">
                {isAuthenticated && (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-sm font-medium text-gray-700 hover:text-[#5b50ff] flex items-center space-x-2 transition-colors"
                    >
                      <HomeTrendUp size={20} className="text-current mr-2" />
                      Tableau de bord
                    </Link>
                    <Button
                      variant="outline"
                      size="md"
                      className="shadow-sm transform hover:translate-y-[-2px]"
                      onClick={() => navigate("/outils")}
                    >
                      Accéder aux outils
                    </Button>

                    {/* Bouton Premium uniquement pour les utilisateurs sans licence premium */}
                    {isAuthenticated &&
                    subscription &&
                    !subscription.licence ? (
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
                    className="bg-[#5b50ff] text-white hover:bg-[#4a41d0] px-4 py-2 rounded-2xl text-md font-medium transition-colors duration-200"
                  >
                    Commencer gratuitement
                    <ArrowRight size={20} color="white" className="ml-2" />
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
                        className="overflow-hidden"
                      />
                      {subscription && subscription.licence && (
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full shadow-sm">
                          <Verify size={20} color="#FFD700" variant="Bold" />
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
