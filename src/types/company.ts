/**
 * Types liés aux informations de l'entreprise
 */

/**
 * Structure des données d'une entreprise
 */
export interface CompanyInfo {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  logo?: string;
  siret: string;
  vatNumber: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  bankDetails?: {
    iban: string;
    bic: string;
    bankName: string;
  };
}

/**
 * Props pour le formulaire d'informations de l'entreprise
 */
export interface CompanyInfoFormProps {
  initialData: CompanyInfo;
  onSubmit?: (data: CompanyInfo) => void;
}
