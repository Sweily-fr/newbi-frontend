import React, { useState, useEffect } from 'react';
import { TextArea, Button } from '../../../../../components/';
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
  const [activeFooterNoteButtons, setActiveFooterNoteButtons] = useState<string[]>([]);
  
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
      <div>
        <TextArea
          id="footer-notes"
          name="footer-notes"
          value={footerNotes}
          onChange={(e) => {
            const newText = e.target.value;
            setFooterNotes(newText);
            validateFooterNotes(newText);
            
            // Si le champ est vide, désactiver tous les boutons
            if (!newText || newText.trim() === '') {
              setActiveFooterNoteButtons([]);
              return;
            }
            
            // Vérifier quels boutons doivent rester actifs en fonction du texte
            const mentionsText = "Mentions légales : [Votre entreprise], [Adresse], [SIRET]. TVA non applicable, art. 293 B du CGI.";
            const cgvText = "Conditions générales de vente disponibles sur demande ou sur notre site internet. Le client déclare en avoir pris connaissance et les accepter sans réserve.";
            const penalitesText = "En cas de retard de paiement, une pénalité de 3 fois le taux d'intérêt légal sera appliquée, ainsi qu'une indemnité forfaitaire de 40€ pour frais de recouvrement.";
            
            const newActiveButtons = [];
            
            // Vérifier si le texte contient chacune des suggestions
            if (newText.includes(mentionsText)) {
              newActiveButtons.push('mentions');
            }
            
            if (newText.includes(cgvText)) {
              newActiveButtons.push('cgv');
            }
            
            if (newText.includes(penalitesText)) {
              newActiveButtons.push('penalites');
            }
            
            // Si aucune suggestion n'est trouvée mais il y a du texte, activer le mode personnalisation
            if (newActiveButtons.length === 0 && newText.trim() !== '') {
              newActiveButtons.push('custom');
            }
            
            setActiveFooterNoteButtons(newActiveButtons);
          }}
          rows={3}
          placeholder="Ajoutez des notes qui apparaîtront en bas de la facture..."
          error={error ? { message: error } : undefined}
          helpText={`${footerNotes?.length || 0}/2000 caractères - Les sauts de ligne seront préservés dans l'aperçu`}
        />
        
        <div className="flex flex-wrap gap-2 mt-3">
          {/* Bouton pour les mentions légales */}
          <Button 
            size="sm"
            variant={activeFooterNoteButtons.includes('mentions') ? 'primary' : 'outline'}
            className={`min-w-[110px] ${activeFooterNoteButtons.includes('mentions') ? 'bg-[#5b50ff] hover:bg-[#5b50ff] focus:ring-[#5b50ff]' : ''}`}
            onClick={() => {
              const mentionsText = "Mentions légales : [Votre entreprise], [Adresse], [SIRET]. TVA non applicable, art. 293 B du CGI.";
              
              // Si le bouton est déjà actif, le désactiver et supprimer le texte
              if (activeFooterNoteButtons.includes('mentions')) {
                // Supprimer ce bouton de la liste des boutons actifs
                const newButtons = activeFooterNoteButtons.filter(id => id !== 'mentions');
                setActiveFooterNoteButtons(newButtons);
                
                // Supprimer le texte correspondant
                let newText = footerNotes;
                if (newText.includes(mentionsText)) {
                  if (newText.includes("\n\n" + mentionsText)) {
                    newText = newText.replace("\n\n" + mentionsText, "");
                  } else if (newText.includes(mentionsText + "\n\n")) {
                    newText = newText.replace(mentionsText + "\n\n", "");
                  } else {
                    newText = newText.replace(mentionsText, "");
                  }
                  
                  // Nettoyer les sauts de ligne en trop
                  newText = newText.replace(/^\n+|\n+$/g, "");
                  newText = newText.replace(/\n{3,}/g, "\n\n");
                  
                  setFooterNotes(newText);
                  validateFooterNotes(newText);
                }
              } else {
                // Si le bouton "custom" est actif, le désactiver
                if (activeFooterNoteButtons.includes('custom')) {
                  setActiveFooterNoteButtons(['mentions']);
                  setFooterNotes(mentionsText);
                  validateFooterNotes(mentionsText);
                  return;
                }
                
                // Activer ce bouton
                setActiveFooterNoteButtons([...activeFooterNoteButtons, 'mentions']);
                
                // Ajouter le texte
                if (footerNotes && footerNotes.trim() !== "") {
                  setFooterNotes(footerNotes + "\n\n" + mentionsText);
                  validateFooterNotes(footerNotes + "\n\n" + mentionsText);
                } else {
                  setFooterNotes(mentionsText);
                  validateFooterNotes(mentionsText);
                }
              }
            }}
          >
            Mentions légales
          </Button>
          
          {/* Bouton pour les CGV */}
          <Button 
            size="sm"
            variant={activeFooterNoteButtons.includes('cgv') ? 'primary' : 'outline'}
            className={`min-w-[110px] ${activeFooterNoteButtons.includes('cgv') ? 'bg-[#5b50ff] hover:bg-[#5b50ff] focus:ring-[#5b50ff]' : ''}`}
            onClick={() => {
              const cgvText = "Conditions générales de vente disponibles sur demande ou sur notre site internet. Le client déclare en avoir pris connaissance et les accepter sans réserve.";
              
              // Si le bouton est déjà actif, le désactiver et supprimer le texte
              if (activeFooterNoteButtons.includes('cgv')) {
                // Supprimer ce bouton de la liste des boutons actifs
                const newButtons = activeFooterNoteButtons.filter(id => id !== 'cgv');
                setActiveFooterNoteButtons(newButtons);
                
                // Supprimer le texte correspondant
                let newText = footerNotes;
                if (newText.includes(cgvText)) {
                  if (newText.includes("\n\n" + cgvText)) {
                    newText = newText.replace("\n\n" + cgvText, "");
                  } else if (newText.includes(cgvText + "\n\n")) {
                    newText = newText.replace(cgvText + "\n\n", "");
                  } else {
                    newText = newText.replace(cgvText, "");
                  }
                  
                  // Nettoyer les sauts de ligne en trop
                  newText = newText.replace(/^\n+|\n+$/g, "");
                  newText = newText.replace(/\n{3,}/g, "\n\n");
                  
                  setFooterNotes(newText);
                  validateFooterNotes(newText);
                }
              } else {
                // Si le bouton "custom" est actif, le désactiver
                if (activeFooterNoteButtons.includes('custom')) {
                  setActiveFooterNoteButtons(['cgv']);
                  setFooterNotes(cgvText);
                  validateFooterNotes(cgvText);
                  return;
                }
                
                // Activer ce bouton
                setActiveFooterNoteButtons([...activeFooterNoteButtons, 'cgv']);
                
                // Ajouter le texte
                if (footerNotes && footerNotes.trim() !== "") {
                  setFooterNotes(footerNotes + "\n\n" + cgvText);
                  validateFooterNotes(footerNotes + "\n\n" + cgvText);
                } else {
                  setFooterNotes(cgvText);
                  validateFooterNotes(cgvText);
                }
              }
            }}
          >
            CGV
          </Button>
          
          {/* Bouton pour les pénalités de retard */}
          <Button 
            size="sm"
            variant={activeFooterNoteButtons.includes('penalites') ? 'primary' : 'outline'}
            className={`min-w-[110px] ${activeFooterNoteButtons.includes('penalites') ? 'bg-[#5b50ff] hover:bg-[#5b50ff] focus:ring-[#5b50ff]' : ''}`}
            onClick={() => {
              const penalitesText = "En cas de retard de paiement, une pénalité de 3 fois le taux d'intérêt légal sera appliquée, ainsi qu'une indemnité forfaitaire de 40€ pour frais de recouvrement.";
              
              // Si le bouton est déjà actif, le désactiver et supprimer le texte
              if (activeFooterNoteButtons.includes('penalites')) {
                // Supprimer ce bouton de la liste des boutons actifs
                const newButtons = activeFooterNoteButtons.filter(id => id !== 'penalites');
                setActiveFooterNoteButtons(newButtons);
                
                // Supprimer le texte correspondant
                let newText = footerNotes;
                if (newText.includes(penalitesText)) {
                  if (newText.includes("\n\n" + penalitesText)) {
                    newText = newText.replace("\n\n" + penalitesText, "");
                  } else if (newText.includes(penalitesText + "\n\n")) {
                    newText = newText.replace(penalitesText + "\n\n", "");
                  } else {
                    newText = newText.replace(penalitesText, "");
                  }
                  
                  // Nettoyer les sauts de ligne en trop
                  newText = newText.replace(/^\n+|\n+$/g, "");
                  newText = newText.replace(/\n{3,}/g, "\n\n");
                  
                  setFooterNotes(newText);
                  validateFooterNotes(newText);
                }
              } else {
                // Si le bouton "custom" est actif, le désactiver
                if (activeFooterNoteButtons.includes('custom')) {
                  setActiveFooterNoteButtons(['penalites']);
                  setFooterNotes(penalitesText);
                  validateFooterNotes(penalitesText);
                  return;
                }
                
                // Activer ce bouton
                setActiveFooterNoteButtons([...activeFooterNoteButtons, 'penalites']);
                
                // Ajouter le texte
                if (footerNotes && footerNotes.trim() !== "") {
                  setFooterNotes(footerNotes + "\n\n" + penalitesText);
                  validateFooterNotes(footerNotes + "\n\n" + penalitesText);
                } else {
                  setFooterNotes(penalitesText);
                  validateFooterNotes(penalitesText);
                }
              }
            }}
          >
            Pénalités de retard
          </Button>
          
          {/* Bouton pour personnaliser */}
          <Button 
            size="sm"
            variant={activeFooterNoteButtons.includes('custom') ? 'primary' : 'outline'}
            className={`min-w-[110px] ${activeFooterNoteButtons.includes('custom') ? 'bg-[#5b50ff] hover:bg-[#5b50ff] focus:ring-[#5b50ff]' : ''}`}
            onClick={() => {
              setFooterNotes('');
              validateFooterNotes('');
              setActiveFooterNoteButtons(['custom']);
              // Focus sur le champ de texte
              document.getElementById('footer-notes')?.focus();
            }}
          >
            Personnaliser
          </Button>
        </div>
      </div>
    </div>
  );
};
