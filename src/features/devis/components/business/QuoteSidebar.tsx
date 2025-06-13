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
  Clock,
  Edit2,
  Trash,
  CloseCircle,
  AddCircle,
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
    EXPIRED: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  // Texte des statuts en français
  const statusText = {
    DRAFT: "Brouillon",
    PENDING: "En attente",
    ACCEPTED: "Accepté",
    COMPLETED: "Accepté",
    REJECTED: "Refusé",
    CANCELED: "Annulé",
    EXPIRED: "Expiré",
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
    if (
      quote?.finalTotalHT !== undefined &&
      quote?.finalTotalTTC !== undefined &&
      quote?.totalVAT !== undefined
    ) {
      // S'assurer que le TTC est toujours supérieur au HT
      const finalTotalTTC = Math.max(
        quote.finalTotalTTC,
        quote.finalTotalHT + (quote.totalVAT || 0)
      );

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
          globalDiscountAmount =
            baseAfterItemDiscounts * (quote.discount / 100);
        } else {
          globalDiscountAmount = Math.min(
            baseAfterItemDiscounts,
            quote.discount
          );
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
            icon: <ArrowRight size={18} className="ml-2" variant="Bold" />,
          },
        ];
      case "PENDING":
        return [
          {
            label: "Marquer comme accepté",
            action: () => onStatusChange("COMPLETED"),
            color: "green",
            icon: (
              <TickCircle
                size={20}
                color="#00c853"
                className="mr-2"
                variant="Bold"
              />
            ),
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
                icon: (
                  <Money
                    size={20}
                    color="#5b50ff"
                    className="mr-2"
                    variant="Linear"
                  />
                ),
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
          className={`fixed top-0 left-0 h-full w-[55%] 2xl:w-[65%] bg-gray-50 z-[999] transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{ display: isOpen ? "block" : "none" }}
        >
          <div className="h-full overflow-auto relative custom-scrollbar">
            <QuotePreview
              quote={{
                ...quote,
                status:
                  quote.status === "CANCELED" ? "COMPLETED" : quote.status,
              }}
              calculateTotals={calculateTotals}
              useBankDetails={true}
              // Passer explicitement les coordonnées bancaires via companyInfo
              companyInfo={
                quote.companyInfo && {
                  name: quote.companyInfo.name || "",
                  email: quote.companyInfo.email || "",
                  phone: quote.companyInfo.phone || "",
                  website: quote.companyInfo.website || "",
                  siret: quote.companyInfo.siret || "",
                  vatNumber: quote.companyInfo.vatNumber || "",
                  logo: quote.companyInfo.logo || "",
                  transactionCategory: quote.companyInfo.transactionCategory as
                    | "goods"
                    | "services"
                    | "mixed"
                    | undefined,
                  address: quote.companyInfo.address
                    ? {
                        street: quote.companyInfo.address.street || "",
                        city: quote.companyInfo.address.city || "",
                        postalCode: quote.companyInfo.address.postalCode || "",
                        country: quote.companyInfo.address.country || "",
                      }
                    : {
                        street: "",
                        city: "",
                        postalCode: "",
                        country: "",
                      },
                  // Vérifier que les coordonnées bancaires existent et sont complètes
                  bankDetails: quote.companyInfo.bankDetails
                    ? {
                        iban: quote.companyInfo.bankDetails.iban || "",
                        bic: quote.companyInfo.bankDetails.bic || "",
                        bankName: quote.companyInfo.bankDetails.bankName || "",
                      }
                    : undefined,
                }
              }
            />
          </div>
        </div>
      )}

      <Sidebar
        isOpen={isOpen}
        onClose={onClose}
        title={`Devis ${quote.prefix}${quote.number}`}
        width="w-[45%] 2xl:w-[35%]"
        position="right"
        className="custom-scrollbar bg-white"
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
                      const remainingAmount =
                        quote.finalTotalTTC - totalInvoiced;
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
                            <TickCircle
                              size={20}
                              color="#00c853"
                              className="mr-2"
                              variant="Bold"
                            />
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
                          buttonClass =
                            "bg-[#5b50ff] hover:bg-[#4a41e0] text-white rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md";
                          icon = (
                            <Money
                              size={20}
                              color="#fff"
                              className="mr-2"
                              variant="Linear"
                            />
                          );
                        } else if (action.color === "green") {
                          buttonClass =
                            "bg-[#00c853] hover:bg-[#00a844] text-white rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md";
                          icon = (
                            <TickCircle
                              size={20}
                              color="#fff"
                              className="mr-2"
                              variant="Bold"
                            />
                          );
                        } else {
                          buttonClass = `border border-[#5b50ff] text-[#5b50ff] hover:bg-gray-100 rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md`;
                          icon = (
                            <AddCircle
                              size={20}
                              color="#5b50ff"
                              className="mr-2"
                              variant="Linear"
                            />
                          );
                        }

                        return (
                          <Button
                            key={index}
                            variant={
                              action.color === "primary" ||
                              action.color === "green"
                                ? "primary"
                                : "outline"
                            }
                            fullWidth
                            className={buttonClass}
                            onClick={action.action}
                            disabled={action.disabled}
                          >
                            {icon}
                            {action.label}
                            {(action.color === "primary" ||
                              action.color === "green") && (
                              <ArrowRight
                                size={18}
                                className="ml-2"
                                variant="Bold"
                              />
                            )}
                          </Button>
                        );
                      });
                    })()}

                  {/* Afficher les boutons d'action normaux si pas de factures liées */}
                  {(!quote.linkedInvoices ||
                    quote.linkedInvoices.length === 0) &&
                    statusActions.map((action, index) => {
                      // Déterminer la couleur et l'icône en fonction de l'action
                      let buttonClass = "";
                      let icon = null;

                      if (action.color === "primary") {
                        buttonClass =
                          "bg-[#5b50ff] hover:bg-[#4a41e0] text-white rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md";
                        icon = (
                          <Money
                            size={20}
                            color="#fff"
                            className="mr-2"
                            variant="Linear"
                          />
                        );
                      } else if (action.color === "green") {
                        buttonClass =
                          "bg-[#00c853] hover:bg-[#00a844] text-white rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md";
                        icon = (
                          <TickCircle
                            size={20}
                            color="#fff"
                            className="mr-2"
                            variant="Bold"
                          />
                        );
                      } else {
                        buttonClass = `border border-[#5b50ff] text-[#5b50ff] hover:bg-gray-100 rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md`;
                        icon = (
                          <AddCircle
                            size={20}
                            color="#5b50ff"
                            className="mr-2"
                            variant="Linear"
                          />
                        );
                      }

                      return (
                        <Button
                          key={index}
                          variant={
                            action.color === "primary" ||
                            action.color === "green"
                              ? "primary"
                              : "outline"
                          }
                          fullWidth
                          className={buttonClass}
                          onClick={action.action}
                          disabled={action.disabled}
                        >
                          {icon}
                          {action.label}
                          {(action.color === "primary" ||
                            action.color === "green") && (
                            <ArrowRight
                              size={18}
                              className="ml-2"
                              variant="Bold"
                            />
                          )}
                        </Button>
                      );
                    })}
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
                    <Edit2
                      size={20}
                      color="#5b50ff"
                      className="mr-2"
                      variant="Linear"
                    />
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
                      <Trash
                        size={20}
                        color="#f44336"
                        className="mr-2"
                        variant="Linear"
                      />
                      Supprimer
                    </Button>
                  ) : (
                    quote.status === "PENDING" && (
                      <Button
                        variant="outline"
                        color="red"
                        onClick={() => setShowCancelConfirmation(true)}
                        fullWidth
                        className="border border-[#f44336] text-[#f44336] hover:bg-gray-100 rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center"
                      >
                        <CloseCircle
                          size={20}
                          color="#f44336"
                          className="mr-2"
                          variant="Bold"
                        />
                        Annuler
                      </Button>
                    )
                  )}
                </div>
              </div>
            )}
          </>
        }
      >
        <div className="space-y-6 px-1">
          {/* Montant principal en haut */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
            <div className="text-3xl font-bold mb-4">
              {quote.totalTTC?.toFixed(2) || "0.00"} €
            </div>
            <button 
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
              onClick={() => onStatusChange("COMPLETED")}
            >
              <Clock size={18} className="mr-2 text-[#5b50ff]" color="#5b50ff" variant="Bold" />
              À encaisser
            </button>
            <div className="border-b mt-6"></div>
            <dl className="space-y-8">
              <div className="flex mt-8">
                <dt className="text-gray-500 w-52 flex-shrink-0 text-left">Date d'émission :</dt>
                <dd className="text-gray-900">{formatDate(quote.issueDate)}</dd>
              </div>
              
              {quote.validUntil && (
                <div className="flex">
                  <dt className="text-gray-500 w-52 flex-shrink-0 text-left">Date d'échéance :</dt>
                  <dd className="text-gray-900">{formatDate(quote.validUntil)}</dd>
                </div>
              )}
              <div className="flex">
                <dt className="text-gray-500 w-52 flex-shrink-0 text-left">Client :</dt>
                <dd className="text-gray-900 font-medium">{quote.client.name}</dd>
              </div>
              
              {quote.client.siret && (
                <div className="flex">
                  <dt className="text-gray-500 w-52 flex-shrink-0 text-left">SIREN/SIRET:</dt>
                  <dd className="text-gray-900">{quote.client.siret}</dd>
                </div>
              )}
              
              {quote.client.vatNumber && (
                <div className="flex">
                  <dt className="text-gray-500 w-52 flex-shrink-0 text-left">Numéro de TVA :</dt>
                  <dd className="text-gray-900">{quote.client.vatNumber}</dd>
                </div>
              )}
              
              {quote.client.email && (
                <div className="flex">
                  <dt className="text-gray-500 w-52 flex-shrink-0 text-left">E-mail :</dt>
                  <dd className="text-gray-900">{quote.client.email}</dd>
                </div>
              )}
              
              {quote.client.address && (
                <div className="flex">
                  <dt className="text-gray-500 w-52 flex-shrink-0 text-left">Adresse de facturation :</dt>
                  <dd className="text-gray-900">
                    {quote.client.address.street}<br />
                    {quote.client.address.postalCode} {quote.client.address.city}, {quote.client.address.country}
                  </dd>
                </div>
              )}
              
              <div className="flex">
                <dt className="text-gray-500 w-52 flex-shrink-0 text-left">Langue du document :</dt>
                <dd className="text-gray-900">Français</dd>
              </div>
            </dl>
          </div>
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
