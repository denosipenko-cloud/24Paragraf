import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, Loader2, User, ExternalLink, Receipt, Minus, Plus, Users, Baby } from 'lucide-react';
import { PaymentService } from '../services/PaymentService';
import { useLanguage } from '../LanguageContext';

interface PaymentModalProps {
  onClose: () => void;
  packageName?: string;
  amount?: number;
}

// --- 1. ЛОКАЛИЗАЦИЯ И СКЛОНЕНИЯ ---
const translations = {
  ru: {
    title: "ОПЛАТА ЗАКАЗА",
    subtitle: "Безопасный шлюз Stripe",
    receipt: {
      title: "ДЕТАЛИ ЗАКАЗА",
      base: "Базовая стоимость",
      family_label: "Семейный тариф", // Динамически добавим состав
      family_extra: "Доп. участники",
      credit: "Зачет оплаты",
      total: "ИТОГО К ОПЛАТЕ",
      spouse: "Супруг",
      child: "ребенок",
      children: "детей"
    },
    payer: "ПЛАТЕЛЬЩИК",
    security: "Оплата производится на защищенной странице Stripe. Мы не храним данные вашей карты.",
    button: "ПЕРЕЙТИ К ОПЛАТЕ",
    footer: "Нажимая кнопку, вы соглашаетесь с условиями сервиса и перенаправляетесь на внешний шлюз.",
    success: { title: "ЗАКАЗ ОФОРМЛЕН", text: "Переход на страницу оплаты Stripe..." }
  },
  de: {
    title: "BESTELLUNG BEZAHLEN",
    subtitle: "Sicheres Stripe-Gateway",
    receipt: {
      title: "BESTELLDETAILS",
      base: "Basispreis",
      family_label: "Familientarif",
      family_extra: "Zusätzliche Teilnehmer",
      credit: "Anrechnung",
      total: "GESAMTSUMME",
      spouse: "Partner",
      child: "Kind",
      children: "Kinder"
    },
    payer: "ZAHLER",
    security: "Die Zahlung erfolgt über die sichere Seite von Stripe. Wir speichern keine Kartendaten.",
    button: "ZUR ZAHLUNG",
    footer: "Mit dem Klick stimmen Sie den AGB zu und werden zum Zahlungs-Gateway weitergeleitet.",
    success: { title: "BESTELLUNG ERFOLGREICH", text: "Weiterleitung zu Stripe..." }
  },
  ua: {
    title: "ОПЛАТА ЗАМОВЛЕННЯ",
    subtitle: "Безпечний шлюз Stripe",
    receipt: {
      title: "ДЕТАЛІ ЗАМОВЛЕННЯ",
      base: "Базова вартість",
      family_label: "Сімейний тариф",
      family_extra: "Дод. учасники",
      credit: "Зарахування оплати",
      total: "РАЗОМ ДО СПЛАТИ",
      spouse: "Чоловік/Дружина",
      child: "дитина",
      children: "дітей"
    },
    payer: "ПЛАТНИК",
    security: "Оплата здійснюється на захищеній сторінці Stripe. Ми не зберігаємо дані вашої картки.",
    button: "ПЕРЕЙТИ ДО ОПЛАТИ",
    footer: "Натискаючи кнопку, ви погоджуєтесь з умовами сервісу та переходите на зовнішній шлюз.",
    success: { title: "ЗАМОВЛЕННЯ ОФОРМЛЕНО", text: "Перехід на сторінку оплати Stripe..." }
  }
};

export const PaymentModal: React.FC<PaymentModalProps> = ({ 
  onClose, 
  packageName = "Пакет", 
  amount = 0
}) => {
  const { language } = useLanguage();
  const t = (translations as any)[language] || translations.ru;

  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [email, setEmail] = useState('');
  const [snapshot, setSnapshot] = useState<any>(null);
  
  useEffect(() => {
    const savedEmail = localStorage.getItem('customerEmail');
    if (savedEmail) setEmail(savedEmail);
    const savedSnapshot = PaymentService.getOrderSnapshot();
    if (savedSnapshot) setSnapshot(savedSnapshot);
  }, []);
  
  const handleStripeRedirect = async () => {
    setStatus('processing');
    try {
      const orderData = snapshot || {
        package_name: packageName,
        final_price: amount,
        currency: "EUR",
        created_at: new Date().toISOString()
      };
      await PaymentService.processStripePayment(email, amount, orderData);
      setStatus('success');
      PaymentService.clearOrderSnapshot();
    } catch (error) {
      console.error("Payment error", error);
      setStatus('idle');
    }
  };

  // --- ЛОГИКА ОТОБРАЖЕНИЯ ЧЕКА ---
  const displayPackageName = snapshot?.package || packageName;
  const basePrice = snapshot?.base_price || amount;
  const displayTotal = snapshot?.final_total || amount;
  
  // Разбираем семью
  const familyConfig = snapshot?.family_config || {};
  const isFamilyActive = familyConfig.active;
  const spouseCount = familyConfig.spouse || 0;
  const childrenCount = familyConfig.children || 0;
  const extraMembersCost = familyConfig.extra_members_cost || 0;
  
  // Стоимость семейного тарифа (всегда 50% от базы, если включен)
  const familyTariffCost = basePrice * 0.5;

  // Формируем строку состава семьи: "Супруг + 2 детей"
  const getFamilyString = () => {
    const parts = [];
    if (spouseCount > 0) parts.push(t.receipt.spouse);
    if (childrenCount > 0) {
      // Простая логика склонения для примера (можно усложнить)
      const childLabel = childrenCount === 1 ? t.receipt.child : t.receipt.children;
      parts.push(`${childrenCount} ${childLabel}`);
    }
    if (parts.length === 0) return ""; // Если включил тариф, но никого не выбрал (редкий кейс)
    return `(${parts.join(" + ")})`;
  };

  const familyCompositionString = getFamilyString();
  const credits = snapshot?.credits_applied || [];

  // --- РЕНДЕР ---
  if (status === 'success') {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative bg-white rounded-[24px] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
           <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
           </div>
           <h3 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tight">{t.success.title}</h3>
           <p className="text-slate-600 mb-2 font-medium text-sm">{t.success.text}</p>
           <div className="mt-6 flex justify-center">
             <Loader2 className="animate-spin text-blue-900" size={24} />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-[480px] sm:rounded-[24px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 flex flex-col max-h-[95vh] sm:max-h-none overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-slate-50 sticky top-0 bg-white z-20">
          <div>
            <h1 className="text-xl font-black text-blue-900 uppercase tracking-tight">{t.title}</h1>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">{t.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose}><X size={24} className="text-slate-400 hover:text-slate-900" /></button>
        </div>

        <div className="p-6 lg:p-8 space-y-6">
          
          {/* === ДЕТАЛИЗАЦИЯ ЧЕКА === */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <Receipt className="absolute -top-3 -right-3 text-slate-100 w-24 h-24 -rotate-12" />

            <div className="relative z-10">
                <div className="mb-4 pb-3 border-b border-slate-200/60">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.receipt.title}</span>
                    <span className="text-sm font-bold text-slate-800 leading-tight">{displayPackageName}</span>
                </div>

                <div className="space-y-2.5 text-sm">
                    {/* 1. БАЗОВАЯ ЦЕНА */}
                    <div className="flex justify-between text-slate-600">
                        <span className="font-medium">{t.receipt.base}</span>
                        <span className="font-bold text-slate-800">{Number(basePrice).toFixed(2)} €</span>
                    </div>

                    {/* 2. СЕМЕЙНЫЙ ТАРИФ (Если включен) */}
                    {isFamilyActive && (
                        <div className="flex justify-between text-blue-700 bg-blue-50/60 p-2 rounded-lg -mx-2">
                            <div className="flex flex-col">
                                <span className="font-bold flex items-center gap-1.5">
                                    <Users size={14} className="text-blue-600" />
                                    {t.receipt.family_label}
                                </span>
                                {familyCompositionString && (
                                    <span className="text-[11px] text-blue-600/80 font-medium pl-5">
                                        {familyCompositionString}
                                    </span>
                                )}
                            </div>
                            <span className="font-bold text-blue-800">+{familyTariffCost.toFixed(2)} €</span>
                        </div>
                    )}

                    {/* 3. ДОП. УЧАСТНИКИ (Если есть переплата) */}
                    {extraMembersCost > 0 && (
                        <div className="flex justify-between text-slate-600 pl-2 border-l-2 border-slate-200">
                            <span className="flex items-center gap-1.5">
                                <Plus size={12} className="text-slate-400" /> 
                                {t.receipt.family_extra}
                            </span>
                            <span className="font-bold">+{extraMembersCost.toFixed(2)} €</span>
                        </div>
                    )}

                    {/* 4. СКИДКИ (КРЕДИТЫ) */}
                    {credits.map((credit: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-emerald-600 font-medium pt-1">
                            <span className="flex items-center gap-1.5"><Minus size={12}/> {t.receipt.credit} {credit.description ? `(${credit.description})` : ''}</span>
                            <span className="font-bold">−{credit.amount.toFixed(2)} €</span>
                        </div>
                    ))}
                </div>

                {/* ИТОГО */}
                <div className="mt-5 pt-3 border-t-2 border-slate-200 border-dashed flex justify-between items-end">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest pb-1">{t.receipt.total}</span>
                    <span className="text-3xl font-black text-blue-900 tracking-tight">{Number(displayTotal).toFixed(2)} €</span>
                </div>
            </div>
          </div>

          {/* Плательщик */}
          {email && (
            <div className="flex items-center gap-3 px-2 py-1">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <User size={16} />
                </div>
                <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.payer}</span>
                    <span className="block text-xs font-bold text-slate-700">{email}</span>
                </div>
            </div>
          )}

          {/* Безопасность */}
          <div className="flex gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
             <ShieldCheck size={24} className="text-blue-600 shrink-0 mt-0.5" />
             <div className="space-y-1">
                <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-wide">STRIPE SECURE</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                   {t.security}
                </p>
             </div>
          </div>

          <button 
            onClick={handleStripeRedirect}
            disabled={status === 'processing'}
            className="w-full h-14 bg-[#635BFF] hover:bg-[#5851E1] text-white rounded-full font-bold text-[13px] uppercase tracking-widest shadow-xl shadow-indigo-200/50 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            {status === 'processing' ? <Loader2 size={22} className="animate-spin" /> : <>{t.button} <ExternalLink size={18} /></>}
          </button>

          <div className="space-y-3 pb-2">
              <div className="flex justify-center gap-4 opacity-60 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5" />
                <div className="h-5 w-px bg-slate-300"></div>
                <div className="flex gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                </div>
              </div>
              <p className="text-[9px] text-slate-400 font-medium text-center px-4 leading-normal">
                {t.footer}
              </p>
          </div>

        </div>
      </div>
    </div>
  );
};