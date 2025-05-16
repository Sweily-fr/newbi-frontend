import React, { useState, useEffect } from 'react';
import { TextArea } from '../../../../../components/';
import { Add } from 'iconsax-react';
import { FOOTER_NOTES_PATTERN, FOOTER_NOTES_ERROR_MESSAGE } from '../../../../../constants/formValidations';
import { useQuery } from '@apollo/client';
import { GET_QUOTES } from '../../../graphql/quotes';

interface QuoteFooterNotesProps {
  footerNotes: string;
  setFooterNotes: (value: string) => void;
  onApplyDefaults?: () => void;
  hasDefaults?: boolean;
}

export const QuoteFooterNotes: React.FC<QuoteFooterNotesProps> = ({
  footerNotes,
  setFooterNotes,
  onApplyDefaults,
  hasDefaults = false
}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [defaultFooterNotesSet, setDefaultFooterNotesSet] = useState(false);
  
  // Récupérer le dernier devis créé
  const { data: quotesData } = useQuery(GET_QUOTES, {
    variables: {
      limit: 1,
      page: 1
    },
    fetchPolicy: 'network-only'
  });
  
  // Fonction de validation des notes de pied
  const validateFooterNotes = (value: string) => {
    if (value && !FOOTER_NOTES_PATTERN.test(value)) {
      setError(FOOTER_NOTES_ERROR_MESSAGE);
      return false;
    } else if (value && value.length > 2000) {
      setError(FOOTER_NOTES_ERROR_MESSAGE);
      return false;
    } else {
      setError(undefined);
      return true;
    }
  };
  
  // Valider les notes à chaque changement
  useEffect(() => {
    validateFooterNotes(footerNotes);
  }, [footerNotes]);
  
  // Utiliser les notes de pied de page du dernier devis si disponible
  useEffect(() => {
    // Ne définir la valeur par défaut que si le champ est vide et que nous n'avons pas déjà défini la valeur par défaut
    if (quotesData?.quotes?.quotes?.length > 0 && !footerNotes && !defaultFooterNotesSet) {
      const lastQuote = quotesData.quotes.quotes[0];
      if (lastQuote.footerNotes) {
        setFooterNotes(lastQuote.footerNotes);
        setDefaultFooterNotesSet(true);
      }
    }
  }, [quotesData, footerNotes, setFooterNotes, defaultFooterNotesSet]);

  return (
    <div className="mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <span className="mr-2 text-[#5b50ff] text-lg font-semibold">03</span>
          Notes de pied de page
        </h3>
        <hr className="border-t border-gray-200 mb-4" />
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <label htmlFor="footerNotes" className="block text-sm font-medium text-gray-700">
          Texte des notes
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
          id="footerNotes"
          name="footerNotes"
          value={footerNotes}
          onChange={(e) => {
            setFooterNotes(e.target.value);
            validateFooterNotes(e.target.value);
          }}
          placeholder="Ajoutez des notes qui apparaîtront en bas du devis..."
          rows={3}
          error={error ? { message: error } : undefined}
          helpText={`${footerNotes?.length || 0}/2000 caractères - Les sauts de ligne seront préservés dans l'aperçu`}
        />
    </div>
  );
};