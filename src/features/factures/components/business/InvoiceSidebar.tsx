import React, { useState, useEffect } from "react";
import { formatDate } from "../../../../utils/date";
import { getUnitAbbreviation } from "../../../../utils/unitAbbreviations";
import { Sidebar } from "../../../../components/layout/Sidebar";
import { Button } from "../../../../components/";
import { InvoicePreview } from "../forms/InvoicePreview";
import { ConfirmationModal } from "../../../../components/common/ConfirmationModal";
import {
  TickCircle,
  CloseCircle,
  Edit2,
  Trash,
  ArrowRight,
  Money,
  Clock,
} from "iconsax-react";

// Type pour le statut de la facture
type InvoiceStatus = "DRAFT" | "PENDING" | "COMPLETED" | "CANCELED";

interface InvoiceSidebarProps {
  invoice: {
    id: string;
    prefix: string;
    number: string;
    status: "DRAFT" | "PENDING" | "COMPLETED" | "CANCELED";
    totalHT: number;
    totalTTC: number;
    totalVAT: number;
    discount: number;
    discountType: string;
    discountAmount: number;
    finalTotalHT: number;
    finalTotalTTC: number;
    createdAt: string;
    issueDate: string;
    dueDate: string;
    executionDate?: string;
    purchaseOrderNumber?: string;
    headerNotes?: string;
    footerNotes?: string;
    termsAndConditions?: string;
    termsAndConditionsLinkTitle?: string;
    termsAndConditionsLink?: string;
    isDeposit?: boolean;
    customFields?: { key: string; value: string }[];
    client: {
      name: string;
      email: string;
      address?: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
      };
      hasDifferentShippingAddress?: boolean;
      shippingAddress?: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
      };
      siret?: string;
      vatNumber?: string;
    };
    companyInfo?: {
      name: string;
      email: string;
      phone?: string;
      website?: string;
      siret?: string;
      vatNumber?: string;
      logo?: string;
      address: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
      };
      bankDetails?: {
        iban: string;
        bic: string;
        bankName: string;
      };
    };
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      vatRate: number;
      unit?: string;
      discount?: number;
      discountType?: string;
      details?: string;
    }>;
  };
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
}

export const InvoiceSidebar: React.FC<InvoiceSidebarProps> = ({
  invoice,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowPreview(true);
    } else {
      // Retarder la fermeture de la prévisualisation pour une meilleure transition
      const timer = setTimeout(() => {
        setShowPreview(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!invoice) return null;

  // Palette de couleurs pour les statuts avec la charte graphique Newbi
  const statusColors = {
    DRAFT: "bg-[#f0eeff] text-[#5b50ff] border border-[#e6e1ff]",
    PENDING: "bg-[#fff8e6] text-[#e6a700] border border-[#ffe7a0]",
    COMPLETED: "bg-[#e6fff0] text-[#00c853] border border-[#a0ffc8]",
    CANCELED: "bg-[#ffebee] text-[#f44336] border border-[#ffcdd2]",
  };

  // Texte des statuts en français
  const statusText = {
    DRAFT: "Brouillon",
    PENDING: "À encaisser",
    COMPLETED: "Payée",
    CANCELED: "Annulée",
  };

  const getNextStatus = (
    currentStatus: InvoiceStatus
  ): InvoiceStatus | null => {
    switch (currentStatus) {
      case "DRAFT":
        return "PENDING";
      case "PENDING":
        return "COMPLETED";
      default:
        return null;
    }
  };

  // Fonction pour annuler une facture
  const cancelInvoice = () => {
    if (invoice.status === "PENDING") {
      setShowCancelConfirmation(true);
    }
  };

  const nextStatus = getNextStatus(invoice.status);

  // Fonction pour calculer les totaux (nécessaire pour InvoicePreview)
  const calculateTotals = () => {
    // Calculer les détails des différentes TVA à partir des items
    const vatDetails: Record<
      number,
      { rate: number; amount: number; baseAmount: number }
    > = {};

    // Parcourir les items pour calculer les montants par taux de TVA
    invoice.items.forEach((item) => {
      const itemHT = item.quantity * item.unitPrice;

      // Appliquer la remise au niveau de l'item si elle existe
      let itemHTAfterDiscount = itemHT;
      if (item.discount && item.discount > 0) {
        if (item.discountType === "PERCENTAGE") {
          itemHTAfterDiscount = itemHT * (1 - item.discount / 100);
        } else {
          itemHTAfterDiscount = Math.max(0, itemHT - item.discount);
        }
      }

      const itemVAT = itemHTAfterDiscount * (item.vatRate / 100);

      // Ajouter les détails de TVA pour ce taux
      if (!vatDetails[item.vatRate]) {
        vatDetails[item.vatRate] = {
          rate: item.vatRate,
          amount: 0,
          baseAmount: 0,
        };
      }
      vatDetails[item.vatRate].amount += itemVAT;
      vatDetails[item.vatRate].baseAmount += itemHTAfterDiscount;
    });

    // Convertir l'objet vatDetails en tableau trié par taux
    const vatRates = Object.values(vatDetails).sort((a, b) => a.rate - b.rate);

    return {
      totalHT: invoice.totalHT,
      totalVAT: invoice.totalVAT,
      finalTotalHT: invoice.finalTotalHT,
      finalTotalTTC: invoice.finalTotalTTC,
      discountAmount: invoice.discountAmount,
      vatRates: vatRates, // Ajouter les détails des différentes TVA
    };
  };

  // Contenu de la sidebar
  const content = (
    <div className="space-y-6 px-1">
      {/* Montant principal en haut */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
        <div className="text-3xl font-bold mb-4">
          {invoice.finalTotalTTC?.toFixed(2) || "0.00"} €
        </div>
        {invoice.status === "DRAFT" && (
          <button
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
            onClick={() => onStatusChange("PENDING")}
          >
            <Clock
              size={18}
              className="mr-2 text-[#5b50ff]"
              color="#5b50ff"
              variant="Bold"
            />
            À encaisser
          </button>
        )}
        {invoice.status === "PENDING" && (
          <button
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
            onClick={() => onStatusChange("COMPLETED")}
          >
            <TickCircle
              size={18}
              className="mr-2 text-[#5b50ff]"
              color="#5b50ff"
              variant="Bold"
            />
            Marquer comme payée
          </button>
        )}
        <div className="border-b mt-6"></div>
        <dl className="space-y-4 mt-6">
          <div className="flex">
            <dt className="text-gray-500 w-52 flex-shrink-0 text-left">
              Date d'émission :
            </dt>
            <dd className="text-gray-900">{formatDate(invoice.issueDate)}</dd>
          </div>

          <div className="flex">
            <dt className="text-gray-500 w-52 flex-shrink-0 text-left">
              Date d'échéance :
            </dt>
            <dd className="text-gray-900">{formatDate(invoice.dueDate)}</dd>
          </div>

          {invoice.executionDate && (
            <div className="flex">
              <dt className="text-gray-500 w-52 flex-shrink-0 text-left">
                Date d'exécution :
              </dt>
              <dd className="text-gray-900">
                {formatDate(invoice.executionDate)}
              </dd>
            </div>
          )}
          <div className="flex">
            <dt className="text-gray-500 w-52 flex-shrink-0 text-left">
              Client :
            </dt>
            <dd className="text-gray-900 font-medium">{invoice.client.name}</dd>
          </div>

          {invoice.client.siret && (
            <div className="flex">
              <dt className="text-gray-500 w-52 flex-shrink-0 text-left">
                SIREN/SIRET:
              </dt>
              <dd className="text-gray-900">{invoice.client.siret}</dd>
            </div>
          )}

          {invoice.client.vatNumber && (
            <div className="flex">
              <dt className="text-gray-500 w-52 flex-shrink-0 text-left">
                Numéro de TVA :
              </dt>
              <dd className="text-gray-900">{invoice.client.vatNumber}</dd>
            </div>
          )}

          {invoice.client.email && (
            <div className="flex">
              <dt className="text-gray-500 w-52 flex-shrink-0 text-left">
                E-mail :
              </dt>
              <dd className="text-gray-900">{invoice.client.email}</dd>
            </div>
          )}

          {invoice.client.address && (
            <div className="flex">
              <dt className="text-gray-500 w-52 flex-shrink-0 text-left">
                Adresse de facturation :
              </dt>
              <dd className="text-gray-900">
                {invoice.client.address.street}
                <br />
                {invoice.client.address.postalCode}{" "}
                {invoice.client.address.city}, {invoice.client.address.country}
              </dd>
            </div>
          )}

          <div className="flex">
            <dt className="text-gray-500 w-52 flex-shrink-0 text-left">
              Langue du document :
            </dt>
            <dd className="text-gray-900">Français</dd>
          </div>
        </dl>
      </div>
    </div>
  );

  // Actions de la sidebar
  const actions = (
    <>
      <div className="space-y-4">
        <div className="flex flex-col space-y-3">
          {invoice.status === "DRAFT" && nextStatus && (
            <Button
              variant="primary"
              fullWidth
              className="bg-[#5b50ff] hover:bg-[#4a41e0] text-white rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md"
              onClick={() => onStatusChange(nextStatus)}
            >
              <Money size={20} color="#fff" className="mr-2" variant="Linear" />
              Marquer à encaisser
              <ArrowRight size={18} className="ml-2" variant="Bold" />
            </Button>
          )}
          {invoice.status === "PENDING" && nextStatus && (
            <Button
              variant="primary"
              fullWidth
              className="bg-[#00c853] hover:bg-[#00a844] text-white rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md"
              onClick={() => onStatusChange(nextStatus)}
            >
              <TickCircle
                size={20}
                color="#fff"
                className="mr-2"
                variant="Bold"
              />
              Indiquer comme payée
              <ArrowRight size={18} className="ml-2" variant="Bold" />
            </Button>
          )}
          {invoice.status === "PENDING" && (
            <Button
              variant="outline"
              color="red"
              fullWidth
              className="border border-[#f44336] text-[#f44336] hover:bg-gray-100 rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md"
              onClick={cancelInvoice}
            >
              <CloseCircle
                size={20}
                color="#f44336"
                className="mr-2"
                variant="Bold"
              />
              Annuler la facture
            </Button>
          )}
        </div>
      </div>
      {invoice.status === "DRAFT" && (
        <div className="grid grid-cols-2 gap-3 mt-2">
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
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Modal de confirmation d'annulation */}
      <ConfirmationModal
        isOpen={showCancelConfirmation}
        onClose={() => setShowCancelConfirmation(false)}
        onConfirm={() => {
          onStatusChange("CANCELED");
          setShowCancelConfirmation(false);
        }}
        title="Confirmation d'annulation"
        message="Êtes-vous sûr de vouloir annuler cette facture ? Cette action ne peut pas être annulée."
        confirmButtonText="Oui, annuler la facture"
        cancelButtonText="Non, conserver la facture"
        confirmButtonVariant="danger"
      />

      {/* Prévisualisation de la facture */}
      {showPreview && (
        <div
          className={`fixed top-0 left-0 h-full w-[55%] 2xl:w-[65%] bg-gray-50 z-[999] border-r border-gray-100 transition-all duration-500 ${
            isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
          style={{
            display: isOpen ? "block" : "none",
            boxShadow: "5px 0 15px rgba(0,0,0,0.1)",
          }}
        >
          <div className="h-full overflow-auto custom-scrollbar animate-slideInLeft">
            <InvoicePreview
              invoice={invoice}
              items={invoice.items}
              invoiceNumber={invoice.number}
              invoicePrefix={invoice.prefix}
              issueDate={invoice.issueDate}
              dueDate={invoice.dueDate}
              executionDate={invoice.executionDate}
              purchaseOrderNumber={invoice.purchaseOrderNumber}
              companyInfo={invoice.companyInfo}
              calculateTotals={calculateTotals}
              headerNotes={invoice.headerNotes}
              footerNotes={invoice.footerNotes}
              isDeposit={invoice.isDeposit}
              customFields={invoice.customFields}
              termsAndConditions={invoice.termsAndConditions}
              termsAndConditionsLinkTitle={invoice.termsAndConditionsLinkTitle}
              termsAndConditionsLink={invoice.termsAndConditionsLink}
              useBankDetails={true}
            />
          </div>
        </div>
      )}

      <Sidebar
        isOpen={isOpen}
        onClose={onClose}
        title={`Facture ${invoice.prefix}${invoice.number}`}
        width="w-[45%] 2xl:w-[35%]"
        position="right"
        actions={actions}
        className="custom-scrollbar bg-white shadow-xl"
      >
        <div className="animate-fadeIn space-y-6 px-1">{content}</div>
      </Sidebar>
    </>
  );
};
