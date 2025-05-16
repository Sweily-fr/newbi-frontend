import React, { useState, useEffect } from 'react';
import { TextArea } from '../../../../../components/';
import { FOOTER_NOTES_PATTERN, FOOTER_NOTES_ERROR_MESSAGE } from '../../../../../constants/formValidations';
import { useQuery } from '@apollo/client';
import { GET_INVOICES } from '../../../graphql/invoices';
import { NoteText, Add } from 'iconsax-react';

interface InvoiceFooterNotesProps {
  footerNotes: string;
  setFooterNotes: (value: string) => void;
  onApplyDefaults?: () => void;
  hasDefaults?: boolean;
}

export const InvoiceFooterNotes: React.FC<InvoiceFooterNotesProps> = ({
  footerNotes,
  setFooterNotes,
  onApplyDefaults,
  hasDefaults = false
}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [defaultFooterNotesSet, setDefaultFooterNotesSet] = useState(false);
  
  // Récupérer la dernière facture créée
  const { data: invoicesData } = useQuery(GET_INVOICES, {
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
  
  // Utiliser les notes de pied de page de la dernière facture si disponible
  useEffect(() => {
    // Ne définir la valeur par défaut que si le champ est vide et que nous n'avons pas déjà défini la valeur par défaut
    if (invoicesData?.invoices?.invoices?.length > 0 && !footerNotes && !defaultFooterNotesSet) {
      const lastInvoice = invoicesData.invoices.invoices[0];
      if (lastInvoice.footerNotes) {
        setFooterNotes(lastInvoice.footerNotes);
        setDefaultFooterNotesSet(true);
      }
    }
  }, [invoicesData, footerNotes, setFooterNotes, defaultFooterNotesSet]);
  return (
    <div className="mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <span className="mr-2 text-[#5b50ff]">
            <NoteText size="20" color="#5b50ff" variant="Linear" />
          </span>
          Notes de pied de page
        </h3>
        <hr className="border-t border-gray-200 mb-4" />
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <label htmlFor="footer-notes" className="block text-sm font-medium text-gray-700">
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
        id="footer-notes"
        name="footer-notes"
        value={footerNotes}
        onChange={(e) => {
          setFooterNotes(e.target.value);
          validateFooterNotes(e.target.value);
        }}
        rows={3}
        placeholder="Ajoutez des notes qui apparaîtront en bas de la facture..."
        error={error ? { message: error } : undefined}
        helpText={`${footerNotes?.length || 0}/2000 caractères - Les sauts de ligne seront préservés dans l'aperçu`}
      />
    </div>
  );
};
