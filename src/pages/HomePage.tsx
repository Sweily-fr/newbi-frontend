import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ButtonLink } from "../components/";
import { SEOHead } from "../components/specific/SEO/SEOHead";
import {
  SchemaMarkup,
  FAQSchema,
} from "../components/specific/SEO/SchemaMarkup";
import {
  StarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowRight2,
  Note1,
  TickCircle,
  Timer,
  ClipboardTick,
  Document,
  ArrowRight,
  Card,
  Star1,
  DocumentText,
  ArchiveMinus,
  ArrowDown2,
  ArrowUp2,
} from "iconsax-react";

export const HomePage = () => {
  const { isAuthenticated } = useAuth();

  // Fonction pour déterminer le chemin de redirection en fonction de l'authentification
  const getRedirectPath = (toolPath: string) => {
    return isAuthenticated ? toolPath : "/auth";
  };

  // État pour gérer l'ouverture/fermeture des questions FAQ
  const [openFAQs, setOpenFAQs] = useState<number[]>([]);

  // Fonction pour basculer l'état d'une question
  const toggleFAQ = (index: number) => {
    setOpenFAQs((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const scrollToSection =
    (sectionId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    };

  const [billingPeriod, setBillingPeriod] = useState("annual");

  // FAQ items pour le schema.org
  const faqItems = [
    {
      question: "Comment créer une facture avec Newbi ?",
      answer:
        "Créez un compte gratuit, accédez à l'outil de facturation, remplissez les informations requises et générez votre facture en PDF ou envoyez-la par email en 1 clic.",
    },
    {
      question:
        "Vos factures sont-elles conformes à la législation française ?",
      answer:
        "Oui, notre solution respecte la réglementation française (mentions obligatoires, numérotation, archivage, sécurité RGPD, etc.).",
    },
    {
      question: "Puis-je utiliser Newbi sur mobile ?",
      answer:
        "Oui, Newbi est entièrement responsive et s'adapte à tous les appareils : ordinateurs, tablettes et smartphones. Vous pouvez gérer votre entreprise où que vous soyez.",
    },
    {
      question: "Comment fonctionne l'abonnement Premium ?",
      answer:
        "L'abonnement Premium vous donne accès à toutes les fonctionnalités avancées de Newbi pour 14,99€/mois. Vous pouvez l'essayer gratuitement pendant 14 jours et annuler à tout moment sans engagement.",
    },
    {
      question: "Mes données sont-elles sécurisées avec Newbi ?",
      answer:
        "Absolument. Nous utilisons un chiffrement de bout en bout et respectons scrupuleusement le RGPD. Vos données sont stockées sur des serveurs sécurisés en France et ne sont jamais partagées avec des tiers.",
    },
    {
      question: "Comment obtenir de l'aide si j'ai un problème ?",
      answer:
        "Notre équipe de support française est disponible par email à contact@newbi.fr. Les utilisateurs Premium bénéficient également d'un support prioritaire avec des temps de réponse garantis sous 24h.",
    },
  ];

  return (
    <>
      <SEOHead
        title="Facturation, Devis & Outils Pros | Newbi"
        description="Simplifiez votre gestion d'entreprise avec Newbi : facturation en ligne, devis, gestion de clients, outils pros, RGPD, sécurité, support français. Essai gratuit, sans engagement."
        keywords="facturation, devis, gestion clients, outils professionnels, RGPD, auto-entrepreneur, freelance, TPE, PME"
        canonicalUrl="https://newbi.fr/"
      />

      {/* Données structurées Organization */}
      <SchemaMarkup
        type="Organization"
        name="Newbi"
        description="Simplifiez votre gestion d'entreprise avec Newbi : facturation en ligne, devis, gestion de clients, outils pros, RGPD, sécurité, support français."
        url="https://newbi.fr/"
        additionalData={{
          logo: "https://newbi.fr/images/PNG/Logo_Texte_Purple.png",
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: "+33-02-21-85-02-40",
              contactType: "customer support",
              areaServed: "FR",
              availableLanguage: ["French"],
            },
          ],
          sameAs: ["https://www.linkedin.com/company/newbi/"],
        }}
      />

      {/* Données structurées FAQ */}
      <FAQSchema items={faqItems} />
      <div className="bg-white" role="main">
        {/* Grid background with 6 columns - Fixed to viewport */}
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
          <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-full w-full relative">
              {/* Left border (solid) */}
              <div className="absolute left-0 top-0 h-full w-px bg-gray-200"></div>

              {/* Interior borders (dashed) */}
              <div className="absolute left-[25%] top-0 h-full w-px border-l border-dashed border-gray-200"></div>
              <div className="absolute left-[50%] top-0 h-full w-px border-l border-dashed border-gray-200"></div>
              <div className="absolute left-[75%] top-0 h-full w-px border-l border-dashed border-gray-200"></div>

              {/* Right border (solid) */}
              <div className="absolute right-0 top-0 h-full w-px bg-gray-200"></div>
            </div>
          </div>
        </div>

        {/* Wrapper for all content with relative positioning */}
        <div className="relative z-10">
          {/* Hero section - Proposition de valeur */}
          <div className="relative overflow-hidden py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center relative">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
                  Simplifiez votre gestion d'entreprise
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-amber-500 to-purple-600">
                    factures, devis et outils professionnels
                  </span>
                </h1>
                <p className="mt-3 text-xl text-gray-500 max-w-3xl mx-auto">
                  Gérez vos factures et devis en toute simplicité et développez
                  votre activité. Notre suite d'outils professionnels vous
                  permet de vous concentrer sur l'essentiel : votre entreprise.
                </p>

                <div className="mt-10 max-w-xl mx-auto">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <ButtonLink
                      to="/auth"
                      variant="primary"
                      size="md"
                      fullWidth
                      className="sm:w-auto px-8 py-4 text-lg font-normal"
                    >
                      <TickCircle
                        color="white"
                        size={20}
                        className="mr-3 inline-block"
                      />
                      COMMENCER GRATUITEMENT
                    </ButtonLink>
                    <a
                      href="#pricing-section"
                      onClick={scrollToSection("pricing-section")}
                      className="w-full sm:w-auto rounded-2xl flex items-center justify-center px-8 py-4 border border-gray-300 text-md font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                    >
                      <span>Tarifs</span>
                      <ArrowRight2
                        className="h-5 w-5 ml-2 inline-block"
                        color="gray"
                      />
                    </a>
                  </div>
                </div>

                <div className="mt-12">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex -space-x-2">
                      <img
                        className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                        src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                      <img
                        className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                        src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                      <img
                        className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                        alt=""
                      />
                      <img
                        className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      Utilisé par plus de{" "}
                      <span className="text-[#5b50ff] font-bold">1000+</span>{" "}
                      clients satisfaits en France
                    </p>
                  </div>
                </div>
              </div>
              {/* Comment ça marche - Interface de gestion de tâches */}
              <div className="bg-transparent py-16 sm:py-24" id="how-it-works">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Interface de gestion de tâches */}
                  <div className="rounded-[24px] shadow-lg overflow-visible border border-gray-200 bg-transparent backdrop-blur-[2px] relative">
                    {/* Petites cartes flottantes */}
                    <div className="absolute top-12 -right-16 w-40 h-26 bg-white rounded-2xl shadow-lg transform -rotate-6 z-40 overflow-hidden border border-gray-200">
                      <div className="h-1.5 w-full bg-gradient-to-r from-red-500 to-amber-500"></div>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-16 h-2.5 bg-gray-200 rounded-full"></div>
                          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full mb-2"></div>
                        <div className="w-3/4 h-2 bg-gray-200 rounded-full mb-2"></div>
                        <div className="flex justify-between items-center">
                          <div className="w-10 h-2 bg-gray-200 rounded-full"></div>
                          <div className="text-xs font-bold text-red-500">
                            1 250 €
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-20 -left-12 w-36 h-24 bg-white rounded-2xl shadow-lg transform rotate-12 z-40 overflow-hidden border border-gray-200">
                      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-purple-600"></div>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-14 h-2.5 bg-gray-200 rounded-full"></div>
                          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                            <div className="w-3 h-3 bg-purple-600 rounded-sm"></div>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full mb-2"></div>
                        <div className="w-2/3 h-2 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>

                    {/* Carte flottante supplémentaire */}
                    <div className="absolute top-40 -left-20 w-32 h-34 bg-white rounded-2xl shadow-lg transform -rotate-12 z-40 overflow-hidden border border-gray-200">
                      <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-red-500 to-amber-500"></div>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-12 h-2.5 bg-gray-200 rounded-full"></div>
                          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                            <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full mb-2"></div>
                        <div className="w-3/4 h-2 bg-gray-200 rounded-full mb-2"></div>
                        <div className="w-1/2 h-2 bg-gray-200 rounded-full mb-2"></div>
                        <div className="flex justify-between items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
                          </div>
                          <div className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-600">
                            3 500 €
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Header de l'interface */}
                    <div className="bg-white/30 p-4 border-b border-gray-200 flex items-center justify-between relative z-20">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
                          <Note1 color="green" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Gestion des factures et devis
                          </h3>
                          <p className="text-xs text-gray-500">
                            Dernière mise à jour : aujourd'hui
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 italic">
                          {new Date().toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Tableau des factures et devis */}
                    <div className="overflow-hidden bg-transparent relative z-20">
                      <table className="min-w-full divide-y divide-gray-200 bg-transparent">
                        <thead className="bg-transparent">
                          <tr className="bg-transparent hover:bg-white/20 transition-colors duration-150">
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3"
                            >
                              Référence
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Statut
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Client
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Montant
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Document
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-gray-200">
                          <tr className="bg-transparent hover:bg-white/20 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                FACT-2024-0103
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-[16px] shadow-sm transition-all duration-200 bg-[#ecfdf5] text-[#10b981] border border-[#d1fae5]">
                                <ClipboardTick
                                  size={16}
                                  variant="Bold"
                                  className="mr-2"
                                  color="#10b981"
                                />
                                Payée
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              15 mars 2024
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Dupont SARL
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              1 250,00 €
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                              facture_dupont.pdf
                            </td>
                          </tr>
                          <tr className="bg-transparent hover:bg-white/20 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                DEVIS-2024-0089
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-[16px] shadow-sm transition-all duration-200 bg-[#fffbeb] text-[#f59e0b] border border-[#fef3c7]">
                                <Timer
                                  size={16}
                                  variant="Bold"
                                  className="mr-2"
                                  color="#f59e0b"
                                />
                                En attente
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              24 mars 2024
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Martin & Fils
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              3 780,50 €
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                              devis_martin.pdf
                            </td>
                          </tr>
                          <tr className="bg-transparent hover:bg-white/20 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                FACT-2024-0102
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-[16px] shadow-sm transition-all duration-200 bg-[#ecfdf5] text-[#10b981] border border-[#d1fae5]">
                                <ClipboardTick
                                  size={16}
                                  variant="Bold"
                                  className="mr-2"
                                  color="#10b981"
                                />
                                Payée
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              10 février 2024
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Petit Consulting
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              950,00 €
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                              facture_petit.pdf
                            </td>
                          </tr>
                          <tr className="bg-transparent hover:bg-white/20 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                DEVIS-2024-0088
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-[16px] shadow-sm transition-all duration-200 bg-[#f0eeff] text-[#5b50ff] border border-[#e6e1ff]">
                                <TickCircle
                                  size={16}
                                  variant="Bold"
                                  className="mr-2"
                                  color="#5b50ff"
                                />
                                Accepté
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              18 mars 2024
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Dubois Entreprise
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              5 420,75 €
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                              devis_dubois.pdf
                            </td>
                          </tr>
                          <tr className="bg-transparent hover:bg-white/20 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                FACT-2024-0104
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-[16px] shadow-sm transition-all duration-200 bg-[#fffbeb] text-[#f59e0b] border border-[#fef3c7]">
                                <Timer
                                  size={16}
                                  variant="Bold"
                                  className="mr-2"
                                  color="#f59e0b"
                                />
                                En attente
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              22 mars 2024
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Moreau SAS
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              2 840,30 €
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                              facture_moreau.pdf
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pourquoi nous choisir - Style Stripe avec blocs */}
          <div className="bg-blue-50/50 py-24" id="benefits-section">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-sm font-semibold text-[#5b50ff] tracking-wide uppercase">
                  POURQUOI NOUS CHOISIR ?
                </h2>
                <p className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Simplifiez votre gestion d'entreprise
                </p>
                <p className="mt-4 max-w-2xl text-xl text-gray-500">
                  Optez pour une solution intuitive avec nos outils faciles à
                  utiliser, un support client réactif, des options tarifaires
                  flexibles et des prix hautement compétitifs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 px-4 sm:px-6 lg:px-8 lg:grid-cols-3 gap-6 mb-16">
                {/* Bénéfice 1 - Gestion des factures */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100">
                      <Document
                        className="h-5 w-5 text-emerald-600"
                        aria-hidden="true"
                        color="#10b981"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Gestion des factures
                    </h3>
                  </div>
                  <p className="text-base text-gray-600 leading-relaxed mb-5">
                    Créez et gérez facilement vos factures professionnelles.
                    Suivez les paiements et automatisez les relances.
                  </p>

                  {/* Exemple de facture */}
                  <div className="bg-gray-50 rounded-2xl p-4 mb-4 relative flex-grow">
                    <div className="absolute top-0 right-0 p-1">
                      <span className="inline-block w-4 h-4 bg-gray-200 rounded-full"></span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-3 text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold">Facture #2023-42</span>
                        <span>28/03/2025</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Service de consultation</span>
                          <span>450,00 €</span>
                        </div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Développement web</span>
                          <span>850,00 €</span>
                        </div>
                        <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
                          <span>Total</span>
                          <span>1 300,00 €</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Link
                      to={getRedirectPath("/factures")}
                      className="text-base font-medium text-emerald-600 hover:text-emerald-800 group"
                    >
                      Créer une facture{" "}
                      <ArrowRight
                        color="#10b981"
                        size={20}
                        aria-hidden="true"
                        className="inline-block transform group-hover:translate-x-1 transition-transform duration-200"
                      />
                    </Link>
                  </div>
                </div>

                {/* Bénéfice 2 - Gestion des devis */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-amber-100">
                      <Card
                        color="#f59e0b"
                        className="h-5 w-5 text-amber-600"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Gestion des devis
                    </h3>
                  </div>
                  <p className="text-base text-gray-600 leading-relaxed mb-5">
                    Créez des devis professionnels en quelques clics et
                    convertissez-les facilement en factures.
                  </p>

                  {/* Bulle de chat */}
                  <div className="bg-gray-50 rounded-2xl p-4 mb-4 relative flex-grow">
                    <div className="absolute top-0 right-0 p-1">
                      <span className="inline-block w-4 h-4 bg-gray-200 rounded-full"></span>
                    </div>
                    <div className="mb-2 bg-yellow-100 rounded-2xl p-2 text-sm inline-block max-w-[90%]">
                      <p className="text-gray-700">
                        Comment personnaliser mes devis ?
                      </p>
                    </div>
                    <div className="mb-2 bg-gray-200 rounded-2xl p-2 text-sm inline-block max-w-[90%]">
                      <p className="text-gray-700">
                        Vous pouvez ajouter votre logo et modifier les
                        conditions.
                      </p>
                    </div>
                    <div className="mb-2 bg-gray-200 rounded-2xl p-2 text-sm inline-block max-w-[90%]">
                      <p className="text-gray-700">
                        Essayez notre éditeur de devis dans les outils.
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Link
                      to={getRedirectPath("/devis")}
                      className="text-base font-medium text-amber-600 hover:text-amber-800 group"
                    >
                      Créer un devis{" "}
                      <ArrowRight
                        color="#f59e0b"
                        size={20}
                        aria-hidden="true"
                        className="inline-block transform group-hover:translate-x-1 transition-transform duration-200"
                      />
                    </Link>
                  </div>
                </div>

                {/* Bénéfice 3 - Créateur de Signature Email */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100">
                      <Star1
                        color="#60a5fa"
                        className="h-5 w-5 text-indigo-600"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Signature Email
                    </h3>
                  </div>
                  <p className="text-base text-gray-600 leading-relaxed mb-5">
                    Créez des signatures email professionnelles qui renforcent
                    votre image de marque.
                  </p>

                  {/* Exemple de signature */}
                  <div className="bg-gray-50 rounded-2xl p-4 mb-4 relative flex-grow">
                    <div className="absolute top-0 right-0 p-1">
                      <span className="inline-block w-4 h-4 bg-gray-200 rounded-full"></span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-3 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                          JD
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Jean Dupont</p>
                          <p className="text-gray-700">Directeur Commercial</p>
                          <p className="text-gray-700 text-xs mt-1">Newbi</p>
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-600">
                              +33 6 12 34 56 78
                            </p>
                            <p className="text-xs text-indigo-600">
                              jean.dupont@newbi.fr
                            </p>
                            <p className="text-xs text-gray-600">
                              www.newbi.fr
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Link
                      to={getRedirectPath("/signatures-email")}
                      className="text-base font-medium text-[#5b50ff] hover:text-[#5b50ff] group"
                    >
                      Créer ma signature{" "}
                      <ArrowRight
                        color="#5b50ff"
                        size={20}
                        aria-hidden="true"
                        className="inline-block transform group-hover:translate-x-1 transition-transform duration-200"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* À propos section */}
          <div
            id="about-section"
            className="bg-transparent px-4 sm:px-6 lg:px-8 py-24 border-t border-gray-100"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-16 px-4 sm:px-6 lg:px-8">
                <h2 className="text-sm font-semibold text-[#5b50ff] tracking-wide uppercase">
                  RÉINVENTION D'ENTREPRISE
                </h2>
                <h3 className="mt-3 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                  Apportez de l'agilité
                  <br className="hidden md:block" /> à votre entreprise
                </h3>
                <p className="mt-6 max-w-3xl text-lg md:text-xl text-gray-500 leading-relaxed">
                  Chez Newbi, nous simplifions la gestion de votre entreprise en
                  vous permettant de créer rapidement des expériences de
                  facturation exceptionnelles, d'améliorer vos performances et
                  de vous développer sur de nouveaux marchés
                </p>

                <div className="mt-10">
                  <ButtonLink
                    to="/contact"
                    variant="primary"
                    size="lg"
                    className="inline-flex items-center"
                  >
                    NEWBI GRATUITEMENT
                    <ArrowRight size={20} color="#fff" className="ml-2" />
                  </ButtonLink>
                </div>
              </div>

              <div className="mt-20 flex flex-col md:flex-row gap-8 md:gap-12 px-4 sm:px-6 lg:px-8">
                <div className="md:w-1/4">
                  <div className="flex flex-col space-y-12">
                    <div className="flex items-start">
                      <div className="w-1 h-12 bg-[#5b50ff] mr-4"></div>
                      <div>
                        <div className="text-5xl font-bold text-gray-900">
                          100%
                        </div>
                        <div className="mt-1 text-gray-500 text-sm">
                          sécurisé
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-1 h-12 bg-[#5b50ff] mr-4"></div>
                      <div>
                        <div className="text-5xl font-bold text-gray-900">
                          100%
                        </div>
                        <div className="mt-1 text-gray-500 text-sm">
                          Agilité
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-medium text-gray-900 mb-4">
                        Produits utilisés
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-3">
                            <div className="h-7 w-7 bg-red-500 rounded-lg flex items-center justify-center">
                              <DocumentText size={20} color="#fff" />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            Facturation
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-3">
                            <div className="h-7 w-7 bg-green-500 rounded-lg flex items-center justify-center">
                              <DocumentText size={20} color="#fff" />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            Devis
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-3">
                            <div className="h-7 w-7 bg-[#5b50ff] rounded-lg flex items-center justify-center">
                              <Star1 size={20} color="#fff" />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            Signatures Email
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-3/4 bg-gradient-to-r from-red-400 to-red-500 rounded-2xl overflow-hidden relative">
                  <div className="absolute top-4 right-4 bg-white rounded-full p-2">
                    <ArchiveMinus size={20} color="red" variant="Bulk" />
                  </div>
                  <div className="p-8 text-white">
                    <div className="flex items-center mb-6">
                      <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center mr-3">
                        <span className="text-red-500 font-bold text-xs">
                          Offre
                        </span>
                      </div>
                      <h3 className="text-xl font-bold">TOUT à 1€.</h3>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">
                      Profitez dès maintenant de 6 mois à 1€/mois pour explorer
                      nos solutions innovantes. Inscrivez-vous avant le 31 Août
                      2025 pour bénéficier de cette offre exclusive.
                    </h2>
                    <p className="text-white/80 mb-6">
                      Optimisation des factures, des devis et signatures email
                      professionnelles pour une image de marque cohérente et
                      bien plus encore.
                    </p>
                    <a
                      href="/auth"
                      className="text-white font-medium hover:underline flex items-center"
                    >
                      S'inscrire gratuitement
                      <ArrowRight size={20} color="#fff" className="ml-2" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-24 border-t border-gray-200 pt-12 flex justify-between items-center px-4 sm:px-6 lg:px-8 flex-wrap gap-12">
                <div className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-1/5 max-w-[180px]">
                  <div className="h-16 w-full bg-white rounded-sm py-2 flex items-center justify-center">
                    <img
                      src="/images/reference/heritage_logo.png"
                      alt="Heritage Logo"
                      className="h-full w-auto max-w-full object-contain"
                    />
                  </div>
                </div>
                <div className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-1/5 max-w-[180px]">
                  <div className="h-16 w-full bg-white rounded-sm px-6 py-2 flex items-center justify-center">
                    <img
                      src="/images/reference/Logo-Sweily-noir.png"
                      alt="Sweily Logo"
                      className="h-full w-auto max-w-full object-contain"
                    />
                  </div>
                </div>
                <div className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-1/5 max-w-[180px]">
                  <div className="h-16 w-full bg-white rounded-sm py-2 flex items-center justify-center">
                    <img
                      src="/images/reference/mademoisellelilli_logo.png"
                      alt="Mademoiselle Lilli Logo"
                      className="h-full w-auto max-w-full object-contain"
                    />
                  </div>
                </div>
                <div className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-1/5 max-w-[180px]">
                  <div className="h-16 w-full bg-white rounded-sm px-6 py-2 flex items-center justify-center">
                    <img
                      src="/images/reference/smefrance_logo.png"
                      alt="SME France Logo"
                      className="h-full w-auto max-w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Preuve sociale 2 : Les avis */}
          <div className="bg-blue-50/50 py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-base font-semibold text-[#5b50ff] tracking-wide uppercase">
                  TÉMOIGNAGES
                </h2>
                <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Ce que nos clients disent de nous
                </p>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                  Découvrez pourquoi nos clients nous font confiance pour leur
                  gestion quotidienne.
                </p>
              </div>

              <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-8">
                {/* Témoignage 1 */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <img
                        src="https://randomuser.me/api/portraits/women/44.jpg"
                        alt="Avatar de Marine Dupuy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        Marine Dupuy
                      </h4>
                      <p className="text-sm text-gray-500">
                        Consultante indépendante
                      </p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600">
                    "Depuis que j'utilise cette plateforme, j'ai gagné un temps
                    précieux sur ma facturation. Mes clients sont impressionnés
                    par le professionnalisme des documents."
                  </p>
                </div>

                {/* Témoignage 2 */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="Avatar de Pedro Marques"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        Pedro Marques
                      </h4>
                      <p className="text-sm text-gray-500">Dirigeant</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600">
                    "Un outil indispensable pour tout entrepreneur qui veut se
                    concentrer sur son cœur de métier plutôt que sur
                    l'administratif. Je recommande vivement !"
                  </p>
                </div>

                {/* Témoignage 3 */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <img
                        src="https://randomuser.me/api/portraits/men/68.jpg"
                        alt="Avatar de Christian Tavares"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        Christian Tavares
                      </h4>
                      <p className="text-sm text-gray-500">Dirigeant</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600">
                    "La plateforme est intuitive et les outils sont vraiment
                    adaptés à mes besoins. Le support client est également très
                    réactif."
                  </p>
                </div>
              </div>

              {/* CTA en dessous des avis */}
              <div className="mt-16 bg-[#5b50ff] rounded-2xl shadow-xl mx-4 sm:mx-6 lg:mx-8 overflow-hidden">
                <div className="px-6 py-12 sm:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between">
                  <div className="text-center md:text-left mb-8 md:mb-0">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                      Prêt à simplifier votre gestion d'entreprise ?
                    </h2>
                    <p className="mt-3 text-lg text-blue-100 max-w-3xl">
                      Rejoignez des milliers d'entrepreneurs qui ont transformé
                      leur façon de gérer leur activité. Essayez gratuitement
                      pendant 14 jours, sans engagement.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link
                      to="/auth"
                      className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-2xl text-[#5b50ff] bg-white md:py-4 md:text-lg md:px-10 transition-all duration-200 shadow-lg whitespace-nowrap"
                    >
                      S'inscrire gratuitement
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing section */}
          <div
            id="pricing-section"
            className="bg-transparent py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p className="text-base font-semibold text-[#5b50ff] tracking-wide uppercase">
                  TARIFS
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
                  Choisissez le plan qui correspond à vos besoins
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                  Nos formules flexibles vous offrent tous les outils
                  nécessaires pour optimiser votre activité.
                </p>
              </div>

              <div className="mt-12 bg-transparent px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl">
                  {/* Fond dégradé comme sur l'image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-amber-100 opacity-80 rounded-3xl"></div>

                  {/* Bordure glacée */}
                  <div
                    className="absolute inset-0 rounded-3xl border-[16px] border-white/50 shadow-xl"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)",
                      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                      backdropFilter: "blur(4px)",
                      WebkitBackdropFilter: "blur(4px)",
                    }}
                  ></div>

                  <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                      Tarification adaptée à tous
                    </h2>

                    <p className="text-center text-gray-700 mb-6 max-w-2xl mx-auto">
                      Inscrivez-vous gratuitement à Newbi avant de prendre un
                      plan payant.
                      <span className="font-medium text-[#5b50ff]">
                        14 jours d'essais offerts
                      </span>{" "}
                      et possibilité de résilier à tout moment sans condition.
                    </p>

                    {/* Sélecteur de période */}
                    <div className="flex justify-center mb-10">
                      <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                        <button
                          onClick={() => setBillingPeriod("monthly")}
                          className={`${
                            billingPeriod === "monthly"
                              ? "bg-white shadow-sm"
                              : "bg-transparent hover:bg-gray-200"
                          } px-4 py-2 rounded-md text-sm font-medium transition-all duration-200`}
                        >
                          Mensuel
                        </button>
                        <button
                          onClick={() => setBillingPeriod("annual")}
                          className={`${
                            billingPeriod === "annual"
                              ? "bg-white shadow-sm"
                              : "bg-transparent hover:bg-gray-200"
                          } px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative`}
                        >
                          Annuel
                          <span className="absolute -top-2 -right-2 bg-[#5b50ff] text-white text-xs px-1.5 py-0.5 rounded-full">
                            -10%
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8">
                      {/* Carte Standard */}
                      <div className="bg-white rounded-2xl shadow-md p-8 flex-1 max-w-md mx-auto lg:mx-0 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          Premium
                        </h3>
                        <p className="text-gray-600 h-24">
                          Accédez à tous les outils de Newbi avec une
                          tarification simple et transparente. Sans frais
                          cachés.
                        </p>

                        {(() => {
                          const monthlyPrice = 14.99;
                          const discountRate = 0.1;
                          const discountedMonthly =
                            monthlyPrice * (1 - discountRate);
                          const monthsInYear = 12;
                          const annualTotal = discountedMonthly * monthsInYear;
                          // const savings = monthlyTotal - annualTotal;
                          if (billingPeriod === "monthly") {
                            return (
                              <div className="flex items-baseline mb-2">
                                <span className="text-4xl font-extrabold text-gray-900">
                                  {monthlyPrice.toFixed(2).replace(".", ",")}€
                                </span>
                                <span className="text-gray-500 ml-2">
                                  /mois
                                </span>
                              </div>
                            );
                          } else {
                            return (
                              <div className="flex items-baseline mb-2">
                                <span className="text-4xl font-extrabold text-gray-900">
                                  {discountedMonthly
                                    .toFixed(2)
                                    .replace(".", ",")}
                                  €
                                </span>
                                <span className="text-gray-500 ml-2">
                                  /mois
                                </span>
                                <span className="text-gray-500 ml-2">
                                  ({annualTotal.toFixed(2).replace(".", ",")}
                                  €/an)
                                </span>
                              </div>
                            );
                          }
                        })()}

                        {(() => {
                          const monthlyPrice = 14.99;

                          // const savings = monthlyTotal - annualTotal;
                          if (billingPeriod === "monthly") {
                            return (
                              <div className="text-sm text-gray-500 mb-6">
                                Passez à l'annuel et économisez 10%
                              </div>
                            );
                          } else {
                            return (
                              <div className="text-sm text-green-500 mb-6">
                                <span className="line-through mr-1">
                                  {monthlyPrice.toFixed(2).replace(".", ",")}€
                                </span>
                                Économisez 10% par an
                              </div>
                            );
                          }
                        })()}

                        <ul className="space-y-3 mb-8">
                          <li className="flex items-start">
                            <div className="flex-shrink-0">
                              <TickCircle color="#5b50ff" variant="Bold" size={24}/>
                            </div>
                            <span className="ml-3 text-gray-600">
                              Accès à tous les outils
                            </span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0">
                              <TickCircle color="#5b50ff" variant="Bold" size={24}/>
                            </div>
                            <span className="ml-3 text-gray-600">
                              Facturation et devis illimités
                            </span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0">
                              <TickCircle color="#5b50ff" variant="Bold" size={24}/>
                            </div>
                            <span className="ml-3 text-gray-600">
                              Signatures email personnalisées
                            </span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0">
                              <TickCircle color="#5b50ff" variant="Bold" size={24}/>
                            </div>
                            <span className="ml-3 text-gray-600">
                              Support client prioritaire
                            </span>
                          </li>
                        </ul>

                        <ButtonLink
                          to="/auth"
                          variant="primary"
                          size="lg"
                          className="w-full justify-center"
                        >
                          Commencer maintenant
                        </ButtonLink>

                        <div className="mt-6 space-y-3">
                          {/* Mise en avant du mois gratuit */}
                          <li className="flex items-start bg-blue-50 p-3 rounded-2xl mb-2">
                            <div className="flex-shrink-0">
                              <TickCircle color="#5b50ff" variant="Bold" size={24}/>
                            </div>
                            <span className="ml-3 text-[#5b50ff] font-medium">
                              14 jours d'essais gratuits
                            </span>
                          </li>
                          {/* Mise en avant du sans engagement */}
                          <li className="flex items-start bg-green-50 p-3 rounded-2xl mb-4">
                            <div className="flex-shrink-0">
                              <TickCircle color="#22c55b" variant="Bold" size={24}/>
                            </div>
                            <span className="ml-3 text-[#22c55b] font-medium">
                              Sans engagement - résiliez à tout moment
                            </span>
                          </li>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ section */}
          <div id="faq-section" className="bg-[#f0eeff] py-16 sm:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-base font-semibold text-[#5b50ff] tracking-wide uppercase">
                  FAQ
                </h2>
                <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Questions fréquemment posées
                </p>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                  Vous avez des questions ? Nous avons les réponses.
                </p>
              </div>

              <div className="mt-12 px-4 sm:px-6 lg:px-8">
                <div className="space-y-4 divide-y divide-gray-200 ">
                  {/* Question 1 */}
                  <div className="pt-4">
                    <button
                      onClick={() => toggleFAQ(0)}
                      className="w-full flex justify-between items-center text-left focus:outline-none"
                    >
                      <h3 className="text-lg font-medium text-gray-900">
                        Comment créer ma première facture ou mon premier devis ?
                      </h3>
                      <span className="ml-6 flex-shrink-0">
                        {openFAQs.includes(0) ? (
                          <ArrowUp2 color="#5b50ff" variant="Outline" size={24}/>
                        ) : (
                          <ArrowDown2 color="#5b50ff" variant="Outline" size={24}/>
                        )}
                      </span>
                    </button>
                    {openFAQs.includes(0) && (
                      <div className="mt-2 pr-12 text-base text-gray-500">
                        <p>
                          Après votre inscription, accédez à l'outil de
                          facturation ou de devis depuis votre tableau de bord.
                          Cliquez sur "Créer une facture" ou "Créer un devis",
                          remplissez les informations de votre client, ajoutez
                          vos produits ou services, et personnalisez votre
                          document selon vos besoins. Vous pouvez ensuite le
                          télécharger en PDF ou l'envoyer directement à votre
                          client.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Question 2 */}
                  <div className="pt-4">
                    <button
                      onClick={() => toggleFAQ(1)}
                      className="w-full flex justify-between items-center text-left focus:outline-none"
                    >
                      <h3 className="text-lg font-medium text-gray-900">
                        Mes documents sont-ils conformes à la législation
                        française ?
                      </h3>
                      <span className="ml-6 flex-shrink-0">
                        {openFAQs.includes(1) ? (
                          <ArrowUp2 color="#5b50ff" variant="Outline" size={24}/>
                        ) : (
                          <ArrowDown2 color="#5b50ff" variant="Outline" size={24}/>
                        )}
                      </span>
                    </button>
                    {openFAQs.includes(1) && (
                      <div className="mt-2 pr-12 text-base text-gray-500">
                        <p>
                          Absolument. Tous nos modèles de factures et devis sont
                          conformes aux exigences légales françaises et
                          européennes. Ils incluent toutes les mentions
                          obligatoires (numéro de facture, date, coordonnées,
                          TVA, conditions de paiement, etc.) et sont
                          régulièrement mis à jour pour rester en conformité
                          avec les évolutions législatives. Vous pouvez utiliser
                          nos documents en toute sérénité pour votre activité
                          professionnelle.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Question 3 */}
                  <div className="pt-4">
                    <button
                      onClick={() => toggleFAQ(2)}
                      className="w-full flex justify-between items-center text-left focus:outline-none"
                    >
                      <h3 className="text-lg font-medium text-gray-900">
                        Comment convertir un devis accepté en facture ?
                      </h3>
                      <span className="ml-6 flex-shrink-0">
                        {openFAQs.includes(2) ? (
                          <ArrowUp2 color="#5b50ff" variant="Outline" size={24}/>
                        ) : (
                          <ArrowDown2 color="#5b50ff" variant="Outline" size={24}/>
                        )}
                      </span>
                    </button>
                    {openFAQs.includes(2) && (
                      <div className="mt-2 pr-12 text-base text-gray-500">
                        <p>
                          C'est très simple ! Lorsqu'un client accepte votre
                          devis, ouvrez-le dans votre espace et cliquez sur le
                          bouton "Convertir en facture". Toutes les informations
                          du devis (client, articles, montants) seront
                          automatiquement transférées vers une nouvelle facture.
                          Vous pouvez également créer une facture d'acompte à
                          partir d'un devis, avec la possibilité de définir un
                          pourcentage du montant total. Notre système génère
                          automatiquement un numéro de facture séquentiel pour
                          garantir une numérotation conforme.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Question 4 */}
                  <div className="pt-4">
                    <button
                      onClick={() => toggleFAQ(3)}
                      className="w-full flex justify-between items-center text-left focus:outline-none"
                    >
                      <h3 className="text-lg font-medium text-gray-900">
                        Puis-je personnaliser l'apparence de mes documents ?
                      </h3>
                      <span className="ml-6 flex-shrink-0">
                        {openFAQs.includes(3) ? (
                          <ArrowUp2 color="#5b50ff" variant="Outline" size={24}/>
                        ) : (
                          <ArrowDown2 color="#5b50ff" variant="Outline" size={24}/>
                        )}
                      </span>
                    </button>
                    {openFAQs.includes(3) && (
                      <div className="mt-2 pr-12 text-base text-gray-500">
                        <p>
                          Oui, vous pouvez personnaliser vos factures et devis
                          selon l'identité visuelle de votre entreprise.
                          Téléchargez votre logo, définissez vos coordonnées
                          bancaires, ajoutez des notes personnalisées et des
                          conditions de paiement spécifiques. Vous pouvez
                          également créer des champs personnalisés pour adapter
                          vos documents à votre secteur d'activité. Tous ces
                          paramètres sont modifiables dans la section
                          "Paramètres entreprise" de votre profil.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Question 5 */}
                  <div className="pt-4">
                    <button
                      onClick={() => toggleFAQ(4)}
                      className="w-full flex justify-between items-center text-left focus:outline-none"
                    >
                      <h3 className="text-lg font-medium text-gray-900">
                        Comment gérer mes produits et services récurrents ?
                      </h3>
                      <span className="ml-6 flex-shrink-0">
                        {openFAQs.includes(4) ? (
                          <ArrowUp2 color="#5b50ff" variant="Outline" size={24}/>
                        ) : (
                          <ArrowDown2 color="#5b50ff" variant="Outline" size={24}/>
                        )}
                      </span>
                    </button>
                    {openFAQs.includes(4) && (
                      <div className="mt-2 pr-12 text-base text-gray-500">
                        <p>
                          Notre plateforme vous permet de créer et gérer un
                          catalogue de produits et services. Ajoutez vos
                          articles avec leurs descriptions, prix, taux de TVA et
                          unités. Lors de la création d'une facture ou d'un
                          devis, il vous suffit de commencer à taper le nom du
                          produit dans le champ description pour voir apparaître
                          des suggestions. Sélectionnez le produit souhaité et
                          tous les champs (prix, TVA, unité) seront
                          automatiquement remplis, vous faisant gagner un temps
                          précieux et évitant les erreurs de saisie.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Question 6 */}
                  <div className="pt-4">
                    <button
                      onClick={() => toggleFAQ(5)}
                      className="w-full flex justify-between items-center text-left focus:outline-none"
                    >
                      <h3 className="text-lg font-medium text-gray-900">
                        Puis-je résilier mon abonnement à tout moment ?
                      </h3>
                      <span className="ml-6 flex-shrink-0">
                        {openFAQs.includes(5) ? (
                          <ArrowUp2 color="#5b50ff" variant="Outline" size={24}/>
                        ) : (
                          <ArrowDown2 color="#5b50ff" variant="Outline" size={24}/>
                        )}
                      </span>
                    </button>
                    {openFAQs.includes(5) && (
                      <div className="mt-2 pr-12 text-base text-gray-500">
                        <p>
                          Oui, vous pouvez résilier votre abonnement à tout
                          moment, sans frais ni engagement. La résiliation peut
                          se faire directement depuis votre espace personnel sur
                          la plateforme.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Question 7 */}
                  <div className="pt-4">
                    <button
                      onClick={() => toggleFAQ(6)}
                      className="w-full flex justify-between items-center text-left focus:outline-none"
                    >
                      <h3 className="text-lg font-medium text-gray-900">
                        Mes données sont-elles en sécurité sur Newbi ?
                      </h3>
                      <span className="ml-6 flex-shrink-0">
                        {openFAQs.includes(6) ? (
                          <ArrowUp2 color="#5b50ff" variant="Outline" size={24}/>
                        ) : (
                          <ArrowDown2 color="#5b50ff" variant="Outline" size={24}/>
                        )}
                      </span>
                    </button>
                    {openFAQs.includes(6) && (
                      <div className="mt-2 pr-12 text-base text-gray-500">
                        <p>
                          Absolument. La sécurité et la confidentialité de vos
                          données sont essentielles pour nous. Vos informations
                          sont stockées sur des serveurs sécurisés et ne sont
                          jamais partagées sans votre accord.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Question 8 */}
                  <div className="pt-4">
                    <button
                      onClick={() => toggleFAQ(7)}
                      className="w-full flex justify-between items-center text-left focus:outline-none"
                    >
                      <h3 className="text-lg font-medium text-gray-900">
                        Comment contacter le support en cas de problème ?
                      </h3>
                      <span className="ml-6 flex-shrink-0">
                        {openFAQs.includes(7) ? (
                          <ArrowUp2 color="#5b50ff" variant="Outline" size={24}/>
                        ) : (
                          <ArrowDown2 color="#5b50ff" variant="Outline" size={24}/>
                        )}
                      </span>
                    </button>
                    {openFAQs.includes(7) && (
                      <div className="mt-2 pr-12 text-base text-gray-500">
                        <p>
                          Notre équipe support est accessible via le formulaire
                          de contact sur la plateforme ou par email. Vous pouvez
                          également rejoindre notre communauté sur WhatsApp pour
                          échanger avec d'autres utilisateurs et poser
                          directement vos questions à notre équipe.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Question 9 */}
                  <div className="pt-4">
                    <button
                      onClick={() => toggleFAQ(8)}
                      className="w-full flex justify-between items-center text-left focus:outline-none"
                    >
                      <h3 className="text-lg font-medium text-gray-900">
                        Puis-je personnaliser mes devis et mes factures ?
                      </h3>
                      <span className="ml-6 flex-shrink-0">
                        {openFAQs.includes(8) ? (
                          <ArrowUp2 color="#5b50ff" variant="Outline" size={24}/>
                        ) : (
                          <ArrowDown2 color="#5b50ff" variant="Outline" size={24}/>
                        )}
                      </span>
                    </button>
                    {openFAQs.includes(8) && (
                      <div className="mt-2 pr-12 text-base text-gray-500">
                        <p>
                          Oui, tous vos devis et factures sont entièrement
                          personnalisables : logo, couleurs, mentions légales et
                          informations de votre entreprise.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Question 10 */}
                  <div className="pt-4">
                    <button
                      onClick={() => toggleFAQ(9)}
                      className="w-full flex justify-between items-center text-left focus:outline-none"
                    >
                      <h3 className="text-lg font-medium text-gray-900">
                        Est-ce que Newbi propose la gestion multi-utilisateur ?
                      </h3>
                      <span className="ml-6 flex-shrink-0">
                        {openFAQs.includes(9) ? (
                          <ArrowUp2 color="#5b50ff" variant="Outline" size={24}/>
                        ) : (
                          <ArrowDown2 color="#5b50ff" variant="Outline" size={24}/>
                        )}
                      </span>
                    </button>
                    {openFAQs.includes(9) && (
                      <div className="mt-2 pr-12 text-base text-gray-500">
                        <p>
                          Pour l'instant, Newbi est principalement conçu pour
                          les indépendants et petites équipes. La gestion
                          multi-utilisateur n'est pas encore disponible, mais
                          elle fait partie de nos futures évolutions.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* CTA Final */}
          <div className="bg-transparent">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 px-4 sm:px-6 lg:px-8 sm:text-4xl">
                <span className="block">
                  Prêt à transformer votre activité ?
                </span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-amber-500 to-purple-600">
                  Commencez gratuitement dès aujourd'hui.
                </span>
              </h2>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 px-4 sm:px-6 lg:px-8">
                <div className="inline-flex rounded-2xl">
                  <ButtonLink
                    to="/auth"
                    variant="primary"
                    size="lg"
                    className="text-[#5b50ff] hover:bg-[#5b50ff]"
                  >
                    Commencer GRATUITEMENT
                  </ButtonLink>
                </div>
                <div className="ml-3 inline-flex rounded-2xl">
                  <ButtonLink
                    to={isAuthenticated ? "/outils" : "/auth"}
                    variant="outline"
                    size="lg"
                    className="text-[#5b50ff] hover:bg-[#5b50ff]"
                  >
                    Découvrir nos outils
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
