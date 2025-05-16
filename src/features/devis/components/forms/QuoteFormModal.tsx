import React, { useState, useEffect, useCallback } from "react";
import { ConfirmationModal } from "../../../../components/common/ConfirmationModal";
import { useQuoteForm } from "../../hooks/useQuoteForm";
import {
  useBodyScrollLock,
  useDocumentSettings,
  useBeforeUnload,
} from "../../../../hooks";
import { QuoteFormModalProps } from "../../types";
import { Button, Form } from "../../../../components/";
import { DocumentSettings } from "../../../../components/specific/DocumentSettings";
import { NavigationSidebar } from "../../../../components/common/NavigationSidebar/NavigationSidebar";
import {
  DocumentText,
  Profile2User,
  Building,
  ShoppingCart,
  Calculator,
  MessageText,
  Setting2,
} from "iconsax-react";
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
  const [pendingAction, setPendingAction] = useState<
    "close" | "configureInfo" | "configureBankDetails" | null
  >(null);

  // Utiliser le hook useBeforeUnload pour empêcher la navigation non intentionnelle avec le modal de confirmation personnalisé
  const { showConfirmModal, confirmNavigation, cancelNavigation } =
    useBeforeUnload(true);

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
    isSaving: isSavingSettings,
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

  // État pour suivre la section active dans la navigation
  const [activeSection, setActiveSection] = useState<
    | "generalInfo"
    | "client"
    | "companyInfo"
    | "items"
    | "discountAndTotals"
    | "bankDetails"
  >("generalInfo");

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
    if (defaultTermsAndConditions && !termsAndConditions)
      setTermsAndConditions(defaultTermsAndConditions);
    if (defaultTermsAndConditionsLinkTitle && !termsAndConditionsLinkTitle)
      setTermsAndConditionsLinkTitle(defaultTermsAndConditionsLinkTitle);
    if (defaultTermsAndConditionsLink && !termsAndConditionsLink)
      setTermsAndConditionsLink(defaultTermsAndConditionsLink);
  }, [
    defaultHeaderNotes,
    defaultFooterNotes,
    defaultTermsAndConditions,
    defaultTermsAndConditionsLinkTitle,
    defaultTermsAndConditionsLink,
    headerNotes,
    footerNotes,
    termsAndConditions,
    termsAndConditionsLinkTitle,
    termsAndConditionsLink,
    setHeaderNotes,
    setFooterNotes,
    setTermsAndConditions,
    setTermsAndConditionsLinkTitle,
    setTermsAndConditionsLink,
  ]);

  // Appliquer les paramètres par défaut au chargement du formulaire
  useEffect(() => {
    if (!quote) {
      // Seulement pour les nouveaux devis
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
        (item) =>
          !item.description ||
          !item.quantity ||
          !item.unitPrice ||
          // Vérifier si un item a une TVA à 0 mais pas de texte d'exemption
          (item.vatRate === 0 &&
            (!item.vatExemptionText || item.vatExemptionText.trim() === ""))
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
      handleSubmit(new Event("submit") as unknown as React.FormEvent, asDraft);
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
        {/* Navigation sidebar */}
        {!showSettings && (
          <NavigationSidebar
            items={[
              {
                id: "generalInfo",
                icon: (
                  <DocumentText
                    size="24"
                    color={activeSection === "generalInfo" ? "#5b50ff" : "#222"}
                    variant={
                      activeSection === "generalInfo" ? "Bold" : "Linear"
                    }
                  />
                ),
                tooltip: "Informations générales",
              },
              {
                id: "client",
                icon: (
                  <Profile2User
                    size="24"
                    color={activeSection === "client" ? "#5b50ff" : "#222"}
                    variant={activeSection === "client" ? "Bold" : "Linear"}
                  />
                ),
                tooltip: "Informations client",
              },
              {
                id: "companyInfo",
                icon: (
                  <Building
                    size="24"
                    color={activeSection === "companyInfo" ? "#5b50ff" : "#222"}
                    variant={
                      activeSection === "companyInfo" ? "Bold" : "Linear"
                    }
                  />
                ),
                tooltip: "Informations société",
              },
              {
                id: "items",
                icon: (
                  <ShoppingCart
                    size="24"
                    color={activeSection === "items" ? "#5b50ff" : "#222"}
                    variant={activeSection === "items" ? "Bold" : "Linear"}
                  />
                ),
                tooltip: "Produits et services",
              },
              {
                id: "discountAndTotals",
                icon: (
                  <Calculator
                    size="24"
                    color={
                      activeSection === "discountAndTotals" ? "#5b50ff" : "#222"
                    }
                    variant={
                      activeSection === "discountAndTotals" ? "Bold" : "Linear"
                    }
                  />
                ),
                tooltip: "Remise et totaux",
              },
              {
                id: "bankDetails",
                icon: (
                  <MessageText
                    size="24"
                    color={activeSection === "bankDetails" ? "#5b50ff" : "#222"}
                    variant={
                      activeSection === "bankDetails" ? "Bold" : "Linear"
                    }
                  />
                ),
                tooltip: "Notes de bas de page",
              },
            ]}
            activeItemId={activeSection}
            onItemClick={(id) => setActiveSection(id as typeof activeSection)}
            primaryColor="#5b50ff"
            activeBackgroundColor="#f0eeff"
            fixed={false}
          />
        )}

        {/* Formulaire à gauche */}
        <div className="w-3/6 bg-gray-50 overflow-y-auto border-r border-gray-200 flex flex-col h-full custom-scrollbar">
          <Form onSubmit={(e) => e.preventDefault()} className="flex flex-col flex-grow">
            {showSettings ? (
              <div className="p-6">
                <DocumentSettings
                  documentType="QUOTE"
                  defaultHeaderNotes={defaultHeaderNotes}
                  setDefaultHeaderNotes={setDefaultHeaderNotes}
                  defaultFooterNotes={defaultFooterNotes}
                  setDefaultFooterNotes={setDefaultFooterNotes}
                  defaultTermsAndConditions={defaultTermsAndConditions}
                  setDefaultTermsAndConditions={setDefaultTermsAndConditions}
                  defaultTermsAndConditionsLinkTitle={
                    defaultTermsAndConditionsLinkTitle
                  }
                  setDefaultTermsAndConditionsLinkTitle={
                    setDefaultTermsAndConditionsLinkTitle
                  }
                  defaultTermsAndConditionsLink={defaultTermsAndConditionsLink}
                  setDefaultTermsAndConditionsLink={
                    setDefaultTermsAndConditionsLink
                  }
                  onSave={handleSaveDocumentSettings}
                  onCancel={() => setShowSettings(false)}
                  isSaving={isSavingSettings}
                />
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-4 px-10 pt-10">
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="secondary"
                    size="md"
                    className="flex items-center gap-2"
                  >
                    <Setting2 color="#5b50ff" size="20" variant="Linear" />
                    Paramètres
                  </Button>
                </div>
                {/* Section dynamique basée sur la navigation */}
                <div className="mb-4 px-10">
                  {activeSection === "generalInfo" && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2 flex items-center">
                        <span
                          className={`mr-4 ${
                            sectionErrors.generalInfo
                              ? "text-red-500"
                              : "text-[#5b50ff]"
                          }`}
                        >
                          <DocumentText
                            color="#5b50ff"
                            size="24"
                            variant="Bold"
                          />
                        </span>
                        Informations générales
                      </h2>
                      <p className="text-gray-500 mb-8">
                        Informations de base du devis
                      </p>
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
                    </div>
                  )}

                  {activeSection === "client" && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2 flex items-center">
                        <span
                          className={`mr-4 ${
                            sectionErrors.client
                              ? "text-red-500"
                              : "text-[#5b50ff]"
                          }`}
                        >
                          <Profile2User
                            color="#5b50ff"
                            size="24"
                            variant="Bold"
                          />
                        </span>
                        Informations client
                      </h2>
                      <p className="text-gray-500 mb-8">
                        Sélection ou création d'un client pour le devis
                      </p>
                      <ClientSelection
                        isNewClient={isNewClient}
                        setIsNewClient={handleClientModeChange}
                        newClient={newClient}
                        setNewClient={setNewClient as any}
                        selectedClient={selectedClient}
                        setSelectedClient={setSelectedClient}
                        clientsData={clientsData}
                        quote={quote}
                        selectedClientData={
                          clientsData?.clients?.items?.find(
                            (c: any) => c.id === selectedClient
                          ) || null
                        }
                      />
                    </div>
                  )}

                  {activeSection === "companyInfo" && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2 flex items-center">
                        <span
                          className={`mr-4 ${
                            sectionErrors.companyInfo
                              ? "text-red-500"
                              : "text-[#5b50ff]"
                          }`}
                        >
                          <Building color="#5b50ff" size="24" variant="Bold" />
                        </span>
                        Informations société
                      </h2>
                      <p className="text-gray-500 mb-8">
                        Coordonnées et informations de votre entreprise
                      </p>
                      <QuoteCompanyInfo
                        companyInfo={companyInfo}
                        userData={userData}
                        apiUrl={apiUrl}
                        onConfigureInfoClick={handleConfigureInfoRequest}
                        setCompanyInfo={setCompanyInfo}
                      />
                    </div>
                  )}

                  {activeSection === "items" && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2 flex items-center">
                        <span
                          className={`mr-4 ${
                            sectionErrors.items
                              ? "text-red-500"
                              : "text-[#5b50ff]"
                          }`}
                        >
                          <ShoppingCart
                            color="#5b50ff"
                            size="24"
                            variant="Bold"
                          />
                        </span>
                        Produits et services
                      </h2>
                      <p className="text-gray-500 mb-8">
                        Articles, quantités et prix à facturer
                      </p>
                      <QuoteItems
                        items={items}
                        handleAddItem={handleAddItem}
                        handleRemoveItem={handleRemoveItem}
                        handleItemChange={handleItemChange as any}
                        handleProductSelect={handleProductSelect}
                      />
                    </div>
                  )}

                  {activeSection === "discountAndTotals" && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2 flex items-center">
                        <span
                          className={`mr-4 ${
                            sectionErrors.discountAndTotals
                              ? "text-red-500"
                              : "text-[#5b50ff]"
                          }`}
                        >
                          <Calculator
                            color="#5b50ff"
                            size="24"
                            variant="Bold"
                          />
                        </span>
                        Remise et totaux
                      </h2>
                      <p className="text-gray-500 mb-8">
                        Remises, taxes et champs personnalisés
                      </p>
                      <QuoteDiscountAndTotals
                        discount={discount}
                        setDiscount={setDiscount}
                        discountType={discountType}
                        setDiscountType={setDiscountType}
                        calculateTotals={calculateTotals}
                        customFields={customFields}
                        handleAddCustomField={handleAddCustomField}
                        handleRemoveCustomField={handleRemoveCustomField}
                        handleCustomFieldChange={handleCustomFieldChange}
                      />
                    </div>
                  )}

                  {activeSection === "bankDetails" && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2 flex items-center">
                        <span
                          className={`mr-4 ${
                            sectionErrors.bankDetails
                              ? "text-red-500"
                              : "text-[#5b50ff]"
                          }`}
                        >
                          <MessageText
                            color="#5b50ff"
                            size="24"
                            variant="Bold"
                          />
                        </span>
                        Notes de bas de page
                      </h2>
                      <p className="text-gray-500 mb-8">
                        Coordonnées bancaires, conditions et notes
                      </p>
                      <div className="mb-10">
                        <QuoteBankDetails
                          userData={userData}
                          useBankDetails={useBankDetails}
                          setUseBankDetails={setUseBankDetails}
                          setCompanyInfo={setCompanyInfo}
                          onConfigureBankDetailsClick={
                            handleConfigureBankDetailsRequest
                          }
                        />
                      </div>
                      <div className="mb-10">
                        <QuoteTermsAndConditions
                          termsAndConditions={termsAndConditions}
                          setTermsAndConditions={setTermsAndConditions}
                          termsAndConditionsLinkTitle={
                            termsAndConditionsLinkTitle
                          }
                          setTermsAndConditionsLinkTitle={
                            setTermsAndConditionsLinkTitle
                          }
                          termsAndConditionsLink={termsAndConditionsLink}
                          setTermsAndConditionsLink={setTermsAndConditionsLink}
                          onApplyDefaults={() => {
                            if (defaultTermsAndConditions) {
                              setTermsAndConditions(defaultTermsAndConditions);
                            }
                            if (defaultTermsAndConditionsLinkTitle) {
                              setTermsAndConditionsLinkTitle(
                                defaultTermsAndConditionsLinkTitle
                              );
                            }
                            if (defaultTermsAndConditionsLink) {
                              setTermsAndConditionsLink(
                                defaultTermsAndConditionsLink
                              );
                            }
                          }}
                          hasDefaults={
                            !!(
                              defaultTermsAndConditions ||
                              defaultTermsAndConditionsLinkTitle ||
                              defaultTermsAndConditionsLink
                            )
                          }
                        />
                      </div>
                      <div className="mb-10">
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
                      </div>
                    </div>
                  )}
                </div>

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
        <div className="w-3/6 overflow-hidden z-[900]">
          {/* Calculer les totaux pour l'aperçu */}
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
            }}
            calculateTotals={calculateTotals}
            isNewClient={isNewClient}
            newClient={newClient}
            selectedClient={
              Array.isArray(clientsData?.clients?.items)
                ? clientsData?.clients?.items.find(
                    (c: any) => c.id === selectedClient
                  )
                : null
            }
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
