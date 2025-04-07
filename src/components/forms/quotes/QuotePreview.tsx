import React, { useState } from "react";
import { Quote, CompanyInfo } from "../../../types";
import { Button, PDFGenerator, Loader } from "../../ui";

interface QuotePreviewProps {
  quote: Partial<Quote>;
  showActionButtons?: boolean;
  companyInfo?: CompanyInfo;
  calculateTotals?: () => {
    finalTotalHT: number;
    totalVAT: number;
    finalTotalTTC: number;
  };
  useBankDetails?: boolean;
}

export const QuotePreview: React.FC<QuotePreviewProps> = ({
  quote,
  showActionButtons = true,
  companyInfo = quote.companyInfo,
  useBankDetails,
}) => {
  // Vérifier si les boutons doivent être affichés en fonction du statut
  const showButtons = showActionButtons;
  // Vérifier si le bouton de téléchargement PDF doit être affiché
  const showPdfButton =
    quote?.status === "PENDING" ||
    quote?.status === "DRAFT" ||
    quote?.status === "COMPLETED";
  // Fonction pour formater les dates
  const formatDate = (dateInput?: string | null) => {
    if (!dateInput) return "";

    try {
      // Vérifier si l'entrée est un timestamp (nombre)
      if (!isNaN(Number(dateInput))) {
        // C'est un timestamp, convertir en nombre et créer une Date
        const timestamp = Number(dateInput);
        const date = new Date(timestamp);

        // Vérifier si la date est valide
        if (isNaN(date.getTime())) {
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
        return "Date invalide";
      }

      // Formater la date au format JJ-MM-AAAA
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    } catch (error) {
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

  // Contenu du PDF qui sera généré - sans les classes de largeur et centrage pour le PDF
  // Log des informations de companyInfo pour le débogage
  console.log("CompanyInfo dans QuotePreview:", companyInfo);

  const documentContent = (
    <div className="bg-white h-full print:overflow-visible">
      <div
        className="p-6 pb-0 max-w-full"
        style={{
          minHeight: "auto",
          display: "flex",
          flexDirection: "column",
          pageBreakInside: "avoid",
        }}
        data-pdf-body="true"
        data-pdf-scale="1"
      >
        {/* En-tête avec logo et infos entreprise */}
        <div className="flex justify-between mb-8" data-pdf-no-break="true">
          <div className="w-24 h-24 flex justify-center items-center">
            {companyInfo?.logo && (
              <img
                src={
                  companyInfo.logo.startsWith("http")
                    ? companyInfo.logo
                    : `${import.meta.env.VITE_API_URL}${companyInfo.logo}`
                }
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
          </div>
          <div className="text-right">
            <h2 className="text-xl font-medium mb-4">DEVIS</h2>
            <p className="text-gray-600 text-xs mb-1">
              N° {quote.prefix || ""}
              {quote.number || ""}
            </p>
            <p className="text-gray-600 text-xs mb-1">
              Date d'émission: {formatDate(quote.issueDate)}
            </p>
            {quote.validUntil && (
              <p className="text-gray-600 text-xs mb-1">
                Valide jusqu'au: {formatDate(quote.validUntil)}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between mb-8" data-pdf-no-break="true">
          <div className="w-1/2 pr-4">
            <h3 className="font-normal mb-2">
              {companyInfo?.name || "Votre Entreprise"}
            </h3>
            <p className="text-xs">{quote.companyInfo?.email}</p>
            <p className="text-xs">{quote.companyInfo?.phone}</p>
            {quote.companyInfo?.siret && (
              <p className="text-xs">SIRET: {quote.companyInfo.siret}</p>
            )}
            {quote.companyInfo?.vatNumber && (
              <p className="text-xs">TVA: {quote.companyInfo.vatNumber}</p>
            )}
          </div>
          <div className="w-1/2 pl-4">
            <h3 className="font-normal mb-2">
              {quote.client?.name || "Client"}
            </h3>
            <p className="text-xs">{quote.client?.email}</p>
            <p className="text-xs">{quote.client?.address?.street}</p>
            <p className="text-xs">
              {quote.client?.address?.postalCode} {quote.client?.address?.city}
            </p>
            <p className="text-xs">{quote.client?.address?.country}</p>
            {quote.client?.siret && (
              <p className="text-xs">SIRET: {quote.client.siret}</p>
            )}
            {quote.client?.vatNumber && (
              <p className="text-xs">TVA: {quote.client.vatNumber}</p>
            )}
          </div>
        </div>

        {quote.headerNotes && (
          <div className="mb-4" data-pdf-no-break="true">
            <p className="text-xs whitespace-pre-line">{quote.headerNotes}</p>
          </div>
        )}
        <div className="mb-6 overflow-x-auto print:overflow-visible">
          <table
            className="w-full border-collapse table-fixed print:table-auto"
            data-pdf-table="true"
            data-pdf-table-header="repeat"
            style={{ pageBreakInside: "auto" }}
          >
            <thead
              data-pdf-thead="true"
              style={{ backgroundColor: "#111111", color: "#ffffff" }}
            >
              <tr data-pdf-tr="header">
                <th
                  className="text-xs font-normal text-left w-2/5 print:w-auto print:text-xs p-2"
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
              {quote.items?.map((item, index) => {
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
                      {item.quantity} {item.unit}
                    </td>
                    <td className="p-2 text-xs text-right">
                      {formatAmount(item.unitPrice)}
                    </td>
                    <td className="p-2 text-xs text-right">{item.vatRate}%</td>
                    <td className="p-2 text-xs text-right">
                      {item.discount !== undefined && item.discount > 0 && (
                        <div className="text-gray-500 line-through text-xs">
                          {formatAmount(itemTotal)}
                        </div>
                      )}
                      {formatAmount(itemTotalAfterDiscount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-8" data-pdf-no-break="true">
          <div
            className="ml-auto w-1/3 print:w-1/3"
            data-pdf-no-break="true"
            data-pdf-totals="true"
          >
            <div
              className="flex justify-between py-1 text-xs"
              data-pdf-total-item="true"
            >
              <span>Total HT</span>
              <span>{formatAmount(quote.totalHT)}</span>
            </div>

            {quote.discount !== undefined && quote.discount > 0 && (
              <div
                className="flex justify-between py-1 text-xs text-red-600"
                data-pdf-total-item="true"
              >
                <span>
                  Remise{" "}
                  {quote.discountType === "PERCENTAGE"
                    ? `(${quote.discount}%)`
                    : ""}
                </span>
                <span>-{formatAmount(quote.discountAmount)}</span>
              </div>
            )}

            {quote.discount !== undefined && quote.discount > 0 && (
              <div
                className="flex justify-between py-1 text-xs font-normal"
                data-pdf-total-item="true"
              >
                <span>Total HT après remise</span>
                <span>
                  {formatAmount(quote.finalTotalHT || quote.totalHT || 0)}
                </span>
              </div>
            )}

            <div
              className="flex justify-between py-1 text-xs"
              data-pdf-total-item="true"
            >
              <span>TVA</span>
              <span>{formatAmount(quote.totalVAT || 0)}</span>
            </div>

            <div
              className="flex justify-between py-1 text-xs font-medium border-t border-gray-300"
              data-pdf-total-item="true"
              data-pdf-total-ttc="true"
            >
              <span>Total TTC</span>
              <span>
                {formatAmount(quote.finalTotalTTC || quote.totalTTC || 0)}
              </span>
            </div>

            {quote.customFields && quote.customFields.length > 0 && (
              <div>
                {quote.customFields.map((field, index) => (
                  <div
                    key={index}
                    className="flex justify-between py-1 text-xs"
                  >
                    <span>{field.key}</span>
                    <span>{field.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {quote.termsAndConditions && (
          <div className="mb-6 w-4/6 print:w-4/6" data-pdf-keep-together="true">
            <p className="whitespace-pre-line text-xs">
              {quote.termsAndConditions}
            </p>
            {quote.termsAndConditionsLink &&
              quote.termsAndConditionsLinkTitle && (
                <a
                  href={quote.termsAndConditionsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-xs hover:underline"
                >
                  {quote.termsAndConditionsLinkTitle}
                </a>
              )}
          </div>
        )}

        {/* Footer avec fond grisé - collé en bas et pleine largeur */}
        <div
          className="bg-gray-50 p-0 print:fixed print:bottom-0 absolute bottom-0 left-0"
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
                  <span className="text-gray-600 text-xs font-normal">
                    IBAN
                  </span>
                  <span>{companyInfo.bankDetails.iban}</span>
                  <span className="text-gray-600 text-xs font-normal">BIC</span>
                  <span>{companyInfo.bankDetails.bic}</span>
                </div>
              </div>
            )}

            {/* Notes de pied de page */}
            {quote.footerNotes && (
              <div className="border-t border-gray-200 whitespace-pre-line py-4 mt-4 text-[10px] text-gray-600">
                <div>{quote.footerNotes}</div>
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
    </div>
  );

  // États pour gérer le chargement et l'affichage
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  // Rendu final du composant
  return (
    <div className="bg-white overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-medium">Aperçu du devis</h2>
        {showButtons && (
          <div className="flex space-x-2">
            {showPdfButton && (
              <PDFGenerator
                content={documentContent}
                fileName={`Devis_${quote.prefix || ""}${
                  quote.number || ""
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
                onGenerated={(pdf) => {
                  console.log("PDF généré avec succès", pdf);
                  setIsGeneratingPDF(false);
                  setPdfSuccess(true);
                  // Réinitialiser l'état de succès après 2 secondes
                  setTimeout(() => setPdfSuccess(false), 2000);
                }}
                onGenerationError={() => {
                  setIsGeneratingPDF(false);
                }}
              />
            )}
          </div>
        )}
      </div>
      <div className="flex-grow bg-blue-50 py-12 overflow-auto overflow-x-hidden w-full relative">
        {isGeneratingPDF && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90 z-10">
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
          style={{ aspectRatio: "1/1.414", height: "auto" }}
        >
          {documentContent}
        </div>
      </div>
    </div>
  );
};
