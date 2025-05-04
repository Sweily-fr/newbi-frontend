import React, { useEffect, useState } from 'react';
import { TextField } from '../../ui';
import { useQuery } from '@apollo/client';
import { GET_USER_INFO } from '../../../graphql/queries';

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
      console.log('Données de l\'entreprise récupérées:', data.me.company);
      setCompanyInfo(data.me.company);
    }
  }, [data]);

  const handleAutoComplete = () => {
    if (!companyInfo) return;

    console.log('Informations de l\'entreprise pour l\'autocomplétion:', companyInfo);
    const { name, rcs, capitalSocial, companyStatus } = companyInfo;
    console.log('Valeurs extraites:', { name, rcs, capitalSocial, companyStatus });
    
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
      className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Paramètres {documentType === 'INVOICE' ? 'des factures' : 'des devis'}
      </h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Notes d'en-tête par défaut</h3>
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
          <h3 className="text-lg font-semibold mb-2">Notes de bas de page par défaut</h3>
          <textarea
            id="defaultFooterNotes"
            name="defaultFooterNotes"
            rows={4}
            value={defaultFooterNotes}
            onChange={(e) => setDefaultFooterNotes(e.target.value)}
            placeholder="Saisissez les notes de bas de page qui apparaîtront par défaut sur tous vos documents"
            className="block w-full border border-gray-300 rounded-lg bg-white py-3 px-4 text-base focus:border-[#5b50ff] focus:ring-[#5b50ff] focus:ring-opacity-50 focus:ring-2 transition-all duration-300 ease-in-out"
          />
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
          <h3 className="text-lg font-semibold mb-2">Conditions générales par défaut</h3>
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
            <button 
              type="button" 
              onClick={() => setDefaultTermsAndConditions(documentType === 'INVOICE' ? "1. Paiement exigible sous 30 jours.\n2. Tout retard de paiement entraînera des pénalités de 3 fois le taux d'intérêt légal.\n3. Une indemnité forfaitaire de 40€ pour frais de recouvrement sera due en cas de retard." : "1. Ce devis est valable 30 jours à compter de sa date d'émission.\n2. Un acompte de 30% est demandé à la signature.\n3. Les travaux débuteront après réception de l'acompte.")}
              className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
            >
              {documentType === 'INVOICE' ? "Conditions de paiement" : "Conditions standard devis"}
            </button>
            <button 
              type="button" 
              onClick={() => setDefaultTermsAndConditions("1. Tous les prix sont indiqués hors taxes.\n2. Nos produits et services sont fournis conformément à nos conditions générales de vente.\n3. Tout litige relatif à ce document sera soumis à la juridiction compétente de notre siège social.")}
              className="text-sm px-3 py-1 bg-[#f0eeff] text-[#5b50ff] rounded-md hover:bg-[#e6e1ff] transition-colors"
            >
              Mentions légales
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Titre du lien des conditions générales</h3>
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
            <h3 className="text-lg font-semibold mb-2">Lien des conditions générales</h3>
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
      
      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={isSaving}
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 bg-[#5b50ff] text-white rounded-md hover:bg-[#4a41e0]"
          disabled={isSaving}
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
        </button>
      </div>
    </div>
  );
};
