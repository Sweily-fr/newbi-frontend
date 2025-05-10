import React, { useEffect, useState, useCallback } from "react";
import { useBodyScrollLock, useDocumentSettings, useBeforeUnload } from "../../../../hooks";
import { useInvoiceForm } from "../../hooks/useInvoiceForm";
import { InvoiceFormModalProps } from "../../types/invoice";
import { Button, Form } from "../../../../components/ui";
import { DocumentSettings } from "../../../common/ParametreDocuments/DocumentSettings";
import Collapse from "../../../../components/ui/Collapse";
import { validateInvoiceDates } from "../../../../constants/formValidations";
import { ClientSelection } from "./Sections";
import { InvoiceItems } from "./Sections";
import { InvoiceDiscountAndTotals } from "./Sections";
import { InvoiceGeneralInfo } from "./Sections";
import { InvoiceFooterNotes } from "./Sections";
import { InvoiceTermsAndConditions } from "./Sections";
import { InvoiceCompanyInfo } from "./Sections";
import { InvoiceBankDetails } from "./Sections";
import { InvoiceActionButtons } from "./Sections";
import { InvoicePreview } from "./InvoicePreview";
import { useQuery } from "@apollo/client";
import { GET_QUOTE } from "../../../devis/graphql/quotes";
import { ConfirmationModal } from "../../../../components/feedback/ConfirmationModal";
import { Notification } from "../../../../components/feedback";

export const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({
  invoice,
  onClose,
  onSubmit,
  quoteId
}) => {
  // Verrouiller le défilement du body lorsque la modale est ouverte
  useBodyScrollLock(true);
  
  // Vérifier si la facture est en statut PENDING, dans ce cas empêcher l'édition
  if (invoice && invoice.status === 'PENDING') {
    // Utiliser setTimeout pour permettre au composant de se monter avant de fermer
    setTimeout(() => {
      Notification.error("Les factures en statut 'À encaisser' ne peuvent pas être modifiées", {
        position: 'bottom-left',
        duration: 5000
      });
      onClose();
    }, 100);
  }
  // État pour la popup de confirmation
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"close" | "configureInfo" | "configureBankDetails" | null>(null);
  
  // Utiliser le hook useBeforeUnload pour empêcher la navigation non intentionnelle avec le modal de confirmation personnalisé
  const { showConfirmModal, confirmNavigation, cancelNavigation } = useBeforeUnload(true);
  // État pour afficher les paramètres
  const [showSettings, setShowSettings] = useState(false);
  // État pour suivre les sections avec des erreurs
  const [sectionErrors, setSectionErrors] = useState({
    generalInfo: false,
    client: false,
    companyInfo: false,
    items: false,
    discountAndTotals: false,
    bankDetails: false,
  });
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

  // Fonction exécutée lorsque l'utilisateur confirme l'action
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

  // Hook pour gérer les paramètres globaux des factures
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
  } = useDocumentSettings('INVOICE');

  // Fonction pour gérer l'enregistrement des paramètres
  const handleSaveDocumentSettings = async () => {
    const success = await handleSaveSettings();
    if (success) {
      setShowSettings(false);
    }
  };



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
    isDeposit,
    setIsDeposit,
    invoiceNumber,
    setInvoiceNumber,
    invoicePrefix,
    setInvoicePrefix,
    purchaseOrderNumber,
    setPurchaseOrderNumber,
    issueDate,
    setIssueDate,
    executionDate,
    setExecutionDate,
    dueDate,
    setDueDate,
    companyInfo,
    setCompanyInfo,
    useBankDetails,
    setUseBankDetails,
    setBankDetailsReadOnly,

    // Données
    clientsData,
    userData,

    // Fonctions utilitaires
    calculateTotals,

    // Handlers
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleProductSelect, // Nouvelle fonction pour mettre à jour un item complet
    handleAddCustomField,
    handleRemoveCustomField,
    handleCustomFieldChange,
    handleSubmit,
    
    // Variables manquantes
    setItems,
    setCustomFields,

    // Constantes
    apiUrl,
    isSubmitting,
    setSubmitAsDraft,
  } = useInvoiceForm({ 
    invoice, 
    onClose, 
    onSubmit,
    showNotifications: false // Désactiver les notifications ici pour éviter les doublons avec useInvoices
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
    if (!invoice) { // Seulement pour les nouvelles factures
      applyDefaultSettingsToForm();
    }
  }, [invoice, applyDefaultSettingsToForm]);

  // Récupérer les données du devis si quoteId est fourni
  const { data: quoteData } = useQuery(GET_QUOTE, {
    variables: { id: quoteId },
    skip: !quoteId,
  });

  // Pré-remplir le formulaire avec les données du devis
  useEffect(() => {
    if (quoteData && quoteData.quote) {
      const quote = quoteData.quote;
      setNewClient(quote.client);
      setSelectedClient(quote.client.id);
      setItems(quote.items);
      setDiscount(quote.discount);
      setDiscountType(quote.discountType);
      setCustomFields(quote.customFields);
      setHeaderNotes(quote.headerNotes);
      setFooterNotes(quote.footerNotes);
      setTermsAndConditions(quote.termsAndConditions);
      setTermsAndConditionsLinkTitle(quote.termsAndConditionsLinkTitle);
      setTermsAndConditionsLink(quote.termsAndConditionsLink);
      setCompanyInfo(quote.companyInfo);
      setUseBankDetails(quote.useBankDetails);
      setBankDetailsReadOnly(quote.bankDetailsReadOnly);
     
    }
  }, [quoteData, setNewClient, setSelectedClient, setItems, setDiscount, setDiscountType, setHeaderNotes, setFooterNotes, setTermsAndConditions, setTermsAndConditionsLinkTitle, setTermsAndConditionsLink, setCompanyInfo, setUseBankDetails, setBankDetailsReadOnly, setCustomFields]);

  // Fonction pour valider le formulaire et gérer la soumission
  const onValidateForm = async (asDraft: boolean) => {
    
    // Définir si on soumet en brouillon et le logger pour débogage
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
    if (!invoiceNumber || !issueDate || !dueDate) {
      errors.generalInfo = true;
      console.error("Erreurs dans les informations générales");
    }
    
    // Vérifier la validité des dates avec validateInvoiceDates
    const datesValidation = validateInvoiceDates(issueDate, dueDate, executionDate);
    if (!datesValidation.isValid) {
      errors.generalInfo = true;
      console.error("Erreurs dans les dates:", datesValidation);
    }
    
    // Vérifier les erreurs dans la section Client
    if (!selectedClient && !isNewClient) {
      errors.client = true;
      console.error("Erreur: aucun client sélectionné");
    } else if (isNewClient) {
      if (!newClient.name || !newClient.email || !newClient.street || !newClient.city || !newClient.postalCode || !newClient.country) {
        errors.client = true;
        console.error("Erreur: informations du nouveau client incomplètes");
      }
    }
    
    // Vérifier les erreurs dans la section Informations de l'entreprise
    if (!companyInfo.name || !companyInfo.email || !companyInfo.address.street || !companyInfo.address.city || !companyInfo.address.postalCode || !companyInfo.address.country) {
      errors.companyInfo = true;
      console.error("Erreur: informations de l'entreprise incomplètes");
    }
    
    // Vérifier les erreurs dans la section Produits/Services
    const hasItemErrors = items.some((item, index) => {
      const hasError = !item.description || 
                      !item.quantity || 
                      !item.unitPrice || 
                      item.vatRate === undefined || item.vatRate === null ||
                      !item.unit;
      if (hasError) {
        console.error(`Erreur dans l'article ${index + 1}:`, item);
      }
      return hasError;
    });
    errors.items = hasItemErrors;
    
    // Vérifier les erreurs dans la section Remise et totaux
    if (discount < 0 || (discountType === 'PERCENTAGE' && discount > 100)) {
      errors.discountAndTotals = true;
      console.error("Erreur: valeur de remise invalide");
    }
    
    // Vérifier les erreurs dans la section Notes de bas de page (coordonnées bancaires)
    if (useBankDetails && (!companyInfo.bankDetails?.iban || !companyInfo.bankDetails?.bic || !companyInfo.bankDetails?.bankName)) {
      errors.bankDetails = true;
      console.error("Erreur: coordonnées bancaires incomplètes");
    }
    
   
   
    
    // Mettre à jour l'état des erreurs
    setSectionErrors(errors);
    
    // Si aucune erreur, soumettre le formulaire
    if (!Object.values(errors).some(Boolean)) {
      // Passer directement asDraft à handleSubmit pour éviter les problèmes de synchronisation
      handleSubmit(new Event('submit') as unknown as React.FormEvent, asDraft);
    } else {
      console.error("Des erreurs ont été détectées, affichage des sections avec erreurs");
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col h-screen w-screen">
      {/* Header avec titre et bouton de fermeture */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">
          {invoice ? "Modifier la facture" : "Nouvelle facture"}
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
          <Form onSubmit={(e) => e.preventDefault()} className="p-4">
            {showSettings ? (
              <DocumentSettings
                documentType="INVOICE"
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
                  description="Informations de base de la facture"
                  icon="document"
                >
                  <InvoiceGeneralInfo
                    isDeposit={isDeposit}
                    setIsDeposit={setIsDeposit}
                    purchaseOrderNumber={purchaseOrderNumber}
                    setPurchaseOrderNumber={setPurchaseOrderNumber}
                    issueDate={issueDate}
                    setIssueDate={setIssueDate}
                    executionDate={executionDate}
                    setExecutionDate={setExecutionDate}
                    dueDate={dueDate}
                    setDueDate={setDueDate}
                    invoicePrefix={invoicePrefix}
                    setInvoicePrefix={setInvoicePrefix}
                    invoiceNumber={invoiceNumber}
                    setInvoiceNumber={setInvoiceNumber}
                    headerNotes={headerNotes}
                    setHeaderNotes={setHeaderNotes}
                    defaultHeaderNotes={defaultHeaderNotes}
                  />
                </Collapse>
                <Collapse 
                  title="Informations client" 
                  defaultOpen={false} 
                  hasError={sectionErrors.client}
                  description="Sélection ou création d'un client pour la facture"
                  icon="user"
                >
                  <ClientSelection
                    isNewClient={isNewClient}
                    setIsNewClient={handleClientModeChange}
                    newClient={newClient}
                    setNewClient={setNewClient as any}
                    selectedClient={selectedClient}
                    setSelectedClient={setSelectedClient}
                    clientsData={clientsData}
                    invoice={invoice}
                    selectedClientData={clientsData?.clients?.items?.find((c: any) => c.id === selectedClient) || null}
                  />
                </Collapse>

                <Collapse 
                  title="Informations société" 
                  defaultOpen={false} 
                  hasError={sectionErrors.companyInfo}
                  description="Coordonnées et informations de votre entreprise"
                  icon="company"
                >
                  <InvoiceCompanyInfo
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
                  <InvoiceItems
                    items={items}
                    handleAddItem={handleAddItem}
                    handleRemoveItem={handleRemoveItem}
                    handleItemChange={handleItemChange as any}
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
                  <InvoiceDiscountAndTotals
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
                </Collapse>

                <Collapse 
                  title="Notes de bas de page" 
                  defaultOpen={false} 
                  hasError={sectionErrors.bankDetails}
                  description="Coordonnées bancaires, conditions et notes"
                  icon="notes"
                >
                  <InvoiceBankDetails
                    userData={userData}
                    useBankDetails={useBankDetails}
                    setUseBankDetails={setUseBankDetails}
                    setCompanyInfo={setCompanyInfo}
                    onConfigureBankDetailsClick={handleConfigureBankDetailsRequest}
                  />
                  <InvoiceTermsAndConditions
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
                  <InvoiceFooterNotes
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
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-8">
                  <div className="max-w-7xl mx-auto flex justify-end items-center">
                    <InvoiceActionButtons 
                      onValidateForm={onValidateForm}
                      isSubmitting={isSubmitting}
                      isEditMode={!!invoice}
                      onClose={handleCloseRequest}
                    />
                  </div>
                </div>
              </>
            )}
          </Form>
        </div>

        {/* Aperçu à droite */}
        <div className="w-3/5 overflow-y-auto bg-gray-50">
          <InvoicePreview
            invoice={invoice}
            selectedClient={clientsData?.clients?.items?.find(
              (c) => c.id === selectedClient
            )}
            isNewClient={isNewClient}
            newClient={newClient}
            items={items}
            invoiceNumber={invoiceNumber}
            invoicePrefix={invoicePrefix}
            issueDate={issueDate}
            dueDate={dueDate}
            executionDate={executionDate}
            purchaseOrderNumber={purchaseOrderNumber}
            companyInfo={companyInfo}
            calculateTotals={calculateTotals}
            headerNotes={headerNotes}
            footerNotes={footerNotes}
            isDeposit={isDeposit}
            customFields={customFields}
            termsAndConditions={termsAndConditions}
            termsAndConditionsLinkTitle={termsAndConditionsLinkTitle}
            termsAndConditionsLink={termsAndConditionsLink}
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
