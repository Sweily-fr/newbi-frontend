import React, { useState, useEffect, useCallback } from "react";
import { ConfirmationModal } from "../../../../components/feedback/ConfirmationModal";
import { useQuoteForm } from "../../hooks/useQuoteForm";
import { useBodyScrollLock, useDocumentSettings, useBeforeUnload } from "../../../../hooks";
import { QuoteFormModalProps } from "../../types";
import { Button, Form } from "../../../../components/";
import Collapse from "../../../../components/common/Collapse";
import { DocumentSettings } from "../../../../components/specific/DocumentSettings";
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
  // Verrouiller le défilement du body lorsque la modale est ouverte
  useBodyScrollLock(true);
  // État pour la popup de confirmation
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"close" | "configureInfo" | "configureBankDetails" | null>(null);
  
  // Utiliser le hook useBeforeUnload pour empêcher la navigation non intentionnelle avec le modal de confirmation personnalisé
  const { showConfirmModal, confirmNavigation, cancelNavigation } = useBeforeUnload(true);
  
  // État pour afficher/masquer les paramètres
  const [showSettings, setShowSettings] = useState(false);
  
  // Utiliser le hook pour les paramètres de document
  const {
    defaultHeaderNotes,
    setDefaultHeaderNotes,
    defaultFooterNotes,
    setDefaultFooterNotes,
    defaultTermsAndConditions,
    setDefaultTermsAndConditions,
    defaultTermsAndConditionsLinkTitle,
    setDefaultTermsAndConditionsLinkTitle,
    defaultTermsAndConditionsLink,
    setDefaultTermsAndConditionsLink,
    handleSaveSettings,
    isSaving: isSavingSettings
  } = useDocumentSettings("QUOTE");
  
  // Fonction pour sauvegarder les paramètres
  const handleSaveDocumentSettings = async () => {
    await handleSaveSettings();
    setShowSettings(false);
  };

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
  } = useQuoteForm({
    quote,
    onClose,
    onSubmit,
    showNotifications: false, // Désactiver les notifications ici pour éviter les doublons avec useQuotes
  });

  // Fonction pour appliquer les paramètres par défaut
  const applyDefaultSettingsToForm = useCallback(() => {
    if (defaultHeaderNotes && !headerNotes) setHeaderNotes(defaultHeaderNotes);
    if (defaultFooterNotes && !footerNotes) setFooterNotes(defaultFooterNotes);
    if (defaultTermsAndConditions && !termsAndConditions) setTermsAndConditions(defaultTermsAndConditions);
    if (defaultTermsAndConditionsLinkTitle && !termsAndConditionsLinkTitle) setTermsAndConditionsLinkTitle(defaultTermsAndConditionsLinkTitle);
    if (defaultTermsAndConditionsLink && !termsAndConditionsLink) setTermsAndConditionsLink(defaultTermsAndConditionsLink);
  }, [defaultHeaderNotes, defaultFooterNotes, defaultTermsAndConditions, defaultTermsAndConditionsLinkTitle, defaultTermsAndConditionsLink, 
      headerNotes, footerNotes, termsAndConditions, termsAndConditionsLinkTitle, termsAndConditionsLink, 
      setHeaderNotes, setFooterNotes, setTermsAndConditions, setTermsAndConditionsLinkTitle, setTermsAndConditionsLink]);
  
  // Appliquer les paramètres par défaut au chargement du formulaire
  useEffect(() => {
    if (!quote) { // Seulement pour les nouveaux devis
      applyDefaultSettingsToForm();
    }
  }, [quote, applyDefaultSettingsToForm]);

  // Fonction pour valider le formulaire et gérer la soumission
  const onValidateForm = async (asDraft: boolean) => {
    // Validation du formulaire déclenchée

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
    }

    // Vérifier les erreurs dans la section Client
    if (!selectedClient && !isNewClient) {
      errors.client = true;
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
    }

    // Vérifier les erreurs dans la section Produits/Services
    if (!items || items.length === 0) {
      errors.items = true;
    } else {
      const hasInvalidItem = items.some(
        (item) => !item.description || !item.quantity || !item.unitPrice
      );
      if (hasInvalidItem) {
        errors.items = true;
      }
    }

    // Mettre à jour l'état des erreurs
    setSectionErrors(errors);

    // Vérifier s'il y a des erreurs
    const hasErrors = Object.values(errors).some((hasError) => hasError);

    if (!hasErrors) {
      // Passer directement asDraft à handleSubmit pour éviter les problèmes de synchronisation
      handleSubmit(new Event('submit') as unknown as React.FormEvent, asDraft);
    }
  };

  // Calculer les totaux pour l'aperçu
  const totals = calculateTotals();

  // Gestionnaire pour demander confirmation avant de fermer
  const handleCloseRequest = () => {
    setPendingAction("close");
    setShowConfirmationModal(true);
  };

  // Gestionnaire pour demander confirmation avant de naviguer vers les paramètres d'entreprise
  const handleConfigureInfoRequest = () => {
    setPendingAction("configureInfo");
    setShowConfirmationModal(true);
  };

  // Gestionnaire pour demander confirmation avant de naviguer vers les paramètres bancaires
  const handleConfigureBankDetailsRequest = () => {
    setPendingAction("configureBankDetails");
    setShowConfirmationModal(true);
  };

  // Fonction exécutée lorsque l'utilisateur confirme la fermeture
  const handleConfirmAction = () => {
    if (pendingAction === "close") {
      onClose();
    } else if (pendingAction === "configureInfo") {
      window.location.href = "/settings/company";
    } else if (pendingAction === "configureBankDetails") {
      window.location.href = "/settings/bank";
    }
    
    setShowConfirmationModal(false);
    setPendingAction(null);
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
        <div className="w-2/5 overflow-y-auto border-r border-gray-200">
          <Form onSubmit={(e) => e.preventDefault()} spacing="normal" className="w-full p-6">
            {showSettings ? (
              <DocumentSettings
                documentType="QUOTE"
                defaultHeaderNotes={defaultHeaderNotes}
                setDefaultHeaderNotes={setDefaultHeaderNotes}
                defaultFooterNotes={defaultFooterNotes}
                setDefaultFooterNotes={setDefaultFooterNotes}
                defaultTermsAndConditions={defaultTermsAndConditions}
                setDefaultTermsAndConditions={setDefaultTermsAndConditions}
                defaultTermsAndConditionsLinkTitle={defaultTermsAndConditionsLinkTitle}
                setDefaultTermsAndConditionsLinkTitle={setDefaultTermsAndConditionsLinkTitle}
                defaultTermsAndConditionsLink={defaultTermsAndConditionsLink}
                setDefaultTermsAndConditionsLink={setDefaultTermsAndConditionsLink}
                onSave={handleSaveDocumentSettings}
                onCancel={() => setShowSettings(false)}
                isSaving={isSavingSettings}
              />
            ) : (
              <>
                <div className="flex justify-end">
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="secondary"
                    size="md"
                    className="flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Paramètres
                  </Button>
                </div>
                <Collapse
                  title="Informations générales"
                  defaultOpen={true}
                  hasError={sectionErrors.generalInfo}
                  description="Numéro, dates et informations de base du devis"
                  icon="document"
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
                    defaultHeaderNotes={defaultHeaderNotes}
                  />
                </Collapse>

                <Collapse
                  title="Informations client"
                  defaultOpen={false}
                  hasError={sectionErrors.client}
                  description="Sélection ou création d'un client pour le devis"
                  icon="user"
                >
                  <ClientSelection
                    isNewClient={isNewClient}
                    setIsNewClient={handleClientModeChange}
                    newClient={newClient}
                    setNewClient={setNewClient}
                    selectedClient={selectedClient}
                    setSelectedClient={setSelectedClient}
                    clientsData={clientsData}
                    quote={quote}
                    selectedClientData={clientsData?.clients?.items?.find((c: any) => c.id === selectedClient)}
                  />
                </Collapse>

                <Collapse
                  title="Informations société"
                  defaultOpen={false}
                  hasError={sectionErrors.companyInfo}
                  description="Coordonnées et informations de votre entreprise"
                  icon="company"
                >
                  <QuoteCompanyInfo
                    companyInfo={companyInfo}
                    userData={userData}
                    apiUrl={apiUrl}
                    onConfigureInfoClick={handleConfigureInfoRequest}
                    setCompanyInfo={setCompanyInfo}
                  />
                </Collapse>

                <Collapse
                  title="Produits et services"
                  defaultOpen={false}
                  hasError={sectionErrors.items}
                  description="Articles, quantités et prix à facturer"
                  icon="products"
                >
                  <QuoteItems
                    items={items}
                    handleItemChange={handleItemChange}
                    handleRemoveItem={handleRemoveItem}
                    handleAddItem={handleAddItem}
                    handleProductSelect={handleProductSelect}
                  />
                </Collapse>

                <Collapse
                  title="Remise et totaux"
                  defaultOpen={false}
                  hasError={sectionErrors.discountAndTotals}
                  description="Remises, taxes et champs personnalisés"
                  icon="calculator"
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

                <Collapse
                  title="Notes de bas de page"
                  defaultOpen={false}
                  hasError={sectionErrors.bankDetails}
                  description="Coordonnées bancaires, conditions et notes"
                  icon="notes"
                >
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
                    onApplyDefaults={() => {
                      if (defaultTermsAndConditions) {
                        setTermsAndConditions(defaultTermsAndConditions);
                      }
                      if (defaultTermsAndConditionsLinkTitle) {
                        setTermsAndConditionsLinkTitle(defaultTermsAndConditionsLinkTitle);
                      }
                      if (defaultTermsAndConditionsLink) {
                        setTermsAndConditionsLink(defaultTermsAndConditionsLink);
                      }
                    }}
                    hasDefaults={!!(defaultTermsAndConditions || defaultTermsAndConditionsLinkTitle || defaultTermsAndConditionsLink)}
                  />
                  <QuoteFooterNotes
                    footerNotes={footerNotes}
                    setFooterNotes={setFooterNotes}
                    onApplyDefaults={() => {
                      if (defaultFooterNotes) {
                        setFooterNotes(defaultFooterNotes);
                      }
                    }}
                    hasDefaults={!!defaultFooterNotes}
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
              </>
            )}
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
              // Utiliser le client original du devis lors de la modification
              client: quote ? quote.client : undefined,
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
            isNewClient={isNewClient}
            newClient={newClient}
            selectedClient={Array.isArray(clientsData?.clients?.items) 
              ? clientsData?.clients?.items.find((c: any) => c.id === selectedClient)
              : null}
            useBankDetails={useBankDetails}
          />
        </div>
      </div>
      {/* Modal de confirmation pour les actions internes */}
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
      
      {/* Modal de confirmation pour la navigation entre pages */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={cancelNavigation}
        onConfirm={confirmNavigation}
        title="Confirmation"
        message="Toute progression non enregistrée sera perdue. Êtes-vous sûr de vouloir continuer ?"
        confirmButtonText="Continuer"
        cancelButtonText="Annuler"
        confirmButtonVariant="danger"
      />
    </div>
  );
};