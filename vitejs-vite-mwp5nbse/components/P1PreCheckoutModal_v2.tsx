import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { createClient } from '@supabase/supabase-js';

// --- 1. НАСТРОЙКИ ---
const SUPABASE_URL = 'https://fbabhnqutznukysleqqt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_sr3PYRr1OpcbXBSxcQgnmQ_f4uXjLoJ';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- ЦЕНА ---
const PACKAGE_PRICE = 249.0;

// --- СПИСОК СТРАН (Priority + Alphabetical) ---
const COUNTRIES = [
  // ПРИОРИТЕТНЫЕ
  { code: 'UA', name: 'Ukraine', dial: '+380', flag: '🇺🇦' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },

  // ОСТАЛЬНЫЕ (Европа + Мир с диаспорами)
  { code: 'AT', name: 'Austria', dial: '+43', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', dial: '+32', flag: '🇧🇪' },
  { code: 'BG', name: 'Bulgaria', dial: '+359', flag: '🇧🇬' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'HR', name: 'Croatia', dial: '+385', flag: '🇭🇷' },
  { code: 'CY', name: 'Cyprus', dial: '+357', flag: '🇨🇾' },
  { code: 'CZ', name: 'Czech Republic', dial: '+420', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', dial: '+45', flag: '🇩🇰' },
  { code: 'EE', name: 'Estonia', dial: '+372', flag: '🇪🇪' },
  { code: 'FI', name: 'Finland', dial: '+358', flag: '🇫🇮' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'GE', name: 'Georgia', dial: '+995', flag: '🇬🇪' },
  { code: 'GR', name: 'Greece', dial: '+30', flag: '🇬🇷' },
  { code: 'HU', name: 'Hungary', dial: '+36', flag: '🇭🇺' },
  { code: 'IS', name: 'Iceland', dial: '+354', flag: '🇮🇸' },
  { code: 'IE', name: 'Ireland', dial: '+353', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', dial: '+972', flag: '🇮🇱' },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹' },
  { code: 'KZ', name: 'Kazakhstan', dial: '+7', flag: '🇰🇿' },
  { code: 'LV', name: 'Latvia', dial: '+371', flag: '🇱🇻' },
  { code: 'LT', name: 'Lithuania', dial: '+370', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxembourg', dial: '+352', flag: '🇱🇺' },
  { code: 'MD', name: 'Moldova', dial: '+373', flag: '🇲🇩' },
  { code: 'ME', name: 'Montenegro', dial: '+382', flag: '🇲🇪' },
  { code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { code: 'NO', name: 'Norway', dial: '+47', flag: '🇳🇴' },
  { code: 'PL', name: 'Poland', dial: '+48', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
  { code: 'RO', name: 'Romania', dial: '+40', flag: '🇷🇴' },
  { code: 'RS', name: 'Serbia', dial: '+381', flag: '🇷🇸' },
  { code: 'SK', name: 'Slovakia', dial: '+421', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenia', dial: '+386', flag: '🇸🇮' },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'SE', name: 'Sweden', dial: '+46', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', dial: '+41', flag: '🇨🇭' },
  { code: 'TR', name: 'Turkey', dial: '+90', flag: '🇹🇷' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'US', name: 'USA', dial: '+1', flag: '🇺🇸' },
];

interface P1PreCheckoutModalProps {
  onClose: () => void;
  onProceed: (amount: number, name: string) => void;
}

// --- 2. БАЗА ТЕКСТОВ ---
const modalContent = {
  ru: {
    title: 'ОФОРМЛЕНИЕ ЗАКАЗА',
    subtitle: 'ПАКЕТ №1 «СТАРТОВЫЙ»',
    placeholders: {
      name: 'ИМЯ *',
      name_ph: 'Имя',
      surname: 'ФАМИЛИЯ *',
      surname_ph: 'Фамилия',
      email: 'EMAIL *',
      email_ph: 'email@example.com',
      phone: 'ТЕЛЕФОН *',
      phone_ph: '123 456 789',
    },
    price_label: 'СТОИМОСТЬ УСЛУГИ:',
    price_value: '249.00 €',
    mandatory_hint: '* Поля, отмеченные звёздочкой, обязательны',
    data_consent:
      'Я подтверждаю достоверность введенных данных и даю согласие на их обработку в соответствии с политикой конфиденциальности.',
    terms_consent:
      'Я понимаю, что пакет №1 является стартовой оценкой и не включает сопровождение или судебное представительство.',
    button: 'ОПЛАТИТЬ КАРТОЙ',
    loading: 'СОЗДАНИЕ ЗАКАЗА...',
    features: [
      'Индивидуальная правовая оценка',
      'Стратегия перехода и план действий',
      'Анализ параграфов',
      'Оценка шансов на успех',
    ],
    secure_badge: 'SSL Secure Payment',
  },
  de: {
    title: 'BESTELLUNG',
    subtitle: 'PAKET №1 «START»',
    placeholders: {
      name: 'VORNAME *',
      name_ph: 'Vorname',
      surname: 'NACHNAME *',
      surname_ph: 'Nachname',
      email: 'E-MAIL *',
      email_ph: 'email@example.com',
      phone: 'TELEFON *',
      phone_ph: '123 456 789',
    },
    price_label: 'PREIS:',
    price_value: '249.00 €',
    mandatory_hint: '* Pflichtfelder',
    data_consent:
      'Ich bestätige die Richtigkeit der Daten und stimme der Verarbeitung gemäß der Datenschutzerklärung zu.',
    terms_consent:
      'Ich verstehe, dass Paket Nr. 1 eine Ersteinschätzung ist und keine Begleitung oder gerichtliche Vertretung beinhaltet.',
    button: 'MIT KARTE BEZAHLEN',
    loading: 'BESTELLUNG WIRD ERSTELLT...',
    features: [
      'Individuelle rechtliche Einschätzung',
      'Strategie & Fahrplan',
      'Analyse der Paragraphen',
      'Prüfung der Erfolgsaussichten',
    ],
    secure_badge: 'SSL Secure Payment',
  },
  ua: {
    title: 'ОФОРМЛЕННЯ ЗАМОВЛЕННЯ',
    subtitle: 'ПАКЕТ №1 «СТАРТОВИЙ»',
    placeholders: {
      name: "ІМ'Я *",
      name_ph: "Ім'я",
      surname: 'ПРІЗВИЩЕ *',
      surname_ph: 'Прізвище',
      email: 'EMAIL *',
      email_ph: 'email@example.com',
      phone: 'ТЕЛЕФОН *',
      phone_ph: '123 456 789',
    },
    price_label: 'ВАРТІСТЬ ПОСЛУГИ:',
    price_value: '249.00 €',
    mandatory_hint: "* Поля, позначені зірочкою, є обов'язковими",
    data_consent:
      'Я підтверджую достовірність введених даних та даю згоду на їх обробку відповідно до політики конфіденційності.',
    terms_consent:
      'Я розумію, що пакет №1 є стартовою оцінкою і не включає супровід або судове представництво.',
    button: 'СПЛАТИТИ КАРТКОЮ',
    loading: 'СТВОРЕННЯ ЗАМОВЛЕННЯ...',
    features: [
      'Індивідуальна правова оцінка',
      'Стратегія переходу',
      'Аналіз параграфів',
      'Оцінка шансів',
    ],
    secure_badge: 'SSL Secure Payment',
  },
};

export const P1PreCheckoutModal_v2: React.FC<P1PreCheckoutModalProps> = ({
  onClose,
}) => {
  const { language } = useLanguage();
  const t = (modalContent as any)[language] || modalContent.ru;

  // State
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
  });

  // State для стран (По умолчанию Украина, раз мы ориентируемся на них, или Германия)
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие дропдауна при клике вне его
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  const [isDataConsent, setIsDataConsent] = useState(false);
  const [isTermsConsent, setIsTermsConsent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const isNameValid = formData.name.trim().length > 1;
  const isSurnameValid = formData.surname.trim().length > 1;
  const isEmailValid = formData.email.includes('@');
  // Простая валидация номера (цифры)
  const isPhoneValid = formData.phone.replace(/\D/g, '').length > 5;
  const isFormValid =
    isNameValid &&
    isSurnameValid &&
    isEmailValid &&
    isPhoneValid &&
    isDataConsent &&
    isTermsConsent;

  const inputClass = (valid: boolean, value: string) => {
    const isNotEmpty = value.trim().length > 0;
    let base =
      'w-full border rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 transition-all text-sm font-medium';

    if (showValidationErrors && !valid) {
      return `${base} border-red-500 bg-red-50 focus:ring-red-100 placeholder-red-300`;
    }
    if (valid && isNotEmpty) {
      return `${base} border-emerald-500 bg-emerald-50/30 focus:ring-emerald-100`;
    }
    return `${base} border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-900`;
  };

  const handleSubmit = async () => {
    setServerError(null);

    if (!isFormValid) {
      setShowValidationErrors(true);
      return;
    }

    setIsProcessing(true);

    const amount = PACKAGE_PRICE;
    const packageName = 'Package #1 (Start)';
    const fullName = `${formData.name} ${formData.surname}`.trim();
    const emailLower = formData.email.toLowerCase().trim();

    // Формируем полный номер телефона с кодом страны
    const fullPhone = `${selectedCountry.dial} ${formData.phone}`;

    try {
      // 1. Сохраняем клиента
      const { error: clientError } = await supabase.from('clients').upsert(
        {
          email: emailLower,
          full_name: fullName,
          phone: fullPhone,
          payment_amount: amount,
          last_attempt_at: new Date().toISOString(),
          p1_status: 'PENDING_PAYMENT',
        },
        { onConflict: 'email' }
      );

      if (clientError) throw clientError;

      // 2. Создаем заказ
      const { error: orderError } = await supabase.from('orders').insert({
        client_email: emailLower,
        amount: amount,
        package_name: packageName,
        order_details: {
          package: packageName,
          customer: fullName,
          phone: fullPhone,
          country: selectedCountry.name,
          date: new Date().toISOString(),
        },
      });

      if (orderError) console.error('Order create error:', orderError);

      // 3. Вызываем Stripe
      const payload = {
        amount: amount,
        email: emailLower,
        productName: packageName,
        description: `Клиент: ${fullName}. Тел: ${fullPhone}`,
        metadata: {
          packageId: 'p1',
          clientName: fullName,
        },
      };

      const response = await fetch(
        'https://fbabhnqutznukysleqqt.supabase.co/functions/v1/create-checkout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Ошибка создания ссылки.');
      }
    } catch (error: any) {
      console.error(error);
      setServerError('Ошибка соединения. Попробуйте еще раз.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white w-full max-w-[520px] h-full sm:h-auto sm:rounded-[24px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 flex flex-col max-h-screen sm:max-h-[95vh]">
        {/* Header */}
        <div className="p-6 lg:p-8 pb-4 flex items-start justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-900 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-[14px] lg:text-[16px] font-black text-slate-900 uppercase tracking-tight">
                {t.title}
              </h3>
              <p className="text-[11px] text-blue-900 font-bold uppercase tracking-widest mt-1">
                {t.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 lg:p-8 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                {t.placeholders.name}
              </label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={inputClass(isNameValid, formData.name)}
                placeholder={t.placeholders.name_ph}
              />
            </div>
            <div className="relative">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                {t.placeholders.surname}
              </label>
              <input
                value={formData.surname}
                onChange={(e) =>
                  setFormData({ ...formData, surname: e.target.value })
                }
                className={inputClass(isSurnameValid, formData.surname)}
                placeholder={t.placeholders.surname_ph}
              />
            </div>
            <div className="relative">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                {t.placeholders.email}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={inputClass(isEmailValid, formData.email)}
                placeholder={t.placeholders.email_ph}
              />
            </div>

            {/* ТЕЛЕФОН С ВЫБОРОМ СТРАНЫ */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                {t.placeholders.phone}
              </label>
              <div className="relative flex">
                {/* Кнопка выбора страны */}
                <button
                  type="button"
                  onClick={() =>
                    setIsCountryDropdownOpen(!isCountryDropdownOpen)
                  }
                  className={`flex items-center gap-2 px-3 border-y border-l rounded-l-xl bg-slate-50 hover:bg-slate-100 transition-colors ${
                    showValidationErrors && !isPhoneValid
                      ? 'border-red-500'
                      : 'border-slate-200'
                  }`}
                >
                  <span className="text-xl leading-none">
                    {selectedCountry.flag}
                  </span>
                  <ChevronDown size={12} className="text-slate-400" />
                </button>

                {/* Код страны (нередактируемый) + Ввод номера */}
                <div
                  className={`flex-1 flex items-center border rounded-r-xl bg-white border-l-0 ${
                    showValidationErrors && !isPhoneValid
                      ? 'border-red-500 bg-red-50'
                      : formData.phone.length > 5
                      ? 'border-emerald-500 bg-emerald-50/30'
                      : 'border-slate-200 focus-within:border-blue-900 focus-within:ring-2'
                  }`}
                >
                  <span className="pl-3 text-sm font-bold text-slate-500 select-none">
                    {selectedCountry.dial}
                  </span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value.replace(/[^0-9\s]/g, ''),
                      })
                    }
                    className="w-full py-3.5 pl-2 pr-4 bg-transparent focus:outline-none text-sm font-medium"
                    placeholder={t.placeholders.phone_ph}
                  />
                </div>

                {/* Выпадающий список стран (Аккордеон) */}
                {isCountryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setSelectedCountry(c);
                          setIsCountryDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left border-b border-slate-50 last:border-0"
                      >
                        <span className="text-2xl">{c.flag}</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900">
                            {c.name}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {c.dial}
                          </span>
                        </div>
                        {selectedCountry.code === c.code && (
                          <Check size={14} className="ml-auto text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2">
            <label
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                isDataConsent
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-slate-50 border-slate-100 hover:border-slate-200'
              } ${
                showValidationErrors && !isDataConsent
                  ? 'border-red-500 bg-red-50 animate-pulse'
                  : ''
              }`}
            >
              <input
                type="checkbox"
                checked={isDataConsent}
                onChange={(e) => setIsDataConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-blue-900 shrink-0"
              />
              <span className="text-[10px] lg:text-[11px] font-medium text-slate-600 leading-snug">
                {t.data_consent}
              </span>
            </label>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <ul className="space-y-3 mb-4">
              {t.features.map((feat, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-xs font-medium text-slate-600"
                >
                  <div className="mt-0.5 p-0.5 bg-blue-100 rounded-full shrink-0 text-blue-600">
                    <Check size={10} strokeWidth={4} />
                  </div>
                  {feat}
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                {t.price_label}
              </span>
              <span className="text-2xl font-black text-blue-900">
                {t.price_value}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                isTermsConsent
                  ? 'bg-blue-50 border-blue-900 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-blue-200'
              } ${
                showValidationErrors && !isTermsConsent
                  ? 'border-red-500 bg-red-50 animate-pulse'
                  : ''
              }`}
            >
              <input
                type="checkbox"
                checked={isTermsConsent}
                onChange={(e) => setIsTermsConsent(e.target.checked)}
                className="mt-1 w-5 h-5 rounded text-blue-900 shrink-0"
              />
              <span className="text-[11px] lg:text-[12px] font-bold text-slate-700 leading-snug">
                {t.terms_consent}
              </span>
            </label>
          </div>

          <p className="text-[10px] text-slate-400 font-medium text-center">
            {t.mandatory_hint}
          </p>

          {serverError && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs font-medium">{serverError}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className={`w-full h-14 rounded-full font-black text-[13px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all ${
              isFormValid
                ? 'bg-blue-900 text-white active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {t.loading}
              </>
            ) : (
              <>
                {t.button} <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 opacity-50 pb-2">
            <CreditCard size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Stripe Payments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
