export interface BankAccount {
  id: string;
  accountHolderName: string;
  bankName: string;
  iban: string;
  bic: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBankAccountInput {
  accountHolderName: string;
  bankName: string;
  iban: string;
  bic: string;
  isDefault?: boolean;
}

export interface UpdateBankAccountInput extends Partial<CreateBankAccountInput> {
  id: string;
}
