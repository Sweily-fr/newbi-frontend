import { SelectOption } from '../types/ui';

/**
 * Options pour les unités de mesure dans les formulaires de facture
 */
export const UNIT_OPTIONS: SelectOption[] = [
  { value: 'unité', label: 'unité' },
  { value: 'heure', label: 'heure' },
  { value: 'jour', label: 'jour' },
  { value: 'mois', label: 'mois' },
  { value: 'g', label: 'g - gramme' },
  { value: 'kg', label: 'kg - kilogramme' },
  { value: 'l', label: 'l - litre' },
  { value: 'm', label: 'm - mètre' },
  { value: 'm²', label: 'm² - mètre carré' },
  { value: 'm³', label: 'm³ - mètre cube' },
  { value: 'ampère', label: 'ampère' },
  { value: 'article', label: 'article' },
  { value: 'cm', label: 'cm - centimètre' },
  { value: 'm³/h', label: 'm³/h - mètre cube par heure' },
  { value: 'gigajoule', label: 'gigajoule' },
  { value: 'gigawatt', label: 'gigawatt' },
  { value: 'gigawattheure', label: 'gigawattheure' },
  { value: 'semestre', label: 'semestre' },
  { value: 'joule', label: 'joule' },
  { value: 'kilojoule', label: 'kilojoule' },
  { value: 'kilovar', label: 'kilovar' },
  { value: 'kilowatt', label: 'kilowatt' },
  { value: 'kilowattheure', label: 'kilowattheure' },
  { value: 'mégajoule', label: 'mégajoule' },
  { value: 'mégawatt', label: 'mégawatt' },
  { value: 'mégawattheure', label: 'mégawattheure' },
  { value: 'mg', label: 'mg - milligramme' },
  { value: 'ml', label: 'ml - millilitre' },
  { value: 'mm', label: 'mm - millimètre' },
  { value: 'minute', label: 'minute' },
  { value: 'paire', label: 'paire' },
  { value: 'trimestre', label: 'trimestre' },
  { value: 'seconde', label: 'seconde' },
  { value: 'ensemble', label: 'ensemble' },
  { value: 't', label: 't - tonne' },
  { value: 'deux semaines', label: 'deux semaines' },
  { value: 'wattheure', label: 'wattheure' },
  { value: 'semaine', label: 'semaine' },
  { value: 'année', label: 'année' }
];

/**
 * Options pour les taux de TVA dans les formulaires de facture
 */
export const VAT_RATE_OPTIONS: SelectOption[] = [
  { value: '20', label: '20%' },
  { value: '10', label: '10%' },
  { value: '5.5', label: '5.5%' },
  { value: '2.1', label: '2.1%' },
  { value: '0', label: '0%' }
];

/**
 * Options pour les types de remise dans les formulaires de facture
 */
export const DISCOUNT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'PERCENTAGE', label: 'Pourcentage (%)' },
  { value: 'FIXED', label: 'Montant fixe (€)' }
];

/**
 * Valeurs par défaut pour un nouvel article
 */
export const DEFAULT_ITEM = {
  description: '',
  quantity: 1,
  unitPrice: 0,
  vatRate: 20,
  unit: 'unité',
  discount: 0,
  discountType: 'FIXED'
};