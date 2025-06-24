import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useContext, useState } from "react";
import { SubscriptionContext } from "../../context/SubscriptionContext.context";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Logo } from "../../assets/logo";
import { ButtonLink } from "../";
import { useQuery } from "@apollo/client";
import { GET_PROFILE } from "../../features/profile/graphql";
import axios from "axios";
import { PremiumModal } from "../specific/subscription/PremiumModal";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { ArrowRight, Verify, HomeTrendUp } from "iconsax-react";
import { Badge } from "../ui/badge";

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

  // Créer les éléments du menu déroulant
  const renderDropdownItems = () => {
    const items = [
      // Profil utilisateur
      <DropdownMenuItem 
        key="profile" 
        className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-[#f0eeff] cursor-pointer"
        onClick={handleProfileClick}
      >
        <span>Mon profil</span>
      </DropdownMenuItem>,
    ];

    // Gestion d'abonnement
    if (subscription?.stripeCustomerId) {
      items.push(
        <DropdownMenuItem
          key="subscription"
          className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-[#f0eeff] cursor-pointer"
          onClick={() => isPremium ? handleSubscription() : setIsPremiumModalOpen(true)}
        >
          <span>{isPremium ? "Gérer mon abonnement" : "Passer Premium"}</span>
        </DropdownMenuItem>
      );
    }

    // Séparateur avant la section Communauté
    items.push(<DropdownMenuSeparator key="before-community" className="my-1" />);

    // Communauté (uniquement pour les membres premium)
    if (isPremium) {
      items.push(
        <DropdownMenuItem
          key="community"
          className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-[#f0eeff] cursor-pointer"
          onClick={() => window.open("https://chat.whatsapp.com/FGLms8EYhpv1o5rkrnIldL", "_blank")}
        >
          <span>Communauté</span>
        </DropdownMenuItem>
      );
    }

    // Aide
    items.push(
      <DropdownMenuItem
        key="help"
        className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-[#f0eeff] cursor-pointer"
        onClick={() => window.open("https://chat.whatsapp.com/FGLms8EYhpv1o5rkrnIldL", "_blank")}
      >
        <span>Aide</span>
      </DropdownMenuItem>
    );

    // Séparateur avant la déconnexion
    items.push(<DropdownMenuSeparator key="separator" className="my-1" />);

    // Déconnexion
    items.push(
      <DropdownMenuItem
        key="logout"
        className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-red-50 cursor-pointer text-red-500"
        onClick={handleLogout}
      >
        <span>Déconnexion</span>
      </DropdownMenuItem>
    );

    return items;
  };

  // Construire le nom pour l'avatar à partir des données du profil
  const firstName = userData?.me?.profile?.firstName || "";
  const lastName = userData?.me?.profile?.lastName || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  // Récupérer l'URL de la photo de profil si elle existe
  const profilePicture =
    import.meta.env.VITE_API_URL +
      "/" +
      userData?.me?.profile?.profilePicture || "";

  // Générer les initiales pour l'avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const avatarTrigger = (
    <div className="relative">
      <Avatar className="h-10 w-10 border-2 border-white">
        {profilePicture && (
          <AvatarImage src={profilePicture} alt={fullName} />
        )}
        <AvatarFallback className="bg-[#5b50ff] text-white font-medium">
          {fullName ? getInitials(fullName) : 'US'}
        </AvatarFallback>
      </Avatar>
      {subscription?.licence && (
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
          <Verify size={16} color="#FFD700" variant="Bold" />
        </div>
      )}
    </div>
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
              <Badge variant="outline" className="ml-3 font-medium">
                Version Beta
              </Badge>
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
                      size="default"
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
                  <div className="relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="outline-none">
                          {avatarTrigger}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        className="w-72 p-2 border border-gray-200 shadow-lg rounded-lg bg-white z-[1001]"
                        align="end"
                        sideOffset={8}
                        alignOffset={-10}
                        side="bottom"
                      >
                        {renderDropdownItems()}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
