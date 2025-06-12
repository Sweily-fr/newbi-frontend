
export interface OCRMetadata {
  text: string;
  vendor?: string;
  amount?: number;
  date?: string;
  vatNumber?: string;
  invoiceNumber?: string;
  confidence?: number;
  rawData?: unknown;
  
  // Propriétés supplémentaires pour l'affichage
  title?: string;
  category?: string;
  description?: string;
}

export interface CreateExpenseData {
  title: string;
  amount: number;
  date: string;
  vendor?: string;
  vendorVatNumber?: string;
  invoiceNumber?: string;
  category: string;
  ocrData: OCRMetadata;
  ocrFile?: File;
}

export enum ExpenseStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID'
}

export enum ExpenseCategory {
  TRAVEL = 'TRAVEL',
  MEAL = 'MEAL',
  OFFICE = 'OFFICE',
  EQUIPMENT = 'EQUIPMENT',
  SOFTWARE = 'SOFTWARE',
  OTHER = 'OTHER'
}

export enum ExpensePaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
  PAYPAL = 'PAYPAL',
  OTHER = 'OTHER'
}

export const EXPENSE_STATUS_LABELS: Record<ExpenseStatus, string> = {
  [ExpenseStatus.DRAFT]: 'Brouillon',
  [ExpenseStatus.PENDING]: 'En attente',
  [ExpenseStatus.APPROVED]: 'Approuvé',
  [ExpenseStatus.REJECTED]: 'Rejeté',
  [ExpenseStatus.PAID]: 'Payé'
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.TRAVEL]: 'Voyage',
  [ExpenseCategory.MEAL]: 'Repas',
  [ExpenseCategory.OFFICE]: 'Bureau',
  [ExpenseCategory.EQUIPMENT]: 'Équipement',
  [ExpenseCategory.SOFTWARE]: 'Logiciel',
  [ExpenseCategory.OTHER]: 'Autre'
};

export const EXPENSE_PAYMENT_METHOD_LABELS: Record<ExpensePaymentMethod, string> = {
  [ExpensePaymentMethod.CREDIT_CARD]: 'Carte bancaire',
  [ExpensePaymentMethod.BANK_TRANSFER]: 'Virement bancaire',
  [ExpensePaymentMethod.CASH]: 'Espèces',
  [ExpensePaymentMethod.PAYPAL]: 'PayPal',
  [ExpensePaymentMethod.OTHER]: 'Autre'
};

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  status: ExpenseStatus;
  description?: string;
  vendor?: string;
  vendorVatNumber?: string;
  invoiceNumber?: string;
  notes?: string;
  files?: Array<{
    id: string;
    url: string;
    name: string;
    type: string;
  }>;
  ocrMetadata?: OCRMetadata;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  description?: string;
  vendor?: string;
  vendorVatNumber?: string;
  invoiceNumber?: string;
  notes?: string;
  files?: File[];
  ocrData?: OCRMetadata;
}

export interface ExpenseFilters {
  status?: ExpenseStatus;
  category?: ExpenseCategory;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface ExpenseSummary {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  byCategory: Array<{
    category: ExpenseCategory;
    amount: number;
  }>;
}

export interface ExpenseStats {
  total: number;
  thisMonth: number;
  lastMonth: number;
  pendingApproval: number;
  byCategory: Array<{
    category: ExpenseCategory;
    amount: number;
    percentage: number;
  }>;
}
