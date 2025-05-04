import React, { useState, useEffect, useCallback } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { TextField, TextArea, Tooltip, Button } from '../../../ui';
import {
  INVOICE_PREFIX_PATTERN,
  INVOICE_NUMBER_PATTERN,
  NOTES_PATTERN,
  INVOICE_PREFIX_ERROR_MESSAGE,
  INVOICE_NUMBER_ERROR_MESSAGE,
  HEADER_NOTES_ERROR_MESSAGE
} from '../../../../constants/formValidations';

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
  const [activeHeaderNoteButton, setActiveHeaderNoteButton] = useState<string>('');
  const [activeValidityButton, setActiveValidityButton] = useState<string>('');
  
  // Fonction pour valider les dates
  const validateDates = useCallback(() => {
    // Réinitialiser les erreurs
    setIssueDateError(null);
    setValidUntilError(null);
    
    let isValid = true;
    
    // Vérifier que la date d'émission est présente
    if (!issueDate || issueDate.trim() === '') {
      setIssueDateError('La date d\'\u00e9mission est requise');
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
        setValidUntilError('La date de validité doit être postérieure ou égale à la date d\'\u00e9mission');
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
    <div className="space-y-6">
      {/* Identification */}
      <div className="mb-4">
        <div className="flex items-center mb-3">
          <h4 className="text-xl font-medium text-gray-600">Informations du devis</h4>
          <div className="flex items-center">
            <Tooltip content="Le numéro de devis est automatiquement séquentiel pour assurer la conformité légale" position="right">
              <InformationCircleIcon className="h-6 w-6 ml-2 text-[#5b50ff] cursor-help" />
            </Tooltip>
          </div>
        </div>
        <p className="text-xs text-gray-400 italic mb-3">Conformément à la législation française, les numéros de facture doivent suivre une séquence chronologique continue sans interruption. Cette numérotation séquentielle est obligatoire pour assurer la conformité fiscale et la traçabilité des transactions.</p>
      </div>

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
      
      {/* Notes d'en-tête */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xl font-medium text-gray-600">Notes</h4>
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
        <TextArea
          id="headerNotes"
          name="headerNotes"
          label="Notes d'en-tête"
          value={headerNotes}
          onChange={(e) => {
            setHeaderNotes(e.target.value);
            validateHeaderNotes(e.target.value);
            // Réinitialiser le bouton actif si le texte est modifié manuellement
            if (activeHeaderNoteButton && e.target.value !== '') {
              setActiveHeaderNoteButton('');
            }
          }}
          placeholder="Notes à afficher en haut du devis"
          rows={3}
        />
        {headerNotesError && (
          <p className="mt-1 text-sm text-red-600 font-medium">{headerNotesError}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Ces notes apparaîtront en haut du devis, juste après les informations de base.</p>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <Button 
            size="sm"
            variant={activeHeaderNoteButton === 'validite' ? 'primary' : 'outline'}
            className={`min-w-[110px] ${activeHeaderNoteButton === 'validite' ? 'bg-[#5b50ff] hover:bg-[#5b50ff] focus:ring-[#5b50ff]' : ''}`}
            onClick={() => {
              const text = "Ce devis est valable 30 jours à compter de sa date d'émission. Passé ce délai, les prix sont susceptibles d'être modifiés.";
              setHeaderNotes(text);
              validateHeaderNotes(text);
              setActiveHeaderNoteButton('validite');
            }}
          >
            Validité
          </Button>
          
          <Button 
            size="sm"
            variant={activeHeaderNoteButton === 'conditions' ? 'primary' : 'outline'}
            className={`min-w-[110px] ${activeHeaderNoteButton === 'conditions' ? 'bg-[#5b50ff] hover:bg-[#5b50ff] focus:ring-[#5b50ff]' : ''}`}
            onClick={() => {
              const text = "Conditions de paiement : 30% à la commande, solde à la livraison. Délai d'exécution : à convenir ensemble après acceptation du devis.";
              setHeaderNotes(text);
              validateHeaderNotes(text);
              setActiveHeaderNoteButton('conditions');
            }}
          >
            Conditions
          </Button>
          
          <Button 
            size="sm"
            variant={activeHeaderNoteButton === 'reference' ? 'primary' : 'outline'}
            className={`min-w-[110px] ${activeHeaderNoteButton === 'reference' ? 'bg-[#5b50ff] hover:bg-[#5b50ff] focus:ring-[#5b50ff]' : ''}`}
            onClick={() => {
              const text = "Référence du projet : [Référence]. Merci de mentionner cette référence lors de votre acceptation du devis.";
              setHeaderNotes(text);
              validateHeaderNotes(text);
              setActiveHeaderNoteButton('reference');
            }}
          >
            Référence projet
          </Button>
          
          <Button 
            size="sm"
            variant={activeHeaderNoteButton === 'custom' ? 'primary' : 'outline'}
            className={`min-w-[110px] ${activeHeaderNoteButton === 'custom' ? 'bg-[#5b50ff] hover:bg-[#5b50ff] focus:ring-[#5b50ff]' : ''}`}
            onClick={() => {
              setHeaderNotes('');
              validateHeaderNotes('');
              setActiveHeaderNoteButton('custom');
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