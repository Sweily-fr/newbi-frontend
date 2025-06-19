import React, { useState, useEffect, useCallback } from 'react';
import { TextField, TextArea, Tooltip, Button } from '../../../../../components/';
import { Add, InfoCircle } from 'iconsax-react';
import {
  INVOICE_PREFIX_PATTERN,
  INVOICE_NUMBER_PATTERN,
  NOTES_PATTERN,
  INVOICE_PREFIX_ERROR_MESSAGE,
  INVOICE_NUMBER_ERROR_MESSAGE,
  HEADER_NOTES_ERROR_MESSAGE
} from '../../../../../constants/formValidations';

interface QuoteGeneralInfoProps {
  quotePrefix: string;
  setQuotePrefix: (value: string) => void;
  quoteNumber: string;
  setQuoteNumber: (value: string) => void;
  issueDate: string;
  setIssueDate: (value: string) => void;
  validUntil: string;
  setValidUntil: (value: string) => void;
  headerNotes: string;
  setHeaderNotes: (value: string) => void;
  defaultHeaderNotes?: string;
}

export const QuoteGeneralInfo: React.FC<QuoteGeneralInfoProps> = ({
  quotePrefix,
  setQuotePrefix,
  quoteNumber,
  setQuoteNumber,
  issueDate,
  setIssueDate,
  validUntil,
  setValidUntil,
  headerNotes,
  setHeaderNotes,
  defaultHeaderNotes,
}) => {
  // États pour gérer les erreurs de validation
  const [quotePrefixError, setQuotePrefixError] = useState<string | null>(null);
  const [quoteNumberError, setQuoteNumberError] = useState<string | null>(null);
  const [headerNotesError, setHeaderNotesError] = useState<string | null>(null);
  const [issueDateError, setIssueDateError] = useState<string | null>(null);
  const [validUntilError, setValidUntilError] = useState<string | null>(null);
  const [activeHeaderNoteButtons, setActiveHeaderNoteButtons] = useState<string[]>([]);
  const [activeValidityButton, setActiveValidityButton] = useState<string>('');
  
  // Fonction pour valider les dates
  const validateDates = useCallback(() => {
    // Réinitialiser les erreurs
    setIssueDateError(null);
    setValidUntilError(null);
    
    let isValid = true;
    
    // Vérifier que la date d'émission est présente
    if (!issueDate || issueDate.trim() === '') {
      setIssueDateError('La date d\'émission est requise');
      isValid = false;
    }
    
    // Vérifier que la date de validité est présente
    if (!validUntil || validUntil.trim() === '') {
      setValidUntilError('La date de validité est requise');
      isValid = false;
    }
    
    // Si les deux dates sont présentes, vérifier que la date de validité est postérieure ou égale à la date d'émission
    if (issueDate && validUntil) {
      const issueDateObj = new Date(issueDate);
      const validUntilObj = new Date(validUntil);
      
      if (validUntilObj < issueDateObj) {
        setValidUntilError('La date de validité doit être postérieure ou égale à la date d\'émission');
        isValid = false;
      }
    }
    
    return isValid;
  }, [issueDate, validUntil, setIssueDateError, setValidUntilError]);
  
  // Fonction pour calculer une date future basée sur le nombre de jours
  const calculateFutureDate = useCallback((days: number): string => {
    const date = new Date();
    if (issueDate) {
      date.setTime(new Date(issueDate).getTime());
    }
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }, [issueDate]);

  // Définir les valeurs par défaut pour les dates si elles ne sont pas déjà définies
  useEffect(() => {
    // Date d'émission par défaut : aujourd'hui
    if (!issueDate || issueDate.trim() === '') {
      const today = new Date().toISOString().split('T')[0];
      setIssueDate(today);
    }
    
    // Date de validité par défaut : aujourd'hui + 1 mois
    if (!validUntil || validUntil.trim() === '') {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setValidUntil(nextMonth.toISOString().split('T')[0]);
      setActiveValidityButton('30');
    }
    
    // Valider les dates au chargement initial
    validateDates();
  }, [issueDate, validUntil, setIssueDate, setValidUntil, validateDates]);

  // Fonction pour obtenir l'année et le mois actuels
  const getCurrentYearMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return { year, month };
  };

  // Fonction pour remplacer les placeholders par les valeurs actuelles
  const replaceDatePlaceholders = (value: string) => {
    const { year, month } = getCurrentYearMonth();
    let newValue = value;
    
    // Remplacer AAAA par l'année actuelle
    if (newValue.includes('AAAA')) {
      newValue = newValue.replace('AAAA', year.toString());
    }
    
    // Remplacer MM par le mois actuel
    if (newValue.includes('MM')) {
      newValue = newValue.replace('MM', month);
    }
    
    return newValue;
  };

  // Fonction pour valider le préfixe
  const validateQuotePrefix = useCallback((value: string) => {
    if (!value) {
      setQuotePrefixError('Ce champ est requis');
      return false;
    } else if (!INVOICE_PREFIX_PATTERN.test(value)) {
      setQuotePrefixError(INVOICE_PREFIX_ERROR_MESSAGE);
      return false;
    } else {
      setQuotePrefixError(null);
      return true;
    }
  }, []);

  // Fonction pour valider le numéro de devis
  const validateQuoteNumber = useCallback((value: string) => {
    if (!value) {
      setQuoteNumberError('Ce champ est requis');
      return false;
    } else if (!INVOICE_NUMBER_PATTERN.test(value)) {
      setQuoteNumberError(INVOICE_NUMBER_ERROR_MESSAGE.replace('facture', 'devis'));
      return false;
    } else {
      setQuoteNumberError(null);
      return true;
    }
  }, []);
  
  // Fonction pour valider les notes d'en-tête
  const validateHeaderNotes = useCallback((value: string) => {
    if (value && !NOTES_PATTERN.test(value)) {
      setHeaderNotesError(HEADER_NOTES_ERROR_MESSAGE);
      return false;
    } else if (value && value.length > 1000) {
      setHeaderNotesError('Les notes ne doivent pas dépasser 1000 caractères');
      return false;
    } else {
      setHeaderNotesError(null);
      return true;
    }
  }, []);
  
  // Valider tous les champs lorsque le composant est monté
  useEffect(() => {
    validateQuotePrefix(quotePrefix);
    validateQuoteNumber(quoteNumber);
    validateHeaderNotes(headerNotes);
  }, [quotePrefix, quoteNumber, headerNotes, validateQuotePrefix, validateQuoteNumber, validateHeaderNotes]);

  return (
    <div className="space-y-12">
      {/* Identification */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <span className="mr-2 text-[#5b50ff]">01</span>
          Informations du devis
          <div className="flex items-center ml-2">
            <Tooltip content="Le numéro de devis est automatiquement séquentiel pour assurer la conformité légale" position="right">
              <InfoCircle size="18" color="#5b50ff" variant="Linear" className="cursor-help" />
            </Tooltip>
          </div>
        </h3>
        <hr className="border-t border-gray-200 mb-4" />
        <p className="text-xs text-gray-500 italic mb-4 bg-[#f9f8ff] p-3 rounded-lg border border-[#5b50ff]/20 flex items-start gap-2">
          <InfoCircle size="16" color="#5b50ff" variant="Linear" className="mt-0.5 shrink-0" />
          <span>Conformément à la législation française, les numéros de facture doivent suivre une séquence chronologique continue sans interruption. Cette numérotation séquentielle est obligatoire pour assurer la conformité fiscale et la traçabilité des transactions.</span>
        </p>
      </div>

      <div className="mb-10">
        <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
          Numérotation
        </h4>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              id="quotePrefix"
              name="quotePrefix"
              label="Préfixe"
              value={quotePrefix}
              onChange={(e) => {
                // Remplacer automatiquement AAAA et MM par les valeurs actuelles
                const newValue = replaceDatePlaceholders(e.target.value);
                setQuotePrefix(newValue);
                validateQuotePrefix(newValue);
              }}
              required
              onBlur={(e) => {
                // S'assurer que les placeholders sont remplacés lors de la perte de focus
                const newValue = replaceDatePlaceholders(e.target.value);
                setQuotePrefix(newValue);
                validateQuotePrefix(newValue);
              }}
              placeholder="D-AAAAMM-"
              error={quotePrefixError || undefined}
            />
            <p className="text-xs text-gray-500">Astuce : Saisissez "AAAA" pour insérer l'année actuelle et "MM" pour insérer le mois actuel.</p>
          </div>
          <div className="w-1/2">
            <TextField
              id="quoteNumber"
              name="quoteNumber"
              label="Numéro"
              value={quoteNumber}
              onChange={(e) => {
                setQuoteNumber(e.target.value);
                validateQuoteNumber(e.target.value);
              }}
              onBlur={(e) => validateQuoteNumber(e.target.value)}
              placeholder="00001"
              required
              error={quoteNumberError || undefined}
            />
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
          Dates
        </h4>
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <TextField
              id="issueDate"
              name="issueDate"
              label="Date d'émission"
              type="date"
              value={issueDate}
              onChange={(e) => {
                setIssueDate(e.target.value);
                validateDates();
              }}
              onBlur={() => validateDates()}
              required
              error={issueDateError || undefined}
            />
          </div>
          <div className="w-full">
            <TextField
              id="validUntil"
              name="validUntil"
              label="Valide jusqu'au"
              type="date"
              value={validUntil}
              onChange={(e) => {
                setValidUntil(e.target.value);
                validateDates();
                // Réinitialiser le bouton actif si la date est modifiée manuellement
                if (activeValidityButton) {
                  setActiveValidityButton('');
                }
              }}
              onBlur={() => validateDates()}
              required
              error={validUntilError || undefined}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              <Button 
                size="sm"
                variant={activeValidityButton === '15' ? 'primary' : 'outline'}
                className={`min-w-[90px] ${activeValidityButton === '15' ? 'bg-[#5b50ff] hover:bg-[#4a41e0] focus:ring-[#5b50ff]' : ''}`}
                onClick={() => {
                  const newDate = calculateFutureDate(15);
                  setValidUntil(newDate);
                  validateDates();
                  setActiveValidityButton('15');
                }}
              >
                15 jours
              </Button>
              
              <Button 
                size="sm"
                variant={activeValidityButton === '30' ? 'primary' : 'outline'}
                className={`min-w-[90px] ${activeValidityButton === '30' ? 'bg-[#5b50ff] hover:bg-[#4a41e0] focus:ring-[#5b50ff]' : ''}`}
                onClick={() => {
                  const newDate = calculateFutureDate(30);
                  setValidUntil(newDate);
                  validateDates();
                  setActiveValidityButton('30');
                }}
              >
                30 jours
              </Button>
              
              <Button 
                size="sm"
                variant={activeValidityButton === '90' ? 'primary' : 'outline'}
                className={`min-w-[90px] ${activeValidityButton === '90' ? 'bg-[#5b50ff] hover:bg-[#4a41e0] focus:ring-[#5b50ff]' : ''}`}
                onClick={() => {
                  const newDate = calculateFutureDate(90);
                  setValidUntil(newDate);
                  validateDates();
                  setActiveValidityButton('90');
                }}
              >
                90 jours
              </Button>
              
              <Button 
                size="sm"
                variant={activeValidityButton === 'custom' ? 'primary' : 'outline'}
                className={`min-w-[110px] ${activeValidityButton === 'custom' ? 'bg-[#5b50ff] hover:bg-[#4a41e0] focus:ring-[#5b50ff]' : ''}`}
                onClick={() => {
                  setActiveValidityButton('custom');
                  // Focus sur le champ de date
                  document.getElementById('validUntil')?.focus();
                }}
              >
                Personnaliser
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Notes d'en-tête */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold flex items-center">
            <span className="mr-2 text-[#5b50ff]">02</span>
            Notes d'en-tête
          </h3>
          {defaultHeaderNotes && (
            <button
              type="button"
              onClick={() => {
                if (defaultHeaderNotes) {
                  setHeaderNotes(defaultHeaderNotes);
                  validateHeaderNotes(defaultHeaderNotes);
                }
              }}
              className="text-sm text-[#5b50ff] hover:text-[#4a41e0] flex items-center gap-1"
            >
              <Add size="16" color="#5b50ff" variant="Linear" />
              Appliquer les paramètres par défaut
            </button>
          )}
        </div>
        <hr className="border-t border-gray-200 mb-4" />
        <div className="mb-3">
          <TextArea
            id="headerNotes"
            name="headerNotes"
            label="Texte des notes"
            value={headerNotes}
            onChange={(e) => {
              const newText = e.target.value;
              setHeaderNotes(newText);
              validateHeaderNotes(newText);
              
              // Si le champ est vide, désactiver tous les boutons
              if (!newText || newText.trim() === '') {
                setActiveHeaderNoteButtons([]);
                return;
              }
              
              // Vérifier quels boutons doivent rester actifs en fonction du texte
              const validiteText = "Ce devis est valable 30 jours à compter de sa date d'émission. Passé ce délai, les prix sont susceptibles d'être modifiés.";
              const conditionsText = "Conditions de paiement : 30% à la commande, solde à la livraison. Délai d'exécution : à convenir ensemble après acceptation du devis.";
              const referenceText = "Référence du projet : [Référence]. Merci de mentionner cette référence lors de votre acceptation du devis.";
              
              const newActiveButtons = [];
              
              // Vérifier si le texte contient chacune des suggestions
              if (newText.includes(validiteText)) {
                newActiveButtons.push('validite');
              }
              
              if (newText.includes(conditionsText)) {
                newActiveButtons.push('conditions');
              }
              
              if (newText.includes(referenceText)) {
                newActiveButtons.push('reference');
              }
              
              // Si aucune suggestion n'est trouvée mais il y a du texte, activer le mode personnalisation
              if (newActiveButtons.length === 0 && newText.trim() !== '') {
                newActiveButtons.push('custom');
              }
              
              setActiveHeaderNoteButtons(newActiveButtons);
            }}
            placeholder="Notes à afficher en haut du devis"
            rows={3}
          />
        </div>
        {headerNotesError && (
          <p className="mt-1 text-sm text-red-600 font-medium">{headerNotesError}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Ces notes apparaîtront en haut du devis, juste après les informations de base.</p>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {/* Bouton pour la validité */}
          <Button 
            size="sm"
            variant={activeHeaderNoteButtons.includes('validite') ? 'primary' : 'outline'}
            className={`min-w-[110px] ${activeHeaderNoteButtons.includes('validite') ? 'bg-[#5b50ff] hover:bg-[#4a41e0] focus:ring-[#5b50ff]' : ''}`}
            onClick={() => {
              const validiteText = "Ce devis est valable 30 jours à compter de sa date d'émission. Passé ce délai, les prix sont susceptibles d'être modifiés.";
              
              // Si le bouton est déjà actif, le désactiver et supprimer le texte
              if (activeHeaderNoteButtons.includes('validite')) {
                // Supprimer ce bouton de la liste des boutons actifs
                const newButtons = activeHeaderNoteButtons.filter(id => id !== 'validite');
                setActiveHeaderNoteButtons(newButtons);
                
                // Supprimer le texte correspondant
                let newText = headerNotes;
                if (newText.includes(validiteText)) {
                  if (newText.includes("\n\n" + validiteText)) {
                    newText = newText.replace("\n\n" + validiteText, "");
                  } else if (newText.includes(validiteText + "\n\n")) {
                    newText = newText.replace(validiteText + "\n\n", "");
                  } else {
                    newText = newText.replace(validiteText, "");
                  }
                  
                  // Nettoyer les sauts de ligne en trop
                  newText = newText.replace(/^\n+|\n+$/g, "");
                  newText = newText.replace(/\n{3,}/g, "\n\n");
                  
                  setHeaderNotes(newText);
                  validateHeaderNotes(newText);
                }
              } else {
                // Si le bouton "custom" est actif, le désactiver
                if (activeHeaderNoteButtons.includes('custom')) {
                  setActiveHeaderNoteButtons(['validite']);
                  setHeaderNotes(validiteText);
                  validateHeaderNotes(validiteText);
                  return;
                }
                
                // Activer ce bouton
                setActiveHeaderNoteButtons([...activeHeaderNoteButtons, 'validite']);
                
                // Ajouter le texte
                if (headerNotes && headerNotes.trim() !== "") {
                  setHeaderNotes(headerNotes + "\n\n" + validiteText);
                  validateHeaderNotes(headerNotes + "\n\n" + validiteText);
                } else {
                  setHeaderNotes(validiteText);
                  validateHeaderNotes(validiteText);
                }
              }
            }}
          >
            Validité
          </Button>
          
          {/* Bouton pour les conditions */}
          <Button 
            size="sm"
            variant={activeHeaderNoteButtons.includes('conditions') ? 'primary' : 'outline'}
            className={`min-w-[110px] ${activeHeaderNoteButtons.includes('conditions') ? 'bg-[#5b50ff] hover:bg-[#4a41e0] focus:ring-[#5b50ff]' : ''}`}
            onClick={() => {
              const conditionsText = "Conditions de paiement : 30% à la commande, solde à la livraison. Délai d'exécution : à convenir ensemble après acceptation du devis.";
              
              // Si le bouton est déjà actif, le désactiver et supprimer le texte
              if (activeHeaderNoteButtons.includes('conditions')) {
                // Supprimer ce bouton de la liste des boutons actifs
                const newButtons = activeHeaderNoteButtons.filter(id => id !== 'conditions');
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
                if (activeHeaderNoteButtons.includes('custom')) {
                  setActiveHeaderNoteButtons(['conditions']);
                  setHeaderNotes(conditionsText);
                  validateHeaderNotes(conditionsText);
                  return;
                }
                
                // Activer ce bouton
                setActiveHeaderNoteButtons([...activeHeaderNoteButtons, 'conditions']);
                
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
            Conditions
          </Button>
          
          {/* Bouton pour la référence projet */}
          <Button 
            size="sm"
            variant={activeHeaderNoteButtons.includes('reference') ? 'primary' : 'outline'}
            className={`min-w-[110px] ${activeHeaderNoteButtons.includes('reference') ? 'bg-[#5b50ff] hover:bg-[#4a41e0] focus:ring-[#5b50ff]' : ''}`}
            onClick={() => {
              const referenceText = "Référence du projet : [Référence]. Merci de mentionner cette référence lors de votre acceptation du devis.";
              
              // Si le bouton est déjà actif, le désactiver et supprimer le texte
              if (activeHeaderNoteButtons.includes('reference')) {
                // Supprimer ce bouton de la liste des boutons actifs
                const newButtons = activeHeaderNoteButtons.filter(id => id !== 'reference');
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
                if (activeHeaderNoteButtons.includes('custom')) {
                  setActiveHeaderNoteButtons(['reference']);
                  setHeaderNotes(referenceText);
                  validateHeaderNotes(referenceText);
                  return;
                }
                
                // Activer ce bouton
                setActiveHeaderNoteButtons([...activeHeaderNoteButtons, 'reference']);
                
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
            variant={activeHeaderNoteButtons.includes('custom') ? 'primary' : 'outline'}
            className={`min-w-[110px] ${activeHeaderNoteButtons.includes('custom') ? 'bg-[#5b50ff] hover:bg-[#4a41e0] focus:ring-[#5b50ff]' : ''}`}
            onClick={() => {
              setHeaderNotes('');
              validateHeaderNotes('');
              setActiveHeaderNoteButtons(['custom']);
              // Focus sur le champ de texte
              document.getElementById('headerNotes')?.focus();
            }}
          >
            Personnaliser
          </Button>
        </div>
      </div>
    </div>
  );
};
