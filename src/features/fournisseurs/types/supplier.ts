import { Address } from '../../../features/company/types/company';

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: Address;
  siret?: string;
  vatNumber?: string;
  website?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierInput {
  name: string;
  email?: string;
  phone?: string;
  address?: Address;
  siret?: string;
  vatNumber?: string;
  website?: string;
  notes?: string;
  isActive?: boolean;
}
