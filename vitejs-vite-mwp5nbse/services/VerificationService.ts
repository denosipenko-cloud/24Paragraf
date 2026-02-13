export const VerificationService = {
  generateCode: (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  sendCodeToEmail: async (email: string, code: string): Promise<boolean> => {
    // В тестовой версии просто выводим в консоль
    console.log(`%c[EMAIL STUB] Отправка кода ${code} на адрес ${email}`, 'color: #1e3a8a; font-weight: bold; border: 1px solid blue; padding: 4px;');
    return new Promise((resolve) => setTimeout(resolve, 800));
  }
};