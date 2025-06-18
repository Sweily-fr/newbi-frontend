/**
 * Types pour le module de gestion des dépenses
 */

// Énumérations
export enum ExpenseCategory {
  OFFICE_SUPPLIES = 'OFFICE_SUPPLIES',
  TRAVEL = 'TRAVEL',
  MEALS = 'MEALS',
  ACCOMMODATION = 'ACCOMMODATION',
  SOFTWARE = 'SOFTWARE',
  HARDWARE = 'HARDWARE',
  SERVICES = 'SERVICES',
  MARKETING = 'MARKETING',
  TAXES = 'TAXES',
  RENT = 'RENT',
  UTILITIES = 'UTILITIES',
  SALARIES = 'SALARIES',
  INSURANCE = 'INSURANCE',
  MAINTENANCE = 'MAINTENANCE',
  TRAINING = 'TRAINING',
  SUBSCRIPTIONS = 'SUBSCRIPTIONS',
  OTHER = 'OTHER'
}

export enum ExpenseStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID'
}

export enum ExpensePaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
  CHECK = 'CHECK',
  PAYPAL = 'PAYPAL',
  OTHER = 'OTHER'
}

// Interface pour les fichiers associés aux dépenses
export interface ExpenseFile {
  id: string;
  filename: string;
  originalFilename: string;
  mimetype: string;
  path: string;
  size: number;
  url: string;
  ocrProcessed: boolean;
  ocrData?: OCRMetadata;
  createdAt: string;
  updatedAt: string;
}

// Interface pour les métadonnées OCR
export interface OCRMetadata {
  vendorName?: string;
  vendorAddress?: string;
  vendorVatNumber?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  totalAmount?: number;
  vatAmount?: number;
  currency?: string;
  confidenceScore?: number;
  rawExtractedText?: string;
}

// Interface pour les données de création de dépense à partir d'OCR
export interface CreateExpenseData {
  title: string;
  amount: number;
  date: string;
  vendor?: string;
  vendorVatNumber?: string;
  invoiceNumber?: string;
  vatAmount?: number;
  currency?: string;
  ocrFile: File;
  ocrData: OCRMetadata;
  category?: string;
}

// Interface principale pour les dépenses
export interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  date: string;
  vendor?: string;
  vendorVatNumber?: string;
  invoiceNumber?: string;
  documentNumber: string;
  accountingAccount: string;
  vatAmount?: number;
  vatRate?: number;
  isVatDeductible: boolean;
  status: ExpenseStatus;
  paymentMethod: ExpensePaymentMethod;
  paymentDate?: string;
  files: ExpenseFile[];
  ocrMetadata?: OCRMetadata;
  notes?: string;
  tags: string[];
  createdBy: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Interface pour la pagination des dépenses
export interface ExpensePagination {
  expenses: Expense[];
  totalCount: number;
  hasNextPage: boolean;
}

// Interface pour les statistiques des dépenses
export interface ExpenseStats {
  totalAmount: number;
  totalCount: number;
  byCategory: CategoryStat[];
  byMonth: MonthStat[];
  byStatus: StatusStat[];
}

export interface CategoryStat {
  category: ExpenseCategory;
  amount: number;
  count: number;
}

export interface MonthStat {
  month: string;
  amount: number;
  count: number;
}

export interface StatusStat {
  status: ExpenseStatus;
  amount: number;
  count: number;
}

// Interfaces pour les inputs de création et mise à jour
export interface CreateExpenseInput {
  title: string;
  description?: string;
  amount: number;
  currency?: string;
  category?: ExpenseCategory;
  date: string;
  vendor?: string;
  vendorVatNumber?: string;
  invoiceNumber?: string;
  documentNumber: string;
  accountingAccount: string;
  vatAmount?: number;
  vatRate?: number;
  isVatDeductible?: boolean;
  status?: ExpenseStatus;
  paymentMethod?: ExpensePaymentMethod;
  paymentDate?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateExpenseInput {
  title?: string;
  description?: string;
  amount?: number;
  currency?: string;
  category?: ExpenseCategory;
  date?: string;
  vendor?: string;
  vendorVatNumber?: string;
  invoiceNumber?: string;
  documentNumber?: string;
  accountingAccount?: string;
  vatAmount?: number;
  vatRate?: number;
  isVatDeductible?: boolean;
  status?: ExpenseStatus;
  paymentMethod?: ExpensePaymentMethod;
  paymentDate?: string;
  notes?: string;
  tags?: string[];
}

// Interface pour le téléchargement de fichiers
export interface FileUploadInput {
  file: File;
  processOCR?: boolean;
}

// Interface pour la mise à jour des métadonnées OCR
export interface OCRMetadataInput {
  vendorName?: string;
  vendorAddress?: string;
  vendorVatNumber?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  totalAmount?: number;
  vatAmount?: number;
  currency?: string;
  confidenceScore?: number;
  rawExtractedText?: string;
}

// Type pour les filtres de recherche de dépenses
export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  category?: ExpenseCategory;
  status?: ExpenseStatus;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

// Traductions pour les énumérations
export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.OFFICE_SUPPLIES]: 'Fournitures de bureau',
  [ExpenseCategory.TRAVEL]: 'Déplacements',
  [ExpenseCategory.MEALS]: 'Repas',
  [ExpenseCategory.ACCOMMODATION]: 'Hébergement',
  [ExpenseCategory.SOFTWARE]: 'Logiciels',
  [ExpenseCategory.HARDWARE]: 'Matériel informatique',
  [ExpenseCategory.SERVICES]: 'Services',
  [ExpenseCategory.MARKETING]: 'Marketing',
  [ExpenseCategory.TAXES]: 'Taxes et impôts',
  [ExpenseCategory.RENT]: 'Loyer',
  [ExpenseCategory.UTILITIES]: 'Services publics',
  [ExpenseCategory.SALARIES]: 'Salaires',
  [ExpenseCategory.INSURANCE]: 'Assurance',
  [ExpenseCategory.MAINTENANCE]: 'Maintenance',
  [ExpenseCategory.TRAINING]: 'Formation',
  [ExpenseCategory.SUBSCRIPTIONS]: 'Abonnements',
  [ExpenseCategory.OTHER]: 'Autre'
};

export const EXPENSE_STATUS_LABELS: Record<ExpenseStatus, string> = {
  [ExpenseStatus.DRAFT]: 'Brouillon',
  [ExpenseStatus.PENDING]: 'En attente',
  [ExpenseStatus.APPROVED]: 'Approuvé',
  [ExpenseStatus.REJECTED]: 'Rejeté',
  [ExpenseStatus.PAID]: 'Payé'
};

export const EXPENSE_PAYMENT_METHOD_LABELS: Record<ExpensePaymentMethod, string> = {
  [ExpensePaymentMethod.CREDIT_CARD]: 'Carte de crédit',
  [ExpensePaymentMethod.BANK_TRANSFER]: 'Virement bancaire',
  [ExpensePaymentMethod.CASH]: 'Espèces',
  [ExpensePaymentMethod.CHECK]: 'Chèque',
  [ExpensePaymentMethod.PAYPAL]: 'PayPal',
  [ExpensePaymentMethod.OTHER]: 'Autre'
};
