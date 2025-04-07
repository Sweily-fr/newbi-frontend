import React, { useState, useEffect, useCallback } from 'react';
import { TextField, TextArea, Button } from '../../../ui';
import { 
  getTermsAndConditionsValidationRules, 
  getTermsAndConditionsLinkTitleValidationRules, 
  getTermsAndConditionsLinkValidationRules,
  validateTermsAndConditions
} from '../../../../constants/formValidations';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface QuoteTermsAndConditionsProps {
  termsAndConditions: string;
  setTermsAndConditions: (value: string) => void;
  termsAndConditionsLinkTitle: string;
  setTermsAndConditionsLinkTitle: (value: string) => void;
  termsAndConditionsLink: string;
  setTermsAndConditionsLink: (value: string) => void;
  register?: UseFormRegister<any>;
  errors?: Record<string, FieldError>;
}

export const QuoteTermsAndConditions: React.FC<QuoteTermsAndConditionsProps> = ({
  termsAndConditions,
  setTermsAndConditions,
  termsAndConditionsLinkTitle,
  setTermsAndConditionsLinkTitle,
  termsAndConditionsLink,
  setTermsAndConditionsLink,
  register,
  errors
}) => {
  // États locaux pour les erreurs de validation
  const [localErrors, setLocalErrors] = useState({
    termsAndConditions: '',
    termsAndConditionsLinkTitle: '',
    termsAndConditionsLink: ''
  });

  // Fonction pour valider les champs
  const validateFields = useCallback(() => {
    const validationResult = validateTermsAndConditions(
      termsAndConditions,
      termsAndConditionsLinkTitle,
      termsAndConditionsLink
    );

    setLocalErrors({
      termsAndConditions: validationResult.termsAndConditionsError || '',
      termsAndConditionsLinkTitle: validationResult.termsAndConditionsLinkTitleError || '',
      termsAndConditionsLink: validationResult.termsAndConditionsLinkError || ''
    });

    return validationResult.isValid;
  }, [termsAndConditions, termsAndConditionsLinkTitle, termsAndConditionsLink]);

  // Valider les champs lorsqu'ils changent
  useEffect(() => {
    validateFields();
  }, [termsAndConditions, termsAndConditionsLinkTitle, termsAndConditionsLink, validateFields]);

  // Suggestions pour les conditions de vente avec un mot clé pour l'affichage
  const termsAndConditionsSuggestions = [
    { keyword: "Paiement", text: "Les devis sont valables 30 jours à compter de leur date d'émission." },
    { keyword: "Acompte", text: "Un acompte de 30% est demandé à la signature du devis." },
    { keyword: "Annulation", text: "Toute annulation après signature du devis entraînera la facturation des travaux déjà réalisés." },
    { keyword: "Litige", text: "En cas de litige, le tribunal de commerce de [Ville] sera seul compétent." },
    { keyword: "Propriété", text: "Les éléments produits restent la propriété de l'entreprise jusqu'au paiement intégral du prix." }
  ];

  // Fonction pour insérer une suggestion dans le textarea
  const insertSuggestion = (text: string) => {
    // Ajouter la suggestion à la fin du texte actuel avec un saut de ligne
    const newValue = termsAndConditions ? termsAndConditions + '\n' + text : text;
    setTermsAndConditions(newValue);
  };

  // Gestionnaires d'événements avec validation
  const handleTermsAndConditionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTermsAndConditions(e.target.value);
  };

  const handleTermsAndConditionsLinkTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAndConditionsLinkTitle(e.target.value);
  };

  const handleTermsAndConditionsLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAndConditionsLink(e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* Conditions générales */}
      <TextArea
        id="termsAndConditions"
        name="termsAndConditions"
        label="Conditions générales"
        value={termsAndConditions}
        onChange={handleTermsAndConditionsChange}
        register={register ? () => register('termsAndConditions', getTermsAndConditionsValidationRules()) : undefined}
        error={errors?.termsAndConditions || localErrors.termsAndConditions}
        placeholder="Conditions générales du devis"
        rows={4}
        helpText={`${termsAndConditions?.length || 0}/2000 caractères - Les sauts de ligne seront préservés dans l'aperçu`}
      />
      
      {/* Suggestions pour les conditions générales */}
      <div className="mt-2 mb-4">
        <div className="flex flex-wrap gap-2">
          {termsAndConditionsSuggestions.map((suggestion, index) => (
            <Button
              key={index}
              type="button"
              size="sm"
              variant="outline"
              onClick={() => insertSuggestion(suggestion.text)}
              className="text-xs"
              title={suggestion.text}
            >
              {suggestion.keyword}
            </Button>
          ))}
        </div>
      </div>

      {/* Lien vers les conditions générales */}
      <div className="flex gap-4">
        <div className="w-1/2">
          <TextField
            id="termsAndConditionsLinkTitle"
            name="termsAndConditionsLinkTitle"
            label="Titre du lien"
            value={termsAndConditionsLinkTitle}
            onChange={handleTermsAndConditionsLinkTitleChange}
            register={register ? () => register('termsAndConditionsLinkTitle', getTermsAndConditionsLinkTitleValidationRules()) : undefined}
            error={errors?.termsAndConditionsLinkTitle || localErrors.termsAndConditionsLinkTitle}
            placeholder="Voir nos CGV"
            helpText={`${termsAndConditionsLinkTitle?.length || 0}/100 caractères`}
          />
        </div>
        <div className="w-1/2">
          <TextField
            id="termsAndConditionsLink"
            name="termsAndConditionsLink"
            label="URL du lien"
            value={termsAndConditionsLink}
            onChange={handleTermsAndConditionsLinkChange}
            register={register ? () => register('termsAndConditionsLink', getTermsAndConditionsLinkValidationRules()) : undefined}
            error={errors?.termsAndConditionsLink || localErrors.termsAndConditionsLink}
            placeholder="https://example.com/cgv"
          />
        </div>
      </div>
    </div>
  );
};