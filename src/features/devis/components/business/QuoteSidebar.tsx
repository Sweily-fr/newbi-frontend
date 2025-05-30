import React, { useState, useCallback, useEffect } from "react";
import { Sidebar } from "../../../../components/layout/Sidebar";
import { Button } from "../../../../components/";
import { formatDate } from "../../../../utils/date";
import { getUnitAbbreviation } from "../../../../utils/unitAbbreviations";
import { QuoteInvoiceCreationModal } from "./QuoteInvoiceCreationModal";
import { QuoteInvoiceProgress } from "./QuoteInvoiceProgress";
import { useQuery } from "@apollo/client";
import { GET_QUOTE } from "../../graphql/quotes";
import { QuotePreview } from "../forms/QuotePreview";
import { Quote } from "../../types";
import { ConfirmationModal } from "../../../../components/common/ConfirmationModal";
import { 
  TickCircle, 
  ArrowRight, 
  Money,
  InfoCircle,
  Profile2User,
  DocumentText,
  Calendar,
  Clock,
  Receipt21,
  Wallet,
  Sms,
  ReceiptItem,
  Edit2,
  Trash,
  CloseCircle,
  AddCircle
} from "iconsax-react";

interface Invoice {
  id: string;
  prefix: string;
  number: string;
  status: "DRAFT" | "PENDING" | "COMPLETED";
  finalTotalTTC?: number;
  isDeposit?: boolean;
}

interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  unit?: string;
  discount?: number;
  discountType?: string;
  details?: string;
}

// Type étendu pour inclure le statut CANCELED qui est utilisé dans l'interface mais pas dans le type Quote
type ExtendedQuoteStatus = Quote["status"] | "CANCELED";

// Type étendu pour le devis dans la sidebar
type SidebarQuote = Omit<Quote, "status"> & {
  status: ExtendedQuoteStatus;
  id: string;
  prefix: string;
  number: string;
  issueDate: string;
  totalHT: number;
  totalTTC: number;
  totalVAT: number;
  finalTotalHT: number;
  finalTotalTTC: number;
  discountAmount?: number;
  vatRates?: Array<{
    rate: number;
    amount: number;
    baseAmount: number;
  }>;
  client: {
    name: string;
    email?: string;
    address?: {
      street?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    };
  };
  convertedToInvoice?: {
    id: string;
    prefix: string;
    number: string;
    status: string;
  };
  linkedInvoices?: Invoice[];
};

interface QuoteSidebarProps {
  quote: SidebarQuote;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (newStatus: string) => void;
}

export const QuoteSidebar: React.FC<QuoteSidebarProps> = ({
  quote: initialQuote,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [isInvoiceCreationModalOpen, setIsInvoiceCreationModalOpen] =
    useState(false);
  // État pour la popup de confirmation d'annulation
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  // État pour le statut et la facturation
  const showStatusDetails = true;
  // État non utilisé - à réactiver si besoin
  // const [showPreview, setShowPreview] = useState(true);
  const showPreview = true; // Valeur fixe pour l'instant
  // État local pour stocker les données du devis mises à jour
  const [quote, setQuote] = useState<SidebarQuote>(initialQuote);
  
  // Palette de couleurs pour les statuts avec la charte graphique Newbi
  const statusColors = {
    DRAFT: "bg-[#f0eeff] text-[#5b50ff] border border-[#e6e1ff]",
    PENDING: "bg-[#fff8e6] text-[#e6a700] border border-[#ffe7a0]",
    ACCEPTED: "bg-[#e6fff0] text-[#00c853] border border-[#a0ffc8]",
    COMPLETED: "bg-[#e6fff0] text-[#00c853] border border-[#a0ffc8]",
    REJECTED: "bg-[#ffebee] text-[#f44336] border border-[#ffcdd2]",
    CANCELED: "bg-[#ffebee] text-[#f44336] border border-[#ffcdd2]",
    EXPIRED: "bg-gray-100 text-gray-700 border border-gray-200"
  };
  
  // Texte des statuts en français
  const statusText = {
    DRAFT: "Brouillon",
    PENDING: "En attente",
    ACCEPTED: "Accepté",
    COMPLETED: "Accepté",
    REJECTED: "Refusé",
    CANCELED: "Annulé",
    EXPIRED: "Expiré"
  };

  // Utiliser useQuery pour obtenir les données à jour du devis
  const { data, refetch } = useQuery(GET_QUOTE, {
    variables: { id: initialQuote?.id },
    skip: !initialQuote?.id || !isOpen,
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  // Mettre à jour l'état local lorsque les données du devis changent
  useEffect(() => {
    if (data?.quote) {
      setQuote(data.quote);
    }
  }, [data]);

  // Mettre à jour l'état local lorsque les props changent
  useEffect(() => {
    setQuote(initialQuote);
  }, [initialQuote]);

  const handleCreateInvoice = () => {
    setIsInvoiceCreationModalOpen(true);
  };

  const handleInvoiceCreated = useCallback(() => {
    // Forcer une récupération des données à jour depuis le serveur
    refetch().then(({ data }) => {
      if (data?.quote) {
        setQuote(data.quote);
      }
    });
  }, [refetch]);

  // Fonction pour calculer les totaux et les détails des TVA
  const calculateTotals = () => {
    // Utiliser directement les totaux du devis s'ils existent
    if (quote?.finalTotalHT !== undefined && quote?.finalTotalTTC !== undefined && quote?.totalVAT !== undefined) {
      // S'assurer que le TTC est toujours supérieur au HT
      const finalTotalTTC = Math.max(quote.finalTotalTTC, quote.finalTotalHT + (quote.totalVAT || 0));
      
      return {
        subtotal: quote.totalHT || 0,
        totalVAT: quote.totalVAT || 0,
        totalWithoutVAT: quote.finalTotalHT || 0,
        totalWithVAT: finalTotalTTC,
        totalDiscount: quote.discountAmount || 0,
        finalTotalHT: quote.finalTotalHT || 0,
        finalTotalTTC: finalTotalTTC,
        vatRates: quote.vatRates || [],
      };
    }
    
    // Calculer les détails des différentes TVA à partir des items
    const vatDetails: Record<
      number,
      { rate: number; amount: number; baseAmount: number }
    > = {};

    // Initialiser les totaux
    let subtotal = 0;
    let totalVAT = 0;
    let totalWithoutVAT = 0;
    let totalWithVAT = 0;
    let totalDiscount = 0;

    // Si nous n'avons pas d'items ou si les items sont vides, utiliser les totaux du devis
    if (!quote?.items || quote.items.length === 0) {
      // Si nous avons un total de TVA mais pas d'items, créer un taux de TVA par défaut
      if (
        quote?.totalVAT &&
        quote.totalVAT > 0 &&
        quote?.totalHT &&
        quote.totalHT > 0
      ) {
        // Calculer le taux de TVA moyen (arrondi à l'entier le plus proche)
        const avgVatRate = Math.round((quote.totalVAT / quote.totalHT) * 100);
        vatDetails[avgVatRate] = {
          rate: avgVatRate,
          amount: quote.totalVAT,
          baseAmount: quote.totalHT,
        };

        // Utiliser les totaux du devis
        subtotal = quote.totalHT || 0;
        totalVAT = quote.totalVAT || 0;
        totalWithoutVAT = quote.finalTotalHT || quote.totalHT || 0;
        totalWithVAT = Math.max(
          quote.finalTotalTTC || quote.totalTTC || 0,
          totalWithoutVAT + totalVAT
        );
        totalDiscount = quote.discountAmount || 0;
      }
    } else {
      // Parcourir les items pour calculer le sous-total
      quote.items.forEach((item: QuoteItem) => {
        const itemHT = item.quantity * item.unitPrice;
        subtotal += itemHT;

        // Calculer la remise au niveau de l'item si elle existe
        let itemDiscountAmount = 0;
        let itemHTAfterDiscount = itemHT;
        if (item.discount && item.discount > 0) {
          if (item.discountType === "PERCENTAGE") {
            itemDiscountAmount = itemHT * (item.discount / 100);
            itemHTAfterDiscount = itemHT - itemDiscountAmount;
          } else {
            itemDiscountAmount = Math.min(itemHT, item.discount);
            itemHTAfterDiscount = Math.max(0, itemHT - itemDiscountAmount);
          }
          totalDiscount += itemDiscountAmount;
        }

        // Initialiser les détails de TVA pour ce taux
        if (!vatDetails[item.vatRate]) {
          vatDetails[item.vatRate] = {
            rate: item.vatRate,
            amount: 0,
            baseAmount: 0,
          };
        }
        vatDetails[item.vatRate].baseAmount += itemHTAfterDiscount;
      });

      // Appliquer la remise globale si elle existe
      const baseAfterItemDiscounts = subtotal - totalDiscount;
      let globalDiscountAmount = 0;
      
      if (quote.discount && quote.discount > 0) {
        if (quote.discountType === "PERCENTAGE") {
          globalDiscountAmount = baseAfterItemDiscounts * (quote.discount / 100);
        } else {
          globalDiscountAmount = Math.min(baseAfterItemDiscounts, quote.discount);
        }
        totalDiscount += globalDiscountAmount;
      }
      
      // Calculer la base imposable finale après toutes les remises
      totalWithoutVAT = subtotal - totalDiscount;
      
      // Appliquer la remise globale proportionnellement à chaque base de TVA
      if (globalDiscountAmount > 0 && baseAfterItemDiscounts > 0) {
        const discountRatio = globalDiscountAmount / baseAfterItemDiscounts;
        
        // Ajuster les bases de TVA en fonction de la remise globale
        Object.keys(vatDetails).forEach((rateKey) => {
          const rate = Number(rateKey);
          const detail = vatDetails[rate];
          detail.baseAmount = detail.baseAmount * (1 - discountRatio);
        });
      }
      
      // Calculer la TVA sur les bases ajustées
      totalVAT = 0;
      Object.keys(vatDetails).forEach((rateKey) => {
        const rate = Number(rateKey);
        const detail = vatDetails[rate];
        detail.amount = detail.baseAmount * (rate / 100);
        totalVAT += detail.amount;
      });
      
      // Calculer le total TTC en s'assurant qu'il est supérieur au HT
      totalWithVAT = totalWithoutVAT + totalVAT;
    }

    // Convertir l'objet vatDetails en tableau trié par taux
    const vatRates = Object.values(vatDetails).sort((a, b) => a.rate - b.rate);

    return {
      subtotal: subtotal,
      totalVAT: totalVAT,
      totalWithoutVAT: totalWithoutVAT,
      totalWithVAT: totalWithVAT,
      totalDiscount: totalDiscount,
      finalTotalHT: totalWithoutVAT,
      finalTotalTTC: totalWithVAT,
      vatRates: vatRates, // Ajouter les détails des différentes TVA
    };
  };

  // Fonction pour basculer l'affichage de la prévisualisation
  // Fonction non utilisée - à conserver pour référence future
  // const togglePreview = useCallback(() => {
  //   setShowPreview(prev => !prev);
  // }, []);

  // Définir l'interface pour les actions de statut
  interface StatusAction {
    label: string;
    action: () => void;
    color: string;
    disabled?: boolean;
    icon?: React.ReactNode;
  }

  const getStatusActions = (): StatusAction[] => {
    if (!quote) return [];

    switch (quote.status) {
      case "DRAFT":
        return [
          {
            label: "Marquer comme envoyé",
            action: () => onStatusChange("PENDING"),
            color: "purple",
            icon: <ArrowRight size={18} className="ml-2" variant="Bold" />
          },
        ];
      case "PENDING":
        return [
          {
            label: "Marquer comme accepté",
            action: () => onStatusChange("COMPLETED"),
            color: "green",
            icon: <TickCircle size={20} color="#00c853" className="mr-2" variant="Bold" />
          },
        ];
      case "COMPLETED": {
        // Vérifier si on peut encore créer des factures (max 3)
        const linkedInvoicesCount = quote.linkedInvoices?.length || 0;
        const canCreateMoreInvoices = linkedInvoicesCount < 3;

        return canCreateMoreInvoices
          ? [
              {
                label:
                  linkedInvoicesCount === 0
                    ? "Créer une facture"
                    : "Ajouter une facture",
                action: handleCreateInvoice,
                color: "blue",
                disabled: false,
                icon: <Money size={20} color="#5b50ff" className="mr-2" variant="Linear" />
              },
            ]
          : [];
      }
      case "CANCELED":
        return [];
      default:
        return [];
    }
  };

  if (!quote) return null;

  const statusActions = getStatusActions();

  return (
    <>
      {/* Prévisualisation du devis */}
      {showPreview && (
        <div
          className={`fixed top-0 left-0 h-full w-1/2 bg-gray-50 z-[999] transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{ display: isOpen ? "block" : "none" }}
        >
          <div className="h-full overflow-auto relative custom-scrollbar">
            <QuotePreview
              quote={{
                ...quote,
                status:
                  quote.status === "CANCELED" ? "COMPLETED" : quote.status
              }}
              calculateTotals={calculateTotals}
              useBankDetails={true}
              // Passer explicitement les coordonnées bancaires via companyInfo
              companyInfo={quote.companyInfo && {
                name: quote.companyInfo.name || "",
                email: quote.companyInfo.email || "",
                phone: quote.companyInfo.phone || "",
                website: quote.companyInfo.website || "",
                siret: quote.companyInfo.siret || "",
                vatNumber: quote.companyInfo.vatNumber || "",
                logo: quote.companyInfo.logo || "",
                transactionCategory: quote.companyInfo.transactionCategory as "goods" | "services" | "mixed" | undefined,
                address: quote.companyInfo.address ? {
                  street: quote.companyInfo.address.street || "",
                  city: quote.companyInfo.address.city || "",
                  postalCode: quote.companyInfo.address.postalCode || "",
                  country: quote.companyInfo.address.country || ""
                } : {
                  street: "",
                  city: "",
                  postalCode: "",
                  country: ""
                },
                // Vérifier que les coordonnées bancaires existent et sont complètes
                bankDetails: quote.companyInfo.bankDetails ? {
                  iban: quote.companyInfo.bankDetails.iban || "",
                  bic: quote.companyInfo.bankDetails.bic || "",
                  bankName: quote.companyInfo.bankDetails.bankName || ""
                } : undefined
              }}
            />
          </div>
        </div>
      )}

      <Sidebar
        isOpen={isOpen}
        onClose={onClose}
        title={`Devis ${quote.prefix}${quote.number}`}
        width="w-1/2"
        position="right"
        className="custom-scrollbar bg-white shadow-xl"
        actions={
          <>


            {/* Contenu détaillé - affiché uniquement si showStatusDetails est true */}
            {showStatusDetails && (
              <div className="transition-all duration-300 overflow-hidden">
                {/* Progression des factures */}
                {quote.linkedInvoices && quote.linkedInvoices.length > 0 && (
                  <div className="mb-4">
                    <QuoteInvoiceProgress
                      quoteTotal={quote.finalTotalTTC}
                      linkedInvoices={quote.linkedInvoices}
                      quoteId={quote.id}
                      refreshInterval={2000} // Rafraîchir toutes les 2 secondes
                      key={`invoice-progress-${quote.linkedInvoices.length}`} // Forcer le remontage du composant quand le nombre de factures change
                    />
                  </div>
                )}

                {/* Conteneur principal pour tous les boutons d'action */}
                <div className="space-y-3">
                  {/* Vérifier si toutes les factures sont complétées et si le montant total est atteint */}
                  {quote.linkedInvoices &&
                    quote.linkedInvoices.length > 0 &&
                    (() => {
                      const totalInvoiced = quote.linkedInvoices.reduce(
                        (sum, inv) => sum + (inv.finalTotalTTC || 0),
                        0
                      );
                      const remainingAmount = quote.finalTotalTTC - totalInvoiced;
                      const isFullyPaid =
                        quote.linkedInvoices.every(
                          (inv) => inv.status === "COMPLETED"
                        ) && Math.abs(remainingAmount) < 0.01; // Tolérance pour les erreurs d'arrondi
                      const hasMaxInvoices = quote.linkedInvoices.length >= 3;

                      if (isFullyPaid) {
                        return (
                          <Button
                            variant="outline"
                            color="green"
                            fullWidth
                            disabled={true}
                            className="border border-[#00c853] text-[#00c853] rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center"
                          >
                            <TickCircle size={20} color="#00c853" className="mr-2" variant="Bold" />
                            Payée
                          </Button>
                        );
                      } else if (
                        Math.abs(remainingAmount) < 0.01 ||
                        hasMaxInvoices
                      ) {
                        // Ne pas afficher les boutons si le reste à facturer est 0 ou si 3 factures sont déjà liées
                        return null;
                      }

                      // Sinon, afficher les boutons d'action normaux avec le nouveau style
                      return statusActions.map((action, index) => {
                        // Déterminer la couleur et l'icône en fonction de l'action
                        let buttonClass = "";
                        let icon = null;
                        
                        if (action.color === "primary") {
                          buttonClass = "bg-[#5b50ff] hover:bg-[#4a41e0] text-white rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md";
                          icon = <Money size={20} color="#fff" className="mr-2" variant="Linear" />;
                        } else if (action.color === "green") {
                          buttonClass = "bg-[#00c853] hover:bg-[#00a844] text-white rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md";
                          icon = <TickCircle size={20} color="#fff" className="mr-2" variant="Bold" />;
                        } else {
                          buttonClass = `border border-[#5b50ff] text-[#5b50ff] hover:bg-gray-100 rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md`;
                          icon = <AddCircle size={20} color="#5b50ff" className="mr-2" variant="Linear" />;
                        }
                        
                        return (
                          <Button
                            key={index}
                            variant={action.color === "primary" || action.color === "green" ? "primary" : "outline"}
                            fullWidth
                            className={buttonClass}
                            onClick={action.action}
                            disabled={action.disabled}
                          >
                            {icon}
                            {action.label}
                            {(action.color === "primary" || action.color === "green") && 
                              <ArrowRight size={18} className="ml-2" variant="Bold" />}
                          </Button>
                        );
                      });
                    })()}
                  
                  {/* Afficher les boutons d'action normaux si pas de factures liées */}
                  {(!quote.linkedInvoices || quote.linkedInvoices.length === 0) &&
                    statusActions.map((action, index) => {
                      // Déterminer la couleur et l'icône en fonction de l'action
                      let buttonClass = "";
                      let icon = null;
                      
                      if (action.color === "primary") {
                        buttonClass = "bg-[#5b50ff] hover:bg-[#4a41e0] text-white rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md";
                        icon = <Money size={20} color="#fff" className="mr-2" variant="Linear" />;
                      } else if (action.color === "green") {
                        buttonClass = "bg-[#00c853] hover:bg-[#00a844] text-white rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md";
                        icon = <TickCircle size={20} color="#fff" className="mr-2" variant="Bold" />;
                      } else {
                        buttonClass = `border border-[#5b50ff] text-[#5b50ff] hover:bg-gray-100 rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md`;
                        icon = <AddCircle size={20} color="#5b50ff" className="mr-2" variant="Linear" />;
                      }
                      
                      return (
                        <Button
                          key={index}
                          variant={action.color === "primary" || action.color === "green" ? "primary" : "outline"}
                          fullWidth
                          className={buttonClass}
                          onClick={action.action}
                          disabled={action.disabled}
                        >
                          {icon}
                          {action.label}
                          {(action.color === "primary" || action.color === "green") && 
                            <ArrowRight size={18} className="ml-2" variant="Bold" />}
                        </Button>
                      );
                    })
                  }
                </div>
              </div>
            )}
            
            {/* Conteneur pour les boutons d'édition et de suppression/annulation - toujours visible */}
            {quote.status !== "COMPLETED" && quote.status !== "CANCELED" && (
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={onEdit}
                    fullWidth
                    className="border border-[#5b50ff] text-[#5b50ff] hover:bg-gray-100 rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md"
                  >
                    <Edit2 size={20} color="#5b50ff" className="mr-2" variant="Linear" />
                    Modifier
                  </Button>
                  
                  {quote.status === "DRAFT" ? (
                    <Button
                      variant="outline"
                      color="red"
                      onClick={onDelete}
                      fullWidth
                      className="border border-[#f44336] text-[#f44336] hover:bg-gray-100 rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center"
                    >
                      <Trash size={20} color="#f44336" className="mr-2" variant="Linear" />
                      Supprimer
                    </Button>
                  ) : quote.status === "PENDING" && (
                    <Button
                      variant="outline"
                      color="red"
                      onClick={() => setShowCancelConfirmation(true)}
                      fullWidth
                      className="border border-[#f44336] text-[#f44336] hover:bg-gray-100 rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center"
                    >
                      <CloseCircle size={20} color="#f44336" className="mr-2" variant="Bold" />
                      Annuler
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        }
      >
        <div className="space-y-8">
      {/* Statut du devis */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600 flex items-center">
            <div className="w-7 h-7 rounded-full bg-[#f0eeff] flex items-center justify-center mr-2">
              <TickCircle size={18} color="#5b50ff" variant="Bold" />
            </div>
            Statut
          </span>
          <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${statusColors[quote.status as keyof typeof statusColors]} shadow-sm transition-all duration-300 hover:shadow-md badge-transition flex items-center`}>
            <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></span>
            {statusText[quote.status as keyof typeof statusText]}
          </span>
        </div>
        <div className="mt-4 h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full ${quote.status === 'DRAFT' ? 'w-1/3' : 
              quote.status === 'PENDING' ? 'w-2/3' : 
              (quote.status === 'ACCEPTED' || quote.status === 'COMPLETED') ? 'w-full' : 
              'w-0'} bg-[#5b50ff]`}
            style={{ transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs font-medium text-gray-600">
          <span className="flex flex-col items-center">
            <span className="w-2 h-2 rounded-full bg-[#5b50ff] mb-1"></span>
            Création
          </span>
          <span className="flex flex-col items-center">
            <span className="w-2 h-2 rounded-full bg-[#5b50ff] mb-1"></span>
            En attente
          </span>
          <span className="flex flex-col items-center">
            <span className="w-2 h-2 rounded-full bg-[#5b50ff] mb-1"></span>
            Accepté
          </span>
        </div>
      </div>
      {/* Informations générales */}
      <div className="rounded-xl">
        <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center mr-2">
            <InfoCircle size={18} color="#5b50ff" variant="Bold" />
          </div>
          Informations générales
        </h3>
        <div className="bg-white shadow-sm overflow-hidden rounded-xl border border-gray-100 transition-all duration-300 hover:border-[#e6e1ff]">
          <dl>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
              <dt className="text-sm font-medium text-gray-600 flex items-center"><Calendar size={16} color="#5b50ff" className="mr-4" variant="Linear" /> Date d'émission</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium hover:text-[#5b50ff] transition-colors duration-300">
                {formatDate(quote.issueDate)}
              </dd>
            </div>
            {quote.validUntil && (
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                <dt className="text-sm font-medium text-gray-600 flex items-center"><Clock size={16} color="#5b50ff" className="mr-4" variant="Linear" /> Valide jusqu'au</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(quote.validUntil)}
                </dd>
              </div>
            )}
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
              <dt className="text-sm font-medium text-gray-600 flex items-center"><Wallet size={16} color="#5b50ff" className="mr-4" variant="Linear" /> Montant HT</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium hover:text-[#5b50ff] transition-colors duration-300">
                {quote.totalHT?.toFixed(2) || '0.00'} €
              </dd>
            </div>
            {/* Affichage détaillé des TVA si plusieurs taux sont utilisés */}
            {(() => {
              // Calculer les détails des TVA
              const vatDetails = calculateTotals().vatRates;
              
              if (vatDetails && vatDetails.length > 1) {
                return (
                  <>
                    {vatDetails.map((vatDetail, index) => (
                      <div key={index} className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                        <dt className="text-sm font-medium text-gray-600 flex items-center">
                          <ReceiptItem size={16} color="#5b50ff" className="mr-4" variant="Linear" /> TVA {vatDetail.rate}%
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {vatDetail.amount.toFixed(2)} € ({vatDetail.rate}% de {vatDetail.baseAmount.toFixed(2)} €)
                        </dd>
                      </div>
                    ))}
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                      <dt className="text-sm font-medium text-gray-600 flex items-center"><ReceiptItem size={16} color="#5b50ff" className="mr-4" variant="Linear" /> Total TVA</dt>
                      <dd className="mt-1 text-sm font-bold text-gray-900 sm:mt-0 sm:col-span-2">
                        {quote.totalVAT?.toFixed(2) || '0.00'} €
                      </dd>
                    </div>
                  </>
                );
              } else {
                // Afficher seulement le total de TVA si un seul taux est utilisé
                return (
                  <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-600 flex items-center"><ReceiptItem size={16} color="#5b50ff" className="mr-4" variant="Linear" /> TVA</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {quote.totalVAT?.toFixed(2) || '0.00'} €
                    </dd>
                  </div>
                );
              }
            })()}
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
              <dt className="text-sm font-medium text-gray-600 flex items-center"><Money size={16} color="#5b50ff" className="mr-4" variant="Linear" /> Montant TTC</dt>
              <dd className="mt-1 text-sm font-bold text-[#5b50ff] sm:mt-0 sm:col-span-2 transition-transform duration-300 rounded-lg inline-block">
                {quote.totalTTC?.toFixed(2) || '0.00'} €
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Client */}
      <div className="rounded-xl">
        <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center mr-2">
            <Profile2User size={18} color="#5b50ff" variant="Bold" />
          </div>
          Client
        </h3>
        <div className="bg-white shadow-sm overflow-hidden rounded-xl border border-gray-100 transition-all duration-300 hover:border-[#e6e1ff]">
          <dl>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
              <dt className="text-sm font-medium text-gray-600 flex items-center"><Profile2User size={16} color="#5b50ff" className="mr-4" variant="Linear" /> Nom</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium hover:text-[#5b50ff] transition-colors duration-300">
                {quote.client.name}
              </dd>
            </div>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
              <dt className="text-sm font-medium text-gray-600 flex items-center"><Sms size={16} color="#5b50ff" className="mr-4" variant="Linear" /> Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {quote.client.email}
              </dd>
            </div>
            {quote.client.siret && (
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                <dt className="text-sm font-medium text-gray-600 flex items-center"><DocumentText size={16} color="#5b50ff" className="mr-4" variant="Linear" /> SIRET</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {quote.client.siret}
                </dd>
              </div>
            )}
            {quote.client.vatNumber && (
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                <dt className="text-sm font-medium text-gray-600 flex items-center"><Receipt21 size={16} color="#5b50ff" className="mr-4" variant="Linear" /> N° TVA</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {quote.client.vatNumber}
                </dd>
              </div>
            )}
            {quote.client.address && (
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                <dt className="text-sm font-medium text-gray-600 flex items-center"><InfoCircle size={16} color="#5b50ff" className="mr-4" variant="Linear" /> Adresse</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {quote.client.address.street}<br />
                  {quote.client.address.postalCode} {quote.client.address.city}<br />
                  {quote.client.address.country}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Éléments du devis */}
      <div className="rounded-xl">
        <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center mr-2">
            <DocumentText size={18} color="#5b50ff" variant="Bold" />
          </div>
          Éléments du devis
        </h3>
        <div className="bg-white overflow-hidden rounded-xl border border-gray-100 transition-all duration-300 hover:border-[#e6e1ff]">
          <ul className="divide-y divide-gray-200">
            {quote.items && quote.items.map((item, index) => (
              <li key={index} className={`px-4 py-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} transition-all duration-300 hover:bg-gray-100`}>
                <div className="flex justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 flex items-center">
                      <DocumentText size={16} color="#5b50ff" className="mr-4" variant="Linear" />
                      {item.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-gray-700 mr-2">
                        {item.quantity} {getUnitAbbreviation(item.unit) || 'u'}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-gray-700">
                        {item.unitPrice.toFixed(2)} €
                      </span>
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-800 px-3 py-1 rounded-lg">
                    {((item.quantity * item.unitPrice) * (1 - (item.discountType === 'PERCENTAGE' && item.discount ? item.discount / 100 : 0))).toFixed(2)} €
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Notes */}
      {(quote.headerNotes || quote.footerNotes || quote.termsAndConditions) && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
          <div className="bg-white overflow-hidden rounded-xl border border-gray-100 transition-all duration-300 hover:border-[#e6e1ff]">
            <div className="divide-y divide-gray-200">
            {quote.headerNotes && (
              <div className="px-4 py-4 border-b border-gray-200">
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">En-tête</h4>
                <p className="text-sm text-gray-900">{quote.headerNotes}</p>
              </div>
            )}
            {quote.footerNotes && (
              <div className="px-4 py-4 border-b border-gray-200">
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Pied de page</h4>
                <p className="text-sm text-gray-900">{quote.footerNotes}</p>
              </div>
            )}
            {quote.termsAndConditions && (
              <div className="px-4 py-4 border-b border-gray-200">
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Conditions générales</h4>
                <p className="text-sm text-gray-900">{quote.termsAndConditions}</p>
                {quote.termsAndConditionsLink && (
                  <a 
                    href={quote.termsAndConditionsLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-flex items-center"
                  >
                    {quote.termsAndConditionsLinkTitle || 'Voir les conditions générales'} <ArrowRight size={14} className="ml-1" variant="Bold" />
                  </a>
                )}
              </div>
            )}
            </div>
          </div>
        </div>
      )}
        </div>

        {/* Modal de création de facture */}
        <QuoteInvoiceCreationModal
          isOpen={isInvoiceCreationModalOpen}
          onClose={() => setIsInvoiceCreationModalOpen(false)}
          quoteId={quote.id}
          quoteTotal={quote.finalTotalTTC}
          linkedInvoices={quote.linkedInvoices}
          onInvoiceCreated={handleInvoiceCreated}
        />

        {/* Modal de confirmation d'annulation */}
        <ConfirmationModal
          isOpen={showCancelConfirmation}
          onClose={() => setShowCancelConfirmation(false)}
          onConfirm={() => {
            onStatusChange("CANCELED");
            setShowCancelConfirmation(false);
          }}
          title="Confirmation d'annulation"
          message="Êtes-vous sûr de vouloir annuler ce devis ? Cette action ne peut pas être annulée."
          confirmButtonText="Oui, annuler le devis"
          cancelButtonText="Non, conserver"
          confirmButtonVariant="danger"
        />
      </Sidebar>
    </>
  );
};
