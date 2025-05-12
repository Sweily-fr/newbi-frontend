import React, { useState, useEffect } from 'react';
import { FieldGroup, TextArea } from '../../../../../components/';
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
    <div className="space-y-4">
      <FieldGroup>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="footerNotes" className="block text-sm font-medium text-gray-700">
            Notes de bas de page
          </label>
          {hasDefaults && onApplyDefaults && (
            <button
              type="button"
              onClick={onApplyDefaults}
              className="text-sm text-[#5b50ff] hover:underline"
            >
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
          placeholder="Notes à afficher en bas du devis"
          rows={3}
          error={error ? { message: error } : undefined}
          helpText="Maximum 2000 caractères"
        />
      </FieldGroup>
    </div>
  );
};