import React, { useState, useEffect } from 'react';
import { TextArea, TextField } from '../../../../components/ui';
import { 
  getTermsAndConditionsValidationRules, 
  getTermsAndConditionsLinkTitleValidationRules, 
  getTermsAndConditionsLinkValidationRules,
  validateTermsAndConditions
} from '../../../../constants/formValidations';

interface InvoiceTermsAndConditionsProps {
  termsAndConditions: string;
  setTermsAndConditions: (value: string) => void;
  termsAndConditionsLinkTitle: string;
  setTermsAndConditionsLinkTitle: (value: string) => void;
  termsAndConditionsLink: string;
  setTermsAndConditionsLink: (value: string) => void;
  register?: any;
  errors?: any;
}

export const InvoiceTermsAndConditions: React.FC<InvoiceTermsAndConditionsProps> = ({
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
    { keyword: "Pénalités", text: "Tout retard de paiement entraînera des pénalités de retard calculées sur la base de trois fois le taux d'intérêt légal en vigueur." },
    { keyword: "Indemnité", text: "Conformément aux articles 441-6 c. com. et D. 441-5 c. com., tout retard de paiement entraîne de plein droit, outre les pénalités de retard, une obligation pour le débiteur de payer une indemnité forfaitaire de 40€ pour frais de recouvrement." },
    { keyword: "Escompte", text: "Aucun escompte n'est accordé pour paiement anticipé." },
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
    <>
      {/* Conditions de vente */}
      <div className="mb-4">
        <TextArea
          id="terms-and-conditions"
          name="termsAndConditions"
          label="Conditions de vente"
          value={termsAndConditions}
          onChange={handleTermsAndConditionsChange}
          register={register ? () => register('termsAndConditions', getTermsAndConditionsValidationRules()) : undefined}
          error={errors?.termsAndConditions || localErrors.termsAndConditions}
          rows={5}
          placeholder="Ajoutez des conditions de vente qui apparaîtront en bas de la facture..."
          helpText={`${termsAndConditions?.length || 0}/2000 caractères - Les sauts de ligne seront préservés dans l'aperçu`}
        />
        
        {/* Suggestions pour les conditions de vente */}
        <div className="mt-2 mb-6">
          <div className="flex flex-wrap gap-2">
            {termsAndConditionsSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => insertSuggestion(suggestion.text)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded transition-colors"
                title={suggestion.text}
              >
                {suggestion.keyword}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lien vers les conditions de vente */}
      <div className="mb-4">
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
    </>
  );
};
