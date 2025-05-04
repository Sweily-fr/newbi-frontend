import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Notification } from '../components/feedback';

// Définir les requêtes GraphQL
const GET_DOCUMENT_SETTINGS = gql`
  query GetDocumentSettings($documentType: DocumentType!) {
    getDocumentSettings(documentType: $documentType) {
      id
      documentType
      defaultHeaderNotes
      defaultFooterNotes
      defaultTermsAndConditions
      defaultTermsAndConditionsLinkTitle
      defaultTermsAndConditionsLink
    }
  }
`;

const SAVE_DOCUMENT_SETTINGS = gql`
  mutation SaveDocumentSettings($input: DocumentSettingsInput!) {
    saveDocumentSettings(input: $input) {
      id
      documentType
      defaultHeaderNotes
      defaultFooterNotes
      defaultTermsAndConditions
      defaultTermsAndConditionsLinkTitle
      defaultTermsAndConditionsLink
    }
  }
`;

export const useDocumentSettings = (documentType: 'INVOICE' | 'QUOTE') => {
  // États pour les paramètres
  const [defaultHeaderNotes, setDefaultHeaderNotes] = useState('');
  const [defaultFooterNotes, setDefaultFooterNotes] = useState('');
  const [defaultTermsAndConditions, setDefaultTermsAndConditions] = useState('');
  const [defaultTermsAndConditionsLinkTitle, setDefaultTermsAndConditionsLinkTitle] = useState('');
  const [defaultTermsAndConditionsLink, setDefaultTermsAndConditionsLink] = useState('');

  // Requête pour récupérer les paramètres
  const { data, loading, error, refetch } = useQuery(GET_DOCUMENT_SETTINGS, {
    variables: { documentType },
    fetchPolicy: 'network-only',
  });

  // Mutation pour sauvegarder les paramètres
  const [saveSettings, { loading: isSaving }] = useMutation(SAVE_DOCUMENT_SETTINGS);

  // Charger les paramètres depuis le serveur
  useEffect(() => {
    if (data?.getDocumentSettings) {
      const settings = data.getDocumentSettings;
      setDefaultHeaderNotes(settings.defaultHeaderNotes || '');
      setDefaultFooterNotes(settings.defaultFooterNotes || '');
      setDefaultTermsAndConditions(settings.defaultTermsAndConditions || '');
      setDefaultTermsAndConditionsLinkTitle(settings.defaultTermsAndConditionsLinkTitle || '');
      setDefaultTermsAndConditionsLink(settings.defaultTermsAndConditionsLink || '');
    }
  }, [data]);

  // Fonction pour sauvegarder les paramètres
  const handleSaveSettings = async () => {
    try {
      await saveSettings({
        variables: {
          input: {
            documentType,
            defaultHeaderNotes,
            defaultFooterNotes,
            defaultTermsAndConditions,
            defaultTermsAndConditionsLinkTitle,
            defaultTermsAndConditionsLink,
          },
        },
      });
      
      Notification.success('Paramètres enregistrés avec succès', {
        position: 'bottom-left',
        duration: 3000,
      });
      
      // Rafraîchir les données
      refetch();
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      
      Notification.error('Erreur lors de la sauvegarde des paramètres', {
        position: 'bottom-left',
        duration: 5000,
      });
      
      return false;
    }
  };

  // Fonction pour appliquer les paramètres par défaut à un document
  const applyDefaultSettings = (setHeaderNotes: (value: string) => void, setFooterNotes: (value: string) => void, setTermsAndConditions: (value: string) => void, setTermsAndConditionsLinkTitle: (value: string) => void, setTermsAndConditionsLink: (value: string) => void) => {
    if (defaultHeaderNotes) setHeaderNotes(defaultHeaderNotes);
    if (defaultFooterNotes) setFooterNotes(defaultFooterNotes);
    if (defaultTermsAndConditions) setTermsAndConditions(defaultTermsAndConditions);
    if (defaultTermsAndConditionsLinkTitle) setTermsAndConditionsLinkTitle(defaultTermsAndConditionsLinkTitle);
    if (defaultTermsAndConditionsLink) setTermsAndConditionsLink(defaultTermsAndConditionsLink);
  };

  return {
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
    handleSaveSettings,
    applyDefaultSettings,
    isLoading: loading,
    isSaving,
    error,
  };
};
