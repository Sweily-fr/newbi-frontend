// Réutiliser les composants des factures pour les sections communes
export { ClientSelection } from '../../invoices/Sections/ClientSelection';
export { InvoiceItems as QuoteItems } from '../../invoices/Sections/InvoiceItems';
export { InvoiceDiscountAndTotals as QuoteDiscountAndTotals } from '../../invoices/Sections/InvoiceDiscountAndTotals';
export { InvoiceCompanyInfo as QuoteCompanyInfo } from '../../invoices/Sections/InvoiceCompanyInfo';
export { InvoiceBankDetails as QuoteBankDetails } from '../../invoices/Sections/InvoiceBankDetails';
export { InvoiceCustomFields as QuoteCustomFields } from '../../invoices/Sections/InvoiceDiscountAndTotals';

// Composants spécifiques aux devis
export { QuoteGeneralInfo } from './QuoteGeneralInfo';
export { QuoteFooterNotes } from './QuoteFooterNotes';
export { QuoteTermsAndConditions } from './QuoteTermsAndConditions';
export { QuoteActionButtons } from './QuoteActionButtons';