import React, { useState, useEffect } from "react";
import { formatDate } from "../../../../utils/date";
import { getUnitAbbreviation } from "../../../../utils/unitAbbreviations";
import { Sidebar } from "../../../../components/layout/Sidebar";
import { Button } from "../../../../components/";
import { InvoicePreview } from "../forms/InvoicePreview";
import { ConfirmationModal } from "../../../../components/common/ConfirmationModal";
import { 
  InfoCircle, 
  Profile2User, 
  DocumentText, 
  TickCircle, 
  CloseCircle, 
  Edit2, 
  Trash, 
  ArrowRight, 
  Money, 
  Calendar, 
  Clock, 
  Receipt21, 
  Wallet, 
  ReceiptItem, 
  Sms
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
    CANCELED: "bg-[#ffebee] text-[#f44336] border border-[#ffcdd2]"
  };
  
  // Texte des statuts en français
  const statusText = {
    DRAFT: "Brouillon",
    PENDING: "À encaisser",
    COMPLETED: "Payée",
    CANCELED: "Annulée"
  };

  const getNextStatus = (currentStatus: InvoiceStatus): InvoiceStatus | null => {
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
    const vatDetails: Record<number, { rate: number; amount: number; baseAmount: number }> = {};
    
    // Parcourir les items pour calculer les montants par taux de TVA
    invoice.items.forEach(item => {
      const itemHT = item.quantity * item.unitPrice;
      
      // Appliquer la remise au niveau de l'item si elle existe
      let itemHTAfterDiscount = itemHT;
      if (item.discount && item.discount > 0) {
        if (item.discountType === 'PERCENTAGE') {
          itemHTAfterDiscount = itemHT * (1 - (item.discount / 100));
        } else {
          itemHTAfterDiscount = Math.max(0, itemHT - item.discount);
        }
      }
      
      const itemVAT = itemHTAfterDiscount * (item.vatRate / 100);
      
      // Ajouter les détails de TVA pour ce taux
      if (!vatDetails[item.vatRate]) {
        vatDetails[item.vatRate] = { rate: item.vatRate, amount: 0, baseAmount: 0 };
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
      vatRates: vatRates // Ajouter les détails des différentes TVA
    };
  };

  // Contenu de la sidebar
  const content = (
    <div className="space-y-8">
      {/* Statut de la facture */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600 flex items-center">
            <div className="w-7 h-7 rounded-full bg-[#f0eeff] flex items-center justify-center mr-2">
              <TickCircle size={18} color="#5b50ff" variant="Bold" />
            </div>
            Statut
          </span>
          <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${statusColors[invoice.status as keyof typeof statusColors]} shadow-sm transition-all duration-300 hover:shadow-md badge-transition flex items-center`}>
            <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></span>
            {statusText[invoice.status as keyof typeof statusText]}
          </span>
        </div>
        <div className="mt-4 h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full ${invoice.status === 'DRAFT' ? 'w-1/3' : 
              invoice.status === 'PENDING' ? 'w-2/3' : 
              invoice.status === 'COMPLETED' ? 'w-full' : 
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
            Finalisée
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
                {formatDate(invoice.issueDate)}
              </dd>
            </div>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
              <dt className="text-sm font-medium text-gray-600 flex items-center"><Clock size={16} color="#5b50ff" className="mr-4" variant="Linear" /> Date d'échéance</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(invoice.dueDate)}
              </dd>
            </div>
            {invoice.executionDate && (
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                <dt className="text-sm font-medium text-gray-600 flex items-center"><Calendar size={16} color="#5b50ff" className="mr-4" variant="Linear" /> Date d'exécution</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(invoice.executionDate)}
                </dd>
              </div>
            )}
            {invoice.purchaseOrderNumber && (
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                <dt className="text-sm font-medium text-gray-600 flex items-center"><Receipt21 size={16} color="#5b50ff" className="mr-4" variant="Linear" /> N° de commande</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {invoice.purchaseOrderNumber}
                </dd>
              </div>
            )}
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
              <dt className="text-sm font-medium text-gray-600 flex items-center"><Wallet size={16} color="#5b50ff" className="mr-4" variant="Linear" /> Montant HT</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium hover:text-[#5b50ff] transition-colors duration-300">
                {invoice.totalHT?.toFixed(2) || '0.00'} €
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
                        {invoice.totalVAT?.toFixed(2) || '0.00'} €
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
                      {invoice.totalVAT?.toFixed(2) || '0.00'} €
                    </dd>
                  </div>
                );
              }
            })()}
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
              <dt className="text-sm font-medium text-gray-600 flex items-center"><Money size={16} color="#5b50ff" className="mr-4" variant="Linear" /> Montant TTC</dt>
              <dd className="mt-1 text-sm font-bold text-[#5b50ff] sm:mt-0 sm:col-span-2 transition-transform duration-300 rounded-lg inline-block">
                {invoice.finalTotalTTC?.toFixed(2) || '0.00'} €
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
                {invoice.client.name}
              </dd>
            </div>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
              <dt className="text-sm font-medium text-gray-600 flex items-center"><Sms size={16} color="#5b50ff" className="mr-4" variant="Linear" /> Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {invoice.client.email}
              </dd>
            </div>
            {invoice.client.siret && (
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                <dt className="text-sm font-medium text-gray-600 flex items-center"><DocumentText size={16} color="#5b50ff" className="mr-4" variant="Linear" /> SIRET</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {invoice.client.siret}
                </dd>
              </div>
            )}
            {invoice.client.vatNumber && (
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                <dt className="text-sm font-medium text-gray-600 flex items-center"><Receipt21 size={16} color="#5b50ff" className="mr-4" variant="Linear" /> N° TVA</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {invoice.client.vatNumber}
                </dd>
              </div>
            )}
            {invoice.client.address && (
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                <dt className="text-sm font-medium text-gray-600 flex items-center"><InfoCircle size={16} color="#5b50ff" className="mr-4" variant="Linear" /> Adresse</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {invoice.client.address.street}<br />
                  {invoice.client.address.postalCode} {invoice.client.address.city}<br />
                  {invoice.client.address.country}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Éléments de la facture */}
      <div className="rounded-xl">
        <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center mr-2">
            <DocumentText size={18} color="#5b50ff" variant="Bold" />
          </div>
          Éléments de la facture
        </h3>
        <div className="bg-white overflow-hidden rounded-xl border border-gray-100 transition-all duration-300 hover:border-[#e6e1ff]">
          <ul className="divide-y divide-gray-200">
            {invoice.items && invoice.items.map((item, index) => (
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
      {(invoice.headerNotes || invoice.footerNotes || invoice.termsAndConditions) && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
          <div className="bg-white overflow-hidden rounded-xl border border-gray-100 transition-all duration-300 hover:border-[#e6e1ff]">
            <div className="divide-y divide-gray-200">
            {invoice.headerNotes && (
              <div className="px-4 py-4 border-b border-gray-200">
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">En-tête</h4>
                <p className="text-sm text-gray-900">{invoice.headerNotes}</p>
              </div>
            )}
            {invoice.footerNotes && (
              <div className="px-4 py-4 border-b border-gray-200">
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Pied de page</h4>
                <p className="text-sm text-gray-900">{invoice.footerNotes}</p>
              </div>
            )}
            {invoice.termsAndConditions && (
              <div className="px-4 py-4 border-b border-gray-200">
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Conditions générales</h4>
                <p className="text-sm text-gray-900">{invoice.termsAndConditions}</p>
                {invoice.termsAndConditionsLink && (
                  <a 
                    href={invoice.termsAndConditionsLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-flex items-center"
                  >
                    {invoice.termsAndConditionsLinkTitle || 'Voir les conditions générales'} <ArrowRight size={14} className="ml-1" variant="Bold" />
                  </a>
                )}
              </div>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Actions de la sidebar
  const actions = (
    <>
      <div className="space-y-4">
        <div className="flex flex-col space-y-3">
          {invoice.status === 'DRAFT' && nextStatus && (
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
          {invoice.status === 'PENDING' && nextStatus && (
            <Button
              variant="primary"
              fullWidth
              className="bg-[#00c853] hover:bg-[#00a844] text-white rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md"
              onClick={() => onStatusChange(nextStatus)}
            >
              <TickCircle size={20} color="#fff" className="mr-2" variant="Bold" />
              Indiquer comme payée
              <ArrowRight size={18} className="ml-2" variant="Bold" />
            </Button>
          )}
          {invoice.status === 'PENDING' && (
            <Button
              variant="outline"
              color="red"
              fullWidth
              className="border border-[#f44336] text-[#f44336] hover:bg-gray-100 rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md"
              onClick={cancelInvoice}
            >
              <CloseCircle size={20} color="#f44336" className="mr-2" variant="Bold" />
              Annuler la facture
            </Button>
          )}
        </div>
      </div>
      {invoice.status === 'DRAFT' && (
        <div className="grid grid-cols-2 gap-3 mt-2">
          <Button
            variant="outline"
            onClick={onEdit}
            fullWidth
            className="border border-[#5b50ff] text-[#5b50ff] hover:bg-gray-100 rounded-2xl py-2.5 transition-all duration-200 flex items-center justify-center hover:shadow-md"
          >
            <Edit2 size={20} color="#5b50ff" className="mr-2" variant="Linear" />
            Modifier
          </Button>
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
          className={`fixed top-0 left-0 h-full w-1/2 bg-gray-50 z-[999] border-r border-gray-100 transition-all duration-500 ${
            isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
          style={{ display: isOpen ? "block" : "none", boxShadow: "5px 0 15px rgba(0,0,0,0.1)" }}
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
        width="w-1/2"
        position="right"
        actions={actions}
        className="custom-scrollbar bg-white shadow-xl"
      >
        <div className="animate-fadeIn space-y-6 px-1">
          {content}
        </div>
      </Sidebar>
    </>
  );
};
