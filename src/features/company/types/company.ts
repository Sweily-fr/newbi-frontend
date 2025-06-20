export interface Address {
  street: string;
  complement?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CompanyInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: Address;
  siret?: string;
  vatNumber?: string;
  logoUrl?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}
