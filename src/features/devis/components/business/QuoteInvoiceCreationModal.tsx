import React, { useState, useEffect } from "react";
import { Modal } from "../../../../components/feedback/Modal";
import { Button } from "../../../../components/ui";
import { useMutation, useQuery } from "@apollo/client";
import { CONVERT_QUOTE_TO_INVOICE_MUTATION, GET_QUOTE } from "../../../../graphql/quotes";
import { Notification } from "../../../../components/feedback";

interface Invoice {
  id: string;
  prefix: string;
  number: string;
  status: "DRAFT" | "PENDING" | "COMPLETED";
  finalTotalTTC?: number;
  isDeposit?: boolean;
}

interface QuoteInvoiceCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreated: () => void;
  quoteId: string;
  quoteTotal: number;
  linkedInvoices?: Invoice[];
}

export const QuoteInvoiceCreationModal: React.FC<
  QuoteInvoiceCreationModalProps
> = ({
  isOpen,
  onClose,
  onInvoiceCreated,
  quoteId,
  quoteTotal,
  linkedInvoices = [],
}) => {
  // Utiliser useQuery pour obtenir les données à jour du devis
  const { data: quoteData, loading: quoteLoading, refetch } = useQuery(GET_QUOTE, {
    variables: { id: quoteId },
    skip: !quoteId || !isOpen, // Ne pas exécuter la requête si la modal n'est pas ouverte
    fetchPolicy: 'network-only', // Toujours récupérer les données depuis le serveur
  });

  // Utiliser les données du devis récupérées par la requête si disponibles
  const currentLinkedInvoices = quoteData?.quote?.linkedInvoices || linkedInvoices;
  const currentQuoteTotal = quoteData?.quote?.finalTotalTTC || quoteTotal;

  // Définir le type de facture par défaut en fonction de l'existence de factures liées
  const [invoiceType, setInvoiceType] = useState<"deposit" | "regular">(
    currentLinkedInvoices.length === 0 ? "deposit" : "regular"
  );
  const [depositPercentage, setDepositPercentage] = useState(30); // Pourcentage d'acompte par défaut
  const [remainingAmount, setRemainingAmount] = useState(currentQuoteTotal);
  const [remainingPercentage, setRemainingPercentage] = useState(100);
  const [useRemainingBalance, setUseRemainingBalance] = useState(false);

  const [convertToInvoice, { loading: mutationLoading }] = useMutation(
    CONVERT_QUOTE_TO_INVOICE_MUTATION,
    {
      onCompleted: (data) => {
        const invoiceTypeText = invoiceType === "deposit" ? "d'acompte" : "";
        Notification.success(
          `Facture ${invoiceTypeText} n°${data.convertQuoteToInvoice.number} créée avec succès`,
          {
            duration: 5000,
            position: "bottom-left",
          }
        );
        // Rafraîchir les données du devis après la création de la facture
        refetch().then(() => {
          onInvoiceCreated();
          onClose();
        });
      },
      onError: (error) => {
        Notification.error(
          `Erreur lors de la création de la facture: ${error.message}`,
          {
            duration: 8000,
            position: "bottom-left",
          }
        );
      },
    }
  );

  // Calculer le montant et le pourcentage restants
  useEffect(() => {
    if (currentLinkedInvoices && currentLinkedInvoices.length > 0) {
      const invoicedAmount = currentLinkedInvoices.reduce(
        (sum: number, invoice: Invoice) => sum + (invoice.finalTotalTTC || 0),
        0
      );
      const remaining = currentQuoteTotal - invoicedAmount;
      const remainingPercent = (remaining / currentQuoteTotal) * 100;

      setRemainingAmount(remaining);
      setRemainingPercentage(remainingPercent);

      // Si c'est la dernière facture possible (déjà 2 factures liées), utiliser automatiquement le solde restant
      if (currentLinkedInvoices.length === 2) {
        setUseRemainingBalance(true);
        setDepositPercentage(remainingPercent);
      } else {
        // Pour les autres cas, si le pourcentage restant est inférieur à la valeur par défaut
        // ajuster le pourcentage par défaut pour ne pas dépasser le restant
        if (remainingPercent < depositPercentage) {
          setDepositPercentage(Math.max(5, remainingPercent));
        }
      }
    } else {
      setRemainingAmount(currentQuoteTotal);
      setRemainingPercentage(100);
    }
  }, [currentLinkedInvoices, currentQuoteTotal, depositPercentage]);

  // Gérer le changement de pourcentage d'acompte
  const handleDepositPercentageChange = (value: number) => {
    // Limiter entre 5% et le pourcentage restant (ou 95% max)
    const maxPercentage = useRemainingBalance
      ? remainingPercentage
      : Math.min(95, remainingPercentage);
    const validValue = Math.max(5, Math.min(maxPercentage, value));
    setDepositPercentage(validValue);
  };

  // Utiliser le solde restant pour la facture
  const handleToggleUseRemainingBalance = () => {
    setUseRemainingBalance(!useRemainingBalance);
    if (!useRemainingBalance) {
      setDepositPercentage(remainingPercentage);
    } else {
      setDepositPercentage(Math.min(30, remainingPercentage));
    }
  };

  // Effet pour forcer le type de facture régulière si des factures sont déjà liées
  useEffect(() => {
    if (currentLinkedInvoices.length > 0 && invoiceType === "deposit") {
      setInvoiceType("regular");
    }
  }, [currentLinkedInvoices.length, invoiceType]);

  // Créer la facture
  const handleCreateInvoice = () => {
    interface ConvertVariables {
      id: string;
      distribution?: number[];
      isDeposit?: boolean;
      skipValidation?: boolean;
    }

    const variables: ConvertVariables = { id: quoteId };

    if (invoiceType === "deposit") {
      // Pour une facture d'acompte
      variables.distribution = [depositPercentage];
      variables.isDeposit = true;
      variables.skipValidation = true;
    } else {
      // Pour une facture régulière
      const percentageToUse = useRemainingBalance ? remainingPercentage : depositPercentage;
      
      // S'assurer que le pourcentage ne dépasse pas le solde restant
      const safePercentage = Math.min(percentageToUse, remainingPercentage);
      
      variables.distribution = [safePercentage];
      variables.isDeposit = false;
      variables.skipValidation = useRemainingBalance;
    }

    convertToInvoice({ variables });
  };

  // Calculer le montant correspondant au pourcentage
  const calculateAmount = (percentage: number) => {
    return (quoteTotal * percentage) / 100;
  };

  // Vérifier si on peut créer une nouvelle facture
  const canCreateInvoice = currentLinkedInvoices.length < 3;

  // Calculer le pourcentage total facturé
  const invoicedPercentage = 100 - remainingPercentage;
  
  // Déterminer si la modal est en cours de chargement
  const loading = quoteLoading || mutationLoading;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Création de facture à partir du devis"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleCreateInvoice}
            isLoading={loading}
            disabled={!canCreateInvoice}
          >
            Créer
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : !canCreateInvoice ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800">
            Ce devis a déjà 3 factures liées. Vous ne pouvez pas en créer
            davantage.
          </div>
        ) : (
          <>
            {/* Progression des factures */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Progression de facturation
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {invoicedPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${invoicedPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>0€</span>
                <span>{quoteTotal.toFixed(2)}€</span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {linkedInvoices.length > 0 ? (
                  <span>
                    {linkedInvoices.length} facture(s) existante(s) pour un
                    total de {(quoteTotal - remainingAmount).toFixed(2)}€
                  </span>
                ) : (
                  <span>Aucune facture existante</span>
                )}
              </div>
            </div>

            {/* Type de facture */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de facture
              </label>
                <div className="flex space-x-4">
              {currentLinkedInvoices.length === 0 && (
                  <label
                    className={`inline-flex items-center ${
                      currentLinkedInvoices.length > 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      className="form-radio"
                      name="invoiceType"
                      value="deposit"
                      checked={invoiceType === "deposit"}
                      onChange={() =>
                        currentLinkedInvoices.length === 0 && setInvoiceType("deposit")
                      }
                      disabled={currentLinkedInvoices.length > 0}
                    />
                    <span className="ml-2">Facture d'acompte</span>
                  </label>
                  )}
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="invoiceType"
                      value="regular"
                      checked={invoiceType === "regular"}
                      onChange={() => setInvoiceType("regular")}
                    />
                    <span className="ml-2">Facture standard</span>
                  </label>
                </div>
            </div>

            {/* Pourcentage */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {invoiceType === "deposit"
                    ? "Pourcentage d'acompte"
                    : "Pourcentage à facturer"}
                </label>
                {currentLinkedInvoices.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleUseRemainingBalance}
                    className={useRemainingBalance ? "border-blue-600 text-blue-600" : ""}
                  >
                    {useRemainingBalance
                      ? "Utiliser un pourcentage personnalisé"
                      : "Utiliser le solde restant"}
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="range"
                    min="5"
                    max={
                      useRemainingBalance
                        ? remainingPercentage
                        : Math.min(95, remainingPercentage)
                    }
                    value={depositPercentage}
                    onChange={(e) =>
                      handleDepositPercentageChange(parseInt(e.target.value))
                    }
                    className="w-full"
                    disabled={
                      useRemainingBalance && linkedInvoices.length === 2
                    }
                  />
                </div>
                <div className="w-24 flex items-center space-x-2">
                  <input
                    type="number"
                    min="5"
                    max={
                      useRemainingBalance
                        ? remainingPercentage
                        : Math.min(95, remainingPercentage)
                    }
                    value={depositPercentage}
                    onChange={(e) =>
                      handleDepositPercentageChange(parseInt(e.target.value))
                    }
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                    disabled={
                      useRemainingBalance && linkedInvoices.length === 2
                    }
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
                <div className="w-24 text-right">
                  <span className="text-sm font-medium">
                    {calculateAmount(depositPercentage).toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>

            {/* Informations sur les factures existantes */}
            {currentLinkedInvoices.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Factures liées à ce devis
                </h4>
                <ul className="space-y-2">
                  {currentLinkedInvoices.map((invoice: Invoice, index: number) => (
                    <li
                      key={invoice.id}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {invoice.isDeposit
                          ? "Facture d'acompte"
                          : `Facture ${index + 1}`}{" "}
                        {invoice.prefix}
                        {invoice.number}
                      </span>
                      <span className="font-medium">
                        {invoice.finalTotalTTC?.toFixed(2)} € (
                        {(
                          ((invoice.finalTotalTTC || 0) / quoteTotal) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Informations sur le solde restant */}
            <div className="mt-4 bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">
                  Solde restant à facturer :
                </span>
                <span className="font-medium text-gray-900">
                  {remainingAmount.toFixed(2)} € (
                  {remainingPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
