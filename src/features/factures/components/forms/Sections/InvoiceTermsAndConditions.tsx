import React, { useState, useEffect } from 'react';
import { TextArea, TextField } from '../../../../../components/';
import { DocumentText, Link1, Add } from 'iconsax-react';
import { 
  getTermsAndConditionsValidationRules, 
  getTermsAndConditionsLinkTitleValidationRules, 
  getTermsAndConditionsLinkValidationRules,
  validateTermsAndConditions
} from '../../../../../constants/formValidations';

interface InvoiceTermsAndConditionsProps {
  termsAndConditions: string;
  setTermsAndConditions: (value: string) => void;
  termsAndConditionsLinkTitle: string;
  setTermsAndConditionsLinkTitle: (value: string) => void;
  termsAndConditionsLink: string;
  setTermsAndConditionsLink: (value: string) => void;
  register?: any;
  errors?: any;
  onApplyDefaults?: () => void;
  hasDefaults?: boolean;
}

export const InvoiceTermsAndConditions: React.FC<InvoiceTermsAndConditionsProps> = ({
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
  const validateFields = () => {
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
  };

  // Valider les champs lorsqu'ils changent
  useEffect(() => {
    validateFields();
  }, [termsAndConditions, termsAndConditionsLinkTitle, termsAndConditionsLink]);

  // Suggestions pour les conditions de vente avec un mot clé pour l'affichage
  const termsAndConditionsSuggestions = [
    { keyword: "Paiement", text: "Les factures sont payables à réception, sauf accord préalable." },
    { keyword: "Escompte", text: "Pas d'escompte accordé pour paiement anticipé." },
    { keyword: "Pénalités", text: "En cas de non-paiement à la date d'échéance, des pénalités seront appliquées. Tout montant non réglé à l'échéance sera majoré d'un intérêt annuel de 11,13 %." },
    { keyword: "Retard", text: "Tout retard de paiement entraînera une indemnité forfaitaire pour frais de recouvrement de 40€." },
    { keyword: "Litige", text: "En cas de litige, le tribunal de commerce de [Ville] sera seul compétent." }
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
      {/* Conditions de vente */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <span className="mr-2 text-[#5b50ff]">
            <DocumentText size="20" color="#5b50ff" variant="Linear" />
          </span>
          Conditions de vente
        </h3>
        <hr className="border-t border-gray-200 mb-4" />
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="terms-and-conditions" className="block text-sm font-medium text-gray-700">
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
          id="terms-and-conditions"
          name="termsAndConditions"
          value={termsAndConditions}
          onChange={handleTermsAndConditionsChange}
          register={register ? () => register('termsAndConditions', getTermsAndConditionsValidationRules()) : undefined}
          error={errors?.termsAndConditions || localErrors.termsAndConditions}
          rows={5}
          placeholder="Ajoutez des conditions de vente qui apparaîtront en bas de la facture..."
          helpText={`${termsAndConditions?.length || 0}/2000 caractères - Les sauts de ligne seront préservés dans l'aperçu`}
        />
        
        {/* Suggestions pour les conditions de vente */}
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

      {/* Lien vers les conditions de vente */}
      <div className="mt-6">
        <div className="flex items-center mb-3">
          <span className="mr-2 text-[#5b50ff]">
            <Link1 size="20" color="#5b50ff" variant="Linear" />
          </span>
          <h3 className="text-lg font-semibold">Lien vers les conditions</h3>
        </div>
        <hr className="border-t border-gray-200 mb-4" />
        <TextField
          id="terms-and-conditions-link-title"
          name="termsAndConditionsLinkTitle"
          label="Lien vers les conditions de vente"
          value={termsAndConditionsLinkTitle}
          onChange={handleTermsAndConditionsLinkTitleChange}
          register={register ? () => register('termsAndConditionsLinkTitle', getTermsAndConditionsLinkTitleValidationRules()) : undefined}
          error={errors?.termsAndConditionsLinkTitle || localErrors.termsAndConditionsLinkTitle}
          placeholder="Titre du lien"
          className="mb-2"
          helpText={`${termsAndConditionsLinkTitle?.length || 0}/100 caractères`}
        />
        <TextField
          id="terms-and-conditions-link"
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
