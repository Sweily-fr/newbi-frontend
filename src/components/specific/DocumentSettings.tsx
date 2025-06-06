import React, { useEffect, useState } from 'react';
import { TextField, Button } from '../';
import { useQuery } from '@apollo/client';
import { GET_USER_INFO } from '../../graphql/queries';
import { DocumentText, Setting2, InfoCircle, ArrowRight2 } from 'iconsax-react';

export interface DocumentSettingsProps {
  documentType: 'INVOICE' | 'QUOTE';
  defaultHeaderNotes: string;
  setDefaultHeaderNotes: (value: string) => void;
  defaultFooterNotes: string;
  setDefaultFooterNotes: (value: string) => void;
  defaultTermsAndConditions: string;
  setDefaultTermsAndConditions: (value: string) => void;
  defaultTermsAndConditionsLinkTitle: string;
  setDefaultTermsAndConditionsLinkTitle: (value: string) => void;
  defaultTermsAndConditionsLink: string;
  setDefaultTermsAndConditionsLink: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

// Interface pour les informations de l'entreprise
interface CompanyInfoType {
  name: string;
  rcs?: string;
  capitalSocial?: string;
  companyStatus?: string;
}

// Composant pour le bouton d'autocomplétion des informations de l'entreprise
const CompanyInfoAutoComplete: React.FC<{ 
  setDefaultFooterNotes: (value: string) => void;
  defaultFooterNotes: string;
}> = ({ setDefaultFooterNotes, defaultFooterNotes }) => {
  const { data, loading } = useQuery(GET_USER_INFO);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoType | null>(null);

  useEffect(() => {
    if (data?.me?.company) {
      setCompanyInfo(data.me.company);
    }
  }, [data]);

  const handleAutoComplete = () => {
    if (!companyInfo) return;

    const { name, rcs, capitalSocial, companyStatus } = companyInfo;
    
    // Formater le statut de l'entreprise pour l'affichage
    let statusText = '';
    switch(companyStatus) {
      case 'SARL':
        statusText = 'SARL';
        break;
      case 'SAS':
        statusText = 'SAS';
        break;
      case 'SASU':
        statusText = 'SASU';
        break;
      case 'EURL':
        statusText = 'EURL';
        break;
      case 'EI':
        statusText = 'Entreprise Individuelle';
        break;
      case 'EIRL':
        statusText = 'EIRL';
        break;
      case 'SA':
        statusText = 'SA';
        break;
      case 'SNC':
        statusText = 'SNC';
        break;
      case 'SCI':
        statusText = 'SCI';
        break;
      case 'AUTRE':
      default:
        statusText = '';
    }

    // Construire le texte avec les informations de l'entreprise
    let companyInfoText = `${name}`;
    
    if (statusText) {
      companyInfoText += ` - ${statusText}`;
    }
    
    if (rcs) {
      companyInfoText += ` - RCS ${rcs}`;
    }
    
    if (capitalSocial) {
      // Formater le capital social avec séparateur de milliers et symbole €
      const formattedCapital = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(parseFloat(capitalSocial));
      
      companyInfoText += ` - Capital social : ${formattedCapital}`;
    }

    // Construire le texte final avec les notes existantes
    const separator = defaultFooterNotes && !defaultFooterNotes.endsWith('.') && !defaultFooterNotes.endsWith('\n') ? '. ' : '';
    const finalText = defaultFooterNotes ? `${defaultFooterNotes}${separator}${companyInfoText}` : companyInfoText;
    setDefaultFooterNotes(finalText);
  };

  return (
    <button 
      type="button" 
      onClick={handleAutoComplete}
      disabled={loading || !companyInfo}
      className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
    >
      <InfoCircle size="16" color="#5b50ff" variant="Linear" />
      {loading ? 'Chargement...' : 'Infos légales entreprise'}
    </button>
  );
};

export const DocumentSettings: React.FC<DocumentSettingsProps> = ({
  documentType,
  defaultHeaderNotes,
  setDefaultHeaderNotes,
  defaultFooterNotes,
  setDefaultFooterNotes,
  defaultTermsAndConditions,
  setDefaultTermsAndConditions,
  defaultTermsAndConditionsLinkTitle,
  setDefaultTermsAndConditionsLinkTitle,
  defaultTermsAndConditionsLink,
  setDefaultTermsAndConditionsLink,
  onSave,
  onCancel,
  isSaving = false
}) => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <DocumentText size="28" color="#5b50ff" variant="Linear" className="mr-3" />
        Paramètres {documentType === 'INVOICE' ? 'des factures' : 'des devis'}
      </h2>
      
      <hr className="border-t border-gray-200 my-8" />
      
      <div className="space-y-10">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2 text-[#5b50ff]">01</span>
            Notes d'en-tête par défaut
          </h3>
          <textarea
            id="defaultHeaderNotes"
            name="defaultHeaderNotes"
            rows={4}
            value={defaultHeaderNotes}
            onChange={(e) => setDefaultHeaderNotes(e.target.value)}
            placeholder="Saisissez les notes d'en-tête qui apparaîtront par défaut sur tous vos documents"
            className="block w-full border border-gray-300 rounded-lg bg-white py-3 px-4 text-base focus:border-[#5b50ff] focus:ring-[#5b50ff] focus:ring-opacity-50 focus:ring-2 transition-all duration-300 ease-in-out"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button 
              type="button" 
              onClick={() => setDefaultHeaderNotes("Merci de votre confiance. N'hésitez pas à nous contacter pour toute question.")}
              className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
            >
              Message de remerciement
            </button>
            <button 
              type="button" 
              onClick={() => setDefaultHeaderNotes(documentType === 'INVOICE' ? "Facture établie conformément à nos accords." : "Devis valable 30 jours à compter de sa date d'émission.")}
              className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
            >
              {documentType === 'INVOICE' ? "Note standard facture" : "Validité du devis"}
            </button>
          </div>
        </div>
        
        <div>
          <hr className="border-t border-gray-200 my-8" />
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2 text-[#5b50ff]">02</span>
            Notes de bas de page par défaut
          </h3>
          <textarea
            id="defaultFooterNotes"
            name="defaultFooterNotes"
            rows={4}
            value={defaultFooterNotes}
            onChange={(e) => setDefaultFooterNotes(e.target.value)}
            placeholder="Saisissez les notes de bas de page qui apparaîtront par défaut sur tous vos documents"
            className="block w-full border border-gray-300 rounded-lg bg-white py-3 px-4 text-base focus:border-[#5b50ff] focus:ring-[#5b50ff] focus:ring-opacity-50 focus:ring-2 transition-all duration-300 ease-in-out"
          />
          <div className="mt-3 mb-4 p-3 bg-[#f0eeff] rounded-lg border border-[#e6e1ff]">
            <p className="text-sm text-gray-700 flex items-start">
              <InfoCircle size="18" color="#5b50ff" variant="Linear" className="mr-2 mt-0.5 flex-shrink-0" />
              <span><span className="text-[#5b50ff] font-medium">Rappel important :</span> La mention des informations légales de votre entreprise (nom, forme juridique, capital social, RCS) est obligatoire sur tous vos documents commerciaux conformément à l'article R.123-237 du Code de commerce.</span>
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button 
              type="button" 
              onClick={() => setDefaultFooterNotes("Nous vous remercions pour votre confiance et restons à votre disposition pour toute information complémentaire.")}
              className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
            >
              Message de remerciement
            </button>
            <button 
              type="button" 
              onClick={() => setDefaultFooterNotes(documentType === 'INVOICE' ? "Paiement à effectuer sous 30 jours. Pénalités de retard : 3 fois le taux d'intérêt légal. Indemnité forfaitaire de recouvrement : 40€." : "La signature de ce devis vaut acceptation des conditions générales de vente.")}
              className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
            >
              {documentType === 'INVOICE' ? "Conditions de paiement" : "Acceptation du devis"}
            </button>
            <CompanyInfoAutoComplete 
              setDefaultFooterNotes={setDefaultFooterNotes} 
              defaultFooterNotes={defaultFooterNotes} 
            />
          </div>
        </div>
        
        <div>
          <hr className="border-t border-gray-200 my-8" />
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2 text-[#5b50ff]">03</span>
            Conditions générales par défaut
          </h3>
          <textarea
            id="defaultTermsAndConditions"
            name="defaultTermsAndConditions"
            rows={6}
            value={defaultTermsAndConditions}
            onChange={(e) => setDefaultTermsAndConditions(e.target.value)}
            placeholder="Saisissez les conditions générales qui apparaîtront par défaut sur tous vos documents"
            className="block w-full border border-gray-300 rounded-lg bg-white py-3 px-4 text-base focus:border-[#5b50ff] focus:ring-[#5b50ff] focus:ring-opacity-50 focus:ring-2 transition-all duration-300 ease-in-out"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {/* Suggestions pour les conditions générales - identiques à celles des formulaires */}
            <div className="mt-2 flex flex-wrap gap-2">
              {documentType === 'INVOICE' ? (
                // Suggestions pour les factures
                <>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentText = defaultTermsAndConditions || "";
                      setDefaultTermsAndConditions(currentText + (currentText ? "\n" : "") + "Les factures sont payables à réception, sauf accord préalable.");
                    }}
                    className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
                  >
                    Paiement
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentText = defaultTermsAndConditions || "";
                      setDefaultTermsAndConditions(currentText + (currentText ? "\n" : "") + "Pas d'escompte accordé pour paiement anticipé.");
                    }}
                    className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
                  >
                    Escompte
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentText = defaultTermsAndConditions || "";
                      setDefaultTermsAndConditions(currentText + (currentText ? "\n" : "") + "En cas de non-paiement à la date d'échéance, des pénalités seront appliquées. Tout montant non réglé à l'échéance sera majoré d'un intérêt annuel de 11,13 %.");
                    }}
                    className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
                  >
                    Pénalités
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentText = defaultTermsAndConditions || "";
                      setDefaultTermsAndConditions(currentText + (currentText ? "\n" : "") + "Tout retard de paiement entraînera une indemnité forfaitaire pour frais de recouvrement de 40€.");
                    }}
                    className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
                  >
                    Retard
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentText = defaultTermsAndConditions || "";
                      setDefaultTermsAndConditions(currentText + (currentText ? "\n" : "") + "En cas de litige, le tribunal de commerce de [Ville] sera seul compétent.");
                    }}
                    className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
                  >
                    Litige
                  </button>
                </>
              ) : (
                // Suggestions pour les devis
                <>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentText = defaultTermsAndConditions || "";
                      setDefaultTermsAndConditions(currentText + (currentText ? "\n" : "") + "Les devis sont valables 30 jours à compter de leur date d'émission.");
                    }}
                    className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
                  >
                    Paiement
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentText = defaultTermsAndConditions || "";
                      setDefaultTermsAndConditions(currentText + (currentText ? "\n" : "") + "Un acompte de 30% est demandé à la signature du devis.");
                    }}
                    className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
                  >
                    Acompte
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentText = defaultTermsAndConditions || "";
                      setDefaultTermsAndConditions(currentText + (currentText ? "\n" : "") + "Toute annulation après signature du devis entraînera la facturation des travaux déjà réalisés.");
                    }}
                    className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
                  >
                    Annulation
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentText = defaultTermsAndConditions || "";
                      setDefaultTermsAndConditions(currentText + (currentText ? "\n" : "") + "En cas de litige, le tribunal de commerce de [Ville] sera seul compétent.");
                    }}
                    className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
                  >
                    Litige
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentText = defaultTermsAndConditions || "";
                      setDefaultTermsAndConditions(currentText + (currentText ? "\n" : "") + "Les éléments produits restent la propriété de l'entreprise jusqu'au paiement intégral du prix.");
                    }}
                    className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
                  >
                    Propriété
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentText = defaultTermsAndConditions || "";
                      setDefaultTermsAndConditions(currentText + (currentText ? "\n" : "") + "Pas d'escompte accordé pour paiement anticipé.");
                    }}
                    className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
                  >
                    Escompte
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentText = defaultTermsAndConditions || "";
                      setDefaultTermsAndConditions(currentText + (currentText ? "\n" : "") + "En cas de non-paiement à la date d'échéance, des pénalités seront appliquées. Tout montant non réglé à l'échéance sera majoré d'un intérêt annuel de 11,13 %.");
                    }}
                    className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
                  >
                    Pénalités
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentText = defaultTermsAndConditions || "";
                      setDefaultTermsAndConditions(currentText + (currentText ? "\n" : "") + "Tout retard de paiement entraînera une indemnité forfaitaire pour frais de recouvrement de 40€.");
                    }}
                    className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
                  >
                    Retard
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <hr className="border-t border-gray-200 my-8" />
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2 text-[#5b50ff]">04</span>
            Liens vers les conditions générales
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium mb-3">Titre du lien des conditions générales</h4>
            <TextField
              id="defaultTermsAndConditionsLinkTitle"
              name="defaultTermsAndConditionsLinkTitle"
              value={defaultTermsAndConditionsLinkTitle}
              onChange={(e) => setDefaultTermsAndConditionsLinkTitle(e.target.value)}
              placeholder="Ex: Voir nos CGV complètes"
              className="w-full"
            />
            </div>
            
            <div>
              <h4 className="text-md font-medium mb-3">Lien des conditions générales</h4>
            <TextField
              id="defaultTermsAndConditionsLink"
              name="defaultTermsAndConditionsLink"
              value={defaultTermsAndConditionsLink}
              onChange={(e) => setDefaultTermsAndConditionsLink(e.target.value)}
              placeholder="https://exemple.com/cgv"
              className="w-full"
            />
            </div>
          </div>
        </div>
      </div>
      
      <hr className="border-t border-gray-200 my-8" />
      
      <div className="mt-10 flex justify-end space-x-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          disabled={isSaving}
        >
          Annuler
        </Button>
        <Button
          type="button"
          onClick={onSave}
          variant="primary"
          disabled={isSaving}
          icon={<ArrowRight2 size="18" color="#ffffff" />}
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
        </Button>
      </div>
    </div>
  );
};
