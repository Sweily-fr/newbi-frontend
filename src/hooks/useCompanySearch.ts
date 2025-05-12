import { useState } from 'react';
import { useLazyQuery, ApolloError } from '@apollo/client';
import { SEARCH_COMPANY_BY_SIRET, SEARCH_COMPANIES_BY_NAME } from '../features/clients/graphql/client';
import useNotification from './useNotification';

// Types pour les résultats de recherche
export interface CompanySearchResult {
  name: string;
  siret: string;
  vatNumber?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface CompanyNameResult {
  name: string;
  siret: string;
  siren: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export const useCompanySearch = () => {
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [companyData, setCompanyData] = useState<CompanySearchResult | null>(null);
  const [companiesList, setCompaniesList] = useState<CompanyNameResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSearchType, setLastSearchType] = useState<'siret' | 'name' | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('');

  // Fonction pour gérer les erreurs de connexion
  const handleConnectionError = (error: ApolloError) => {
    setIsLoading(false);
    setIsRetrying(false);
    
    // Vérifier si c'est une erreur de connexion
    const errorMsg = error.message || 'Une erreur est survenue';
    setErrorMessage(errorMsg);
    
    if (errorMsg.includes('ECONNREFUSED') || errorMsg.includes('ETIMEDOUT') || 
        errorMsg.includes('Network Error') || errorMsg.includes('connect')) {
      showNotification(
        'Impossible de se connecter au service de recherche d\'entreprises. Veuillez réessayer plus tard.', 
        'error',
        8000
      );
    } else {
      showNotification(`Erreur lors de la recherche: ${errorMsg}`, 'error');
    }
  };

  // Query pour rechercher une entreprise par SIRET
  const [searchBySiret] = useLazyQuery(SEARCH_COMPANY_BY_SIRET, {
    onCompleted: (data) => {
      setIsLoading(false);
      setIsRetrying(false);
      setErrorMessage(null);
      
      if (data.searchCompanyBySiret) {
        setCompanyData(data.searchCompanyBySiret);
      } else {
        showNotification('Aucune entreprise trouvée avec ce SIRET', 'warning');
        setCompanyData(null);
      }
    },
    onError: (error) => {
      handleConnectionError(error);
      setCompanyData(null);
    },
    fetchPolicy: 'network-only'
  });

  // Query pour rechercher des entreprises par nom
  const [searchByName] = useLazyQuery(SEARCH_COMPANIES_BY_NAME, {
    onCompleted: (data) => {
      setIsLoading(false);
      setIsRetrying(false);
      setErrorMessage(null);
      
      if (data.searchCompaniesByName && data.searchCompaniesByName.length > 0) {
        setCompaniesList(data.searchCompaniesByName);
      } else {
        showNotification('Aucune entreprise trouvée avec ce nom', 'warning');
        setCompaniesList([]);
      }
    },
    onError: (error) => {
      handleConnectionError(error);
      setCompaniesList([]);
    },
    fetchPolicy: 'network-only'
  });

  // Fonction pour rechercher une entreprise par SIRET
  const handleSearchBySiret = (siret: string) => {
    if (!siret || siret.length !== 14) {
      showNotification('Le SIRET doit contenir exactement 14 chiffres', 'warning');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    setCompanyData(null);
    searchBySiret({ variables: { siret } });
  };

  // Fonction pour rechercher des entreprises par nom
  const handleSearchByName = (name: string) => {
    if (!name || name.length < 3) {
      showNotification('Le nom doit contenir au moins 3 caractères', 'warning');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    setCompaniesList([]);
    searchByName({ variables: { name } });
  };

  // Fonction pour réessayer une recherche après une erreur
  const retrySearch = (type: 'siret' | 'name', value: string) => {
    setIsRetrying(true);
    setErrorMessage(null);
    
    if (type === 'siret') {
      handleSearchBySiret(value);
    } else {
      handleSearchByName(value);
    }
  };

  // Fonction pour réinitialiser les résultats
  const resetSearch = () => {
    setCompanyData(null);
    setCompaniesList([]);
    setErrorMessage(null);
    setIsRetrying(false);
    setLastSearchType(null);
    setLastSearchQuery('');
  };

  // Fonction unifiée pour rechercher par SIRET, SIREN ou nom d'entreprise
  const searchCompany = (query: string) => {
    if (!query || query.trim().length < 3) {
      showNotification('Veuillez saisir au moins 3 caractères', 'warning');
      return;
    }
    
    const trimmedQuery = query.trim();
    setLastSearchQuery(trimmedQuery);
    
    // Vérifier si la requête ressemble à un SIRET (14 chiffres)
    if (/^\d{14}$/.test(trimmedQuery)) {
      setLastSearchType('siret');
      handleSearchBySiret(trimmedQuery);
    } 
    // Vérifier si la requête ressemble à un SIREN (9 chiffres)
    else if (/^\d{9}$/.test(trimmedQuery)) {
      // Pour un SIREN, on peut chercher par nom car il n'y a pas d'API directe pour SIREN
      setLastSearchType('name');
      handleSearchByName(trimmedQuery);
    }
    // Sinon, considérer comme une recherche par nom
    else {
      setLastSearchType('name');
      handleSearchByName(trimmedQuery);
    }
  };

  // Fonction pour réessayer la dernière recherche
  const retryLastSearch = () => {
    if (lastSearchQuery && lastSearchType) {
      retrySearch(lastSearchType, lastSearchQuery);
    }
  };

  return {
    isLoading,
    isRetrying,
    errorMessage,
    companyData,
    companiesList,
    searchBySiret: handleSearchBySiret,
    searchByName: handleSearchByName,
    searchCompany,
    retrySearch,
    retryLastSearch,
    resetSearch,
    lastSearchType
  };
};

export default useCompanySearch;
