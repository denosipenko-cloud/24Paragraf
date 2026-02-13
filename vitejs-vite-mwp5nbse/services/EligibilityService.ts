
// Типы ошибок верификации согласно сценариям
export type EligibilityStatus = 
  | 'eligible'           // Можно покупать
  | 'no_starter'         // Не куплен P1 (Сценарий 1)
  | 'negative_result'    // Анализ отрицательный (Сценарий 3)
  | 'incomplete_analysis'// Опросник не доделан (Сценарий 5)
  | 'email_not_found'    // Email не совпадает с P1 (Сценарий 6)
  | 'error';             // Техническая ошибка

export interface EligibilityCheck {
  status: EligibilityStatus;
  allowed: boolean;
  previouslyPaidAmount: number;
}

/**
 * Сервис для проверки юридической возможности покупки расширенных пакетов
 */
export const EligibilityService = {
  /**
   * Проверка клиента перед переходом к оплате
   * @param email Введенный пользователем email
   * @param targetPackageId ID пакета, который он хочет купить
   */
  async verifyBeforePurchase(email: string, targetPackageId: string): Promise<EligibilityCheck> {
    const lowerEmail = email.toLowerCase().trim();
    
    // В будущем здесь будет реальный запрос к Supabase:
    // 1. Проверка таблицы purchases на наличие P1 для этого email
    // 2. Проверка таблицы assessments на последний результат
    
    // ПРЕДВАРИТЕЛЬНАЯ МОК-ЛОГИКА (для тестирования интерфейса)
    console.log(`[Verification] Checking eligibility for: ${lowerEmail}`);
    
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Для демонстрации: если в email есть 'test', считаем что все ок
    if (lowerEmail.includes('test')) {
      return { status: 'eligible', allowed: true, previouslyPaidAmount: 249 };
    }
    
    // Если email пустой или явно неверный
    if (!lowerEmail.includes('@')) {
      return { status: 'email_not_found', allowed: false, previouslyPaidAmount: 0 };
    }

    // По умолчанию (пока не подключен Supabase) возвращаем 'no_starter'
    return { status: 'no_starter', allowed: false, previouslyPaidAmount: 0 };
  }
};
