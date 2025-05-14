/**
 * Types liés aux factures et à leurs formulaires
 */

import { Client } from '../../../types/client';
import { CompanyInfo } from '../../../types/company';

// Re-export des types importés pour faciliter l'utilisation
export type { Client, CompanyInfo };

/**
 * Structure d'un élément de facture
 */
export interface Item {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  unit: string;
  discount?: number;
  discountType?: 'PERCENTAGE' | 'FIXED';
  details?: string;
  vatExemptionText?: string;
}

/**
 * Structure d'un champ personnalisé
 */
export interface CustomField {
  key: string;
  value: string;
}

/**
 * Structure d'une facture
 */
export interface Invoice {
  id?: string;
  number?: string;
  prefix?: string;
  status?: 'DRAFT' | 'PENDING' | 'COMPLETED';
  createdAt?: string;
  dueDate?: string;
  client: Client;
  companyInfo?: CompanyInfo;
  items: Item[];
  discount?: number;
  discountType?: 'PERCENTAGE' | 'FIXED';
  discountAmount?: number;
  totalHT?: number;
  totalVAT?: number;
  totalTTC?: number;
  finalTotalHT?: number;
  finalTotalTTC?: number;
  notes?: string;
  customFields?: CustomField[];
  vatExemptionText?: string;
  hasDifferentShippingAddress?: boolean;
  shippingAddress?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

/**
 * Props pour le composant modal de formulaire de facture
 */
export interface InvoiceFormModalProps {
  invoice?: Invoice;
  onClose: () => void;
  onSubmit: (data: Invoice) => void;
  quoteId?: string;
}