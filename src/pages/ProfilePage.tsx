import { useQuery } from "@apollo/client"
import { useState, useContext, useEffect } from "react"
import { GET_PROFILE } from "../features/profile/graphql/profile"
import { IntegrationsManager } from "../features/integrations/components/IntegrationsManager"
import { PersonalInfoForm } from "../features/profile/components/PersonalInfoForm"
import { CompanyInfoForm } from "../features/profile/components/CompanyInfoForm"
import { CreditCardIcon } from "@heroicons/react/24/outline"
import { CheckBadgeIcon } from "@heroicons/react/24/solid"
import { SubscriptionContext } from "../context/SubscriptionContext.context"
import { Button } from "../components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert"
import { PremiumModal } from "../components/specific/subscription/PremiumModal"
import axios from "axios"
import { SEOHead } from "../components/specific/SEO/SEOHead"
import { LogoLoader } from "../components/common/LogoLoader"
import {
  Building,
  Card,
  InfoCircle,
  Lock1,
  User,
  Verify,
  Link21,
} from "iconsax-react"

export const ProfilePage = () => {
  const { loading, error, data } = useQuery(GET_PROFILE);
  const [activeTab, setActiveTab] = useState<string | null>("profile");
  const { subscription } = useContext(SubscriptionContext);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Vérifier si un onglet est spécifié dans l'URL ou le localStorage
  useEffect(() => {
    // D'abord vérifier l'URL (priorité la plus haute)
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");

    if (
      tabParam &&
      [
        "profile",
        "company",
        "payment",
        "products",
        "security",
        "integrations",
        "clients",
      ].includes(tabParam)
    ) {
      // Mettre à jour l'onglet actif et le sauvegarder dans localStorage
      setActiveTab(tabParam);
      localStorage.setItem("profileActiveTab", tabParam);
    } else {
      // Si aucun onglet n'est spécifié dans l'URL, essayer de récupérer du localStorage
      const savedTab = localStorage.getItem("profileActiveTab");
      if (
        savedTab &&
        [
          "profile",
          "company",
          "payment",
          "products",
          "security",
          "integrations",
          "clients",
        ].includes(savedTab)
      ) {
        setActiveTab(savedTab);
      }
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LogoLoader size="md" />
      </div>
    );
  if (error) return <div>Une erreur est survenue</div>;

  // Initialiser des objets vides si les données sont manquantes
  const profileData = data?.me?.profile || {};
  const companyData = data?.me?.company || {};

  // Nous n'avons plus besoin de cette icône personnalisée car nous utilisons directement CheckBadgeIcon

  // Fonction pour déterminer la couleur des icônes en fonction de l'état actif
  const getIconColor = (tabId: string | null) => {
    return activeTab === tabId ? "#fff" : "#000";
  };

  // Définir les onglets en fonction de l'état d'abonnement
  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: (
        <User
          size="20"
          variant="Linear"
          color={getIconColor("profile")}
          className="w-5 h-5"
        />
      ),
    },
  ];

  // Ajouter l'onglet Entreprise uniquement pour les utilisateurs premium
  if (subscription?.licence) {
    tabs.push({
      id: "company",
      label: "Entreprise",
      icon: (
        <div className="flex items-center justify-between w-full">
          <Building
            size="20"
            variant="Linear"
            color={getIconColor("company")}
            className="w-5 h-5"
          />
          <Verify
            size="20"
            variant="Bold"
            color="#FFD700"
            className="w-5 h-5 ml-4 absolute right-8"
          />
        </div>
      ),
    });

    // Ajouter l'onglet Intégrations pour les utilisateurs premium
    tabs.push({
      id: "integrations",
      label: "Intégrations",
      icon: (
        <div className="flex items-center justify-between w-full">
          <Link21
            size="20"
            variant="Linear"
            color={getIconColor("integrations")}
            className="w-5 h-5"
          />
          <Verify
            size="20"
            variant="Bold"
            color="#FFD700"
            className="w-5 h-5 ml-4 absolute right-8"
          />
        </div>
      ),
    });
  } else {
    // Pour les utilisateurs non premium, ajouter un onglet désactivé
    tabs.push({
      id: "company_locked",
      label: "Entreprise",
      icon: (
        <div className="flex items-center justify-between w-full">
          <Building
            size="20"
            variant="Linear"
            color={getIconColor("company_locked")}
            className="w-5 h-5"
          />
          <Lock1
            size="20"
            variant="Linear"
            color={getIconColor("company_locked")}
            className="w-4 h-4 text-gray-400 ml-4"
          />
        </div>
      ),
    });

    // Ajouter l'onglet Intégrations désactivé pour les utilisateurs non premium
    tabs.push({
      id: "integrations_locked",
      label: "Intégrations",
      icon: (
        <div className="flex items-center justify-between w-full">
          <Link21
            size="20"
            variant="Linear"
            color={getIconColor("integrations_locked")}
            className="w-5 h-5"
          />
          <Lock1
            size="20"
            variant="Linear"
            color={getIconColor("integrations_locked")}
            className="w-4 h-4 text-gray-400 ml-4"
          />
        </div>
      ),
    });
  }

  const handleTabChange = (tabId: string | null) => {
    // Si l'utilisateur clique sur un onglet verrouillé, ouvrir la modal premium
    if (
      tabId === "company_locked" ||
      tabId === "products_locked" ||
      tabId === "clients_locked"
    ) {
      setIsPremiumModalOpen(true);
      return;
    }

    // Mettre à jour l'onglet actif
    setActiveTab(tabId);

    if (tabId) {
      // Sauvegarder l'onglet actif dans localStorage
      localStorage.setItem("profileActiveTab", tabId);

      // Mettre à jour l'URL sans recharger la page
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tabId);
      window.history.pushState({}, "", url.toString());
    }
  };

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
      <SEOHead
        title="Mon Espace | Newbi"
        description="Gérez vos informations personnelles et professionnelles"
        keywords="mon espace, espace personnel, espace professionnel, gestion espace, espace Newbi"
        canonicalUrl="https://www.newbi.fr/profile"
      />
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8 flex justify-between items-start">
          {subscription?.stripeCustomerId && (
            <Button
              onClick={handlePremiumClick}
              variant={subscription?.licence ? "secondary" : "default"}
              className="flex items-center gap-2"
            >
              <Card size="20" variant="Bold" color="#fff" />
              {subscription?.licence
                ? "Gérer mon abonnement"
                : "Passer Premium"}
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Navigation à gauche */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div className="sticky top-[100px] bg-white shadow-sm rounded-2xl p-4">
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="w-32 h-32 rounded-full bg-[#5b50ff]/10 flex items-center justify-center overflow-hidden relative mb-2">
                  {data?.me?.profile?.profilePicture ? (
                    <img
                      src={
                        import.meta.env.VITE_API_URL +
                        "/" +
                        data.me.profile.profilePicture
                      }
                      alt={`${data?.me?.profile?.firstName || ""} ${
                        data?.me?.profile?.lastName || ""
                      }`}
                      className="w-full h-full object-cover"
                    />
                  ) : data?.me?.profile?.avatar ? (
                    <img
                      src={data.me.profile.avatar}
                      alt={`${data?.me?.profile?.firstName || ""} ${
                        data?.me?.profile?.lastName || ""
                      }`}
                      className="w-full h-full object-cover"
                    />
                  ) : data?.me?.profile?.firstName?.[0] ||
                    data?.me?.profile?.lastName?.[0] ? (
                    <span className="text-2xl font-bold text-gray-400">
                      {data?.me?.profile?.firstName?.[0] || ""}
                      {data?.me?.profile?.lastName?.[0] || ""}
                    </span>
                  ) : (
                    <User size="40" variant="Linear" color="#5b50ff" />
                  )}
                  {data?.me?.unreadNotifications > 0 && (
                    <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                        {data.me.unreadNotifications}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 text-lg">
                  {data?.me?.profile?.firstName || ""}{" "}
                  {data?.me?.profile?.lastName || ""}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {data?.me?.profile?.title || "Utilisateur"}
                </p>
              </div>
              <div className="flex flex-col space-y-3">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    className={`w-full justify-start ${activeTab === tab.id ? '' : 'text-gray-700 hover:!bg-[#f0eeff]'}`}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    {tab.icon && <span className="mr-2">{tab.icon}</span>}
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Contenu à droite */}
          <div className="flex-grow space-y-8">
            {activeTab === "profile" && (
              <>
                {/* Informations personnelles */}
                <div className="bg-white shadow-sm rounded-2xl">
                  <div className="px-4 py-5 sm:p-6">
                    <PersonalInfoForm initialData={profileData} />
                  </div>
                </div>
              </>
            )}

            {activeTab === "company" && subscription?.licence && (
              <>
                {/* Informations de l'entreprise */}
                <div className="bg-white shadow-sm rounded-2xl">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                      Informations de l'entreprise
                    </h2>
                    <CompanyInfoForm initialData={companyData} />
                  </div>
                </div>
              </>
            )}



            {(activeTab === "company_locked" ||
              activeTab === "products_locked" ||
              activeTab === "clients_locked" ||
              activeTab === "integrations_locked") && (
              <div className="bg-white shadow-sm rounded-2xl">
                <div className="px-4 py-5 sm:p-6 flex flex-col items-center justify-center text-center">
                  <CheckBadgeIcon className="w-12 h-12 text-yellow-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Fonctionnalité Premium
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                    {activeTab === "company_locked"
                      ? "La gestion des informations de votre entreprise est disponible uniquement pour les comptes Premium."
                      : activeTab === "products_locked"
                      ? "La gestion du catalogue de produits et services est disponible uniquement pour les comptes Premium."
                      : activeTab === "clients_locked"
                      ? "La gestion des clients est disponible uniquement pour les comptes Premium."
                      : "La gestion des intégrations avec d'autres services est disponible uniquement pour les comptes Premium."}
                  </p>
                  <Button
                    onClick={() => setIsPremiumModalOpen(true)}
                    variant="default"
                    className="flex items-center gap-2"
                  >
                    <CreditCardIcon className="h-5 w-5" />
                    Passer Premium
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "integrations" && subscription?.licence && (
              <div className="bg-white shadow-sm rounded-2xl">
                <div className="px-4 py-5 sm:p-6">
                  <IntegrationsManager />
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
