import React, { useState } from "react";
import { ConfirmationModal } from "../../feedback/ConfirmationModal";
import { useQuoteForm } from "../../../hooks/useQuoteForm";
import { QuoteFormModalProps } from "../../../types";
import { Button, Form } from "../../ui";
import Collapse from "../../ui/Collapse";
import {
  ClientSelection,
  QuoteGeneralInfo,
  QuoteItems,
  QuoteDiscountAndTotals,
  QuoteFooterNotes,
  QuoteTermsAndConditions,
  QuoteCompanyInfo,
  QuoteBankDetails,
  QuoteActionButtons,
} from "./Sections";
import { QuotePreview } from "./QuotePreview";

export const QuoteFormModal: React.FC<QuoteFormModalProps> = ({
  quote,
  onClose,
  onSubmit,
}) => {
  // État pour la popup de confirmation
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"close" | "configureInfo" | "configureBankDetails" | null>(null);

  // État pour suivre les sections avec des erreurs
  const [sectionErrors, setSectionErrors] = useState({
    generalInfo: false,
    client: false,
    companyInfo: false,
    items: false,
    discountAndTotals: false,
    bankDetails: false,
  });

  // Utiliser le hook personnalisé pour gérer la logique du formulaire
  const {
    selectedClient,
    setSelectedClient,
    isNewClient,
    handleClientModeChange,
    newClient,
    setNewClient,
    items,
    headerNotes,
    setHeaderNotes,
    footerNotes,
    setFooterNotes,
    handleProductSelect,
    termsAndConditions,
    setTermsAndConditions,
    termsAndConditionsLinkTitle,
    setTermsAndConditionsLinkTitle,
    termsAndConditionsLink,
    setTermsAndConditionsLink,
    discount,
    setDiscount,
    discountType,
    setDiscountType,
    customFields,
    quoteNumber,
    setQuoteNumber,
    quotePrefix,
    setQuotePrefix,
    issueDate,
    setIssueDate,
    validUntil,
    setValidUntil,
    companyInfo,
    setCompanyInfo,
    useBankDetails,
    setUseBankDetails,
    // Données
    clientsData,
    userData,

    // Fonctions utilitaires
    calculateTotals,

    // Handlers
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleAddCustomField,
    handleRemoveCustomField,
    handleCustomFieldChange,
    handleSubmit,

    // Constantes
    apiUrl,
    isSubmitting,
    setSubmitAsDraft,
    refetchNextQuoteNumber,
  } = useQuoteForm({
    quote,
    onClose,
    onSubmit,
    showNotifications: false, // Désactiver les notifications ici pour éviter les doublons avec useQuotes
  });

  // Fonction pour valider le formulaire et gérer la soumission
  const onValidateForm = async (asDraft: boolean) => {
    console.log(
      "Validation du formulaire déclenchée, brouillon:",
      asDraft,
      "type:",
      typeof asDraft
    );

    // Définir si on soumet en brouillon
    setSubmitAsDraft(asDraft);

    // Réinitialiser les erreurs
    const errors = {
      generalInfo: false,
      client: false,
      companyInfo: false,
      items: false,
      discountAndTotals: false,
      bankDetails: false,
    };

    // Vérifier les erreurs dans la section Informations générales
    if (!quoteNumber || !issueDate || !validUntil) {
      errors.generalInfo = true;
      console.log("Erreurs dans les informations générales");
    }

    // Vérifier les erreurs dans la section Client
    if (!selectedClient && !isNewClient) {
      errors.client = true;
      console.log("Erreur: aucun client sélectionné");
    } else if (isNewClient) {
      if (
        !newClient.name ||
        !newClient.email ||
        !newClient.street ||
        !newClient.city ||
        !newClient.postalCode ||
        !newClient.country
      ) {
        errors.client = true;
        console.log("Erreur: informations du nouveau client incomplètes");
      }
    }

    // Vérifier les erreurs dans la section Informations de l'entreprise
    if (
      !companyInfo.name ||
      !companyInfo.email ||
      !companyInfo.address.street ||
      !companyInfo.address.city ||
      !companyInfo.address.postalCode ||
      !companyInfo.address.country
    ) {
      errors.companyInfo = true;
      console.log("Erreur: informations de l'entreprise incomplètes");
    }

    // Vérifier les erreurs dans la section Produits/Services
    const hasItemErrors = items.some((item, index) => {
      const hasError =
        !item.description ||
        !item.quantity ||
        !item.unitPrice ||
        item.vatRate === undefined || item.vatRate === null ||
        !item.unit;
      if (hasError) {
        console.log(`Erreur dans l'article ${index + 1}:`, item);
      }
      return hasError;
    });
    errors.items = hasItemErrors;

    // Vérifier les erreurs dans la section Remise et totaux
    if (discount < 0 || (discountType === "PERCENTAGE" && discount > 100)) {
      errors.discountAndTotals = true;
      console.log("Erreur: valeur de remise invalide");
    }

    // Vérifier les erreurs dans la section Notes de bas de page (coordonnées bancaires)
    if (
      useBankDetails &&
      (!companyInfo.bankDetails?.iban ||
        !companyInfo.bankDetails?.bic ||
        !companyInfo.bankDetails?.bankName)
    ) {
      errors.bankDetails = true;
      console.log("Erreur: coordonnées bancaires incomplètes");
    }

    // Mettre à jour l'état des erreurs
    setSectionErrors(errors);
    console.log("État des erreurs mis à jour:", errors);

    // Si aucune erreur, soumettre le formulaire
    if (!Object.values(errors).some(Boolean)) {
      console.log("Aucune erreur, soumission du formulaire");

      // Récupérer le dernier numéro de devis disponible pour éviter les doublons
      if (!quote) {
        try {
          await refetchNextQuoteNumber();
        } catch (error) {
          console.error(
            "Erreur lors de la récupération du prochain numéro de devis:",
            error
          );
        }
      }

      handleSubmit(new Event("submit") as unknown as React.FormEvent, asDraft);
    } else {
      console.log(
        "Des erreurs ont été détectées, affichage des sections avec erreurs"
      );
    }
  };

  // Calculer les totaux pour l'aperçu
  const totals = calculateTotals();

  // Gestionnaire pour demander confirmation avant de fermer
  const handleCloseRequest = () => {
    setShowConfirmationModal(true);
    setPendingAction("close");
  };

  // Gestionnaire pour demander confirmation avant de naviguer vers les paramètres d'entreprise
  const handleConfigureInfoRequest = () => {
    setShowConfirmationModal(true);
    setPendingAction("configureInfo");
  };

  // Gestionnaire pour demander confirmation avant de naviguer vers les paramètres bancaires
  const handleConfigureBankDetailsRequest = () => {
    setShowConfirmationModal(true);
    setPendingAction("configureBankDetails");
  };

  // Fonction exécutée lorsque l'utilisateur confirme la fermeture
  const handleConfirmAction = () => {
    // Fermer d'abord la modale de confirmation
    setShowConfirmationModal(false);
    setPendingAction(null);
    
    // Ensuite, effectuer l'action demandée
    if (pendingAction === "close") {
      onClose();
    } else if (pendingAction === "configureInfo" || pendingAction === "configureBankDetails") {
      // Utiliser setTimeout pour s'assurer que la modale est fermée avant la navigation
      setTimeout(() => {
        window.location.href = "/profile?tab=company";
      }, 100);
    }
  };

  // Fonction pour fermer la modal de confirmation
  const handleCancelConfirmation = () => {
    setShowConfirmationModal(false);
    setPendingAction(null);
  };

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col h-screen w-screen">
      {/* Header avec titre et bouton de fermeture */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">
          {quote ? "Modifier le devis" : "Nouveau devis"}
        </h2>
        <Button
          onClick={handleCloseRequest}
          variant="outline"
          size="sm"
          className="p-1 mr-4"
          aria-label="Fermer"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>

      {/* Contenu principal avec formulaire à gauche et aperçu à droite */}
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Formulaire à gauche */}
        <div className="w-2/5 overflow-y-auto px-6 pt-6 border-r">
          <Form
            onSubmit={(e) => e.preventDefault()}
            spacing="normal"
            className="w-full"
          >
            <Collapse
              title="Informations générales"
              defaultOpen={true}
              hasError={sectionErrors.generalInfo}
            >
              <QuoteGeneralInfo
                quotePrefix={quotePrefix}
                setQuotePrefix={setQuotePrefix}
                quoteNumber={quoteNumber}
                setQuoteNumber={setQuoteNumber}
                issueDate={issueDate}
                setIssueDate={setIssueDate}
                validUntil={validUntil}
                setValidUntil={setValidUntil}
                headerNotes={headerNotes}
                setHeaderNotes={setHeaderNotes}
              />
            </Collapse>

            <Collapse
              title="Client"
              defaultOpen={false}
              hasError={sectionErrors.client}
            >
              <ClientSelection
                isNewClient={isNewClient}
                setIsNewClient={handleClientModeChange}
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                newClient={newClient}
                setNewClient={setNewClient}
                clientsData={clientsData}
              />
            </Collapse>

            <Collapse
              title="Informations de l'entreprise"
              defaultOpen={false}
              hasError={sectionErrors.companyInfo}
            >
              <QuoteCompanyInfo
                companyInfo={companyInfo}
                setCompanyInfo={setCompanyInfo}
                userData={userData}
                apiUrl={apiUrl}
                onConfigureInfoClick={handleConfigureInfoRequest}
              />
            </Collapse>

            <Collapse
              title="Produits / Services"
              defaultOpen={false}
              hasError={sectionErrors.items}
            >
              <QuoteItems
                items={items}
                handleAddItem={handleAddItem}
                handleRemoveItem={handleRemoveItem}
                handleItemChange={handleItemChange}
                handleProductSelect={handleProductSelect}
              />
            </Collapse>

            <Collapse
              title="Remise et totaux"
              defaultOpen={false}
              hasError={sectionErrors.discountAndTotals}
            >
              <QuoteDiscountAndTotals
                discount={discount}
                setDiscount={setDiscount}
                discountType={discountType}
                setDiscountType={setDiscountType}
                totals={totals}
                customFields={customFields || []}
                handleAddCustomField={handleAddCustomField}
                handleRemoveCustomField={handleRemoveCustomField}
                handleCustomFieldChange={handleCustomFieldChange}
              />
            </Collapse>

            <Collapse title="Notes de bas de page" defaultOpen={false}>
              <QuoteBankDetails
                userData={userData}
                useBankDetails={useBankDetails}
                setUseBankDetails={setUseBankDetails}
                setCompanyInfo={setCompanyInfo}
                onConfigureBankDetailsClick={handleConfigureBankDetailsRequest}
              />
              <QuoteTermsAndConditions
                termsAndConditions={termsAndConditions}
                setTermsAndConditions={setTermsAndConditions}
                termsAndConditionsLinkTitle={termsAndConditionsLinkTitle}
                setTermsAndConditionsLinkTitle={setTermsAndConditionsLinkTitle}
                termsAndConditionsLink={termsAndConditionsLink}
                setTermsAndConditionsLink={setTermsAndConditionsLink}
              />
              <QuoteFooterNotes
                footerNotes={footerNotes}
                setFooterNotes={setFooterNotes}
              />
            </Collapse>

            {/* Espace en bas pour les boutons fixes */}
            <div className="h-20"></div>

            {/* Boutons d'action fixes en bas */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-8">
              <div className="max-w-7xl mx-auto">
                <QuoteActionButtons
                  onSaveAsDraft={() => onValidateForm(true)}
                  onSubmit={() => onValidateForm(false)}
                  onCancel={handleCloseRequest}
                  isSubmitting={isSubmitting}
                  isEditing={!!quote}
                />
              </div>
            </div>
          </Form>
        </div>

        {/* Aperçu à droite */}
        <div className="w-3/5 overflow-y-auto z-[1000]">
          <QuotePreview
            quote={{
              prefix: quotePrefix,
              number: quoteNumber,
              issueDate,
              validUntil,
              client: isNewClient
                ? newClient
                : clientsData?.clients.find(
                    (c: { id: string }) => c.id === selectedClient
                  ),
              companyInfo,
              items,
              discount,
              discountType,
              headerNotes,
              footerNotes,
              termsAndConditions,
              termsAndConditionsLinkTitle,
              termsAndConditionsLink,
              customFields: customFields.filter((f) => f.key && f.value),
              ...totals,
            }}
            useBankDetails={useBankDetails}
          />
        </div>
      </div>
      {/* Modal de confirmation */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCancelConfirmation}
        onConfirm={handleConfirmAction}
        title="Confirmation"
        message="Toute progression non enregistrée sera perdue. Êtes-vous sûr de vouloir continuer ?"
        confirmButtonText="Continuer"
        cancelButtonText="Annuler"
        confirmButtonVariant="danger"
      />
    </div>
  );
};
