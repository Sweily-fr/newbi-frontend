import React, { useState, useEffect } from "react";
import { InfoCircle } from "iconsax-react";
import {
  Button,
  Checkbox,
  TextField,
  TextArea,
  Tooltip,
} from "../../../../../components/";
import {
  INVOICE_PREFIX_PATTERN,
  INVOICE_NUMBER_PATTERN,
  PURCHASE_ORDER_PATTERN,
  NOTES_PATTERN,
  INVOICE_PREFIX_ERROR_MESSAGE,
  INVOICE_NUMBER_ERROR_MESSAGE,
  PURCHASE_ORDER_ERROR_MESSAGE,
  HEADER_NOTES_ERROR_MESSAGE,
  validateInvoiceDates,
} from "../../../../../constants/formValidations";

interface InvoiceGeneralInfoProps {
  isDeposit: boolean;
  setIsDeposit: (isDeposit: boolean) => void;
  purchaseOrderNumber: string;
  setPurchaseOrderNumber: (purchaseOrderNumber: string) => void;
  issueDate: string;
  setIssueDate: (issueDate: string) => void;
  executionDate: string;
  setExecutionDate: (executionDate: string) => void;
  dueDate: string;
  setDueDate: (dueDate: string) => void;
  invoicePrefix: string;
  setInvoicePrefix: (invoicePrefix: string) => void;
  invoiceNumber: string;
  setInvoiceNumber: (invoiceNumber: string) => void;
  headerNotes: string;
  setHeaderNotes: (headerNotes: string) => void;
  defaultHeaderNotes?: string;
}

export const InvoiceGeneralInfo: React.FC<InvoiceGeneralInfoProps> = ({
  isDeposit,
  setIsDeposit,
  purchaseOrderNumber,
  setPurchaseOrderNumber,
  issueDate,
  setIssueDate,
  executionDate,
  setExecutionDate,
  dueDate,
  setDueDate,
  invoicePrefix,
  setInvoicePrefix,
  invoiceNumber,
  setInvoiceNumber,
  headerNotes,
  setHeaderNotes,
  defaultHeaderNotes,
}) => {
  // États pour les erreurs de validation
  const [invoicePrefixError, setInvoicePrefixError] = useState<
    string | undefined
  >(undefined);
  const [invoiceNumberError, setInvoiceNumberError] = useState<
    string | undefined
  >(undefined);
  const [purchaseOrderError, setPurchaseOrderError] = useState<
    string | undefined
  >(undefined);
  const [headerNotesError, setHeaderNotesError] = useState<string | undefined>(
    undefined
  );
  const [issueDateError, setIssueDateError] = useState<string | undefined>(
    undefined
  );
  const [dueDateError, setDueDateError] = useState<string | undefined>(
    undefined
  );
  const [executionDateError, setExecutionDateError] = useState<
    string | undefined
  >(undefined);
  const [activeDueDateButton, setActiveDueDateButton] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  // Suivre les boutons actifs pour les notes d'en-tête
  const [activeHeaderNoteButtons, setActiveHeaderNoteButtons] =
    useState<string[]>([]);

  // Fonctions de validation
  // Fonction pour obtenir l'année et le mois actuels
  const getCurrentYearMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return { year, month };
  };

  // Fonction pour remplacer les placeholders par les valeurs actuelles
  const replaceDatePlaceholders = (value: string) => {
    const { year, month } = getCurrentYearMonth();
    let newValue = value;

    // Remplacer AAAA par l'année actuelle
    if (newValue.includes("AAAA")) {
      newValue = newValue.replace("AAAA", year.toString());
    }

    // Remplacer MM par le mois actuel
    if (newValue.includes("MM")) {
      newValue = newValue.replace("MM", month);
    }

    return newValue;
  };

  const validateInvoicePrefix = (value: string) => {
    if (!value) {
      setInvoicePrefixError("Ce champ est requis");
      return false;
    } else if (!INVOICE_PREFIX_PATTERN.test(value)) {
      setInvoicePrefixError(INVOICE_PREFIX_ERROR_MESSAGE);
      return false;
    } else {
      setInvoicePrefixError(undefined);
      return true;
    }
  };

  const validateInvoiceNumber = (value: string) => {
    if (!value) {
      setInvoiceNumberError("Ce champ est requis");
      return false;
    } else if (!INVOICE_NUMBER_PATTERN.test(value)) {
      setInvoiceNumberError(INVOICE_NUMBER_ERROR_MESSAGE);
      return false;
    } else {
      setInvoiceNumberError(undefined);
      return true;
    }
  };

  const validatePurchaseOrder = (value: string) => {
    if (value && !PURCHASE_ORDER_PATTERN.test(value)) {
      setPurchaseOrderError(PURCHASE_ORDER_ERROR_MESSAGE);
      return false;
    } else {
      setPurchaseOrderError(undefined);
      return true;
    }
  };

  const validateHeaderNotes = (value: string) => {
    if (value && !NOTES_PATTERN.test(value)) {
      setHeaderNotesError(HEADER_NOTES_ERROR_MESSAGE);
      return false;
    } else if (value && value.length > 1000) {
      setHeaderNotesError(HEADER_NOTES_ERROR_MESSAGE);
      return false;
    } else {
      setHeaderNotesError(undefined);
      return true;
    }
  };

  // Fonction pour valider les dates
  const validateDates = () => {
    const result = validateInvoiceDates(issueDate, dueDate, executionDate);

    setIssueDateError(result.issueError);
    setDueDateError(result.dueError);
    setExecutionDateError(result.executionError);

    return result.isValid;
  };

  // Valider les champs à chaque changement
  useEffect(() => {
    validateInvoicePrefix(invoicePrefix);
  }, [invoicePrefix]);

  useEffect(() => {
    validateInvoiceNumber(invoiceNumber);
  }, [invoiceNumber]);

  useEffect(() => {
    validatePurchaseOrder(purchaseOrderNumber);
  }, [purchaseOrderNumber]);

  useEffect(() => {
    validateHeaderNotes(headerNotes);
  }, [headerNotes]);

  // Valider les dates lorsqu'une des dates change
  useEffect(() => {
    validateDates();
  }, [issueDate, dueDate, executionDate]);

  // Détermine le bouton actif en fonction de la date d'échéance
  useEffect(() => {
    if (!dueDate) return;

    const today = new Date().toISOString().split("T")[0];
    if (dueDate === today) {
      setActiveDueDateButton("emission");
      setShowDatePicker(false);
      return;
    }

    const date15 = new Date();
    date15.setDate(date15.getDate() + 15);
    const date15Str = date15.toISOString().split("T")[0];
    if (dueDate === date15Str) {
      setActiveDueDateButton("15jours");
      setShowDatePicker(false);
      return;
    }

    const date30 = new Date();
    date30.setDate(date30.getDate() + 30);
    const date30Str = date30.toISOString().split("T")[0];
    if (dueDate === date30Str) {
      setActiveDueDateButton("30jours");
      setShowDatePicker(false);
      return;
    }

    setActiveDueDateButton("custom");
  }, [dueDate]);

  return (
    <>
      {/* Type de facture */}
      <div className="mb-6">
        <h4 className="text-xl font-medium mb-3 text-gray-600 flex items-center">
          <span className="mr-2 text-[#5b50ff]">01</span>
          Type de facture
        </h4>
        <div>
          <p className="text-xs text-gray-400 italic mb-2">
            Cochez cette case si cette facture représente un acompte sur une
            prestation future. Une facture d'acompte permet de facturer une
            partie du montant total avant la réalisation complète de la
            prestation.
          </p>
          <Checkbox
            id="isDeposit"
            name="isDeposit"
            label="Facture d'acompte"
            checked={isDeposit}
            onChange={(e) => setIsDeposit(e.target.checked)}
          />
        </div>
      </div>
      
      {/* Séparateur */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* Identification */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <h4 className="text-xl font-medium text-gray-600 flex items-center">
            <span className="mr-2 text-[#5b50ff]">02</span>
            Informations de la facture
          </h4>
          <div className="flex items-center">
            <Tooltip
              content="Le numéro de facture est automatiquement séquentiel pour assurer la conformité légale"
              position="right"
            >
              <InfoCircle size="24" color="#5b50ff" className="ml-2 cursor-help" variant="Outline" />
            </Tooltip>
          </div>
        </div>
        <p className="text-xs text-gray-400 italic mb-3">
          Conformément à la législation française, les numéros de facture
          doivent suivre une séquence chronologique continue sans interruption.
          Cette numérotation séquentielle est obligatoire pour assurer la
          conformité fiscale et la traçabilité des transactions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="space-y-1">
              <TextField
                id="invoicePrefix"
                name="invoicePrefix"
                label="Préfixe de facture"
                value={invoicePrefix}
                onChange={(e) => {
                  // Remplacer automatiquement AAAA et MM par les valeurs actuelles
                  const newValue = replaceDatePlaceholders(e.target.value);
                  setInvoicePrefix(newValue);
                  validateInvoicePrefix(newValue);
                }}
                onBlur={(e) => {
                  // S'assurer que les placeholders sont remplacés lors de la perte de focus
                  const newValue = replaceDatePlaceholders(e.target.value);
                  setInvoicePrefix(newValue);
                  validateInvoicePrefix(newValue);
                }}
                placeholder="F-AAAAMM-"
                required
                error={
                  invoicePrefixError
                    ? { message: invoicePrefixError }
                    : undefined
                }
              />
              <p className="text-xs text-gray-500">
                Astuce : Saisissez "AAAA" pour insérer l'année actuelle et "MM"
                pour insérer le mois actuel.
              </p>
            </div>
          </div>
          <TextField
            id="invoiceNumber"
            name="invoiceNumber"
            label="Numéro de facture"
            value={invoiceNumber}
            onChange={(e) => {
              setInvoiceNumber(e.target.value);
              validateInvoiceNumber(e.target.value);
            }}
            required
            error={
              invoiceNumberError ? { message: invoiceNumberError } : undefined
            }
          />
          <TextField
            id="purchaseOrderNumber"
            name="purchaseOrderNumber"
            label="Référence devis"
            placeholder="ex: D-2025-0042"
            value={purchaseOrderNumber}
            onChange={(e) => {
              setPurchaseOrderNumber(e.target.value);
              validatePurchaseOrder(e.target.value);
            }}
            error={
              purchaseOrderError ? { message: purchaseOrderError } : undefined
            }
          />
        </div>
      </div>
      
      {/* Séparateur */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* Dates */}
      <div className="mb-6">
        <h4 className="text-xl font-medium mb-3 text-gray-600 flex items-center">
          <span className="mr-2 text-[#5b50ff]">03</span>
          Dates
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            id="issueDate"
            name="issueDate"
            label="Date d'émission"
            type="date"
            value={issueDate}
            onChange={(e) => {
              setIssueDate(e.target.value);
              // La validation sera déclenchée par useEffect
            }}
            required
            error={issueDateError ? { message: issueDateError } : undefined}
          />
          <TextField
            id="executionDate"
            name="executionDate"
            label="Date d'exécution"
            type="date"
            value={executionDate}
            onChange={(e) => {
              setExecutionDate(e.target.value);
              // La validation sera déclenchée par useEffect
            }}
            error={
              executionDateError ? { message: executionDateError } : undefined
            }
          />
          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date d'échéance
            </label>
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-3 w-full">
                <Button
                  size="sm"
                  variant={
                    activeDueDateButton === "emission" ? "primary" : "outline"
                  }
                  className={`min-w-[110px] flex-1 whitespace-nowrap ${
                    activeDueDateButton === "emission"
                      ? "bg-[#5b50ff] hover:bg-[#5b50ff] focus:ring-[#5b50ff]"
                      : ""
                  }`}
                  onClick={() => {
                    // Date d'aujourd'hui (à l'émission)
                    const today = new Date().toISOString().split("T")[0];
                    setDueDate(today);
                    setActiveDueDateButton("emission");
                    setShowDatePicker(false);
                  }}
                >
                  À l'émission
                </Button>
                <Button
                  size="sm"
                  variant={
                    activeDueDateButton === "15jours" ? "primary" : "outline"
                  }
                  className={`min-w-[110px] flex-1 whitespace-nowrap ${
                    activeDueDateButton === "15jours"
                      ? "bg-[#5b50ff] hover:bg-[#5b50ff] focus:ring-[#5b50ff]"
                      : ""
                  }`}
                  onClick={() => {
                    // Date dans 15 jours
                    const date = new Date();
                    date.setDate(date.getDate() + 15);
                    setDueDate(date.toISOString().split("T")[0]);
                    setActiveDueDateButton("15jours");
                    setShowDatePicker(false);
                  }}
                >
                  Dans 15 jours
                </Button>
                <Button
                  size="sm"
                  variant={
                    activeDueDateButton === "30jours" ? "primary" : "outline"
                  }
                  className={`min-w-[110px] flex-1 whitespace-nowrap ${
                    activeDueDateButton === "30jours"
                      ? "bg-[#5b50ff] hover:bg-[#5b50ff] focus:ring-[#5b50ff]"
                      : ""
                  }`}
                  onClick={() => {
                    // Date dans 30 jours
                    const date = new Date();
                    date.setDate(date.getDate() + 30);
                    setDueDate(date.toISOString().split("T")[0]);
                    setActiveDueDateButton("30jours");
                    setShowDatePicker(false);
                  }}
                >
                  Dans 30 jours
                </Button>
                <Button
                  size="sm"
                  variant={
                    activeDueDateButton === "custom" ? "primary" : "outline"
                  }
                  className={`min-w-[110px] flex-1 whitespace-nowrap ${
                    activeDueDateButton === "custom"
                      ? "bg-[#5b50ff] hover:bg-[#5b50ff] focus:ring-[#5b50ff]"
                      : ""
                  }`}
                  onClick={() => {
                    setShowDatePicker(true);
                    setActiveDueDateButton("custom");
                  }}
                >
                  Choisir
                </Button>
              </div>
              {showDatePicker && (
                <TextField
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    // La validation sera déclenchée par useEffect
                  }}
                  required
                  className="mt-2"
                />
              )}
              {dueDate && (
                <div className="text-sm text-gray-600 mt-1">
                  Date sélectionnée:{" "}
                  {new Date(dueDate).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              )}
              {dueDateError && (
                <div className="text-sm text-red-600 mt-1">{dueDateError}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Séparateur */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* Notes d'entête */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xl font-medium text-gray-600 flex items-center">
            <span className="mr-2 text-[#5b50ff]">04</span>
            Notes
          </h4>
          {defaultHeaderNotes && (
            <button
              type="button"
              onClick={() => {
                if (defaultHeaderNotes) {
                  setHeaderNotes(defaultHeaderNotes);
                  validateHeaderNotes(defaultHeaderNotes);
                }
              }}
              className="text-sm text-[#5b50ff] hover:underline"
            >
              Appliquer les paramètres par défaut
            </button>
          )}
        </div>
        <div>
          <TextArea
            id="headerNotes"
            name="headerNotes"
            label="Notes d'entête"
            value={headerNotes}
            onChange={(e) => {
              const newText = e.target.value;
              setHeaderNotes(newText);
              validateHeaderNotes(newText);
              
              // Si le champ est vide, désactiver tous les boutons
              if (!newText || newText.trim() === "") {
                setActiveHeaderNoteButtons([]);
                return;
              }
              
              // Vérifier quels boutons doivent rester actifs en fonction du texte
              const conditionsText = "Conditions de paiement : paiement à réception de facture. Pénalités de retard : 3 fois le taux d'intérêt légal.";
              const delaiText = "Délai de paiement : 30 jours à compter de la date d'émission de la facture.";
              const referenceText = "Référence du projet : [Référence]. Merci de mentionner cette référence lors de votre paiement.";
              
              const newActiveButtons = [];
              
              // Vérifier si le texte contient chacune des suggestions
              if (newText.includes(conditionsText)) {
                newActiveButtons.push("conditions");
              }
              
              if (newText.includes(delaiText)) {
                newActiveButtons.push("delai");
              }
              
              if (newText.includes(referenceText)) {
                newActiveButtons.push("reference");
              }
              
              // Si aucune suggestion n'est trouvée mais il y a du texte, activer le mode personnalisation
              if (newActiveButtons.length === 0 && newText.trim() !== "") {
                newActiveButtons.push("custom");
              }
              
              setActiveHeaderNoteButtons(newActiveButtons);
            }}
            rows={3}
            placeholder="Ajoutez des notes qui apparaîtront en haut de la facture..."
            error={headerNotesError ? { message: headerNotesError } : undefined}
            helpText="Maximum 1000 caractères"
          />

          <p className="text-xs text-gray-500 mt-1">Ces notes apparaîtront en haut de la facture, juste après les informations de base.</p>

          <div className="flex flex-wrap gap-2 mt-2">
            {/* Bouton pour les conditions de paiement */}
            <Button
              size="sm"
              variant={activeHeaderNoteButtons.includes("conditions") ? "primary" : "outline"}
              className={`min-w-[110px] ${activeHeaderNoteButtons.includes("conditions") ? "bg-[#5b50ff] hover:bg-[#5b50ff] focus:ring-[#5b50ff]" : ""}`}
              onClick={() => {
                const conditionsText = "Conditions de paiement : paiement à réception de facture. Pénalités de retard : 3 fois le taux d'intérêt légal.";
                
                // Si le bouton est déjà actif, le désactiver et supprimer le texte
                if (activeHeaderNoteButtons.includes("conditions")) {
                  // Supprimer ce bouton de la liste des boutons actifs
                  const newButtons = activeHeaderNoteButtons.filter(id => id !== "conditions");
                  setActiveHeaderNoteButtons(newButtons);
                  
                  // Supprimer le texte correspondant
                  let newText = headerNotes;
                  if (newText.includes(conditionsText)) {
                    if (newText.includes("\n\n" + conditionsText)) {
                      newText = newText.replace("\n\n" + conditionsText, "");
                    } else if (newText.includes(conditionsText + "\n\n")) {
                      newText = newText.replace(conditionsText + "\n\n", "");
                    } else {
                      newText = newText.replace(conditionsText, "");
                    }
                    
                    // Nettoyer les sauts de ligne en trop
                    newText = newText.replace(/^\n+|\n+$/g, "");
                    newText = newText.replace(/\n{3,}/g, "\n\n");
                    
                    setHeaderNotes(newText);
                    validateHeaderNotes(newText);
                  }
                } else {
                  // Si le bouton "custom" est actif, le désactiver
                  if (activeHeaderNoteButtons.includes("custom")) {
                    setActiveHeaderNoteButtons(["conditions"]);
                    setHeaderNotes(conditionsText);
                    validateHeaderNotes(conditionsText);
                    return;
                  }
                  
                  // Activer ce bouton
                  setActiveHeaderNoteButtons([...activeHeaderNoteButtons, "conditions"]);
                  
                  // Ajouter le texte
                  if (headerNotes && headerNotes.trim() !== "") {
                    setHeaderNotes(headerNotes + "\n\n" + conditionsText);
                    validateHeaderNotes(headerNotes + "\n\n" + conditionsText);
                  } else {
                    setHeaderNotes(conditionsText);
                    validateHeaderNotes(conditionsText);
                  }
                }
              }}
            >
              Conditions de paiement
            </Button>
            
            {/* Bouton pour le délai de paiement */}
            <Button
              size="sm"
              variant={activeHeaderNoteButtons.includes("delai") ? "primary" : "outline"}
              className={`min-w-[110px] ${activeHeaderNoteButtons.includes("delai") ? "bg-[#5b50ff] hover:bg-[#5b50ff] focus:ring-[#5b50ff]" : ""}`}
              onClick={() => {
                const delaiText = "Délai de paiement : 30 jours à compter de la date d'émission de la facture.";
                
                // Si le bouton est déjà actif, le désactiver et supprimer le texte
                if (activeHeaderNoteButtons.includes("delai")) {
                  // Supprimer ce bouton de la liste des boutons actifs
                  const newButtons = activeHeaderNoteButtons.filter(id => id !== "delai");
                  setActiveHeaderNoteButtons(newButtons);
                  
                  // Supprimer le texte correspondant
                  let newText = headerNotes;
                  if (newText.includes(delaiText)) {
                    if (newText.includes("\n\n" + delaiText)) {
                      newText = newText.replace("\n\n" + delaiText, "");
                    } else if (newText.includes(delaiText + "\n\n")) {
                      newText = newText.replace(delaiText + "\n\n", "");
                    } else {
                      newText = newText.replace(delaiText, "");
                    }
                    
                    // Nettoyer les sauts de ligne en trop
                    newText = newText.replace(/^\n+|\n+$/g, "");
                    newText = newText.replace(/\n{3,}/g, "\n\n");
                    
                    setHeaderNotes(newText);
                    validateHeaderNotes(newText);
                  }
                } else {
                  // Si le bouton "custom" est actif, le désactiver
                  if (activeHeaderNoteButtons.includes("custom")) {
                    setActiveHeaderNoteButtons(["delai"]);
                    setHeaderNotes(delaiText);
                    validateHeaderNotes(delaiText);
                    return;
                  }
                  
                  // Activer ce bouton
                  setActiveHeaderNoteButtons([...activeHeaderNoteButtons, "delai"]);
                  
                  // Ajouter le texte
                  if (headerNotes && headerNotes.trim() !== "") {
                    setHeaderNotes(headerNotes + "\n\n" + delaiText);
                    validateHeaderNotes(headerNotes + "\n\n" + delaiText);
                  } else {
                    setHeaderNotes(delaiText);
                    validateHeaderNotes(delaiText);
                  }
                }
              }}
            >
              Délai de paiement
            </Button>
            
            {/* Bouton pour la référence projet */}
            <Button
              size="sm"
              variant={activeHeaderNoteButtons.includes("reference") ? "primary" : "outline"}
              className={`min-w-[110px] ${activeHeaderNoteButtons.includes("reference") ? "bg-[#5b50ff] hover:bg-[#5b50ff] focus:ring-[#5b50ff]" : ""}`}
              onClick={() => {
                const referenceText = "Référence du projet : [Référence]. Merci de mentionner cette référence lors de votre paiement.";
                
                // Si le bouton est déjà actif, le désactiver et supprimer le texte
                if (activeHeaderNoteButtons.includes("reference")) {
                  // Supprimer ce bouton de la liste des boutons actifs
                  const newButtons = activeHeaderNoteButtons.filter(id => id !== "reference");
                  setActiveHeaderNoteButtons(newButtons);
                  
                  // Supprimer le texte correspondant
                  let newText = headerNotes;
                  if (newText.includes(referenceText)) {
                    if (newText.includes("\n\n" + referenceText)) {
                      newText = newText.replace("\n\n" + referenceText, "");
                    } else if (newText.includes(referenceText + "\n\n")) {
                      newText = newText.replace(referenceText + "\n\n", "");
                    } else {
                      newText = newText.replace(referenceText, "");
                    }
                    
                    // Nettoyer les sauts de ligne en trop
                    newText = newText.replace(/^\n+|\n+$/g, "");
                    newText = newText.replace(/\n{3,}/g, "\n\n");
                    
                    setHeaderNotes(newText);
                    validateHeaderNotes(newText);
                  }
                } else {
                  // Si le bouton "custom" est actif, le désactiver
                  if (activeHeaderNoteButtons.includes("custom")) {
                    setActiveHeaderNoteButtons(["reference"]);
                    setHeaderNotes(referenceText);
                    validateHeaderNotes(referenceText);
                    return;
                  }
                  
                  // Activer ce bouton
                  setActiveHeaderNoteButtons([...activeHeaderNoteButtons, "reference"]);
                  
                  // Ajouter le texte
                  if (headerNotes && headerNotes.trim() !== "") {
                    setHeaderNotes(headerNotes + "\n\n" + referenceText);
                    validateHeaderNotes(headerNotes + "\n\n" + referenceText);
                  } else {
                    setHeaderNotes(referenceText);
                    validateHeaderNotes(referenceText);
                  }
                }
              }}
            >
              Référence projet
            </Button>
            
            {/* Bouton pour personnaliser */}
            <Button
              size="sm"
              variant={activeHeaderNoteButtons.includes("custom") ? "primary" : "outline"}
              className={`min-w-[110px] ${activeHeaderNoteButtons.includes("custom") ? "bg-[#5b50ff] hover:bg-[#5b50ff] focus:ring-[#5b50ff]" : ""}`}
              onClick={() => {
                // Vider le texte et activer uniquement le bouton personnaliser
                setHeaderNotes("");
                validateHeaderNotes("");
                setActiveHeaderNoteButtons(["custom"]);
                // Focus sur le champ de texte
                document.getElementById("headerNotes")?.focus();
              }}
            >
              Personnaliser
            </Button>
            

          </div>
        </div>
      </div>
    </>
  );
};
