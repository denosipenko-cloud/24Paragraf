export type AssessmentResult = 'positive' | 'negative' | null;

export const PaymentService = {
  saveEmail: (email: string) => localStorage.setItem('p24_email', email.toLowerCase()),
  getEmail: () => localStorage.getItem('p24_email'),
  
  saveAssessmentResult: (result: AssessmentResult) => {
    localStorage.setItem('p24_assessment_result', result || '');
    if (result === 'positive') {
      PaymentService.unlockPackages(['pkg2', 'pkg3']);
    }
  },
  
  getAssessmentResult: (): AssessmentResult => {
    const res = localStorage.getItem('p24_assessment_result');
    if (res === 'positive' || res === 'negative') return res as AssessmentResult;
    return null;
  },

  unlockPackages: (packages: string[]) => {
    const current = PaymentService.getUnlockedPackages();
    const updated = Array.from(new Set([...current, ...packages]));
    localStorage.setItem('p24_unlocked_packages', JSON.stringify(updated));
    // Trigger storage event for cross-tab or same-tab updates if needed
    window.dispatchEvent(new Event('storage'));
  },

  getUnlockedPackages: (): string[] => {
    const data = localStorage.getItem('p24_unlocked_packages');
    try {
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isPackageUnlocked: (pkgId: string): boolean => {
    return PaymentService.getUnlockedPackages().includes(pkgId);
  },

  reset: () => {
    localStorage.removeItem('p24_email');
    localStorage.removeItem('p24_assessment_result');
    localStorage.removeItem('p24_unlocked_packages');
  }
};