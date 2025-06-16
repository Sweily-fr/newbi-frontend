/**
 * Types liés aux bons de commande et à leurs formulaires
 */

import { Client } from '../../clients/types';
import { CompanyInfo } from '../../profile/types';
import { Item, CustomField } from '../../factures/types';

/**
 * Structure d'un bon de commande
 */
export interface PurchaseOrder {
  id?: string;
  number?: string;
  prefix?: string;
  status?: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'CANCELED';
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
  vatExemptionText?: string;
  customFields?: CustomField[];
  convertedToInvoice?: {
    id: string;
    number: string;
  };
  linkedInvoices?: Array<{
    id: string;
    prefix: string;
    number: string;
    status: string;
    finalTotalTTC: number;
  }>;
}

/**
 * Props pour le composant modal de formulaire de bon de commande
 */
export interface PurchaseOrderFormModalProps {
  purchaseOrder?: PurchaseOrder;
  onClose: () => void;
  onSubmit: (data: PurchaseOrder) => void;
}
