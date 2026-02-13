import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  X,
  Minus,
  Plus,
  Gavel,
  Info,
  ArrowRight,
  Loader2,
  AlertCircle,
  ChevronDown,
  Check,
  CreditCard,
  File,
  Download,
} from 'lucide-react';
import { PriceService } from '../services/PriceService';
import { useLanguage } from '../LanguageContext';
import { createClient } from '@supabase/supabase-js';

// --- 1. НАСТРОЙКИ ---
const SUPABASE_URL = 'https://fbabhnqutznukysleqqt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_sr3PYRr1OpcbXBSxcQgnmQ_f4uXjLoJ';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const COUNTRIES = [
  { code: 'UA', name: 'Ukraine', dial: '+380', flag: '🇺🇦' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'AT', name: 'Austria', dial: '+43', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', dial: '+32', flag: '🇧🇪' },
  { code: 'BG', name: 'Bulgaria', dial: '+359', flag: '🇧🇬' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'CZ', name: 'Czech Republic', dial: '+420', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', dial: '+45', flag: '🇩🇰' },
  { code: 'EE', name: 'Estonia', dial: '+372', flag: '🇪🇪' },
  { code: 'FI', name: 'Finland', dial: '+358', flag: '🇫🇮' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'GE', name: 'Georgia', dial: '+995', flag: '🇬🇪' },
  { code: 'GR', name: 'Greece', dial: '+30', flag: '🇬🇷' },
  { code: 'HU', name: 'Hungary', dial: '+36', flag: '🇭🇺' },
  { code: 'IE', name: 'Ireland', dial: '+353', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', dial: '+972', flag: '🇮🇱' },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹' },
  { code: 'KZ', name: 'Kazakhstan', dial: '+7', flag: '🇰🇿' },
  { code: 'LV', name: 'Latvia', dial: '+371', flag: '🇱🇻' },
  { code: 'LT', name: 'Lithuania', dial: '+370', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxembourg', dial: '+352', flag: '🇱🇺' },
  { code: 'MD', name: 'Moldova', dial: '+373', flag: '🇲🇩' },
  { code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { code: 'NO', name: 'Norway', dial: '+47', flag: '🇳🇴' },
  { code: 'PL', name: 'Poland', dial: '+48', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
  { code: 'RO', name: 'Romania', dial: '+40', flag: '🇷🇴' },
  { code: 'SK', name: 'Slovakia', dial: '+421', flag: '🇸🇰' },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'SE', name: 'Sweden', dial: '+46', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', dial: '+41', flag: '🇨🇭' },
  { code: 'TR', name: 'Turkey', dial: '+90', flag: '🇹🇷' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'US', name: 'USA', dial: '+1', flag: '🇺🇸' },
];

const DOCS = {
  AGB: { title: 'AGB', content: 'Текст AGB...' },
  WIDERRUF: { title: 'Widerrufsbelehrung', content: 'Текст Widerrufsbelehrung...' },
  MANDAT: { title: 'Mandatsvereinbarung', content: 'Текст Mandatsvereinbarung...' },
  RVG: { title: 'Honorarvereinbarung', content: 'Текст Honorarvereinbarung...' },
  EXECUTION: { title: 'Sofortige Aufnahme der Tätigkeit', content: 'Текст поручения...' },
  PRIVACY: { title: 'Datenschutzerklärung', content: 'Текст политики...' },
};

interface LeadData {
  email: string;
  name: string;
  surname: string;
  phone: string;
  familyData: { spouse: number; children: number };
}

const registerAndCheckStatus = async (data: LeadData): Promise<{ status: string }> => {
  try {
    const normalizedEmail = data.email.toLowerCase().trim();
    const fullName = `${data.name} ${data.surname}`.trim();
    await supabase.from('clients').upsert({ email: normalizedEmail, full_name: fullName, phone: data.phone, family_data: data.familyData, last_attempt_at: new Date().toISOString() }, { onConflict: 'email' });
    const { data: clientRecord, error } = await supabase.from('clients').select('p1_status, diagnosis_result').eq('email', normalizedEmail).single();
    if (error || !clientRecord) return { status: 'NOT_FOUND' };
    const statusP1 = clientRecord.p1_status?.trim().toUpperCase() || '';
    const diagnosis = clientRecord.diagnosis_result?.trim().toUpperCase() || '';
    if (diagnosis === 'NEGATIVE') return { status: 'NEGATIVE' };
    if ((statusP1 === 'PURCHASED' || statusP1 === 'COMPLETED') && diagnosis === 'POSITIVE') return { status: 'POSITIVE' };
    if (statusP1 === 'PURCHASED' && diagnosis === 'PENDING') return { status: 'PENDING' };
    return { status: 'NOT_FOUND' };
  } catch (e) { return { status: 'ERROR' }; }
};

interface P4PreCheckoutModalProps {
  onClose: () => void;
  onProceed: (amount: number, name: string) => void;
}

const modalContent = {
  ru: {
    title: 'ОФОРМЛЕНИЕ ЗАКАЗА', subtitle: 'Пакет №4 «Премиум»',
    placeholders: { name: 'ИМЯ *', name_ph: 'Имя', surname: 'ФАМИЛИЯ *', surname_ph: 'Фамилия', email: 'EMAIL *', email_ph: 'email@example.com', phone: 'ТЕЛЕФОН *', phone_ph: '123 456 789' },
    mandatory_hint: '* Поля, отмеченные звёздочкой, обязательны для заполнения',
    family: { 
        title: 'СЕМЕЙНЫЙ ФОРМАТ', spouse: 'Супруг/Супруга', children: 'Дети', 
        info: 'Базовый семейный формат включает до 3 человек (основной заявитель + 2 участника). Каждый последующий участник увеличивает объём юридической работы и рассчитывается отдельно как доплата в сумме 50% от стоимости базового пакета.' 
    },
    credits: { title: 'РАНЕЕ ПРИОБРЕТЁННЫЕ ПАКЕТЫ (ЗАЧЁТ)', p1_label: 'Пакет №1 «Стартовый»', p2_label: 'Пакет №2 «Самостоятельный»', p3_label: 'Пакет №3 «Адвокатский»', p1_summary: 'Зачет уровня пакета №1 «Стартовый»', p2_summary: 'Зачет уровня пакета №2 «Самостоятельный»', p3_summary: 'Зачет уровня пакета №3 «Адвокатский»' },
    summary: { base: 'БАЗОВАЯ ЦЕНА ПАКЕТА №4', family_base: 'Базовый семейный формат (до 3 чел.)', family_extra: 'Доп. участники', person_short: 'чел.', family_total: 'Итого семейный тариф:', total: 'ИТОГО К ОПЛАТЕ' },
    offer_scope: 'Это предложение предназначено исключительно для потребителей в понимании § 13 BGB.',
    p1_precondition: 'Бронирование этого пакета возможно только при наличии положительного результата в рамках Пакета №1.',
    privacy_link: 'Политика конфиденциальности',
    button: 'ПРОВЕРИТЬ И ПРОДОЛЖИТЬ', loading: 'СОЗДАНИЕ ЗАКАЗА...', package_name_order: 'Пакет №4 «Премиум»',
    errors: { not_found: 'Обязательным условием для оформления данного заказа является наличие положительного заключения в рамках Пакета №1.', pending: 'Процедура оценки в рамках Пакета №1 еще не завершена.', negative: 'По данному Email наличие положительного результата оценки не подтверждено.', generic: 'Ошибка проверки статуса. Повторите попытку.' },
    btn_close: 'Закрыть', btn_download: 'Скачать PDF'
  },
  de: {
    title: 'BESTELLUNG', subtitle: 'Paket №4 «Premium»',
    placeholders: { name: 'VORNAME *', name_ph: 'Vorname', surname: 'NACHNAME *', surname_ph: 'Nachname', email: 'E-MAIL *', email_ph: 'email@example.com', phone: 'TELEFON *', phone_ph: '123 456 789' },
    mandatory_hint: '* Mit Sternchen markierte Felder sind Pflichtfelder',
    family: { 
        title: 'FAMILIENFORMAT', spouse: 'Ehepartner', children: 'Kinder', 
        info: 'Das Standard-Familienformat umfasst bis zu 3 Personen (Hauptantragsteller + 2 Teilnehmer). Jeder weitere Teilnehmer erhöht den juristischen Arbeitsaufwand und wird separat mit einem Aufschlag von 50 % des Basispaketpreises berechnet.' 
    },
    credits: { title: 'BEREITS ERWORBENE PAKETE (VERRECHNUNG)', p1_label: 'Paket №1 «Start»', p2_label: 'Paket №2 «Selbstständig»', p3_label: 'Paket №3 «Anwaltlich»', p1_summary: 'Anrechnung Paket-Level №1 «Start»', p2_summary: 'Anrechnung Paket-Level №2 «Selbstständig»', p3_summary: 'Anrechnung Paket-Level №3 «Anwaltlich»' },
    summary: { base: 'BASISPREIS PAKET №4', family_base: 'Standard-Familienformat (bis 3 Pers.)', family_extra: 'Zusätzliche Teilnehmer', person_short: 'Pers.', family_total: 'Summe Familientarif:', total: 'GESAMTSUMME' },
    offer_scope: 'Dieses Angebot richtet sich ausschließlich an Verbraucher im Sinne des § 13 BGB.',
    p1_precondition: 'Die Buchung dieses Pakets ist nur möglich, wenn im Rahmen von Paket 1 ein positives Ergebnis festgestellt wurde.',
    privacy_link: 'Datenschutzerklärung',
    button: 'PRÜFEN UND FORTFAHREN', loading: 'ERSTELLUNG...', package_name_order: 'Paket №4 «Premium»',
    errors: { not_found: 'Zwingende Voraussetzung für die Bestellung dieses Pakets ist ein positives Ergebnis im Rahmen von Paket Nr. 1.', pending: 'Das Verfahren der Ersteinschätzung ist noch nicht abgeschlossen.', negative: 'Für diese E-Mail konnte das Vorliegen eines positiven Ergebnisses nicht bestätigt werden.', generic: 'Fehler bei der Überprüfung. Bitte versuchen Sie es erneut.' },
    btn_close: 'Schließen', btn_download: 'Als PDF speichern'
  },
  ua: {
    title: 'ОФОРМЛЕННЯ ЗАМОВЛЕННЯ', subtitle: 'Пакет №4 «Преміум»',
    placeholders: { name: "ІМ'Я *", name_ph: "Ім'я", surname: 'ПРІЗВИЩЕ *', surname_ph: 'Прізвище', email: 'EMAIL *', email_ph: 'email@example.com', phone: 'ТЕЛЕФОН *', phone_ph: '123 456 789' },
    mandatory_hint: "* Поля, позначені зірочкою, є обов'язковими",
    family: { 
        title: 'СЕМЕЙНИЙ ФОРМАТ', spouse: 'Чоловік/Дружина', children: 'Діти', 
        info: 'Базовий сімейний формат включає до 3 осіб (основний заявник + 2 учасники). Кожен наступний учасник збільшує обсяг юридичної роботи та розраховується окремо як доплата у сумі 50% від вартості базового пакета.' 
    },
    credits: { title: 'РАНІШЕ ПРИДБАНІ ПАКЕТИ (ЗАРАХУВАННЯ)', p1_label: 'Пакет №1 «Стартовий»', p2_label: 'Пакет №2 «Самостійний»', p3_label: 'Пакет №3 «Адвокатський»', p1_summary: 'Зарахування рівня пакету №1 «Стартовий»', p2_summary: 'Зарахування рівня пакету №2 «Самостійний»', p3_summary: 'Зарахування рівня пакету №3 «Адвокатський»' },
    summary: { base: 'БАЗОВА ЦІНА ПАКЕТУ №4', family_base: 'Базовий сімейний формат (до 3 осіб)', family_extra: 'Дод. учасники', person_short: 'осіб', family_total: 'Разом сімейний тариф:', total: 'РАЗОМ ДО СПЛАТИ' },
    offer_scope: 'Ця пропозиція призначена виключно для споживачів у розумінні § 13 BGB.',
    p1_precondition: 'Бронювання цього пакета можливе лише за наявності позитивного результату в рамках Пакета №1.',
    privacy_link: 'Політика конфіденційності',
    button: 'ПЕРЕВІРИТИ ТА ПРОДОВЖИТИ', loading: 'СТВОРЕННЯ...', package_name_order: 'Пакет №4 «Преміум»',
    errors: { not_found: "Обов'язковою умовою для оформлення цього замовлення є наявність позитивного висновку в рамках Пакету №1.", pending: 'Процедура оцінки в рамках Пакету №1 ще не завершена.', negative: 'За даним Email наявність позитивного результату не підтверджена.', generic: 'Помилка перевірки. Спробуйте ще раз.' },
    btn_close: 'Закрити', btn_download: 'Завантажити PDF'
  },
};

export const P4PreCheckoutModal: React.FC<P4PreCheckoutModalProps> = ({ onClose, onProceed }) => {
  const { language } = useLanguage();
  const t = (modalContent as any)[language] || modalContent.ru;

  const [formData, setFormData] = useState({ name: '', surname: '', email: '', phone: '' });
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsCountryDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [isFamilyActive, setIsFamilyActive] = useState(false);
  const [familyData, setFamilyData] = useState({ spouse: 0, children: 0 });
  const [selectedCredits, setSelectedCredits] = useState<number[]>([]);
  const [consentA, setConsentA] = useState(false);
  const [consentB, setConsentB] = useState(false);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const extraMembers = isFamilyActive ? familyData.spouse + familyData.children : 0;
  
  const isNameValid = formData.name.trim().length > 1;
  const isSurnameValid = formData.surname.trim().length > 1;
  const isEmailValid = formData.email.includes('@');
  const isPhoneValid = formData.phone.replace(/\D/g, '').length > 5;
  const areLegalsValid = consentA && consentB;
  
  const isFormValid = isNameValid && isSurnameValid && isEmailValid && isPhoneValid;

  const pricing = useMemo(() => PriceService.calculateUpgrade(4, selectedCredits, extraMembers), [selectedCredits, extraMembers]);

  const inputClass = (valid: boolean, value: string) => {
    const isNotEmpty = value.trim().length > 0;
    let base = 'w-full border rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 transition-all text-sm font-medium';
    if (showValidationErrors && !valid) return `${base} border-red-500 bg-red-50 focus:ring-red-100 placeholder-red-300`;
    if (valid && isNotEmpty) return `${base} border-emerald-500 bg-emerald-50/30 focus:ring-emerald-100`;
    return `${base} border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-900`;
  };

  const getCreditLabel = (amount: number) => {
    if (Math.abs(amount - 124.5) < 0.1) return t.credits.p1_summary;
    if (Math.abs(amount - 649) < 0.1) return t.credits.p2_summary;
    return t.credits.p3_summary;
  };

  const handleProceed = async () => {
    setServerError(null);
    if (!isFormValid || !areLegalsValid) { setShowValidationErrors(true); return; }
    setIsChecking(true);
    try {
      const fullPhone = `${selectedCountry.dial} ${formData.phone}`;
      const result = await registerAndCheckStatus({ email: formData.email, name: formData.name, surname: formData.surname, phone: fullPhone, familyData: isFamilyActive ? familyData : { spouse: 0, children: 0 } });
      if (result.status === 'POSITIVE') {
        const payload = { amount: pricing.finalTotal, email: formData.email, productName: t.package_name_order, metadata: { packageId: 'p4', clientName: `${formData.name} ${formData.surname}` } };
        const response = await fetch('https://fbabhnqutznukysleqqt.supabase.co/functions/v1/create-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_ANON_KEY}` }, body: JSON.stringify(payload) });
        const data = await response.json();
        if (data.url) window.location.href = data.url; else throw new Error('Error');
      } else {
        if (result.status === 'NOT_FOUND') setServerError(t.errors.not_found);
        else if (result.status === 'PENDING') setServerError(t.errors.pending);
        else if (result.status === 'NEGATIVE') setServerError(t.errors.negative);
        else setServerError(t.errors.generic);
      }
    } catch (e: any) { setServerError(t.errors.generic); } finally { setIsChecking(false); }
  };

  const DocLink = ({ code, text }: { code: string; text: string }) => (
    <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveDoc(code); }} className="text-blue-600 hover:text-blue-800 underline cursor-pointer hover:bg-blue-50 rounded px-1 transition-colors font-bold">{text}</span>
  );

  return (
    <>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative bg-white w-full max-w-[520px] h-full sm:h-auto sm:rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-screen sm:max-h-[95vh]">
          <div className="p-6 lg:p-8 pb-4 flex items-start justify-between border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-900 rounded-xl"><Gavel size={24} /></div>
              <div><h3 className="text-[14px] lg:text-[16px] font-black text-slate-900 uppercase tracking-tight">{t.title}</h3><p className="text-[11px] text-blue-900 font-bold uppercase tracking-widest mt-1">{t.subtitle}</p></div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
          </div>

          <div className="p-6 lg:p-8 overflow-y-auto custom-scrollbar space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{t.placeholders.name}</label><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass(isNameValid, formData.name)} placeholder={t.placeholders.name_ph} /></div>
              <div className="relative"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{t.placeholders.surname}</label><input value={formData.surname} onChange={(e) => setFormData({ ...formData, surname: e.target.value })} className={inputClass(isSurnameValid, formData.surname)} placeholder={t.placeholders.surname_ph} /></div>
              <div className="relative sm:col-span-2"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{t.placeholders.email}</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass(isEmailValid, formData.email)} placeholder={t.placeholders.email_ph} /></div>
              
              <div className="relative sm:col-span-2" ref={dropdownRef}>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{t.placeholders.phone}</label>
                <div className="relative flex">
                  <button type="button" onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)} className={`flex items-center gap-2 px-3 border border-slate-200 border-r-0 rounded-l-xl bg-slate-50 hover:bg-slate-100 transition-colors ${showValidationErrors && !isPhoneValid ? 'border-red-500' : ''}`}><span className="text-xl leading-none">{selectedCountry.flag}</span><ChevronDown size={12} className={`text-slate-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} /></button>
                  <div className={`flex-1 flex items-center border rounded-r-xl bg-white ${showValidationErrors && !isPhoneValid ? 'border-red-500 bg-red-50' : isPhoneValid && formData.phone.length > 5 ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200'}`}><span className="pl-3 text-sm font-bold text-slate-500">{selectedCountry.dial}</span><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9\s]/g, '') })} className="w-full py-3.5 pl-2 pr-4 bg-transparent focus:outline-none text-sm font-medium" placeholder={t.placeholders.phone_ph} /></div>
                  {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 z-[140] max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2">
                      {COUNTRIES.map((c) => (
                        <button key={c.code} onClick={() => { setSelectedCountry(c); setIsCountryDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left border-b border-slate-50 last:border-0"><span className="text-2xl">{c.flag}</span><div className="flex flex-col"><span className="text-xs font-bold text-slate-900">{c.name}</span><span className="text-[10px] font-medium text-slate-400">{c.dial}</span></div>{selectedCountry.code === c.code && <Check size={14} className="ml-auto text-blue-600" />}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[11px] font-bold text-blue-900 text-center -mt-2 uppercase tracking-tighter">{t.mandatory_hint}</p>

            {/* Блок семьи - ВОССТАНОВЛЕНО ПОЛНОСТЬЮ */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4"><span className="text-xs font-black text-slate-900 uppercase tracking-widest">{t.family.title}</span><button onClick={() => setIsFamilyActive(!isFamilyActive)} className={`w-12 h-6 rounded-full transition-colors relative ${isFamilyActive ? 'bg-blue-900' : 'bg-slate-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isFamilyActive ? 'left-7' : 'left-1'}`}></div></button></div>
              {isFamilyActive && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100"><span className="text-[11px] font-bold">{t.family.spouse}</span><div className="flex items-center gap-4"><button onClick={() => setFamilyData((p) => ({ ...p, spouse: Math.max(0, p.spouse - 1) }))} className="p-1 hover:bg-slate-50 rounded"><Minus size={16} /></button><span className="text-sm font-black w-4 text-center">{familyData.spouse}</span><button onClick={() => setFamilyData((p) => ({ ...p, spouse: Math.min(1, p.spouse + 1) }))} className="p-1 hover:bg-slate-50 rounded"><Plus size={16} /></button></div></div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100"><span className="text-[11px] font-bold">{t.family.children}</span><div className="flex items-center gap-4"><button onClick={() => setFamilyData((p) => ({ ...p, children: Math.max(0, p.children - 1) }))} className="p-1 hover:bg-slate-50 rounded"><Minus size={16} /></button><span className="text-sm font-black w-4 text-center">{familyData.children}</span><button onClick={() => setFamilyData((p) => ({ ...p, children: p.children + 1 }))} className="p-1 hover:bg-slate-50 rounded"><Plus size={16} /></button></div></div>
                  <div className="mt-4 p-3 bg-blue-100/30 rounded-xl border border-blue-100/50 flex gap-3"><Info size={14} className="text-blue-600 shrink-0 mt-0.5" /><p className="text-[10px] text-slate-500 leading-normal font-medium italic">{t.family.info}</p></div>
                </div>
              )}
            </div>

            {/* Зачеты - ВОССТАНОВЛЕНО ПОЛНОСТЬЮ */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t.credits.title}</span>
              {[ { id: 1, l: t.credits.p1_label, a: 124.5 }, { id: 2, l: t.credits.p2_label, a: 649 }, { id: 3, l: t.credits.p3_label, a: 949 } ].map(c => (
                <label key={c.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 cursor-pointer hover:border-blue-900/30 transition-all"><div className="flex items-center gap-3"><input type="checkbox" checked={selectedCredits.includes(c.id)} onChange={() => setSelectedCredits(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id])} className="w-5 h-5 rounded text-blue-900" /><span className="text-[11px] font-bold">{c.l}</span></div><span className="text-[11px] font-black text-slate-400">−{c.a.toFixed(2)} €</span></label>
              ))}
            </div>

            {/* Резюме по цене - ВОССТАНОВЛЕНО ПОЛНОСТЬЮ */}
            <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-3">
              <div className="flex justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider"><span>{t.summary.base}</span><span>{pricing.targetPackage.basePrice.toFixed(2)} €</span></div>
              {pricing.appliedCredits.map((c, i) => (<div key={i} className="flex justify-between text-[11px] text-emerald-600 font-bold uppercase tracking-wider"><span>{getCreditLabel(c.amount)}</span><span>−{c.amount.toFixed(2)} €</span></div>))}
              {pricing.familyTariff > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-blue-100/50">
                  <div className="flex justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider"><span>{t.summary.family_base}</span><span>+{(pricing.targetPackage.basePrice * 0.5).toFixed(2)} €</span></div>
                  {extraMembers > 2 && (<div className="flex justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider"><span>{t.summary.family_extra} ({extraMembers - 2} {t.summary.person_short})</span><span>+{(pricing.familyTariff - pricing.targetPackage.basePrice * 0.5).toFixed(2)} €</span></div>)}
                  <div className="flex justify-between text-[11px] text-blue-900 font-black uppercase tracking-widest pt-1"><span>{t.summary.family_total}</span><span>+{pricing.familyTariff.toFixed(2)} €</span></div>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-blue-100"><span className="text-[12px] text-blue-900 font-black uppercase tracking-widest">{t.summary.total}</span><span className="text-3xl font-black text-blue-900">{pricing.finalTotal.toFixed(2)} €</span></div>
            </div>

            <div className="space-y-4">
              <div className="text-center px-4"><p className="text-[12px] font-bold text-blue-900 uppercase tracking-tighter">{t.offer_scope}</p></div>
              <div className="space-y-3">
                <div className={`p-4 rounded-xl border transition-all ${showValidationErrors && !consentA ? 'border-red-500 bg-red-50 animate-shake' : consentA ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-white'}`}>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={consentA} onChange={e => setConsentA(e.target.checked)} className={`mt-1 w-5 h-5 rounded shrink-0 transition-all ${consentA ? 'text-emerald-600 border-emerald-500' : 'text-blue-900 border-slate-300'}`} />
                    <span className={`text-[11px] font-medium leading-relaxed transition-colors ${consentA ? 'text-emerald-700' : 'text-slate-700 group-hover:text-blue-900'}`}>
                      {language === 'de' ? (<>Ich akzeptiere die <DocLink code="AGB" text="AGB" />, die <DocLink code="MANDAT" text="Mandatsvereinbarung" /> sowie die <DocLink code="RVG" text="Honorarvereinbarung (§ 3a RVG)" />.</>) : language === 'ua' ? (<>Я приймаю <DocLink code="AGB" text="AGB" />, <DocLink code="MANDAT" text="Договір доручення" />, а також <DocLink code="RVG" text="Гонорарну угоду" /> (§ 3a RVG).</>) : (<>Я принимаю <DocLink code="AGB" text="AGB" />, <DocLink code="MANDAT" text="Договор поручения" />, а также <DocLink code="RVG" text="Гонорарное соглашение" /> (§ 3a RVG).</>)}
                    </span>
                  </label>
                </div>
                <div className={`p-4 rounded-xl border transition-all ${showValidationErrors && !consentB ? 'border-red-500 bg-red-50 animate-shake' : consentB ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-white'}`}>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={consentB} onChange={e => setConsentB(e.target.checked)} className={`mt-1 w-5 h-5 rounded shrink-0 transition-all ${consentB ? 'text-emerald-600 border-emerald-500' : 'text-blue-900 border-slate-300'}`} />
                    <span className={`text-[11px] font-medium leading-relaxed transition-colors ${consentB ? 'text-emerald-700' : 'text-slate-700 group-hover:text-blue-900'}`}>
                      {language === 'de' ? (<>Ich verlange ausdrücklich <DocLink code="EXECUTION" text="die sofortige Aufnahme der Tätigkeit" /> und weiß, dass mein <DocLink code="WIDERRUF" text="Widerrufsrecht" /> gemäß § 356 Abs. 4 BGB erlischt.</>) : language === 'ua' ? (<>Я прямо запитую <DocLink code="EXECUTION" text="негайний початок робіт" /> і знаю, що моє <DocLink code="WIDERRUF" text="право на відкликання" /> припиняється відповідно до § 356 Abs. 4 BGB.</>) : (<>Я прямо запрашиваю <DocLink code="EXECUTION" text="немедленное начало работ" /> и знаю, что моё <DocLink code="WIDERRUF" text="право на отзыв" /> прекращается в соответствии с § 356 Abs. 4 BGB.</>)}
                    </span>
                  </label>
                </div>
              </div>
              <div className="text-center pt-2"><button onClick={() => setActiveDoc('PRIVACY')} className="text-[10px] font-bold text-blue-700 hover:text-blue-900 uppercase tracking-widest underline">{t.privacy_link}</button></div>
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-3"><Info size={16} className="text-blue-900 shrink-0" /><p className="text-[11px] font-bold text-blue-900 leading-tight">{t.p1_precondition}</p></div>
            </div>
            {serverError && <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 animate-in fade-in"><AlertCircle size={18} className="shrink-0 mt-0.5" /><p className="text-xs font-medium leading-relaxed">{serverError}</p></div>}
            <button onClick={handleProceed} disabled={isChecking} className={`w-full h-14 rounded-full font-black text-[13px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all ${isFormValid && areLegalsValid ? 'bg-blue-900 text-white active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>{isChecking ? (<><Loader2 size={18} className="animate-spin" /> {t.loading}</>) : (<>{t.button} <ArrowRight size={18} /></>)}</button>
          </div>
        </div>
      </div>

      {activeDoc && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in" onClick={() => setActiveDoc(null)}></div>
          <div className="relative bg-white w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3 text-blue-900"><File size={20} /><h3 className="font-bold text-lg">{(DOCS as any)[activeDoc]?.title}</h3></div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.preventDefault(); alert(`Download: ${activeDoc}.pdf`); }} className="p-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors" title={t.btn_download}><Download size={20} /></button>
                <button onClick={() => setActiveDoc(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
              </div>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar leading-relaxed text-slate-600 text-sm">{(DOCS as any)[activeDoc]?.content}</div>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl"><button onClick={() => setActiveDoc(null)} className="w-full py-3 bg-blue-900 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors">{t.btn_close}</button></div>
          </div>
        </div>
      )}
      <style>{` @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } } .animate-shake { animation: shake 0.2s ease-in-out 0s 2; } `}</style>
    </>
  );
};
