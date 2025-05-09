// Réutiliser les composants des factures pour les sections communes
export { ClientSelection } from '../../../../features/factures/components/forms/Sections/ClientSelection';
export { InvoiceItems as QuoteItems } from '../../../../features/factures/components/forms/Sections/InvoiceItems';
export { InvoiceDiscountAndTotals as QuoteDiscountAndTotals } from '../../../../features/factures/components/forms/Sections/InvoiceDiscountAndTotals';
export { InvoiceCompanyInfo as QuoteCompanyInfo } from '../../../../features/factures/components/forms/Sections/InvoiceCompanyInfo';
export { InvoiceBankDetails as QuoteBankDetails } from '../../../../features/factures/components/forms/Sections/InvoiceBankDetails';
export { InvoiceCustomFields as QuoteCustomFields } from '../../../../features/factures/components/forms/Sections/InvoiceDiscountAndTotals';

// Composants spécifiques aux devis
export { QuoteGeneralInfo } from './QuoteGeneralInfo';
export { QuoteFooterNotes } from './QuoteFooterNotes';
export { QuoteTermsAndConditions } from './QuoteTermsAndConditions';
export { QuoteActionButtons } from './QuoteActionButtons';