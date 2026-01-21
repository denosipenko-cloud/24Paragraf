
export interface PriceBreakdown {
  basePrice: number;
  familyMultiplier: number;
  familyAddon: number;
  totalCredits: number;
  finalTotal: number;
  appliedCredits: Array<{ name: string; amount: number }>;
}

/**
 * Сервис для расчета стоимости юридических пакетов
 */
export const PriceService = {
  // Номинальные цены пакетов
  PRICES: {
    1: 249,
    2: 649,
    3: 949,
    4: 1999
  },

  /**
   * Рассчитывает вклад конкретного пакета в зачет в зависимости от контекста
   * @param pkgId ID пакета для зачета
   * @param allSelectedIds Все выбранные для зачета пакеты
   */
  getPackageContribution(pkgId: number, allSelectedIds: number[]): number {
    if (pkgId === 1) return this.PRICES[1]; // Всегда 249
    
    if (pkgId === 2) return this.PRICES[2] - this.PRICES[1]; // Всегда 400
    
    if (pkgId === 3) {
      // Если P2 тоже оплачен, доплата за P3 составила 300
      if (allSelectedIds.includes(2)) {
        return this.PRICES[3] - this.PRICES[2]; // 300
      }
      // Если P2 НЕ оплачен, доплата за P3 (сразу после P1) составила 700
      return this.PRICES[3] - this.PRICES[1]; // 700
    }
    
    return 0;
  },

  /**
   * Рассчитывает финальную стоимость пакета
   * @param basePrice Базовая цена выбранного пакета
   * @param extraMembers Количество доп. членов семьи (супруг + дети)
   * @param activeCredits Список ID пакетов, выбранных для зачета
   */
  calculatePrice(
    basePrice: number, 
    extraMembers: number, 
    activeCredits: number[]
  ): PriceBreakdown {
    let multiplier = 1.0;

    if (extraMembers > 0) {
      // Семейный формат включает до 2 членов семьи за +50%
      multiplier = 1.5;
      
      // За каждого последующего (сверх двух) еще +50%
      if (extraMembers > 2) {
        multiplier += (extraMembers - 2) * 0.5;
      }
    }

    const priceWithFamily = Math.round(basePrice * multiplier);
    const familyAddon = priceWithFamily - basePrice;
    
    // Суммируем вклады выбранных пакетов
    const appliedCredits: Array<{ name: string; amount: number }> = [];
    let totalCredits = 0;
    
    // Сортируем чтобы расчет P3 корректно видел наличие P2
    const sortedCredits = [...activeCredits].sort((a, b) => a - b);
    
    sortedCredits.forEach((id) => {
      const contribution = this.getPackageContribution(id, sortedCredits);
      totalCredits += contribution;
      appliedCredits.push({ name: `№${id}`, amount: contribution });
    });

    const finalTotal = Math.max(0, priceWithFamily - totalCredits);

    return {
      basePrice,
      familyMultiplier: multiplier,
      familyAddon,
      totalCredits,
      finalTotal,
      appliedCredits
    };
  }
};
