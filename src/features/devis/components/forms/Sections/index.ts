// Réutiliser les composants des factures pour les sections communes
export { ClientSelection } from '../../../../factures/components/forms/Sections/ClientSelection';
export { InvoiceItems as QuoteItems } from '../../../../factures/components/forms/Sections/InvoiceItems';
export { InvoiceDiscountAndTotals as QuoteDiscountAndTotals } from '../../../../factures/components/forms/Sections/InvoiceDiscountAndTotals';
export { InvoiceCompanyInfo as QuoteCompanyInfo } from '../../../../factures/components/forms/Sections/InvoiceCompanyInfo';
export { InvoiceBankDetails as QuoteBankDetails } from '../../../../factures/components/forms/Sections/InvoiceBankDetails';

// Composants spécifiques aux devis
export { QuoteGeneralInfo } from './QuoteGeneralInfo';
export { QuoteFooterNotes } from './QuoteFooterNotes';
export { QuoteTermsAndConditions } from './QuoteTermsAndConditions';
export { QuoteActionButtons } from './QuoteActionButtons';