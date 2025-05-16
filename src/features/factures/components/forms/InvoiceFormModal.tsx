import React, { useEffect, useState, useCallback } from "react";
import { useBodyScrollLock, useDocumentSettings, useBeforeUnload } from "../../../../hooks";
import { useInvoiceForm } from "../../hooks/useInvoiceForm";
import { InvoiceFormModalProps, Item } from "../../types/invoice";
import { Button, Form } from "../../../../components/";
import { DocumentSettings } from "../../../../components/specific/DocumentSettings";
import { validateInvoiceDates } from "../../../../constants/formValidations";
import { ClientSelection } from "./Sections";
import { InvoiceItems } from "./Sections";
import { InvoiceDiscountAndTotals } from "./Sections";
import { InvoiceGeneralInfo } from "./Sections";
import { InvoiceBankDetails } from "./Sections";
import { InvoiceTermsAndConditions } from "./Sections";
import { InvoiceFooterNotes } from "./Sections";
import { InvoiceCompanyInfo } from "./Sections";
import { InvoiceActionButtons } from "./Sections";
import { InvoicePreview } from "./InvoicePreview";
import { useQuery } from "@apollo/client";
import { GET_QUOTE } from "../../../devis/graphql/quotes";
import { ConfirmationModal } from "../../../../components/common/ConfirmationModal";
import { Notification } from "../../../../components/";
import { NavigationSidebar } from "../../../../components/common/NavigationSidebar/NavigationSidebar";
import { Profile2User, Building, ShoppingCart, Calculator, MessageText, Setting2, DocumentText, User, Notepad2 } from "iconsax-react";

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
  
  // État pour suivre la section active dans la navigation
  const [activeSection, setActiveSection] = useState<"generalInfo" | "client" | "companyInfo" | "items" | "discountAndTotals" | "bankDetails">("generalInfo");
  
  // Fonction pour calculer la progression du formulaire
  const calculateProgress = useCallback(() => {
    const sections = [
      !sectionErrors.generalInfo,
      !sectionErrors.client,
      !sectionErrors.companyInfo,
      !sectionErrors.items,
      !sectionErrors.discountAndTotals,
      !sectionErrors.bankDetails
    ];
    
    const completedSections = sections.filter(Boolean).length;
    return Math.round((completedSections / sections.length) * 100);
  }, [sectionErrors]);
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
      // Vérification des champs requis
      const hasRequiredFieldsError = !item.description || 
                      !item.quantity || 
                      !item.unitPrice || 
                      item.vatRate === undefined || item.vatRate === null ||
                      !item.unit;
      
      // Vérification spécifique pour TVA à 0 sans texte d'exemption
      const hasTvaExemptionError = item.vatRate === 0 && (!item.vatExemptionText || item.vatExemptionText.trim() === '');
      
      const hasError = hasRequiredFieldsError || hasTvaExemptionError;
      
      if (hasError) {
        if (hasTvaExemptionError) {
          console.error(`Erreur dans l'article ${index + 1}: TVA à 0% sans mention d'exemption`, item);
        } else if (hasRequiredFieldsError) {
          console.error(`Erreur dans l'article ${index + 1}: champs requis manquants`, item);
        }
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
      <div className="flex flex-1 h-[calc(100vh-60px)] overflow-hidden">
        {/* Navigation sidebar */}
        {!showSettings && (
          <NavigationSidebar
            items={[
              {
                id: "generalInfo",
                icon: <DocumentText size="24" color={activeSection === "generalInfo" ? "#5b50ff" : "#222"} variant={activeSection === "generalInfo" ? "Bold" : "Linear"} />,
                tooltip: "Informations générales"
              },
              {
                id: "client",
                icon: <Profile2User size="24" color={activeSection === "client" ? "#5b50ff" : "#222"} variant={activeSection === "client" ? "Bold" : "Linear"} />,
                tooltip: "Informations client"
              },
              {
                id: "companyInfo",
                icon: <Building size="24" color={activeSection === "companyInfo" ? "#5b50ff" : "#222"} variant={activeSection === "companyInfo" ? "Bold" : "Linear"} />,
                tooltip: "Informations société"
              },
              {
                id: "items",
                icon: <ShoppingCart size="24" color={activeSection === "items" ? "#5b50ff" : "#222"} variant={activeSection === "items" ? "Bold" : "Linear"} />,
                tooltip: "Produits et services"
              },
              {
                id: "discountAndTotals",
                icon: <Calculator size="24" color={activeSection === "discountAndTotals" ? "#5b50ff" : "#222"} variant={activeSection === "discountAndTotals" ? "Bold" : "Linear"} />,
                tooltip: "Remise et totaux"
              },
              {
                id: "bankDetails",
                icon: <MessageText size="24" color={activeSection === "bankDetails" ? "#5b50ff" : "#222"} variant={activeSection === "bankDetails" ? "Bold" : "Linear"} />,
                tooltip: "Notes de bas de page"
              }
            ]}
            activeItemId={activeSection}
            onItemClick={(id) => setActiveSection(id as typeof activeSection)}
            primaryColor="#5b50ff"
            activeBackgroundColor="#f0eeff"
            fixed={false}
          />
        )}
        
        {/* Formulaire à gauche */}
        <div className="w-3/6 bg-gray-50 overflow-y-auto border-r border-gray-200 flex flex-col h-full">
          <Form onSubmit={(e) => e.preventDefault()} className="flex flex-col flex-grow">
            {showSettings ? (
            <div className="p-6 flex-grow">
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
            </div>
            ) : (
              <>
                <div className="flex justify-end px-10 pt-10">
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
                <div className="flex-grow mb-4 px-10 overflow-y-auto">
                  {activeSection === "generalInfo" && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2 flex items-center">
                        <DocumentText 
                          size="20" 
                          variant="Outline" 
                          color={sectionErrors.generalInfo ? '#ef4444' : '#5b50ff'} 
                          className="mr-2" 
                        />
                        Informations générales
                      </h2>
                      <p className="text-gray-500 mb-4">Informations de base de la facture</p>
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
                    </div>
                  )}
                  
                  {activeSection === "client" && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2 flex items-center">
                        <span className={`mr-2 ${sectionErrors.client ? 'text-red-500' : 'text-[#5b50ff]'}`}>
                          <User size="20" color={sectionErrors.client ? '#ef4444' : '#5b50ff'} variant={sectionErrors.client ? 'Bold' : 'Linear'} />
                        </span>
                        Informations client
                      </h2>
                      <p className="text-gray-500 mb-4">Sélection ou création d'un client pour la facture</p>
                      <ClientSelection
                        isNewClient={isNewClient}
                        setIsNewClient={handleClientModeChange}
                        newClient={newClient}
                        setNewClient={setNewClient as any} // Type casting nécessaire en raison d'incompatibilités entre les types
                        selectedClient={selectedClient}
                        setSelectedClient={setSelectedClient}
                        clientsData={clientsData}
                        invoice={invoice}
                        selectedClientData={clientsData?.clients?.items?.find((c: any) => c.id === selectedClient) || null} // Type casting nécessaire pour éviter l'erreur de typage implicite
                      />
                    </div>
                  )}
                  
                  {activeSection === "companyInfo" && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2 flex items-center">
                        <span className={`mr-2 ${sectionErrors.companyInfo ? 'text-red-500' : 'text-[#5b50ff]'}`}>
                          <Building size="20" color={sectionErrors.companyInfo ? '#ef4444' : '#5b50ff'} variant={sectionErrors.companyInfo ? 'Bold' : 'Linear'} />
                        </span>
                        Informations société
                      </h2>
                      <p className="text-gray-500 mb-4">Coordonnées et informations de votre entreprise</p>
                      <InvoiceCompanyInfo
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
                      <h2 className="text-lg font-semibold mb-2 flex items-center">
                        <span className={`mr-2 ${sectionErrors.items ? 'text-red-500' : 'text-[#5b50ff]'}`}>
                          <ShoppingCart size="20" color={sectionErrors.items ? '#ef4444' : '#5b50ff'} variant={sectionErrors.items ? 'Bold' : 'Linear'} />
                        </span>
                        Produits et services
                      </h2>
                      <p className="text-gray-500 mb-4">Articles, quantités et prix à facturer</p>
                      <InvoiceItems
                        items={items}
                        handleAddItem={handleAddItem}
                        handleRemoveItem={handleRemoveItem}
                        handleItemChange={(index, field, value) => {
                          // Créer un adaptateur pour résoudre l'incompatibilité de types
                          // La fonction handleItemChange du hook useInvoiceForm attend un field de type keyof Item
                          // mais le composant InvoiceItems passe un field de type string
                          handleItemChange(index, field as keyof Item, value);
                        }}
                        handleProductSelect={handleProductSelect}
                      />
                    </div>
                  )}
                  
                  {activeSection === "discountAndTotals" && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2 flex items-center">
                        <span className={`mr-2 ${sectionErrors.discountAndTotals ? 'text-red-500' : 'text-[#5b50ff]'}`}>
                          <Calculator size="20" color="#5b50ff" variant="Bold" />
                        </span>
                        Remise et totaux
                      </h2>
                      <p className="text-gray-500 mb-4">Remises, taxes et champs personnalisés</p>
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
                    </div>
                  )}
                  
                  {activeSection === "bankDetails" && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2 flex items-center">
                        <Notepad2 size="20" color="#5b50ff" className="mr-2" variant="Linear" />
                        Notes de bas de page
                      </h2>
                      <p className="text-gray-500 mb-4">Coordonnées bancaires, conditions et notes</p>
                      <div className="mb-10">
                        <InvoiceBankDetails
                          userData={userData}
                          useBankDetails={useBankDetails}
                          setUseBankDetails={setUseBankDetails}
                          setCompanyInfo={setCompanyInfo}
                          onConfigureBankDetailsClick={handleConfigureBankDetailsRequest}
                        />
                      </div>
                      
                      <div className="mb-10">
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
                      </div>
                      
                      <div className="mb-10">
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
                      </div>
                    </div>
                  )}
                </div>
                <div className="sticky bottom-0 bg-white border-t border-l border-gray-200 p-4 mt-8">
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
        <div className="w-3/6 overflow-y-hidden z-[900]">
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
