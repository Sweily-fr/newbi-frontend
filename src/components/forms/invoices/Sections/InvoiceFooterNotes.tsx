import React, { useState, useEffect } from 'react';
import { TextArea } from '../../../../components/ui';
import { FOOTER_NOTES_PATTERN, FOOTER_NOTES_ERROR_MESSAGE } from '../../../../constants/formValidations';
import { useQuery } from '@apollo/client';
import { GET_INVOICES } from '../../../../graphql/queries';

interface InvoiceFooterNotesProps {
  footerNotes: string;
  setFooterNotes: (value: string) => void;
}

export const InvoiceFooterNotes: React.FC<InvoiceFooterNotesProps> = ({
  footerNotes,
  setFooterNotes
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
    <div className="mb-4">
      <TextArea
        id="footer-notes"
        name="footer-notes"
        label="Notes de pied de page"
        value={footerNotes}
        onChange={(e) => {
          setFooterNotes(e.target.value);
          validateFooterNotes(e.target.value);
        }}
        rows={3}
        placeholder="Ajoutez des notes qui apparaîtront en bas de la facture..."
        error={error ? { message: error } : undefined}
        helpText="Maximum 2000 caractères"
      />
    </div>
  );
};
