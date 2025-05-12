import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROFILE } from '../graphql';
import { useAuth } from '../../../context/AuthContext';

interface CompanyAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CompanyBankDetails {
  iban: string;
  bic: string;
  bankName: string;
}

export interface Company {
  name: string;
  email: string;
  phone: string;
  website: string;
  logo: string;
  siret: string;
  vatNumber: string;
  legalStatus?: string;
  capital?: number;
  rcs?: string;
  directorName?: string;
  address: CompanyAddress;
  bankDetails: CompanyBankDetails;
}

export const useCompany = () => {
  const { isAuthenticated } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);

  const { loading, error, refetch } = useQuery(GET_PROFILE, {
    skip: !isAuthenticated,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.me?.company) {
        setCompany(data.me.company);
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la récupération des informations de l\'entreprise:', error);
    }
  });

  // Rafraîchir les données lorsque l'utilisateur se connecte
  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    } else {
      setCompany(null);
    }
  }, [isAuthenticated, refetch]);

  return {
    company,
    loading,
    error,
    refetch
  };
};
