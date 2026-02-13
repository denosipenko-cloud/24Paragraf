import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
  ChevronDown,
  Check,
  File,
  FileDown,
  Gavel,
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { createClient } from '@supabase/supabase-js';

// --- 1. НАСТРОЙКИ ---
const SUPABASE_URL = 'https://fbabhnqutznukysleqqt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_sr3PYRr1OpcbXBSxcQgnmQ_f4uXjLoJ';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const PACKAGE_PRICE = 249.0;

const COUNTRIES = [
  { code: 'UA', name: 'Ukraine', dial: '+380', flag: '🇺🇦' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
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

const DOCS = {
  AGB: { title: 'AGB', content: 'Текст AGB...' },
  WIDERRUF: { title: 'Widerrufsbelehrung', content: 'Текст условий возврата...' },
  MANDAT: { title: 'Mandatsvereinbarung', content: 'Текст мандатного соглашения...' },
  RVG: { title: 'Honorarvereinbarung', content: 'Текст гонорарного соглашения...' },
  EXECUTION: { title: 'Sofortige Aufnahme der Tätigkeit', content: 'Текст поручения...' },
  PRIVACY: { title: 'Datenschutzerklärung', content: 'Текст политики...' },
};

interface P1PreCheckoutModalProps {
  onClose: () => void;
}

const modalContent = {
  ru: {
    title: 'ОФОРМЛЕНИЕ ЗАКАЗА', subtitle: 'ПАКЕТ №1 «СТАРТОВЫЙ»',
    placeholders: { name: 'ИМЯ *', name_ph: 'Имя', surname: 'ФАМИЛИЯ *', surname_ph: 'Фамилия', email: 'EMAIL *', email_ph: 'email@example.com', phone: 'ТЕЛЕФОН *', phone_ph: '123 456 789' },
    price_label: 'СТОИМОСТЬ УСЛУГИ:', price_value: '249.00 €', offer_scope: 'Это предложение предназначено исключительно для потребителей в понимании § 13 BGB.',
    privacy_link: 'Политика конфиденциальности', button: 'ОПЛАТИТЬ КАРТОЙ', loading: 'СОЗДАНИЕ ЗАКАЗА...',
    btn_close: 'Закрыть'
  },
  de: {
    title: 'BESTELLUNG', subtitle: 'PAKET №1 «START»',
    placeholders: { name: 'VORNAME *', name_ph: 'Vorname', surname: 'NACHNAME *', surname_ph: 'Nachname', email: 'E-MAIL *', email_ph: 'email@example.com', phone: 'TELEFON *', phone_ph: '123 456 789' },
    price_label: 'PREIS:', price_value: '249.00 €', offer_scope: 'Dieses Angebot richtet sich ausschließlich an Verbraucher im Sinne des § 13 BGB.',
    privacy_link: 'Datenschutzerklärung', button: 'MIT KARTE BEZAHLEN', loading: 'BESTELLUNG WIRD ERSTELLT...',
    btn_close: 'Schließen'
  },
  ua: {
    title: 'ОФОРМЛЕННЯ ЗАМОВЛЕННЯ', subtitle: 'ПАКЕТ №1 «СТАРТОВІЙ»',
    placeholders: { name: "ІМ'Я *", name_ph: "Ім'я", surname: 'ПРІЗВИЩЕ *', surname_ph: 'Прізвище', email: 'EMAIL *', email_ph: 'email@example.com', phone: 'ТЕЛЕФОН *', phone_ph: '123 456 789' },
    price_label: 'ВАРТІСТЬ ПОСЛУГИ:', price_value: '249.00 €', offer_scope: 'Ця пропозиція призначена виключно для споживачів у розумінні § 13 BGB.',
    privacy_link: 'Політика конфіденційності', button: 'СПЛАТИТИ КАРТКОЮ', loading: 'СТВОРЕННЯ ЗАМОВЛЕННЯ...',
    btn_close: 'Закрити'
  },
};

export const P1PreCheckoutModal_v2: React.FC<P1PreCheckoutModalProps> = ({ onClose }) => {
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

  const [consentA, setConsentA] = useState(false);
  const [consentB, setConsentB] = useState(false);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const isNameValid = formData.name.trim().length > 1;
  const isSurnameValid = formData.surname.trim().length > 1;
  const isEmailValid = formData.email.includes('@');
  const isPhoneValid = formData.phone.replace(/\D/g, '').length > 5;
  const areLegalsValid = consentA && consentB;
  const isFormValid = isNameValid && isSurnameValid && isEmailValid && isPhoneValid && areLegalsValid;

  const inputClass = (valid: boolean, value: string) => {
    const isNotEmpty = value.trim().length > 0;
    let base = 'w-full border rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 transition-all text-sm font-medium';
    if (showValidationErrors && !valid) return `${base} border-red-500 bg-red-50 focus:ring-red-100 placeholder-red-300`;
    if (valid && isNotEmpty) return `${base} border-emerald-500 bg-emerald-50/30 focus:ring-emerald-100`;
    return `${base} border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-900`;
  };

  const handleSubmit = async () => {
    setServerError(null);
    if (!isFormValid) { setShowValidationErrors(true); return; }
    setIsProcessing(true);
    try {
      const fullName = `${formData.name} ${formData.surname}`.trim();
      const payload = { amount: PACKAGE_PRICE, email: formData.email.toLowerCase().trim(), productName: 'Package #1 (Start)', metadata: { packageId: 'p1', clientName: fullName } };
      const response = await fetch('https://fbabhnqutznukysleqqt.supabase.co/functions/v1/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url; else throw new Error();
    } catch (error) { setServerError('Error connecting to payment server.'); setIsProcessing(false); }
  };

  const DocLink = ({ code, text }: { code: string; text: string }) => (
    <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveDoc(code); }} className="text-blue-600 hover:text-blue-800 underline cursor-pointer hover:bg-blue-50 rounded px-1 transition-colors font-bold inline-flex items-center gap-1">{text}</span>
  );

  const DownloadIcon = ({ code }: { code: string }) => (
    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert(`Download: ${code}.pdf`); }} className="p-1 text-slate-400 hover:text-blue-600 transition-colors inline-block align-middle ml-1" title="PDF"><FileDown size={14} /></button>
  );

  return (
    <>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative bg-white w-full max-w-[520px] h-full sm:h-auto sm:rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-screen sm:max-h-[95vh]">
          <div className="p-6 lg:p-8 pb-4 flex items-start justify-between border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-900 rounded-xl"><ShieldCheck size={24} /></div>
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
                  <button type="button" onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)} className={`flex items-center gap-2 px-3 border-y border-l rounded-l-xl bg-slate-50 hover:bg-slate-100 transition-colors ${showValidationErrors && !isPhoneValid ? 'border-red-500' : 'border-slate-200'}`}>
                    <span className="text-xl leading-none">{selectedCountry.flag}</span>
                    <ChevronDown size={12} className={`text-slate-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`flex-1 flex items-center border rounded-r-xl bg-white border-l-0 ${showValidationErrors && !isPhoneValid ? 'border-red-500 bg-red-50' : formData.phone.length > 5 ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 focus-within:border-blue-900 focus-within:ring-2'}`}>
                    <span className="pl-3 text-sm font-bold text-slate-500 select-none">{selectedCountry.dial}</span>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9\s]/g, '') })} className="w-full py-3.5 pl-2 pr-4 bg-transparent focus:outline-none text-sm font-medium" placeholder={t.placeholders.phone_ph} />
                  </div>
                  {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 z-[140] max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2">
                      {COUNTRIES.map((c) => (
                        <button key={c.code} onClick={() => { setSelectedCountry(c); setIsCountryDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left border-b border-slate-50 last:border-0">
                          <span className="text-2xl">{c.flag}</span>
                          <div className="flex flex-col"><span className="text-xs font-bold text-slate-900">{c.name}</span><span className="text-[10px] font-medium text-slate-400">{c.dial}</span></div>
                          {selectedCountry.code === c.code && <Check size={14} className="ml-auto text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex justify-between items-center">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{t.price_label}</span>
              <span className="text-2xl font-black text-blue-900">{t.price_value}</span>
            </div>

            <div className="space-y-4">
              <div className="text-center px-4"><p className="text-[12px] font-bold text-blue-900 leading-relaxed uppercase tracking-tighter">{t.offer_scope}</p></div>
              
              <div className="space-y-3">
                {/* Чекбокс A */}
                <div className={`p-4 rounded-xl border transition-all ${showValidationErrors && !consentA ? 'border-red-500 bg-red-50 animate-shake shadow-lg shadow-red-100' : consentA ? 'border-emerald-500 bg-emerald-50/30 shadow-sm' : 'border-slate-200 bg-white'}`}>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={consentA} onChange={e => setConsentA(e.target.checked)} className={`mt-1 w-5 h-5 rounded shrink-0 transition-all ${consentA ? 'text-emerald-600 border-emerald-500' : 'text-blue-900 border-slate-300'}`} />
                    <span className={`text-[11px] font-medium leading-relaxed transition-colors ${showValidationErrors && !consentA ? 'text-red-700' : consentA ? 'text-emerald-700' : 'text-slate-700 group-hover:text-blue-900'}`}>
                      {language === 'de' ? (
                        <>Ich akzeptiere die <DocLink code="AGB" text="AGB" /> <DownloadIcon code="AGB" />, die <DocLink code="MANDAT" text="Mandatsvereinbarung" /> <DownloadIcon code="MANDAT" /> sowie die <DocLink code="RVG" text="Honorarvereinbarung (§ 3a RVG)" /> <DownloadIcon code="RVG" />.</>
                      ) : language === 'ua' ? (
                        <>Я приймаю <DocLink code="AGB" text="AGB" /> <DownloadIcon code="AGB" />, <DocLink code="MANDAT" text="Договір доручення" /> <DownloadIcon code="MANDAT" />, а також <DocLink code="RVG" text="Гонорарну угоду" /> (§ 3a RVG) <DownloadIcon code="RVG" />.</>
                      ) : (
                        <>Я принимаю <DocLink code="AGB" text="AGB" /> <DownloadIcon code="AGB" />, <DocLink code="MANDAT" text="Договор поручения" /> <DownloadIcon code="MANDAT" />, а также <DocLink code="RVG" text="Гонорарное соглашение" /> (§ 3a RVG) <DownloadIcon code="RVG" />.</>
                      )}
                    </span>
                  </label>
                </div>

                {/* Чекбокс B */}
                <div className={`p-4 rounded-xl border transition-all ${showValidationErrors && !consentB ? 'border-red-500 bg-red-50 animate-shake shadow-lg shadow-red-100' : consentB ? 'border-emerald-500 bg-emerald-50/30 shadow-sm' : 'border-slate-200 bg-white'}`}>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={consentB} onChange={e => setConsentB(e.target.checked)} className={`mt-1 w-5 h-5 rounded shrink-0 transition-all ${consentB ? 'text-emerald-600 border-emerald-500' : 'text-blue-900 border-slate-300'}`} />
                    <span className={`text-[11px] font-medium leading-relaxed transition-colors ${showValidationErrors && !consentB ? 'text-red-700' : consentB ? 'text-emerald-700' : 'text-slate-700 group-hover:text-blue-900'}`}>
                      {language === 'de' ? (
                        <>Ich verlange ausdrücklich <DocLink code="EXECUTION" text="die sofortige Aufnahme der Tätigkeit" /> <DownloadIcon code="EXECUTION" /> und weiß, dass mein <DocLink code="WIDERRUF" text="Widerrufsrecht" /> gemäß § 356 Abs. 4 BGB erlischt <DownloadIcon code="WIDERRUF" />.</>
                      ) : language === 'ua' ? (
                        <>Я прямо запитую <DocLink code="EXECUTION" text="негайний початок робіт" /> <DownloadIcon code="EXECUTION" /> і знаю, що моє <DocLink code="WIDERRUF" text="право на відкликання" /> припиняється відповідно до § 356 Abs. 4 BGB <DownloadIcon code="WIDERRUF" />.</>
                      ) : (
                        <>Я прямо запрашиваю <DocLink code="EXECUTION" text="немедленное начало работ" /> <DownloadIcon code="EXECUTION" /> и знаю, что моё <DocLink code="WIDERRUF" text="право на отзыв" /> прекращается в соответствии с § 356 Abs. 4 BGB <DownloadIcon code="WIDERRUF" />.</>
                      )}
                    </span>
                  </label>
                </div>
              </div>

              <div className="text-center pt-2"><button onClick={() => setActiveDoc('PRIVACY')} className="text-[10px] font-bold text-blue-700 hover:text-blue-900 transition-colors uppercase tracking-widest underline">{t.privacy_link}</button></div>
            </div>

            {serverError && <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 animate-in fade-in"><AlertCircle size={18} className="shrink-0 mt-0.5" /><p className="text-xs font-medium">{serverError}</p></div>}
            <button onClick={handleSubmit} disabled={isProcessing} className={`w-full h-14 rounded-full font-black text-[13px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all ${isFormValid ? 'bg-blue-900 text-white active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>{isProcessing ? (<><Loader2 size={18} className="animate-spin" /> {t.loading}</>) : (<>{t.button} <ArrowRight size={18} /></>)}</button>
          </div>
        </div>
      </div>

      {activeDoc && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in" onClick={() => setActiveDoc(null)}></div>
          <div className="relative bg-white w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-6 border-b border-slate-100"><div className="flex items-center gap-3 text-blue-900"><File size={20} /><h3 className="font-bold text-lg">{(DOCS as any)[activeDoc]?.title}</h3></div><button onClick={() => setActiveDoc(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button></div>
            <div className="p-8 overflow-y-auto custom-scrollbar leading-relaxed text-slate-600 text-sm">{(DOCS as any)[activeDoc]?.content}</div>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl"><button onClick={() => setActiveDoc(null)} className="w-full py-3 bg-blue-900 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors">{t.btn_close}</button></div>
          </div>
        </div>
      )}
      <style>{` @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } } .animate-shake { animation: shake 0.2s ease-in-out 0s 2; } `}</style>
    </>
  );
};
