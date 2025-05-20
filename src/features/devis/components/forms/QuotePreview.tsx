import React, { useState } from "react";
import { CompanyInfo } from "../../../../types";
import { Quote } from "../../../devis/types/quote";
import { Client } from "../../../clients/types/client";
import { Item } from "../../../factures/types/invoice";
import { getUnitAbbreviation } from "../../../../utils/unitAbbreviations";
import { getTransactionCategoryDisplayText } from "../../../../utils/transactionCategoryUtils";
import { formatIban } from "../../../../utils/ibanFormatter";
import { PDFGenerator, Loader } from "../../../../components/";

interface QuotePreviewProps {
  quote: Partial<Quote>;
  companyInfo?: CompanyInfo;
  selectedClient?: Client | null;
  isNewClient?: boolean;
  newClient?: Partial<Client>;
  calculateTotals?: () => {
    subtotal: number;
    totalVAT: number;
    totalWithoutVAT: number;
    totalWithVAT: number;
    totalDiscount: number;
    vatRates?: Array<{
      rate: number;
      amount: number;
      baseAmount: number;
    }>;
  };
  footerNotes?: string;
  // Cette prop est utilisée pour déterminer si les coordonnées bancaires doivent être affichées
  useBankDetails?: boolean;
  // Prop pour contrôler l'affichage des boutons d'action
  showActionButtons?: boolean;
}

export const QuotePreview: React.FC<QuotePreviewProps> = ({
  quote,
  companyInfo = quote.companyInfo,
  selectedClient,
  isNewClient,
  newClient,
  calculateTotals,
  footerNotes,
  useBankDetails,
  showActionButtons = true,
}) => {
  // Calculer les totaux si la fonction est fournie
  const totals = calculateTotals ? calculateTotals() : null;
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
    } catch {
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
  
  // La fonction formatIban est maintenant importée depuis utils/ibanFormatter.ts

  // Déterminer les informations du client à afficher
  const clientInfo: Partial<Client> & {
    address?: {
      street?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    };
    shippingAddress?: {
      street?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    };
  } = isNewClient
    ? {
        ...newClient,
        address: {
          street: newClient?.street || "",
          city: newClient?.city || "",
          postalCode: newClient?.postalCode || "",
          country: newClient?.country || ""
        }
      }
    : selectedClient || quote.client || {};

  // Déterminer si le client a une adresse de livraison différente
  const hasShippingAddress =
    clientInfo?.hasDifferentShippingAddress && clientInfo?.shippingAddress;

  // Détermination des informations client terminée

  const documentContent = (
    <div
      className="bg-white print:overflow-visible"
      style={{
        height: "auto",
        minHeight: "100%",
        fontFamily: "Poppins, sans-serif",
        color: "#5c5c5c",
      }}
    >
      <div
        className="p-6 max-w-full"
        style={{
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
          pageBreakInside: "avoid",
          paddingBottom: "40px",
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
                    : `${import.meta.env.VITE_API_URL}/${companyInfo.logo}`
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
          <div className={hasShippingAddress ? "w-1/3 pr-2" : "w-1/2 pr-4"}>
            <h3 className="font-normal mb-2">
              {companyInfo?.name || "Votre Entreprise"}
            </h3>
            <p className="text-xs">{quote.companyInfo?.email}</p>
            <p className="text-xs">{quote.companyInfo?.phone}</p>
            <p className="text-xs">{quote.companyInfo?.address?.street}</p>
            <p className="text-xs">
              {quote.companyInfo?.address?.postalCode}{" "}
              {quote.companyInfo?.address?.city}
            </p>
            <p className="text-xs">{quote.companyInfo?.address?.country}</p>
            {quote.companyInfo?.siret && (
              <p className="text-xs">SIRET: {quote.companyInfo.siret}</p>
            )}
            {quote.companyInfo?.vatNumber && (
              <p className="text-xs">TVA: {quote.companyInfo.vatNumber}</p>
            )}
          </div>
          <div className={hasShippingAddress ? "w-1/3 px-2" : "w-1/2 pl-4"}>
            <h3 className="font-normal mb-2">Facturer à :</h3>
            <p className="text-xs">{clientInfo?.name || "Client"}</p>
            <p className="text-xs">{clientInfo?.email}</p>
            <p className="text-xs">{clientInfo?.address?.street}</p>
            <p className="text-xs">
              {clientInfo?.address?.postalCode} {clientInfo?.address?.city}
            </p>
            <p className="text-xs">{clientInfo?.address?.country}</p>
            {clientInfo?.siret && (
              <p className="text-xs">SIRET: {clientInfo.siret}</p>
            )}
            {clientInfo?.vatNumber && (
              <p className="text-xs">TVA: {clientInfo.vatNumber}</p>
            )}
          </div>
          {hasShippingAddress && (
            <div className="w-1/3 pl-2">
              <h3 className="font-normal mb-2">Livrer à :</h3>
              <p className="text-xs">{clientInfo.name}</p>
              <p className="text-xs">{clientInfo.shippingAddress?.street}</p>
              <p className="text-xs">
                {clientInfo.shippingAddress?.postalCode}{" "}
                {clientInfo.shippingAddress?.city}
              </p>
              <p className="text-xs">{clientInfo.shippingAddress?.country}</p>
            </div>
          )}
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
                    className="border-b "
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
                      {item.quantity}{" "}
                      {(() => {
                        return getUnitAbbreviation(item.unit);
                      })()}
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
            className="ml-auto w-1/2 print:w-1/3"
            data-pdf-no-break="true"
            data-pdf-totals="true"
          >
            <div
              className="flex justify-between py-1 text-xs"
              data-pdf-total-item="true"
            >
              <span>Total HT</span>
              <span>
                {totals
                  ? formatAmount(totals.subtotal + totals.totalDiscount)
                  : formatAmount(quote.totalHT || 0)}
              </span>
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
                <span>
                  -
                  {totals
                    ? formatAmount(totals.totalDiscount)
                    : formatAmount(quote.discountAmount || 0)}
                </span>
              </div>
            )}

            {quote.discount !== undefined && quote.discount > 0 && (
              <div
                className="flex justify-between py-1 text-xs font-normal"
                data-pdf-total-item="true"
              >
                <span>Total HT après remise</span>
                <span>
                  {totals
                    ? formatAmount(totals.totalWithoutVAT)
                    : formatAmount(quote.finalTotalHT || quote.totalHT || 0)}
                </span>
              </div>
            )}

            {/* Affichage détaillé des TVA si plusieurs taux sont utilisés */}
            {(() => {
              // Récupérer les détails des TVA depuis calculateTotals ou quote
              // Utiliser une approche plus sûre pour accéder à calculateTotals
              let totalsData = null;
              try {
                if (typeof calculateTotals === "function") {
                  totalsData = calculateTotals();
                }
              } catch (error) {
                console.error("Erreur lors du calcul des totaux:", error);
              }

              const vatRates = totalsData?.vatRates || quote.vatRates;

              // Vérifier si nous avons plusieurs taux de TVA
              if (vatRates && vatRates.length > 1) {
                return (
                  <>
                    {/* Afficher chaque taux de TVA séparément */}
                    {vatRates.map(
                      (
                        vatDetail: {
                          rate: number;
                          amount: number;
                          baseAmount: number;
                        },
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="flex justify-between py-1 text-xs"
                          data-pdf-total-item="true"
                        >
                          <span>
                            Montant de la TVA ({vatDetail.rate} % de{" "}
                            {formatAmount(vatDetail.baseAmount)})
                          </span>
                          <span>{formatAmount(vatDetail.amount)}</span>
                        </div>
                      )
                    )}
                    {/* Afficher le total de TVA */}
                    <div
                      className="flex justify-between font-bold py-1 text-xs"
                      data-pdf-total-item="true"
                    >
                      <span>Montant total de TVA</span>
                      <span>
                        {formatAmount(
                          totalsData?.totalVAT || quote.totalVAT || 0
                        )}
                      </span>
                    </div>
                  </>
                );
              } else {
                // Afficher seulement le total de TVA si un seul taux est utilisé
                return (
                  <div
                    className="flex justify-between py-1 text-xs"
                    data-pdf-total-item="true"
                  >
                    <span>TVA</span>
                    <span>{formatAmount(quote.totalVAT || 0)}</span>
                  </div>
                );
              }
            })()}

            <div
              className="flex justify-between font-bold py-1 text-xs border-t border-gray-300"
              data-pdf-total-item="true"
              data-pdf-total-ttc="true"
            >
              <span>Total TTC</span>
              <span>
                {totals
                  ? formatAmount(totals.totalWithVAT)
                  : formatAmount(quote.finalTotalTTC || quote.totalTTC || 0)}
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

        {/* Affichage des mentions d'exonération de TVA */}
        {((quote.items &&
          quote.items.length > 0 &&
          quote.items.some(
            (item: Item) => item.vatRate === 0 && item.vatExemptionText
          )) ||
          quote.vatExemptionText) && (
          <div
            className="mb-3 w-full print:w-full"
            data-pdf-keep-together="true"
          >
            {/* Afficher le texte d'exonération global du devis s'il existe */}
            {quote.vatExemptionText && (
              <p className="text-xs text-gray-600 mb-1">
                {quote.vatExemptionText}
              </p>
            )}
            {/* Afficher chaque mention unique des éléments une seule fois */}
            {quote.items &&
              (
                Array.from(
                  new Set(
                    quote.items
                      .filter(
                        (item: Item) =>
                          item.vatRate === 0 && item.vatExemptionText
                      )
                      .map((item: Item) => item.vatExemptionText)
                      .filter(Boolean) as string[]
                  )
                ) as string[]
              ).map((text, index) => (
                <p key={index} className="text-xs text-gray-600 mb-1">
                  {text}
                </p>
              ))}
          </div>
        )}

        {/* Affichage de la catégorie de transaction */}
        {companyInfo?.transactionCategory ? (
          <div className="mb-3 w-4/6 print:w-4/6" data-pdf-keep-together="true">
            <p className="text-xs font-medium text-gray-700">
              {(() => {
                const displayText = getTransactionCategoryDisplayText(
                  companyInfo.transactionCategory
                );
                return (
                  displayText ||
                  `Catégorie de transaction : ${companyInfo.transactionCategory}`
                );
              })()}
            </p>
          </div>
        ) : null}

        {quote.termsAndConditions && (
          <div className="mb-6 w-6/6 print:w-6/6" data-pdf-keep-together="true">
            <p className="whitespace-pre-line text-xs">
              {quote.termsAndConditions}
            </p>
            {quote.termsAndConditionsLink &&
              quote.termsAndConditionsLinkTitle && (
                <a
                  href={quote.termsAndConditionsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-600 text-xs hover:underline"
                >
                  {quote.termsAndConditionsLinkTitle}
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
                {/* Nom du bénéficiaire */}
                <span className="text-gray-600 text-xs font-normal">
                  Nom du bénéficiaire
                </span>
                <span className="font-medium">{companyInfo.name}</span>
                

                
                {/* Coordonnées bancaires */}
                <span className="text-gray-600 text-xs font-normal">
                  Banque
                </span>
                <span>{companyInfo.bankDetails.bankName}</span>
                <span className="text-gray-600 text-xs font-normal">IBAN</span>
                <span>{formatIban(companyInfo.bankDetails.iban)}</span>
                <span className="text-gray-600 text-xs font-normal">BIC</span>
                <span>{companyInfo.bankDetails.bic}</span>
              </div>
            </div>
          )}

          {/* Notes de pied de page */}
          {(footerNotes || quote?.footerNotes) && (
            <div className="border-t border-gray-200 whitespace-pre-line py-4 mt-4 text-[10px] text-gray-600">
              <div>{footerNotes || quote?.footerNotes}</div>
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

  // Vérifier si les boutons doivent être affichés en fonction du statut
  // Afficher les boutons uniquement si le devis a un statut défini (donc déjà créé)
  const showButtons =
    showActionButtons &&
    quote?.status &&
    (quote.status === "PENDING" || quote.status === "COMPLETED");

  return (
    <div
      className="bg-white overflow-hidden flex flex-col"
      style={{ height: "100%" }}
    >
      {showButtons && (
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex space-x-2">
            <PDFGenerator
              content={documentContent}
              fileName={`Devis_${quote?.prefix || ""}${
                quote?.number || ""
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
        </div>
      )}
      <div className="flex-grow bg-[#f0eeff] overflow-y-auto overflow-x-hidden w-full relative custom-scrollbar" style={{ paddingBottom: "40px" }}>
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
          className="w-full sm:w-full md:w-full lg:w-full xl:w-full 2xl:w-full mx-auto max-w-4xl sm:max-w-5xl relative lg:max-w-6xl pb-20"
          style={{ height: "auto" }}
        >
          {documentContent}
        </div>
      </div>
    </div>
  );
};
