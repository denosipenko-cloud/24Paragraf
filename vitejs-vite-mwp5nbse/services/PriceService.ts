
export interface PriceBreakdown {
  targetPackage: {
    id: number;
    name: string;
    basePrice: number;
  };
  appliedCredits: Array<{ name: string; amount: number }>;
  familyTariff: number;
  finalTotal: number;
}

/**
 * Сервис детерминированного ценообразования (Canonical Pricing Logic)
 */
export const PriceService = {
  PRICES: {
    1: 249.00,
    2: 649.00,
    3: 949.00,
    4: 1999.00
  },

  // Канонические значения зачётов (Credits)
  CREDIT_VALUES: {
    1: 124.50, // 50% от P1
    2: 649.00, // 100% от P2
    3: 949.00  // 100% от P3
  },

  calculateFamilyTariff(targetBasePrice: number, extraMembers: number): number {
    if (extraMembers <= 0) return 0;
    let tariff = targetBasePrice * 0.5;
    if (extraMembers > 2) {
      tariff += (extraMembers - 2) * (targetBasePrice * 0.5);
    }
    return tariff;
  },

  calculateUpgrade(
    targetPackageId: number,
    selectedCreditIds: number[],
    extraMembers: number
  ): PriceBreakdown {
    const targetBasePrice = this.PRICES[targetPackageId as keyof typeof this.PRICES];
    const targetName = `Пакет №${targetPackageId}`;

    let appliedCredits: Array<{ name: string; amount: number }> = [];
    let creditAmount = 0;

    // КАНОНИЧЕСКОЕ ПРАВИЛО: Применяется только один зачёт — самый «сильный» из выбранных
    // Иерархия силы: P3 > P2 > P1
    const validIds = selectedCreditIds.filter(id => id < targetPackageId);
    
    if (validIds.length > 0) {
      const bestCreditId = Math.max(...validIds);
      creditAmount = this.CREDIT_VALUES[bestCreditId as keyof typeof this.CREDIT_VALUES] || 0;
      
      appliedCredits = [{
        name: `Зачёт уровня Пакета №${bestCreditId}`,
        amount: creditAmount
      }];
    }

    const familyTariff = this.calculateFamilyTariff(targetBasePrice, extraMembers);
    
    // Итоговая сумма к оплате (Base - SingleCredit + Family)
    // НЕ МОЖЕТ БЫТЬ МЕНЬШЕ 0
    const finalTotal = Math.max(0, targetBasePrice - creditAmount + familyTariff);

    return {
      targetPackage: { id: targetPackageId, name: targetName, basePrice: targetBasePrice },
      appliedCredits,
      familyTariff,
      finalTotal
    };
  }
};
