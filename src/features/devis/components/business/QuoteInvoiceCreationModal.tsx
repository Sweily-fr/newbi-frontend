import React, { useState, useEffect } from "react";
import { Modal } from "../../../../components/";
import { Button } from "../../../../components/";
import { useMutation, useQuery } from "@apollo/client";
import { CONVERT_QUOTE_TO_INVOICE_MUTATION, GET_QUOTE } from "../../graphql/quotes";
import { Notification } from "../../../../components/";
import { ArrowRight, ReceiptEdit } from "iconsax-react";

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
  
  // Calculer le montant déjà facturé avec précision
  const calculateInvoicedAmount = () => {
    if (!currentLinkedInvoices || currentLinkedInvoices.length === 0) return 0;
    
    return currentLinkedInvoices.reduce(
      (sum: number, invoice: Invoice) => {
        const amount = invoice.finalTotalTTC || 0;
        // Arrondir à 2 décimales pour éviter les erreurs de calcul flottant
        return Math.round((sum + amount) * 100) / 100;
      },
      0
    );
  };
  
  const invoicedAmount = calculateInvoicedAmount();

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
      // Utiliser la fonction de calcul précise
      const remaining = Math.round((currentQuoteTotal - invoicedAmount) * 100) / 100;
      // Calculer le pourcentage avec précision et arrondir à 1 décimale
      const remainingPercent = Math.round((remaining / currentQuoteTotal) * 1000) / 10;

      setRemainingAmount(remaining);
      setRemainingPercentage(remainingPercent);

      // Si c'est la dernière facture possible (déjà 2 factures liées), utiliser automatiquement le solde restant
      if (currentLinkedInvoices.length === 2) {
        setUseRemainingBalance(true);
        setDepositPercentage(Math.floor(remainingPercent));
      } else {
        // Pour les autres cas, si le pourcentage restant est inférieur à la valeur par défaut
        // ajuster le pourcentage par défaut pour ne pas dépasser le restant
        if (remainingPercent < depositPercentage) {
          setDepositPercentage(Math.max(5, Math.floor(remainingPercent)));
        }
      }
    } else {
      setRemainingAmount(currentQuoteTotal);
      setRemainingPercentage(100);
    }
  }, [currentLinkedInvoices, currentQuoteTotal, depositPercentage, invoicedAmount]);

  // Gérer le changement de pourcentage d'acompte
  const handleDepositPercentageChange = (value: number) => {
    // Limiter le pourcentage à la valeur restante si on utilise le solde restant
    if (useRemainingBalance) {
      // Arrondir à l'entier inférieur pour éviter de dépasser le montant restant
      setDepositPercentage(Math.min(value, Math.floor(remainingPercentage)));
    } else {
      setDepositPercentage(value);
    }
  };

  // Utiliser le solde restant pour la facture
  const handleToggleUseRemainingBalance = () => {
    setUseRemainingBalance(!useRemainingBalance);
    if (!useRemainingBalance) {
      // Si on active l'option, utiliser le solde restant
      setDepositPercentage(Math.floor(remainingPercentage));
    } else {
      // Si on désactive l'option, revenir à une valeur par défaut raisonnable
      setDepositPercentage(Math.min(30, Math.floor(remainingPercentage)));
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

    // Vérifier que le pourcentage ne dépasse pas le montant restant
    const safePercentage = useRemainingBalance 
      ? Math.min(depositPercentage, Math.floor(remainingPercentage))
      : depositPercentage;
      
    const variables: ConvertVariables = {
      id: quoteId,
      skipValidation: true, // Ignorer la validation pour permettre la création même si le devis est déjà converti
      // Toujours envoyer le pourcentage sélectionné, que ce soit pour une facture standard ou d'acompte
      distribution: [safePercentage]
    };

    // Si c'est une facture d'acompte, ajouter le flag isDeposit
    if (invoiceType === "deposit") {
      variables.isDeposit = true;
    }

    // Appeler la mutation pour convertir le devis en facture
    convertToInvoice({
      variables,
    });
  };

  // Calculer le montant correspondant au pourcentage de manière précise
  const calculateAmount = (percentage: number) => {
    // Utiliser currentQuoteTotal qui est mis à jour avec les données du serveur
    // Arrondir à 2 décimales pour éviter les erreurs de calcul flottant
    return Math.round((currentQuoteTotal * percentage) / 100 * 100) / 100;
  };

  // Vérifier si on peut créer une nouvelle facture
  const canCreateInvoice = currentLinkedInvoices.length < 3;

  // Calculer le pourcentage total facturé (arrondi à 1 décimale)
  const invoicedPercentage = Math.round((100 - remainingPercentage) * 10) / 10;
  
  // Déterminer si la modal est en cours de chargement
  const loading = quoteLoading || mutationLoading;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Création de facture à partir du devis"
      footer={
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutationLoading}
            className="hover:bg-gray-100"
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateInvoice}
            isLoading={mutationLoading}
            disabled={
              mutationLoading ||
              (invoiceType === "deposit" && depositPercentage <= 0) ||
              (currentLinkedInvoices.length > 0 &&
                remainingAmount <= 0)
            }
            className="bg-[#5b50ff] hover:bg-[#4a41e0] text-white flex items-center"
          >
            Créer la facture
            <ArrowRight size="18" className="ml-1" variant="Bold" />
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5b50ff]"></div>
          </div>
        ) : !canCreateInvoice ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800">
            Ce devis a déjà 3 factures liées. Vous ne pouvez pas en créer
            davantage.
          </div>
        ) : (
          <div className="p-6">
            {/* Titre et description */}
            <div className="flex items-center mb-4">
              <div className="mr-3 p-2 rounded-full bg-[#f0eeff]">
                <ReceiptEdit size="24" color="#5b50ff" variant="Bulk" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Créer une facture à partir de ce devis
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Vous pouvez créer une facture standard ou une facture d'acompte à
                  partir de ce devis.
                </p>
              </div>
            </div>

            {/* Progression des factures */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Progression de facturation
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round(invoicedAmount * 100) / 100} € / {currentQuoteTotal.toFixed(2)} €
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[#5b50ff] h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (invoicedAmount / currentQuoteTotal) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>{invoicedPercentage.toFixed(1)}% facturé</span>
                <span>{remainingPercentage.toFixed(1)}% restant</span>
              </div>
            </div>

            {/* Type de facture */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de facture
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    invoiceType === "regular"
                      ? "bg-[#f0eeff] text-[#4a41e0] border border-[#e6e1ff]"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() => setInvoiceType("regular")}
                >
                  Facture standard
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    invoiceType === "deposit"
                      ? "bg-[#f0eeff] text-[#4a41e0] border border-[#e6e1ff]"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() => setInvoiceType("deposit")}
                  disabled={currentLinkedInvoices.length > 0}
                >
                  Facture d'acompte
                </button>
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
                    className="mt-2 text-[#5b50ff] border-[#e6e1ff] hover:bg-[#f0eeff]"
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
                        ? Math.floor(remainingPercentage)
                        : Math.min(95, Math.floor(remainingPercentage))
                    }
                    value={depositPercentage}
                    onChange={(e) =>
                      handleDepositPercentageChange(parseInt(e.target.value))
                    }
                    className="w-full accent-[#5b50ff]"
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
                        ? Math.floor(remainingPercentage)
                        : Math.min(95, Math.floor(remainingPercentage))
                    }
                    value={depositPercentage}
                    onChange={(e) =>
                      handleDepositPercentageChange(parseInt(e.target.value))
                    }
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm focus:border-[#5b50ff] focus:ring-1 focus:ring-[#e6e1ff] focus:outline-none"
                    disabled={
                      useRemainingBalance && linkedInvoices.length === 2
                    }
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
                <div className="w-24 text-right">
                  <span className="text-sm font-medium text-[#4a41e0]">
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
                      className="flex justify-between text-sm p-2 rounded-md hover:bg-[#f0eeff] transition-colors"
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
                          ((invoice.finalTotalTTC || 0) / currentQuoteTotal) *
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
            <div className="mt-4 bg-[#f0eeff] p-4 rounded-md">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">
                  Solde restant à facturer :
                </span>
                <span className="font-medium text-[#4a41e0]">
                  {remainingAmount.toFixed(2)} € (
                  {remainingPercentage.toFixed(1)}%)
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                <span>Montant à facturer avec le pourcentage sélectionné : </span>
                <span className="font-medium">
                  {calculateAmount(depositPercentage).toFixed(2)} €
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
