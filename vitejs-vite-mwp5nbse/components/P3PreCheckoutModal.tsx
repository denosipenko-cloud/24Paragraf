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
} from 'lucide-react';
import { PriceService } from '../services/PriceService';
import { useLanguage } from '../LanguageContext';
import { createClient } from '@supabase/supabase-js';

// --- 1. НАСТРОЙКИ ---
const SUPABASE_URL = 'https://fbabhnqutznukysleqqt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_sr3PYRr1OpcbXBSxcQgnmQ_f4uXjLoJ';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- СПИСОК СТРАН ---
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

// --- ЗАГЛУШКИ ДОКУМЕНТОВ ---
const DOCS = {
  AGB: { title: 'AGB', content: 'Здесь будет текст AGB...' },
  WIDERRUF: {
    title: 'Widerrufsbelehrung',
    content: 'Здесь будет текст условий возврата...',
  },
  MANDAT: {
    title: 'Mandatsvereinbarung',
    content: 'Здесь будет текст мандатного соглашения...',
  },
  RVG: {
    title: 'Vergütungsvereinbarung (§ 3a RVG)',
    content: 'Здесь будет текст соглашения о гонораре...',
  },
  EXECUTION: {
    title: 'Beauftragung mit der sofortigen Aufnahme',
    content: 'Здесь будет текст поручения о немедленном начале работ...',
  },
  PRIVACY: {
    title: 'Datenschutzerklärung',
    content: 'Здесь будет текст политики конфиденциальности...',
  },
};

// --- 2. ЛОГИКА ПРОВЕРКИ ---
interface LeadData {
  email: string;
  name: string;
  surname: string;
  phone: string;
  familyData: { spouse: number; children: number };
}

const registerAndCheckStatus = async (
  data: LeadData
): Promise<{ status: string }> => {
  try {
    const normalizedEmail = data.email.toLowerCase().trim();
    const fullName = `${data.name} ${data.surname}`.trim();

    await supabase.from('clients').upsert(
      {
        email: normalizedEmail,
        full_name: fullName,
        phone: data.phone,
        family_data: data.familyData,
        last_attempt_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    );

    const { data: clientRecord, error } = await supabase
      .from('clients')
      .select('p1_status, diagnosis_result')
      .eq('email', normalizedEmail)
      .single();

    if (error || !clientRecord) return { status: 'NOT_FOUND' };

    const statusP1 = clientRecord.p1_status
      ? clientRecord.p1_status.trim().toUpperCase()
      : '';
    const diagnosis = clientRecord.diagnosis_result
      ? clientRecord.diagnosis_result.trim().toUpperCase()
      : '';

    if (diagnosis === 'NEGATIVE') return { status: 'NEGATIVE' };
    const isP1Paid = statusP1 === 'PURCHASED' || statusP1 === 'COMPLETED';

    if (isP1Paid && diagnosis === 'POSITIVE') return { status: 'POSITIVE' };
    if (statusP1 === 'PURCHASED' && diagnosis === 'PENDING')
      return { status: 'PENDING' };

    return { status: 'NOT_FOUND' };
  } catch (e) {
    console.error('Error:', e);
    return { status: 'ERROR' };
  }
};

interface P3PreCheckoutModalProps {
  onClose: () => void;
  onProceed: (amount: number, name: string) => void;
}

const modalContent = {
  ru: {
    title: 'ОФОРМЛЕНИЕ ЗАКАЗА',
    subtitle: 'Пакет №3 «Адвокатский»',
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
    mandatory_hint: '* Поля, отмеченные звёздочкой, обязательны для заполнения',
    family: {
      title: 'СЕМЕЙНЫЙ ФОРМАТ',
      spouse: 'Супруг/Супруга',
      children: 'Дети',
      info: 'Базовый семейный формат включает до 3 человек (основной заявитель + 2 участника). Каждый последующий участник увеличивает объём юридической работы и рассчитывается отдельно.',
    },
    credits: {
      title: 'РАНЕЕ ПРИОБРЕТЁННЫЕ ПАКЕТЫ (ЗАЧЁТ)',
      p1_label: 'Пакет №1 «Стартовый»',
      p2_label: 'Пакет №2 «Самостоятельный»',
      p1_summary: 'Зачет уровня пакета №1 «Стартовый»',
      p2_summary: 'Зачет уровня пакета №2 «Самостоятельный»',
    },
    summary: {
      base: 'БАЗОВАЯ ЦЕНА ПАКЕТА №3',
      family_base: 'Базовый семейный формат (до 3 чел.)',
      family_extra: 'Доп. участники',
      person_short: 'чел.',
      family_total: 'Итого семейный тариф:',
      total: 'ИТОГО К ОПЛАТЕ',
    },
    check_p1:
      'Я подтверждаю, что на основании предоставленной мной информации в рамках пакета №1 «Стартовый» получен положительный результат проверки возможности перехода с §24 AufenthG на другие стабильные статусы.',
    check_data:
      'Я подтверждаю достоверность введенных данных и даю согласие на их обработку в соответствии с политикой конфиденциальности.',
    trans: {
      privacy: 'Политика конфиденциальности',
    },
    button: 'ПРОВЕРИТЬ И ПРОДОЛЖИТЬ',
    loading: 'СОЗДАНИЕ ЗАКАЗА...',
    package_name_order: 'Пакет №3 «Адвокатский»',
    errors: {
      not_found:
        'Обязательным условием является наличие положительного заключения в рамках Пакета №1.',
      pending: 'Процедура оценки в рамках Пакета №1 еще не завершена.',
      negative:
        'По данному Email не подтвержден положительный результат оценки.',
      generic: 'Ошибка проверки статуса.',
    },
  },
  de: {
    title: 'BESTELLUNG',
    subtitle: 'Paket №3 «Anwaltlich»',
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
    mandatory_hint: '* Mit Sternchen markierte Felder sind Pflichtfelder',
    family: {
      title: 'FAMILIENFORMAT',
      spouse: 'Ehepartner',
      children: 'Kinder',
      info: 'Das Standard-Familienformat umfasst bis zu 3 Personen. Jeder weitere Teilnehmer erhöht den juristischen Arbeitsaufwand und wird separat berechnet.',
    },
    credits: {
      title: 'BEREITS ERWORBENE PAKETE (VERRECHNUNG)',
      p1_label: 'Paket №1 «Start»',
      p2_label: 'Paket №2 «Selbstständig»',
      p1_summary: 'Anrechnung Paket-Level №1 «Start»',
      p2_summary: 'Anrechnung Paket-Level №2 «Selbstständig»',
    },
    summary: {
      base: 'BASISPREIS PAKET №3',
      family_base: 'Standard-Familienformat (bis 3 Pers.)',
      family_extra: 'Zusätzliche Teilnehmer',
      person_short: 'Pers.',
      family_total: 'Summe Familientarif:',
      total: 'GESAMTSUMME',
    },
    check_p1:
      'Ich bestätige, dass auf der Grundlage der von mir im Rahmen von Paket Nr. 1 bereitgestellten Informationen ein positives Ergebnis bezüglich der Möglichkeit eines Wechsels von §24 AufenthG in andere stabile Status vorliegt.',
    check_data:
      'Ich bestätige die Richtigkeit der eingegebenen Daten und stimme deren Verarbeitung gemäß der Datenschutzerklärung zu.',
    trans: { privacy: 'Datenschutz' },
    button: 'PRÜFEN UND FORTFAHREN',
    loading: 'BESTELLUNG WIRD ERSTELLT...',
    package_name_order: 'Paket №3 «Anwaltlich»',
    errors: {
      not_found:
        'Zwingende Voraussetzung ist ein positives Ergebnis im Rahmen von Paket Nr. 1.',
      pending:
        'Das Verfahren der Ersteinschätzung ist noch nicht abgeschlossen.',
      negative: 'Ein positives Ergebnis konnte nicht bestätigt werden.',
      generic: 'Fehler bei der Überprüfung.',
    },
  },
  ua: {
    title: 'ОФОРМЛЕННЯ ЗАМОВЛЕННЯ',
    subtitle: 'Пакет №3 «Адвокатський»',
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
    mandatory_hint: "* Поля, позначені зірочкою, є обов'язковими",
    family: {
      title: 'СІМЕЙНИЙ ФОРМАТ',
      spouse: 'Чоловік/Дружина',
      children: 'Діти',
      info: 'Базовий сімейний формат включає до 3 осіб (основний заявник + 2 учасники). Кожен наступний учасник збільшує обсяг юридичної роботи та розраховується окремо.',
    },
    credits: {
      title: 'РАНІШЕ ПРИДБАНІ ПАКЕТИ (ЗАРАХУВАННЯ)',
      p1_label: 'Пакет №1 «Стартовий»',
      p2_label: 'Пакет №2 «Самостійний»',
      p1_summary: 'Зарахування рівня пакету №1 «Стартовий»',
      p2_summary: 'Зарахування рівня пакету №2 «Самостійний»',
    },
    summary: {
      base: 'БАЗОВА ЦІНА ПАКЕТУ №3',
      family_base: 'Базовий сімейний формат (до 3 осіб)',
      family_extra: 'Дод. учасники',
      person_short: 'осіб',
      family_total: 'Разом сімейний тариф:',
      total: 'РАЗОМ ДО СПЛАТИ',
    },
    check_p1:
      'Я підтверджую, що на підставі наданої мною інформації в рамках пакету №1 «Стартовий» отримано позитивний результат перевірки можливості переходу з §24 AufenthG на інші стабільні статуси.',
    check_data:
      'Я підтверджую достовірність введених даних та даю згоду на їх обробку відповідно до політики конфіденційності.',
    trans: { privacy: 'Політика конфіденційності' },
    button: 'ПЕРЕВІРИТИ ТА ПРОДОВЖИТИ',
    loading: 'СТВОРЕННЯ ЗАМОВЛЕННЯ...',
    package_name_order: 'Пакет №3 «Адвокатський»',
    errors: {
      not_found:
        "Обов'язковою умовою є наявність позитивного висновку в рамках Пакету №1.",
      pending: 'Процедура оцінки в рамках Пакету №1 ще не завершена.',
      negative: 'Позитивний результат оцінки не підтверджено.',
      generic: 'Помилка перевірки.',
    },
  },
};

export const P3PreCheckoutModal: React.FC<P3PreCheckoutModalProps> = ({
  onClose,
  onProceed,
}) => {
  const { language } = useLanguage();
  const t = (modalContent as any)[language] || modalContent.ru;

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
  });

  // Country Selector
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  const [isFamilyActive, setIsFamilyActive] = useState(false);
  const [familyData, setFamilyData] = useState({ spouse: 0, children: 0 });
  const [selectedCredits, setSelectedCredits] = useState<number[]>([]);

  // CHECKBOXES
  const [isP1Confirmed, setIsP1Confirmed] = useState(false);
  const [isLegalConfirmed, setIsLegalConfirmed] = useState(false);
  const [isDataConsent, setIsDataConsent] = useState(false);

  // MODAL FOR DOCS
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  const [isChecking, setIsChecking] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const extraMembers = isFamilyActive
    ? familyData.spouse + familyData.children
    : 0;

  const isNameValid = formData.name.trim().length > 1;
  const isSurnameValid = formData.surname.trim().length > 1;
  const isEmailValid = formData.email.includes('@');
  const isPhoneValid = formData.phone.replace(/\D/g, '').length > 5;
  const isFormValid =
    isNameValid && isSurnameValid && isEmailValid && isPhoneValid;

  const pricing = useMemo(() => {
    const effectiveCredits = isP1Confirmed
      ? Array.from(new Set([...selectedCredits, 1]))
      : selectedCredits;
    return PriceService.calculateUpgrade(3, effectiveCredits, extraMembers);
  }, [selectedCredits, extraMembers, isP1Confirmed]);

  const handleP1Confirmation = (checked: boolean) => {
    setIsP1Confirmed(checked);
    if (checked) {
      setSelectedCredits((prev) => (prev.includes(1) ? prev : [...prev, 1]));
    }
  };

  const toggleCredit = (id: number) => {
    if (id === 1 && isP1Confirmed) return;
    setSelectedCredits((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const inputClass = (valid: boolean, value: string) => {
    const isNotEmpty = value.trim().length > 0;
    let base =
      'w-full border rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 transition-all text-sm font-medium';
    if (showValidationErrors && !valid)
      return `${base} border-red-500 bg-red-50 focus:ring-red-100 placeholder-red-300`;
    if (valid && isNotEmpty)
      return `${base} border-emerald-500 bg-emerald-50/30 focus:ring-emerald-100`;
    return `${base} border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-900`;
  };

  const getCreditLabel = (amount: number) => {
    if (Math.abs(amount - 124.5) < 0.1) return t.credits.p1_summary;
    if (Math.abs(amount - 649) < 0.1) return t.credits.p2_summary;
    return 'Credit';
  };

  // --- SUBMIT ---
  const handleProceed = async () => {
    setServerError(null);
    if (!isFormValid || !isP1Confirmed || !isLegalConfirmed || !isDataConsent) {
      setShowValidationErrors(true);
      return;
    }

    setIsChecking(true);
    const fullPhone = `${selectedCountry.dial} ${formData.phone}`;

    try {
      const result = await registerAndCheckStatus({
        email: formData.email,
        name: formData.name,
        surname: formData.surname,
        phone: fullPhone,
        familyData: isFamilyActive ? familyData : { spouse: 0, children: 0 },
      });

      if (result.status === 'POSITIVE') {
        const orderDetails = {
          package: t.package_name_order,
          base_price: pricing.targetPackage.basePrice,
          final_total: pricing.finalTotal,
          currency: 'EUR',
          family_config: isFamilyActive
            ? {
                active: true,
                spouse: familyData.spouse,
                children: familyData.children,
                extra_members_cost:
                  extraMembers > 2
                    ? pricing.familyTariff -
                      pricing.targetPackage.basePrice * 0.5
                    : 0,
              }
            : { active: false },
          credits_applied: pricing.appliedCredits.map((c) => ({
            id: c.id,
            amount: c.amount,
            description: c.id === 1 ? 'Pack 1' : 'Pack 2',
          })),
          // CONSENTS
          legal_consents: {
            agb: true,
            widerruf: true,
            mandat: true,
            rvg: true,
            execution: true,
            privacy: true,
            timestamp: new Date().toISOString(),
          },
          created_at: new Date().toISOString(),
        };

        await supabase
          .from('clients')
          .update({
            payment_amount: pricing.finalTotal,
            order_details: orderDetails,
            last_attempt_at: new Date().toISOString(),
          })
          .eq('email', formData.email.toLowerCase().trim());

        await supabase.from('orders').insert({
          client_email: formData.email.toLowerCase().trim(),
          amount: pricing.finalTotal,
          package_name: t.package_name_order,
          order_details: orderDetails,
        });

        const payload = {
          amount: pricing.finalTotal,
          email: formData.email,
          productName: t.package_name_order,
          description: `Клиент: ${formData.name} ${formData.surname}. ${
            isFamilyActive ? 'Семья' : 'Личный'
          }.`,
          metadata: {
            packageId: 'p3',
            credits: pricing.appliedCredits.map((c) => c.id).join(','),
            familyMembers: extraMembers,
            clientName: `${formData.name} ${formData.surname}`,
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
          throw new Error('Ошибка: Сервер не вернул ссылку на оплату.');
        }
      } else {
        if (result.status === 'NOT_FOUND') setServerError(t.errors.not_found);
        else if (result.status === 'PENDING') setServerError(t.errors.pending);
        else if (result.status === 'NEGATIVE')
          setServerError(t.errors.negative);
        else setServerError(t.errors.generic);
      }
    } catch (e: any) {
      console.error(e);
      setServerError(e.message || t.errors.generic);
    } finally {
      setIsChecking(false);
    }
  };

  // Helper for docs
  const DocLink = ({ code, text }: { code: string; text: string }) => (
    <span
      onClick={(e) => {
        e.preventDefault();
        setActiveDoc(code);
      }}
      className="text-blue-600 hover:text-blue-800 underline cursor-pointer hover:bg-blue-50 rounded px-1 transition-colors"
    >
      {text}
    </span>
  );

  return (
    <>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-0 sm:p-4">
        <div
          className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        <div className="relative bg-white w-full max-w-[520px] h-full sm:h-auto sm:rounded-[24px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 flex flex-col max-h-screen sm:max-h-[95vh]">
          <div className="p-6 lg:p-8 pb-4 flex items-start justify-between border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-900 rounded-xl">
                <Gavel size={24} />
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

          <div className="p-6 lg:p-8 overflow-y-auto custom-scrollbar space-y-6">
            {/* INPUTS */}
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

              {/* PHONE */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  {t.placeholders.phone}
                </label>
                <div className="relative flex">
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
                            <Check
                              size={14}
                              className="ml-auto text-blue-600"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FAMILY SECTION */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                  {t.family.title}
                </span>
                <button
                  onClick={() => setIsFamilyActive(!isFamilyActive)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    isFamilyActive ? 'bg-blue-900' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      isFamilyActive ? 'left-7' : 'left-1'
                    }`}
                  ></div>
                </button>
              </div>
              {isFamilyActive && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold">
                      {t.family.spouse}
                    </span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          setFamilyData((p) => ({
                            ...p,
                            spouse: Math.max(0, p.spouse - 1),
                          }))
                        }
                        className="p-1 hover:bg-slate-50 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-sm font-black w-4 text-center">
                        {familyData.spouse}
                      </span>
                      <button
                        onClick={() =>
                          setFamilyData((p) => ({
                            ...p,
                            spouse: Math.min(1, p.spouse + 1),
                          }))
                        }
                        className="p-1 hover:bg-slate-50 rounded"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold">
                      {t.family.children}
                    </span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          setFamilyData((p) => ({
                            ...p,
                            children: Math.max(0, p.children - 1),
                          }))
                        }
                        className="p-1 hover:bg-slate-50 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-sm font-black w-4 text-center">
                        {familyData.children}
                      </span>
                      <button
                        onClick={() =>
                          setFamilyData((p) => ({
                            ...p,
                            children: p.children + 1,
                          }))
                        }
                        className="p-1 hover:bg-slate-50 rounded"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-100/30 rounded-xl border border-blue-100/50 flex gap-3">
                    <Info size={14} className="text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-500 leading-normal font-medium italic">
                      {t.family.info}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* CREDITS SECTION */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                {t.credits.title}
              </span>
              <div className="space-y-2">
                <label
                  className={`flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 transition-all ${
                    isP1Confirmed
                      ? 'opacity-70 grayscale-[0.5]'
                      : 'cursor-pointer hover:border-blue-900/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedCredits.includes(1) || isP1Confirmed}
                      onChange={() => toggleCredit(1)}
                      disabled={isP1Confirmed}
                      className={`w-5 h-5 rounded text-blue-900 ${
                        isP1Confirmed ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    />
                    <span className="text-[11px] font-bold">
                      {t.credits.p1_label}
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-slate-400">
                    −124.50 €
                  </span>
                </label>
                <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 cursor-pointer hover:border-blue-900/30 transition-all">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedCredits.includes(2)}
                      onChange={() => toggleCredit(2)}
                      className="w-5 h-5 rounded text-blue-900"
                    />
                    <span className="text-[11px] font-bold">
                      {t.credits.p2_label}
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-slate-400">
                    −649.00 €
                  </span>
                </label>
              </div>
            </div>

            {/* SUMMARY */}
            <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-3">
              <div className="flex justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                <span>{t.summary.base}</span>
                <span>{pricing.targetPackage.basePrice.toFixed(2)} €</span>
              </div>
              {pricing.appliedCredits.map((credit, i) => (
                <div
                  key={i}
                  className="flex justify-between text-[11px] text-emerald-600 font-bold uppercase tracking-wider"
                >
                  <span>{getCreditLabel(credit.amount)}</span>
                  <span>−{credit.amount.toFixed(2)} €</span>
                </div>
              ))}

              {pricing.familyTariff > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-blue-100/50">
                  <div className="flex justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    <span>{t.summary.family_base}</span>
                    <span>
                      +{(pricing.targetPackage.basePrice * 0.5).toFixed(2)} €
                    </span>
                  </div>
                  {extraMembers > 2 && (
                    <div className="flex justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                      <span>
                        {t.summary.family_extra} ({extraMembers - 2}{' '}
                        {t.summary.person_short})
                      </span>
                      <span>
                        +
                        {(
                          pricing.familyTariff -
                          pricing.targetPackage.basePrice * 0.5
                        ).toFixed(2)}{' '}
                        €
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-[11px] text-blue-900 font-black uppercase tracking-widest pt-1">
                    <span>{t.summary.family_total}</span>
                    <span>+{pricing.familyTariff.toFixed(2)} €</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-blue-100">
                <span className="text-[12px] text-blue-900 font-black uppercase tracking-widest">
                  {t.summary.total}
                </span>
                <span className="text-3xl font-black text-blue-900">
                  {pricing.finalTotal.toFixed(2)} €
                </span>
              </div>
            </div>

            {/* CHECKBOX 1: P1 Confirm */}
            <div className="space-y-2">
              <label
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  isP1Confirmed
                    ? 'bg-blue-50 border-blue-900 shadow-sm'
                    : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                } ${
                  showValidationErrors && !isP1Confirmed
                    ? 'border-red-500 bg-red-50 animate-pulse'
                    : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={isP1Confirmed}
                  onChange={(e) => handleP1Confirmation(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded text-blue-900 shrink-0"
                />
                <span className="text-[11px] lg:text-[12px] font-bold text-slate-700 leading-snug">
                  {t.check_p1}
                </span>
              </label>
            </div>

            {/* CHECKBOX 2: LEGAL (Dynamic Language) */}
            <div className="space-y-2">
              <label
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  isLegalConfirmed
                    ? 'bg-blue-50 border-blue-900 shadow-sm'
                    : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                } ${
                  showValidationErrors && !isLegalConfirmed
                    ? 'border-red-500 bg-red-50 animate-pulse'
                    : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={isLegalConfirmed}
                  onChange={(e) => setIsLegalConfirmed(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded text-blue-900 shrink-0"
                />
                <div className="text-[11px] lg:text-[12px] font-medium text-slate-700 leading-snug">
                  {/* GERMAN */}
                  {language === 'de' && (
                    <>
                      Ich habe die Allgemeinen Geschäftsbedingungen -{' '}
                      <DocLink code="AGB" text="AGB" /> und die{' '}
                      <DocLink code="WIDERRUF" text="Widerrufsbelehrung" /> zur
                      Kenntnis genommen und gelesen und bestätige den Abschluss
                      der <DocLink code="MANDAT" text="Mandatsvereinbarung" />{' '}
                      sowie der{' '}
                      <DocLink
                        code="RVG"
                        text="§ 3a RVG - Vergütungsvereinbarung"
                      />{' '}
                      und{' '}
                      <DocLink
                        code="EXECUTION"
                        text="beauftrage die sofortige Aufnahme der Tätigkeit"
                      />
                      .
                    </>
                  )}

                  {/* RUSSIAN */}
                  {language === 'ru' && (
                    <>
                      Я ознакомился(ась) с Общими условиями (
                      <DocLink
                        code="AGB"
                        text="AGB — Allgemeine Geschäftsbedingungen"
                      />
                      ) и Разъяснением о праве на отказ (
                      <DocLink code="WIDERRUF" text="Widerrufsbelehrung" />
                      ), прочитал(а) их и подтверждаю заключение Соглашения о
                      поручении (
                      <DocLink code="MANDAT" text="Mandatsvereinbarung" />) и
                      Соглашения о вознаграждении (
                      <DocLink
                        code="RVG"
                        text="§ 3a RVG — Vergütungsvereinbarung"
                      />
                      ), а также поручаю немедленное начало выполнения поручения
                      (
                      <DocLink
                        code="EXECUTION"
                        text="Beauftragung mit der sofortigen Aufnahme der Tätigkeit"
                      />
                      ).
                    </>
                  )}

                  {/* UKRAINIAN */}
                  {language === 'ua' && (
                    <>
                      Я ознайомився(лася) з Загальними умовами (
                      <DocLink
                        code="AGB"
                        text="AGB — Allgemeine Geschäftsbedingungen"
                      />
                      ) та Роз’ясненням про право на відмову (
                      <DocLink code="WIDERRUF" text="Widerrufsbelehrung" />
                      ), прочитав(ла) їх і підтверджую укладення Угоди про
                      доручення (
                      <DocLink code="MANDAT" text="Mandatsvereinbarung" />) та
                      Угоди про винагороду (
                      <DocLink
                        code="RVG"
                        text="§ 3a RVG — Vergütungsvereinbarung"
                      />
                      ), а також доручаю негайний початок виконання доручення (
                      <DocLink
                        code="EXECUTION"
                        text="Beauftragung mit der sofortigen Aufnahme der Tätigkeit"
                      />
                      ).
                    </>
                  )}
                </div>
              </label>
            </div>

            {/* CHECKBOX 3: DATA CONSENT */}
            <div className="space-y-2">
              <label
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  isDataConsent
                    ? 'bg-emerald-50 border-emerald-200'
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
                  {t.check_data}{' '}
                  <DocLink
                    code="PRIVACY"
                    text={`(${t.trans?.privacy || 'Datenschutzerklärung'})`}
                  />
                </span>
              </label>
            </div>

            <p className="text-[10px] text-slate-400 font-medium text-center">
              {t.mandatory_hint}
            </p>

            {serverError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 animate-in fade-in slide-in-from-bottom-2">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="text-xs font-medium leading-relaxed">
                  {serverError}
                </p>
              </div>
            )}

            <button
              onClick={handleProceed}
              disabled={isChecking}
              className={`w-full h-14 rounded-full font-black text-[13px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all ${
                isFormValid &&
                isP1Confirmed &&
                isLegalConfirmed &&
                isDataConsent
                  ? 'bg-blue-900 text-white active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isChecking ? (
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

      {/* DOCUMENT MODAL OVERLAY */}
      {activeDoc && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in"
            onClick={() => setActiveDoc(null)}
          ></div>
          <div className="relative bg-white w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3 text-blue-900">
                <File size={20} />
                <h3 className="font-bold text-lg">
                  {(DOCS as any)[activeDoc]?.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveDoc(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar leading-relaxed text-slate-600 text-sm">
              {(DOCS as any)[activeDoc]?.content}
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
              <button
                onClick={() => setActiveDoc(null)}
                className="w-full py-3 bg-blue-900 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
