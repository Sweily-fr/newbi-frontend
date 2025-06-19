import React, { useState, useEffect } from 'react';
import { TextArea, Button } from '../../../../../components/';
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
  const [activeFooterNoteButtons, setActiveFooterNoteButtons] = useState<string[]>([]);
  
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
      <div>
        <TextArea
          id="footerNotes"
          name="footerNotes"
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
            const acceptationText = "Pour acceptation, merci de retourner ce devis daté et signé avec la mention 'Bon pour accord'.";
            
            const newActiveButtons = [];
            
            // Vérifier si le texte contient chacune des suggestions
            if (newText.includes(mentionsText)) {
              newActiveButtons.push('mentions');
            }
            
            if (newText.includes(cgvText)) {
              newActiveButtons.push('cgv');
            }
            
            if (newText.includes(acceptationText)) {
              newActiveButtons.push('acceptation');
            }
            
            // Si aucune suggestion n'est trouvée mais il y a du texte, activer le mode personnalisation
            if (newActiveButtons.length === 0 && newText.trim() !== '') {
              newActiveButtons.push('custom');
            }
            
            setActiveFooterNoteButtons(newActiveButtons);
          }}
          placeholder="Ajoutez des notes qui apparaîtront en bas du devis..."
          rows={3}
          error={error ? { message: error } : undefined}
          helpText={`${footerNotes?.length || 0}/2000 caractères - Les sauts de ligne seront préservés dans l'aperçu`}
        />
        
        <div className="flex flex-wrap gap-2 mt-3">
          {/* Bouton pour les mentions légales */}
          <Button 
            size="sm"
            variant={activeFooterNoteButtons.includes('mentions') ? 'primary' : 'outline'}
            className={`min-w-[110px] ${activeFooterNoteButtons.includes('mentions') ? 'bg-[#5b50ff] hover:bg-[#4a41e0] focus:ring-[#5b50ff]' : ''}`}
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
            className={`min-w-[110px] ${activeFooterNoteButtons.includes('cgv') ? 'bg-[#5b50ff] hover:bg-[#4a41e0] focus:ring-[#5b50ff]' : ''}`}
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
          
          {/* Bouton pour l'acceptation */}
          <Button 
            size="sm"
            variant={activeFooterNoteButtons.includes('acceptation') ? 'primary' : 'outline'}
            className={`min-w-[110px] ${activeFooterNoteButtons.includes('acceptation') ? 'bg-[#5b50ff] hover:bg-[#4a41e0] focus:ring-[#5b50ff]' : ''}`}
            onClick={() => {
              const acceptationText = "Pour acceptation, merci de retourner ce devis daté et signé avec la mention 'Bon pour accord'.";
              
              // Si le bouton est déjà actif, le désactiver et supprimer le texte
              if (activeFooterNoteButtons.includes('acceptation')) {
                // Supprimer ce bouton de la liste des boutons actifs
                const newButtons = activeFooterNoteButtons.filter(id => id !== 'acceptation');
                setActiveFooterNoteButtons(newButtons);
                
                // Supprimer le texte correspondant
                let newText = footerNotes;
                if (newText.includes(acceptationText)) {
                  if (newText.includes("\n\n" + acceptationText)) {
                    newText = newText.replace("\n\n" + acceptationText, "");
                  } else if (newText.includes(acceptationText + "\n\n")) {
                    newText = newText.replace(acceptationText + "\n\n", "");
                  } else {
                    newText = newText.replace(acceptationText, "");
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
                  setActiveFooterNoteButtons(['acceptation']);
                  setFooterNotes(acceptationText);
                  validateFooterNotes(acceptationText);
                  return;
                }
                
                // Activer ce bouton
                setActiveFooterNoteButtons([...activeFooterNoteButtons, 'acceptation']);
                
                // Ajouter le texte
                if (footerNotes && footerNotes.trim() !== "") {
                  setFooterNotes(footerNotes + "\n\n" + acceptationText);
                  validateFooterNotes(footerNotes + "\n\n" + acceptationText);
                } else {
                  setFooterNotes(acceptationText);
                  validateFooterNotes(acceptationText);
                }
              }
            }}
          >
            Acceptation
          </Button>
          
          {/* Bouton pour personnaliser */}
          <Button 
            size="sm"
            variant={activeFooterNoteButtons.includes('custom') ? 'primary' : 'outline'}
            className={`min-w-[110px] ${activeFooterNoteButtons.includes('custom') ? 'bg-[#5b50ff] hover:bg-[#4a41e0] focus:ring-[#5b50ff]' : ''}`}
            onClick={() => {
              setFooterNotes('');
              validateFooterNotes('');
              setActiveFooterNoteButtons(['custom']);
              // Focus sur le champ de texte
              document.getElementById('footerNotes')?.focus();
            }}
          >
            Personnaliser
          </Button>
        </div>
      </div>
    </div>
  );
};