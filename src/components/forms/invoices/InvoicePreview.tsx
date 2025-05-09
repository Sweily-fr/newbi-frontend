import React, { useState } from "react";
import { PDFGenerator, Loader } from "../../ui";
import { Client, CompanyInfo, Invoice, Item } from "../../../types";
import { getUnitAbbreviation } from "../../../utils/unitAbbreviations";
import { getTransactionCategoryDisplayText } from "../../../utils/transactionCategoryUtils";

interface InvoicePreviewProps {
  invoice?: Partial<Invoice>;
  selectedClient?: Client | null;
  isNewClient?: boolean;
  newClient?: Partial<Client>;
  items?: Item[];
  invoiceNumber?: string;
  invoicePrefix?: string;
  issueDate?: string;
  dueDate?: string;
  executionDate?: string;
  purchaseOrderNumber?: string;
  companyInfo?: CompanyInfo;
  calculateTotals?: () => {
    totalHT?: number;
    finalTotalHT?: number;
    totalVAT?: number;
    finalTotalTTC?: number;
    discountAmount?: number;
  };
  headerNotes?: string;
  footerNotes?: string;
  isDeposit?: boolean;
  customFields?: { key: string; value: string }[];
  termsAndConditions?: string;
  termsAndConditionsLinkTitle?: string;
  termsAndConditionsLink?: string;
  showActionButtons?: boolean;
  useBankDetails?: boolean;
  hasDifferentShippingAddress?: boolean;
  shippingAddress?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  selectedClient,
  isNewClient,
  newClient,
  items = [],
  invoiceNumber,
  invoicePrefix,
  issueDate,
  dueDate,
  executionDate,
  purchaseOrderNumber,
  companyInfo = invoice?.companyInfo,
  calculateTotals,
  headerNotes,
  footerNotes,
  isDeposit = false,
  customFields = [],
  termsAndConditions,
  termsAndConditionsLinkTitle,
  termsAndConditionsLink,
  showActionButtons,
  useBankDetails,
  hasDifferentShippingAddress = false,
  shippingAddress = {},
}) => {
  const totals = calculateTotals
    ? calculateTotals()
    : { finalTotalHT: 0, totalVAT: 0, finalTotalTTC: 0, totalHT: 0, discountAmount: 0 };

  // Fonction pour formater les dates
  const formatDate = (dateInput?: string | undefined | null) => {
    if (!dateInput) return "";

    try {
      // Vérifier si l'entrée est un timestamp (nombre)
      if (!isNaN(Number(dateInput))) {
        // C'est un timestamp, convertir en nombre et créer une Date
        const timestamp = Number(dateInput);
        const date = new Date(timestamp);

        // Vérifier si la date est valide
        if (isNaN(date.getTime())) {
          console.error("Timestamp invalide:", dateInput);
          return "Date invalide";
        }

        // Formater la date au format JJ-MM-AAAA
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      }

      // Créer un objet Date à partir de l'entrée (chaîne de caractères)
      const date = new Date(dateInput);

      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        console.error("Date invalide:", dateInput);
        return "Date invalide";
      }

      // Formater la date au format JJ-MM-AAAA
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error("Erreur lors du formatage de la date:", error);
      return "Erreur de date";
    }
  };

  // Formatage des montants
  const formatAmount = (amount?: number) => {
    if (amount === undefined) return "0,00 €";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  // Déterminer les informations du client à afficher
  let clientInfo = isNewClient
    ? newClient
    : selectedClient || invoice?.client || {};

  // Restructurer les données du nouveau client si nécessaire
  if (isNewClient) {
    // Créer une structure compatible avec l'affichage
    clientInfo = {
      ...clientInfo,
      // Si le client est nouveau et que les données d'adresse sont à plat (pas dans un objet address)
      address: {
        street: clientInfo?.street || "",
        city: clientInfo?.city || "",
        postalCode: clientInfo?.postalCode || "",
        country: clientInfo?.country || ""
      },
      siret: clientInfo?.siret || "",
      vatNumber: clientInfo?.vatNumber || ""
    };
  } else {
    // S'assurer que l'adresse du client existe toujours pour éviter les erreurs
    if (!clientInfo.address) {
      clientInfo.address = { street: "", city: "", postalCode: "", country: "" };
    }
    
    // S'assurer que les autres champs importants existent
    if (clientInfo?.siret === undefined) {
      clientInfo.siret = "";
    }
    
    if (clientInfo?.vatNumber === undefined) {
      clientInfo.vatNumber = "";
    }
  }

  // Vérifier si les boutons doivent être affichés en fonction du statut
  const showButtons =
    showActionButtons !== false &&
    (invoice?.status === "PENDING" || invoice?.status === "COMPLETED");

  // Contenu du PDF qui sera généré - sans les classes de largeur et centrage pour le PDF
  const documentContent = (
    <div
      className="bg-white print:overflow-visible"
      style={{ height: "auto", minHeight: "100%", fontFamily: "Poppins, sans-serif", color: "#5c5c5c" }}
    >
      <div
        className="p-6 pb-0 max-w-full"
        style={{
          minHeight: "auto",
          display: "flex",
          flexDirection: "column",
          pageBreakInside: "avoid",
          paddingBottom: "120px" /* Espace pour le footer en mode impression */,
        }}
        data-pdf-body="true"
        data-pdf-scale="1"
      >
        {/* En-tête avec logo et infos entreprise */}
        <div className="flex justify-between mb-8">
          <div className="w-24 h-24 flex justify-center items-center">
            {companyInfo?.logo && (
              <img
                src={`${import.meta.env.VITE_API_URL}/${companyInfo.logo}`}
                alt="Logo entreprise"
                className="h-auto mb-2 pdf-image"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  width: "auto",
                  visibility: "visible",
                  display: "block",
                  opacity: "1",
                }}
                data-pdf-image="true"
                loading="eager"
              />
            )}
            {/* <h3 className="text-lg font-normal">
              {companyInfo?.name || "Votre Entreprise"}
            </h3> */}
          </div>
          <div className="text-right">
            <h2 className="text-xl font-medium mb-4">
              {isDeposit ? "FACTURE D'ACOMPTE" : "FACTURE"}
            </h2>
            <p className="text-gray-600 text-xs mb-1">
              N° {invoicePrefix || ""}
              {invoiceNumber || invoice?.number || ""}
            </p>
            {(purchaseOrderNumber || invoice?.purchaseOrderNumber) && (
              <p className="text-gray-600 text-xs mb-1">
                Ref. Devis:{" "}
                {purchaseOrderNumber || invoice?.purchaseOrderNumber}
              </p>
            )}
            <p className="text-gray-600 text-xs mb-1">
              Date d'émission: {formatDate(issueDate || invoice?.issueDate)}
            </p>
            <p className="text-gray-600 text-xs mb-1">
              Date d'échéance: {formatDate(dueDate || invoice?.dueDate)}
            </p>
            <p className="text-gray-600 text-xs mb-1">
              Date de paiement:{" "}
              {formatDate(executionDate || invoice?.executionDate)}
            </p>
          </div>
        </div>

        <div className="flex justify-between mb-8">
          <div className={hasDifferentShippingAddress ? "w-1/3 pr-2" : "w-1/2 pr-4"}>
            <h3 className="font-normal mb-2">
              {companyInfo?.name || "Votre Entreprise"}
            </h3>
            <p className="text-xs">{companyInfo?.email}</p>
            <p className="text-xs">{companyInfo?.phone}</p>
            <p className="text-xs">{companyInfo?.address?.street}</p>
            <p className="text-xs">{companyInfo?.address?.city}</p>
            <p className="text-xs">{companyInfo?.address?.postalCode}</p>
            <p className="text-xs">{companyInfo?.address?.country}</p>
            {companyInfo?.siret && (
              <p className="text-xs">SIRET: {companyInfo.siret}</p>
            )}
            {companyInfo?.vatNumber && (
              <p className="text-xs">TVA: {companyInfo.vatNumber}</p>
            )}
          </div>
          <div className={hasDifferentShippingAddress ? "w-1/3 px-2" : "w-1/2 pl-4"}>
            <h3 className="font-normal mb-2">Facturer à :</h3>
            <p className="text-xs">{clientInfo?.name}</p>
            <p className="text-xs">{clientInfo?.email}</p>
            <p className="text-xs">{clientInfo?.address?.street}</p>
            <p className="text-xs">
              {clientInfo?.address?.postalCode} {clientInfo?.address?.city}
            </p>
            <p className="text-xs">{clientInfo.address?.country}</p>
            {clientInfo.siret && (
              <p className="text-xs">SIRET: {clientInfo.siret}</p>
            )}
            {clientInfo.vatNumber && (
              <p className="text-xs">TVA: {clientInfo.vatNumber}</p>
            )}
          </div>
          {hasDifferentShippingAddress && (
            <div className="w-1/3 pl-2">
              <h3 className="font-normal mb-2">Livrer à :</h3>
              <p className="text-xs">{clientInfo.name}</p>
              <p className="text-xs">{shippingAddress?.street}</p>
              <p className="text-xs">
                {shippingAddress?.postalCode} {shippingAddress?.city}
              </p>
              <p className="text-xs">{shippingAddress?.country}</p>
            </div>
          )}
        </div>

        {(headerNotes || invoice?.headerNotes) && (
          <div className="mb-4" data-pdf-no-break="true">
            <p className="whitespace-pre-line text-xs">
              {headerNotes || invoice?.headerNotes}
            </p>
          </div>
        )}

        {/* Tableau des articles */}
        <div className="mb-6 overflow-x-auto print:overflow-visible">
          <table
            className="w-full border-collapse table-fixed print:table-auto"
            data-pdf-table="true"
            data-pdf-table-header="repeat"
            style={{ pageBreakInside: "auto" }}
          >
            <thead
              data-pdf-thead="true"
              style={{ backgroundColor: "#3e3e3e", color: "#ffffff" }}
            >
              <tr data-pdf-tr="header">
                <th
                  className="text-xs font-normal text-left w-2/5 print:w-auto print:text-xs p-3"
                  data-pdf-column-width="40%"
                >
                  <span>Description</span>
                </th>
                <th
                  className="text-xs font-normal text-right w-1/6 print:w-auto print:text-xs p-2"
                  data-pdf-column-width="15%"
                >
                  <span>Quantité</span>
                </th>
                <th
                  className="text-xs font-normal text-right w-1/6 print:w-auto print:text-xs p-2"
                  data-pdf-column-width="15%"
                >
                  <span>Prix unitaire</span>
                </th>
                <th
                  className="text-xs font-normal text-right w-1/12 print:w-auto print:text-xs p-2"
                  data-pdf-column-width="10%"
                >
                  <span>TVA</span>
                </th>
                <th
                  className="text-xs font-normal text-right w-1/6 print:w-auto print:text-xs p-2"
                  data-pdf-column-width="20%"
                >
                  <span>Total HT</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {(invoice?.items || items)?.map((item, index) => {
                const itemTotal = item.quantity * item.unitPrice;

                // Ne calculer la remise que si elle est supérieure à 0
                const itemDiscount =
                  item.discount !== undefined && item.discount > 0
                    ? item.discountType === "PERCENTAGE"
                      ? itemTotal * (item.discount / 100)
                      : item.discount
                    : 0;
                const itemTotalAfterDiscount = itemTotal - itemDiscount;

                return (
                  <tr
                    key={index}
                    className="border-b"
                    style={{ pageBreakInside: "avoid" }}
                  >
                    <td className="p-2 text-xs">
                      <div className="font-medium break-words">
                        {item.description}
                      </div>
                      {item.details && (
                        <div className="text-xs text-gray-600 break-words">
                          {item.details}
                        </div>
                      )}
                      {/* N'afficher la remise que si elle est strictement supérieure à 0 */}
                      {item.discount !== undefined && item.discount > 0 && (
                        <div className="text-xs text-red-600">
                          Remise:{" "}
                          {item.discountType === "PERCENTAGE"
                            ? `${item.discount}%`
                            : formatAmount(item.discount)}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-xs text-right">
                      {item.quantity} {getUnitAbbreviation(item.unit)}
                    </td>
                    <td className="p-2 text-xs text-right">
                      {formatAmount(item.unitPrice)}
                    </td>
                    <td className="p-2 text-xs text-right">{item.vatRate}%</td>
                    <td className="p-2 text-xs text-right">
                      {item.discount !== undefined && item.discount > 0 && (
                        <div className="text-gray-500 text-sm line-through">
                          {formatAmount(itemTotal)}
                        </div>
                      )}
                      <div>{formatAmount(itemTotalAfterDiscount)}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totaux */}
        <div className="flex justify-end mb-8" data-pdf-no-break="true">
          <div
            className="ml-auto w-1/3 print:w-1/3"
            data-pdf-no-break="true"
            data-pdf-totals="true"
          >
            <div
              className="flex justify-between py-1 text-xs font-normal"
              data-pdf-total-item="true"
            >
              <span>Total HT</span>
              <span>{formatAmount(totals?.totalHT || invoice?.totalHT)}</span>
            </div>

            {(totals?.discountAmount || invoice?.discountAmount) > 0 && (
              <div
                className="flex justify-between py-1 text-xs text-red-600"
                data-pdf-total-item="true"
              >
                <span>
                  Remise{" "}
                  {invoice?.discountType === "PERCENTAGE"
                    ? `(${invoice?.discount}%)`
                    : ""}
                </span>
                <span>
                  -
                  {formatAmount(
                    totals?.discountAmount || invoice?.discountAmount
                  )}
                </span>
              </div>
            )}

            {(totals?.discountAmount || invoice?.discountAmount) > 0 && (
              <div
                className="flex justify-between py-1 text-xs font-normal"
                data-pdf-total-item="true"
              >
                <span>Total HT après remise</span>
                <span>
                  {formatAmount(
                    totals?.finalTotalHT || invoice?.finalTotalHT || 0
                  )}
                </span>
              </div>
            )}

            <div
              className="flex justify-between py-1 text-xs font-normal"
              data-pdf-total-item="true"
            >
              <span>TVA</span>
              <span>
                {formatAmount(totals?.totalVAT || invoice?.totalVAT || 0)}
              </span>
            </div>

            <div
              className="flex justify-between py-1 text-xs font-bold border-t border-gray-300"
              data-pdf-total-item="true"
              data-pdf-total-ttc="true"
            >
              <span>Total TTC</span>
              <span>
                {formatAmount(
                  totals?.finalTotalTTC || invoice?.finalTotalTTC || 0
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Affichage de la catégorie de transaction */}
        {companyInfo?.transactionCategory && (
          <div className="mb-3 w-4/6 print:w-4/6" data-pdf-keep-together="true">
            <p className="text-xs font-medium text-gray-700">
              {getTransactionCategoryDisplayText(companyInfo.transactionCategory)}
            </p>
          </div>
        )}

        {(termsAndConditions || invoice?.termsAndConditions) && (
          <div className="mb-6 w-4/6 print:w-4/6" data-pdf-keep-together="true">
            <p className="whitespace-pre-line text-xs">
              {termsAndConditions || invoice?.termsAndConditions}
            </p>
            {(termsAndConditionsLink || invoice?.termsAndConditionsLink) && (
              <a
                href={termsAndConditionsLink || invoice?.termsAndConditionsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-xs hover:underline"
              >
                {termsAndConditionsLinkTitle ||
                  invoice?.termsAndConditionsLinkTitle ||
                  "Voir les conditions générales"}
              </a>
            )}
          </div>
        )}
      </div>
      {/* Footer avec fond grisé - collé en bas et pleine largeur */}
      <div
        className="bg-gray-50 min-w-full p-0 print:fixed print:bottom-0"
        data-pdf-footer="true"
        data-pdf-footer-on-all-pages="true"
      >
        <div className="flex flex-col px-6 space-y-4">
          {/* Coordonnées bancaires - affichées uniquement si useBankDetails est vrai */}
          {useBankDetails && companyInfo?.bankDetails && (
            <div className="py-4">
              <h3 className="font-medium text-gray-700 mb-4">
                Coordonnées bancaires
              </h3>
              <div className="text-xs grid grid-cols-[30%_70%] gap-x-2 gap-y-1">
                <span className="text-gray-600 text-xs font-normal">
                  Banque
                </span>
                <span>{companyInfo.bankDetails.bankName}</span>
                <span className="text-gray-600 text-xs font-normal">IBAN</span>
                <span>{companyInfo.bankDetails.iban}</span>
                <span className="text-gray-600 text-xs font-normal">BIC</span>
                <span>{companyInfo.bankDetails.bic}</span>
              </div>
            </div>
          )}

          {/* Notes de pied de page */}
          {(footerNotes || invoice?.footerNotes) && (
            <div className="border-t border-gray-200 whitespace-pre-line py-4 mt-4 text-[10px] text-gray-600">
              <div>{footerNotes || invoice?.footerNotes}</div>
            </div>
          )}

          {/* Pagination */}
          <div className="text-xs text-gray-500 text-right py-2">
            <span style={{ display: "inline", whiteSpace: "nowrap" }}>
              Page{" "}
              <span data-pdf-page-number="true" style={{ display: "inline" }}>
                1
              </span>
              /
              <span data-pdf-total-pages="true" style={{ display: "inline" }}>
                1
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // États pour gérer le chargement et l'affichage
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  // Rendu final du composant
  return (
    <div
      className="bg-white overflow-hidden flex flex-col"
      style={{ height: "100vh" }}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-medium">Aperçu de la facture</h2>
        {showButtons && (
          <div className="flex space-x-2">
            <PDFGenerator
              content={documentContent}
              fileName={`Facture_${invoicePrefix || ""}${
                invoiceNumber || invoice?.number || ""
              }.pdf`}
              buttonText="Télécharger en PDF"
              buttonProps={{
                variant: "outline",
                size: "sm",
                className: "flex items-center",
              }}
              format="a4"
              orientation="portrait"
              onGenerationStart={() => {
                setIsGeneratingPDF(true);
              }}
              onGenerated={() => {
                setIsGeneratingPDF(false);
                setPdfSuccess(true);
                // Réinitialiser l'état de succès après 2 secondes
                setTimeout(() => setPdfSuccess(false), 2000);
              }}
              onGenerationError={() => {
                setIsGeneratingPDF(false);
              }}
            />
          </div>
        )}
      </div>
      <div
        className="flex-grow bg-[#f0eeff] py-12 overflow-auto overflow-x-hidden w-full relative"
        style={{ minHeight: "0" }}
      >
        {isGeneratingPDF && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f0eeff] bg-opacity-90 z-10">
            {pdfSuccess ? (
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-green-100 p-3 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Téléchargement réussi
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Loader className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Génération du PDF en cours...
                </p>
              </div>
            )}
          </div>
        )}
        <div
          className="w-10/12 sm:w-11/12 md:w-9/12 lg:w-8/12 xl:w-8/12 2xl:w-6/12 mx-auto max-w-4xl sm:max-w-5xl relative lg:max-w-6xl"
          style={{ minHeight: "29.7cm", height: "auto" }}
        >
          {documentContent}
        </div>
      </div>
    </div>
  );
};
