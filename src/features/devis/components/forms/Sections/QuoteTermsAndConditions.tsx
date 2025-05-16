import React, { useState, useEffect, useCallback } from 'react';
import { TextField, TextArea } from '../../../../../components/';
import { Add } from 'iconsax-react';
import { 
  getTermsAndConditionsValidationRules, 
  getTermsAndConditionsLinkTitleValidationRules, 
  getTermsAndConditionsLinkValidationRules,
  validateTermsAndConditions
} from '../../../../../constants/formValidations';
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
  onApplyDefaults?: () => void;
  hasDefaults?: boolean;
}

export const QuoteTermsAndConditions: React.FC<QuoteTermsAndConditionsProps> = ({
  termsAndConditions,
  setTermsAndConditions,
  termsAndConditionsLinkTitle,
  setTermsAndConditionsLinkTitle,
  termsAndConditionsLink,
  setTermsAndConditionsLink,
  register,
  errors,
  onApplyDefaults,
  hasDefaults = false
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
    { keyword: "Propriété", text: "Les éléments produits restent la propriété de l'entreprise jusqu'au paiement intégral du prix." },
    { keyword: "Escompte", text: "Pas d'escompte accordé pour paiement anticipé." },
    { keyword: "Pénalités", text: "En cas de non-paiement à la date d'échéance, des pénalités seront appliquées. Tout montant non réglé à l'échéance sera majoré d'un intérêt annuel de 11,13 %." },
    { keyword: "Retard", text: "Tout retard de paiement entraînera une indemnité forfaitaire pour frais de recouvrement de 40€." }
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
    <div className="space-y-6">
      {/* Conditions générales */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <span className="mr-2 text-[#5b50ff]">01</span>
          Conditions générales
        </h3>
        <hr className="border-t border-gray-200 mb-4" />
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="termsAndConditions" className="block text-sm font-medium text-gray-700">
            Texte des conditions
          </label>
          {hasDefaults && onApplyDefaults && (
            <button
              type="button"
              onClick={onApplyDefaults}
              className="text-sm text-[#5b50ff] hover:text-[#4a41e0] flex items-center gap-1"
            >
              <Add size="16" color="#5b50ff" variant="Linear" />
              Appliquer les paramètres par défaut
            </button>
          )}
        </div>
        <TextArea
          id="termsAndConditions"
          name="termsAndConditions"
          value={termsAndConditions}
          onChange={handleTermsAndConditionsChange}
          register={register ? () => register('termsAndConditions', getTermsAndConditionsValidationRules()) : undefined}
          error={errors?.termsAndConditions || localErrors.termsAndConditions}
          placeholder="Ajoutez des conditions générales qui apparaîtront en bas du devis..."
          rows={5}
          helpText={`${termsAndConditions?.length || 0}/2000 caractères - Les sauts de ligne seront préservés dans l'aperçu`}
        />
      
        {/* Suggestions pour les conditions générales */}
        <div className="mt-3 mb-4">
          <p className="text-xs text-gray-500 mb-2">Suggestions rapides :</p>
          <div className="flex flex-wrap gap-2">
            {termsAndConditionsSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => insertSuggestion(suggestion.text)}
                className="text-xs bg-[#f0eeff] hover:bg-[#e6e1ff] text-[#5b50ff] py-1 px-3 rounded-full transition-colors border border-[#5b50ff]/20"
                title={suggestion.text}
              >
                {suggestion.keyword}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lien vers les conditions générales */}
      <div className="mt-6">
        <div className="flex items-center mb-3">
          <span className="mr-2 text-[#5b50ff] text-lg font-semibold">02</span>
          <h3 className="text-lg font-semibold">Lien vers les conditions</h3>
        </div>
        <hr className="border-t border-gray-200 mb-4" />
        <TextField
          id="termsAndConditionsLinkTitle"
          name="termsAndConditionsLinkTitle"
          label="Lien vers les conditions générales"
          value={termsAndConditionsLinkTitle}
          onChange={handleTermsAndConditionsLinkTitleChange}
          register={register ? () => register('termsAndConditionsLinkTitle', getTermsAndConditionsLinkTitleValidationRules()) : undefined}
          error={errors?.termsAndConditionsLinkTitle || localErrors.termsAndConditionsLinkTitle}
          placeholder="Titre du lien"
          className="mb-2"
          helpText={`${termsAndConditionsLinkTitle?.length || 0}/100 caractères`}
        />
        <TextField
          id="termsAndConditionsLink"
          name="termsAndConditionsLink"
          label=""
          value={termsAndConditionsLink}
          onChange={handleTermsAndConditionsLinkChange}
          register={register ? () => register('termsAndConditionsLink', getTermsAndConditionsLinkValidationRules()) : undefined}
          error={errors?.termsAndConditionsLink || localErrors.termsAndConditionsLink}
          placeholder="URL du lien (ex: https://example.com)"
        />
      </div>
    </div>
  );
};