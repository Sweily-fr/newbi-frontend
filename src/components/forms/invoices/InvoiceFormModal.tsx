import React, { useEffect, useState } from "react";
import { useInvoiceForm } from "../../../hooks";
import { InvoiceFormModalProps } from "../../../types";
import { Button, Form, Select } from "../../ui";
import Collapse from "../../ui/Collapse";
import { validateInvoiceDates } from "../../../constants/formValidations";
import { ClientSelection } from "./Sections";
import { InvoiceItems } from "./Sections";
import { InvoiceDiscountAndTotals } from "./Sections";
import { InvoiceGeneralInfo } from "./Sections";
import { InvoiceFooterNotes } from "./Sections";
import { InvoiceTermsAndConditions } from "./Sections";
import { InvoiceCustomFields } from "./Sections";
import { InvoiceCompanyInfo } from "./Sections";
import { InvoiceBankDetails } from "./Sections";
import { InvoiceStatus } from "./Sections";
import { InvoiceActionButtons } from "./Sections";
import { InvoicePreview } from "./InvoicePreview";
import { useQuery } from "@apollo/client";
import { GET_QUOTE } from "../../../graphql/quotes";
import { ConfirmationModal } from "../../feedback/ConfirmationModal";

export const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({
  invoice,
  onClose,
  onSubmit,
  quoteId
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

  // Utiliser le hook personnalisé pour gérer la logique du formulaire
  const {
    selectedClient,
    setSelectedClient,
    isNewClient,
    setIsNewClient,
    handleClientModeChange,
    newClient,
    setNewClient,
    items,
    status,
    setStatus,
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
    bankDetailsComplete,
    bankDetailsReadOnly,
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

  // Récupérer les données du devis si quoteId est fourni
  const { data: quoteData, loading: quoteLoading } = useQuery(GET_QUOTE, {
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
      setBankDetailsComplete(quote.bankDetailsComplete);
      setBankDetailsReadOnly(quote.bankDetailsReadOnly);
    }
  }, [quoteData]);



  // Fonction pour valider le formulaire et gérer la soumission
  const onValidateForm = (asDraft: boolean) => {
    console.log("Validation du formulaire déclenchée, brouillon:", asDraft);
    
    // Définir si on soumet en brouillon et le logger pour débogage
    setSubmitAsDraft(asDraft);
    console.log("setSubmitAsDraft appelé avec:", asDraft);
    
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
      console.log("Erreurs dans les informations générales");
    }
    
    // Vérifier la validité des dates avec validateInvoiceDates
    const datesValidation = validateInvoiceDates(issueDate, dueDate, executionDate);
    if (!datesValidation.isValid) {
      errors.generalInfo = true;
      console.log("Erreurs dans les dates:", datesValidation);
    }
    
    // Vérifier les erreurs dans la section Client
    if (!selectedClient && !isNewClient) {
      errors.client = true;
      console.log("Erreur: aucun client sélectionné");
    } else if (isNewClient) {
      if (!newClient.name || !newClient.email || !newClient.street || !newClient.city || !newClient.postalCode || !newClient.country) {
        errors.client = true;
        console.log("Erreur: informations du nouveau client incomplètes");
      }
    }
    
    // Vérifier les erreurs dans la section Informations de l'entreprise
    if (!companyInfo.name || !companyInfo.email || !companyInfo.address.street || !companyInfo.address.city || !companyInfo.address.postalCode || !companyInfo.address.country) {
      errors.companyInfo = true;
      console.log("Erreur: informations de l'entreprise incomplètes");
    }
    
    // Vérifier les erreurs dans la section Produits/Services
    const hasItemErrors = items.some((item, index) => {
      const hasError = !item.description || 
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
    if (discount < 0 || (discountType === 'PERCENTAGE' && discount > 100)) {
      errors.discountAndTotals = true;
      console.log("Erreur: valeur de remise invalide");
    }
    
    // Vérifier les erreurs dans la section Notes de bas de page (coordonnées bancaires)
    if (useBankDetails && (!companyInfo.bankDetails?.iban || !companyInfo.bankDetails?.bic || !companyInfo.bankDetails?.bankName)) {
      errors.bankDetails = true;
      console.log("Erreur: coordonnées bancaires incomplètes");
    }
    
    // Mettre à jour l'état des erreurs
    setSectionErrors(errors);
    console.log("État des erreurs mis à jour:", errors);
    
    // Si aucune erreur, soumettre le formulaire
    if (!Object.values(errors).some(Boolean)) {
      console.log("Aucune erreur, soumission du formulaire avec asDraft =", asDraft);
      // Passer directement asDraft à handleSubmit pour éviter les problèmes de synchronisation
      handleSubmit(new Event('submit') as unknown as React.FormEvent, asDraft);
    } else {
      console.log("Des erreurs ont été détectées, affichage des sections avec erreurs");
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
        <div className="w-2/5 overflow-y-auto px-6 pt-6 border-r">
          <Form onSubmit={(e) => e.preventDefault()} spacing="normal" className="w-full">
            <Collapse title="Informations générales" defaultOpen={true} hasError={sectionErrors.generalInfo}>
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
              />
            </Collapse>
            <Collapse title="Client" defaultOpen={false} hasError={sectionErrors.client}>
              <ClientSelection
                isNewClient={isNewClient}
                setIsNewClient={handleClientModeChange}
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                newClient={newClient}
                setNewClient={setNewClient}
                clientsData={clientsData}
                invoice={invoice}
                selectedClientData={clientsData?.clients?.find(c => c.id === selectedClient)}
              />
            </Collapse>

            <Collapse title="Informations de l'entreprise" defaultOpen={false} hasError={sectionErrors.companyInfo}>
              <InvoiceCompanyInfo
                companyInfo={companyInfo}
                userData={userData}
                apiUrl={apiUrl}
                onConfigureInfoClick={handleConfigureInfoRequest}
                setCompanyInfo={setCompanyInfo}
              />
            </Collapse>

            {/* <Collapse title="Statut" defaultOpen={false}>
              <InvoiceStatus status={status} setStatus={setStatus} />
              </Collapse> */}
            <Collapse title="Produits/Services" defaultOpen={false} hasError={sectionErrors.items}>
              <InvoiceItems
                items={items}
                handleItemChange={handleItemChange}
                handleRemoveItem={handleRemoveItem}
                handleAddItem={handleAddItem}
                handleProductSelect={handleProductSelect}
              />
            </Collapse>

            <Collapse title="Remise et totaux" defaultOpen={false} hasError={sectionErrors.discountAndTotals}>
              <InvoiceDiscountAndTotals
                discount={discount}
                setDiscount={setDiscount}
                discountType={discountType}
                setDiscountType={setDiscountType}
                calculateTotals={calculateTotals}
                customFields={customFields || []}
                handleAddCustomField={handleAddCustomField}
                handleRemoveCustomField={handleRemoveCustomField}
                handleCustomFieldChange={handleCustomFieldChange}
              />
            </Collapse>

            {/* <Collapse title="Conditions générales" defaultOpen={false}>
            </Collapse> */}

            <Collapse title="Notes de bas de page" defaultOpen={false} hasError={sectionErrors.bankDetails}>
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
              />
              <InvoiceFooterNotes
                footerNotes={footerNotes}
                setFooterNotes={setFooterNotes}
              />
            </Collapse>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-8">
              <div className="max-w-7xl mx-auto">
                <InvoiceActionButtons 
                  onValidateForm={onValidateForm}
                  isSubmitting={isSubmitting}
                  isEditMode={!!invoice}
                  onClose={handleCloseRequest}
                />
              </div>
            </div>
          </Form>
        </div>

        {/* Aperçu à droite */}
        <div className="w-3/5 overflow-y-auto bg-gray-50">
          <InvoicePreview
            invoice={invoice}
            selectedClient={clientsData?.clients?.find(
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
