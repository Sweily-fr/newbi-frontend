import React, { useState, useEffect } from "react";
import { formatDate } from "../../../utils/date";
import { Sidebar } from "../../layout/Sidebar";
import { Button } from "../../ui";
import { InvoicePreview } from "../../forms/invoices/InvoicePreview";

interface InvoiceSidebarProps {
  invoice: {
    id: string;
    prefix: string;
    number: string;
    status: string;
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

  const statusColors = {
    DRAFT: "bg-gray-100 text-gray-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-800",
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "DRAFT":
        return "PENDING";
      case "PENDING":
        return "COMPLETED";
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(invoice.status);

  // Fonction pour calculer les totaux (nécessaire pour InvoicePreview)
  const calculateTotals = () => {
    return {
      totalHT: invoice.totalHT,
      totalVAT: invoice.totalVAT,
      finalTotalHT: invoice.finalTotalHT,
      finalTotalTTC: invoice.finalTotalTTC,
      discountAmount: invoice.discountAmount,
    };
  };

  // Contenu de la sidebar
  const content = (
    <div className="space-y-6">
      {/* Informations générales */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Informations générales</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <dl>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
              <dt className="text-sm font-medium text-gray-500">Date d'émission</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(invoice.issueDate)}
              </dd>
            </div>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Date d'échéance</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(invoice.dueDate)}
              </dd>
            </div>
            {invoice.executionDate && (
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                <dt className="text-sm font-medium text-gray-500">Date d'exécution</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(invoice.executionDate)}
                </dd>
              </div>
            )}
            {invoice.purchaseOrderNumber && (
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">N° de commande</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {invoice.purchaseOrderNumber}
                </dd>
              </div>
            )}
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
              <dt className="text-sm font-medium text-gray-500">Montant HT</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {invoice.totalHT?.toFixed(2) || '0.00'} €
              </dd>
            </div>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">TVA</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {invoice.totalVAT?.toFixed(2) || '0.00'} €
              </dd>
            </div>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
              <dt className="text-sm font-medium text-gray-500">Montant TTC</dt>
              <dd className="mt-1 text-sm font-bold text-gray-900 sm:mt-0 sm:col-span-2">
                {invoice.finalTotalTTC?.toFixed(2) || '0.00'} €
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Client */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Client</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <dl>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
              <dt className="text-sm font-medium text-gray-500">Nom</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {invoice.client.name}
              </dd>
            </div>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {invoice.client.email}
              </dd>
            </div>
            {invoice.client.siret && (
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                <dt className="text-sm font-medium text-gray-500">SIRET</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {invoice.client.siret}
                </dd>
              </div>
            )}
            {invoice.client.vatNumber && (
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">N° TVA</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {invoice.client.vatNumber}
                </dd>
              </div>
            )}
            {invoice.client.address && (
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                <dt className="text-sm font-medium text-gray-500">Adresse</dt>
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
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Éléments de la facture</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {invoice.items && invoice.items.map((item, index) => (
              <li key={index} className="px-4 py-3">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.description}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} {item.unit || 'unité(s)'} x {item.unitPrice.toFixed(2)} € 
                      {item.discount && item.discount > 0 && ` (-${item.discount}${item.discountType === 'PERCENTAGE' ? '%' : '€'})`}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
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
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {invoice.headerNotes && (
              <div className="px-4 py-3">
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">En-tête</h4>
                <p className="text-sm text-gray-900">{invoice.headerNotes}</p>
              </div>
            )}
            {invoice.footerNotes && (
              <div className="px-4 py-3 border-t border-gray-200">
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Pied de page</h4>
                <p className="text-sm text-gray-900">{invoice.footerNotes}</p>
              </div>
            )}
            {invoice.termsAndConditions && (
              <div className="px-4 py-3 border-t border-gray-200">
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Conditions générales</h4>
                <p className="text-sm text-gray-900">{invoice.termsAndConditions}</p>
                {invoice.termsAndConditionsLink && (
                  <a 
                    href={invoice.termsAndConditionsLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
                  >
                    {invoice.termsAndConditionsLinkTitle || 'Voir les conditions générales'}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Actions de la sidebar
  const actions = (
    <>
    {/* Statut et actions */}
    <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-500">Statut</h3>
          <div className="flex items-center">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              invoice.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
              invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {invoice.status === 'DRAFT' ? 'Brouillon' :
               invoice.status === 'PENDING' ? 'À encaisser' :
               'Payée'}
            </span>
          </div>
        </div>

        <div className="space-y-2 mt-2">
          {nextStatus && (
            <Button
              variant="outline"
              color={nextStatus === "PENDING" ? "yellow" : "green"}
              fullWidth
              onClick={() => onStatusChange(nextStatus)}
            >
              {nextStatus === "PENDING" ? "Marquer à encaisser" : "Indiquer comme payée"}
            </Button>
          )}
        </div>
      </div>
      {invoice.status !== 'COMPLETED' && (
        <Button
          variant="outline"
          onClick={onEdit}
          fullWidth
          className="flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Modifier
        </Button>
      )}
      {invoice.status === 'DRAFT' && (
        <Button
          variant="outline"
          color="red"
          onClick={onDelete}
          fullWidth
          className="flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Supprimer
        </Button>
      )}
    </>
  );

  return (
    <>
      {/* Prévisualisation de la facture */}
      {showPreview && (
        <div
          className={`fixed top-0 left-0 h-full w-[calc(100%-32rem)] bg-gray-50 z-[9999] transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{ display: isOpen ? "block" : "none" }}
        >
          <div className="h-full overflow-auto">
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
            />
          </div>
        </div>
      )}

      <Sidebar
        isOpen={isOpen}
        onClose={onClose}
        title={`Facture ${invoice.prefix}${invoice.number}`}
        width="w-[32rem]"
        position="right"
        actions={actions}
      >
        {content}
      </Sidebar>
    </>
  );
};
