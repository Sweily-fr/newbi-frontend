// Définition de l'interface Item pour éviter les problèmes d'importation
interface Item {
  description?: string;
  quantity?: number;
  unitPrice?: number;
  vatRate?: number;
  unit?: string;
  discount?: number;
  discountType?: "PERCENTAGE" | "FIXED";
  details?: string;
  vatExemptionText?: string;
}

/**
 * Hook pour calculer les totaux d'un devis avec une gestion précise de la TVA
 * Corrige le problème de calcul des totaux et de la TVA dans la prévisualisation
 */
export const useCalculateTotals = () => {
  /**
   * Calcule tous les totaux d'un devis en tenant compte des remises par ligne et globales
   * @param items Les éléments du devis
   * @param discount La remise globale
   * @param discountType Le type de remise (pourcentage ou montant fixe)
   * @returns Un objet contenant tous les totaux calculés
   */
  const calculateTotals = (
    items: Item[],
    discount: number = 0,
    discountType: "PERCENTAGE" | "FIXED" = "PERCENTAGE"
  ) => {
    // Valider les entrées
    const validItems = items?.filter(item => 
      item && 
      typeof item.quantity === 'number' && 
      typeof item.unitPrice === 'number'
    ) || [];
    
    let subtotal = 0;
    let totalVAT = 0;
    let totalWithoutVAT = 0;
    let totalWithVAT = 0;
    let totalDiscount = 0;
    
    // Objet pour suivre les montants par taux de TVA
    const vatDetails: Record<number, { rate: number; amount: number; baseAmount: number }> = {};

    // Calculer les totaux pour chaque élément
    validItems.forEach((item) => {
      const quantity = item.quantity || 0;
      const unitPrice = item.unitPrice || 0;
      const vatRate = item.vatRate || 0;
      const itemDiscount = item.discount || 0;
      const itemDiscountType = item.discountType || "PERCENTAGE";

      // Calculer le montant avant remise
      const itemTotal = quantity * unitPrice;
      subtotal += itemTotal;

      // Appliquer la remise sur l'élément
      let itemDiscountAmount = 0;
      if (itemDiscount > 0) {
        if (itemDiscountType === "PERCENTAGE") {
          itemDiscountAmount = itemTotal * (itemDiscount / 100);
        } else {
          itemDiscountAmount = Math.min(itemTotal, itemDiscount);
        }
        totalDiscount += itemDiscountAmount;
      }

      // Montant HT après remise sur l'élément
      const itemTotalAfterDiscount = Math.max(0, itemTotal - itemDiscountAmount);

      // Initialiser l'entrée pour ce taux de TVA si elle n'existe pas encore
      if (!vatDetails[vatRate]) {
        vatDetails[vatRate] = {
          rate: vatRate,
          amount: 0,
          baseAmount: 0,
        };
      }

      // Ajouter le montant HT après remise à la base imposable pour ce taux
      vatDetails[vatRate].baseAmount += itemTotalAfterDiscount;
    });

    // Calculer la remise globale
    let globalDiscountAmount = 0;
    const baseAfterItemDiscounts = Math.max(0, subtotal - totalDiscount);

    if (discount > 0 && baseAfterItemDiscounts > 0) {
      if (discountType === "PERCENTAGE") {
        globalDiscountAmount = baseAfterItemDiscounts * (discount / 100);
      } else {
        globalDiscountAmount = Math.min(baseAfterItemDiscounts, discount);
      }
      totalDiscount += globalDiscountAmount;
    }

    // Calculer le total HT après toutes les remises
    totalWithoutVAT = Math.max(0, subtotal - totalDiscount);

    // Appliquer la remise globale proportionnellement à chaque base de TVA
    if (globalDiscountAmount > 0 && baseAfterItemDiscounts > 0) {
      const discountRatio = globalDiscountAmount / baseAfterItemDiscounts;
      
      // Ajuster les bases de TVA en fonction de la remise globale
      Object.keys(vatDetails).forEach((rateKey) => {
        const rate = Number(rateKey);
        const detail = vatDetails[rate];
        detail.baseAmount = Math.max(0, detail.baseAmount * (1 - discountRatio));
      });
    }

    // Calculer la TVA sur les bases ajustées
    Object.keys(vatDetails).forEach((rateKey) => {
      const rate = Number(rateKey);
      const detail = vatDetails[rate];
      detail.amount = Math.max(0, detail.baseAmount * (rate / 100));
      totalVAT += detail.amount;
    });

    // Calculer le total TTC
    totalWithVAT = totalWithoutVAT + totalVAT;

    // Vérification finale pour s'assurer que le TTC est toujours supérieur ou égal au HT
    if (totalVAT < 0 || totalWithVAT < totalWithoutVAT) {
      // Recalculer la TVA correctement
      totalVAT = Math.max(0, totalVAT);
      totalWithVAT = totalWithoutVAT + totalVAT;
    }

    // Convertir l'objet vatDetails en tableau trié par taux
    const vatRates = Object.values(vatDetails)
      .filter(detail => detail.baseAmount > 0)
      .sort((a, b) => a.rate - b.rate);

    return {
      subtotal,
      totalVAT,
      totalWithoutVAT,
      totalWithVAT,
      totalDiscount,
      vatRates,
    };
  };

  return { calculateTotals };
};
