/**
 * Types liés aux devis et à leurs formulaires
 */

import { Client } from '../../../types/client';
import { CompanyInfo } from '../../../types/company';
import { Item, CustomField } from '../../../types/invoice';

/**
 * Structure d'un devis
 */
export interface Quote {
  id?: string;
  number?: string;
  prefix?: string;
  status?: 'DRAFT' | 'PENDING' | 'COMPLETED';
  createdAt?: string;
  issueDate?: string;
  validUntil?: string;
  client?: Client;
  companyInfo?: CompanyInfo;
  items?: Item[];
  discount?: number;
  discountType?: 'PERCENTAGE' | 'FIXED';
  discountAmount?: number;
  totalHT?: number;
  totalVAT?: number;
  totalTTC?: number;
  finalTotalHT?: number;
  finalTotalTTC?: number;
  headerNotes?: string;
  footerNotes?: string;
  termsAndConditions?: string;
  termsAndConditionsLinkTitle?: string;
  termsAndConditionsLink?: string;
  customFields?: CustomField[];
  hasDifferentShippingAddress?: boolean;
  shippingAddress?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  convertedToInvoice?: {
    id: string;
    number: string;
  };
}

/**
 * Props pour le composant modal de formulaire de devis
 */
export interface QuoteFormModalProps {
  quote?: Quote;
  onClose: () => void;
  onSubmit: (data: Quote) => void;
}