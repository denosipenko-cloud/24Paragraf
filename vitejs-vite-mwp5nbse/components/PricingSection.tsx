import React, { useState } from 'react';
import { Check, Info, User, Users, RefreshCw } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { PackageDetailsModal_v1 } from './PackageDetailsModal_v1';
// Импортируем модальные окна оплаты
import { P1PreCheckoutModal_v2 } from './P1PreCheckoutModal_v2';
import { P2PreCheckoutModal } from './P2PreCheckoutModal';
import { P3PreCheckoutModal } from './P3PreCheckoutModal';
import { P4PreCheckoutModal } from './P4PreCheckoutModal';

// --- МОЗГ: БАЗА ТЕКСТОВ ---
const pricingContent = {
  ru: {
    section: {
      title: 'ПАКЕТЫ УСЛУГ',
      subtitle:
        'Прозрачное ценообразование. Единая точка входа. Возможность зачёта оплат.',
      details: 'ПОДРОБНЕЕ',
      vat: 'включая 19% USt',
      caps: { self: 'Сам', family: 'Семья', upgrade: 'Апгрейд' },
      badge_locked: 'ДОСТУПНО ПОСЛЕ СТАРТОВОГО',
      upgrade_note:
        'Апгрейд возможен в любое время. Сумма зачёта и итоговая доплата прозрачно отображаются в окне оформления заказа.',
    },
    packages: [
      {
        id: 1,
        num: 'Пакет №1',
        name: '«Стартовый»',
        subtitle: 'ЮРИДИЧЕСКАЯ ОРИЕНТАЦИЯ И СТРАТЕГИЯ',
        features: [
          'Индивидуальная оценка',
          'Стратегия перехода',
          'Анализ параграфов',
          'Оценка готовности',
        ],
        cta: 'НАЧАТЬ',
      },
      {
        id: 2,
        num: 'Пакет №2',
        name: '«Самостоятельный»',
        subtitle: 'РЕШЕНИЕ ДЛЯ САМОСТОЯТЕЛЬНОЙ ПОДАЧИ',
        features: [
          'Всё из «Стартового»',
          'Формуляры и примеры заполнения',
          'Сопроводительное письмо',
          'Инструкция и чек-лист',
        ],
        cta: 'КУПИТЬ',
      },
      {
        id: 3,
        num: 'Пакет №3',
        name: '«Адвокатский»',
        subtitle: 'АДВОКАТСКОЕ ПРЕДСТАВИТЕЛЬСТВО',
        features: [
          'Всё из «Самостоятельного»',
          'Подача через канцелярию',
          'Доверенность',
          'Коммуникация с ведомством',
          'Контроль сроков',
        ],
        cta: 'КУПИТЬ',
      },
      {
        id: 4,
        num: 'Пакет №4',
        name: '«Премиум»',
        subtitle: 'МАКСИМАЛЬНАЯ ЗАЩИТА И СУД',
        features: [
          'Всё из «Адвокатского»',
          'Параллельный статус',
          'Иск о бездействии',
          'Судебное представительство',
        ],
        cta: 'КУПИТЬ',
      },
    ],
  },
  de: {
    section: {
      title: 'LEISTUNGSPAKETE',
      subtitle:
        'Transparente Preisgestaltung. Ein zentraler Einstiegspunkt. Möglichkeit der Zahlungsanrechnung.',
      details: 'DETAILS',
      vat: 'inkl. 19% USt',
      caps: { self: 'Selbst', family: 'Familie', upgrade: 'Upgrade' },
      badge_locked: 'VERFÜGBAR NACH DEM START-PAKET',
      upgrade_note:
        'Ein Upgrade ist jederzeit möglich. Der Anrechnungsbetrag und die endgültige Zuzahlung werden im Bestellfenster transparent angezeigt.',
    },
    packages: [
      {
        id: 1,
        num: 'Paket №1',
        name: '«Start»',
        subtitle: 'RECHTLICHE ORIENTIERUNG & STRATEGIE',
        features: [
          'Individuelle Einschätzung',
          'Migrationsstrategie & Fahrplan',
          'Analyse der Rechtsgrundlagen',
          'Prüfung der Erfolgsaussichten',
        ],
        cta: 'STARTEN',
      },
      {
        id: 2,
        num: 'Paket №2',
        name: '«Selbstständig»',
        subtitle: 'LÖSUNG FÜR DIE EIGENSTÄNDIGE ANTRAGSTELLUNG',
        features: [
          'Alles aus dem Paket Start',
          'Formulare & Ausfüllhilfen',
          'Juristisches Anschreiben',
          'Anleitung & Checkliste',
        ],
        cta: 'KAUFEN',
      },
      {
        id: 3,
        num: 'Paket №3',
        name: '«Anwaltlich»',
        subtitle: 'ANWALTLICHE VERTRETUNG',
        features: [
          'Alles aus dem Paket Selbstständig',
          'Antragstellung durch die Kanzlei',
          'Anwaltliche Vollmacht',
          'Kommunikation mit Behörden',
          'Fristenkontrolle',
        ],
        cta: 'KAUFEN',
      },
      {
        id: 4,
        num: 'Paket №4',
        name: '«Premium»',
        subtitle: 'MAXIMALER SCHUTZ & KLAGE',
        features: [
          'Alles aus dem Paket Anwalt',
          'Parallel-Status & Duldung',
          'Untätigkeitsklage',
          'Gerichtliche Vertretung',
        ],
        cta: 'KAUFEN',
      },
    ],
  },
  ua: {
    section: {
      title: 'ПАКЕТИ ПОСЛУГ',
      subtitle:
        'Прозоре ціноутворення. Єдина точка входу. Можливість зарахування оплат.',
      details: 'ДЕТАЛЬНІШЕ',
      vat: 'включаючи 19% USt',
      caps: { self: 'Сам', family: "Сім'я", upgrade: 'Апгрейд' },
      badge_locked: 'ДОСТУПНО ПІСЛЯ СТАРТОВОГО',
      upgrade_note:
        'Апгрейд можливий у будь-який час. Сума зарахування та підсумкова доплата прозоро відображаються у вікні оформлення замовлення.',
    },
    packages: [
      {
        id: 1,
        num: 'Пакет №1',
        name: '«Стартовий»',
        subtitle: 'ЮРИДИЧНА ОРІЄНТАЦІЯ ТА СТРАТЕГІЯ',
        features: [
          'Індивідуальна оцінка',
          'Стратегія переходу',
          'Аналіз параграфів',
          'Оцінка готовності',
        ],
        cta: 'РОЗПОЧАТИ',
      },
      {
        id: 2,
        num: 'Пакет №2',
        name: '«Самостійний»',
        subtitle: 'РІШЕННЯ ДЛЯ САМОСТІЙНОЇ ПОДАЧИ',
        features: [
          'Все зі «Стартового»',
          'Формуляри та зразки заповнення',
          'Супровідний лист',
          'Інструкція та чек-лист',
        ],
        cta: 'КУПИТИ',
      },
      {
        id: 3,
        num: 'Пакет №3',
        name: '«Адвокатський»',
        subtitle: 'АДВОКАТСЬКЕ ПРЕДСТАВНИЦТВО',
        features: [
          'Все із «Самостійного»',
          'Подача через канцелярію',
          'Довіреність',
          'Комунікація з відомством',
          'Контроль строків',
        ],
        cta: 'КУПИТИ',
      },
      {
        id: 4,
        num: 'Пакет №4',
        name: '«Преміум»',
        subtitle: 'МАКСИМАЛЬНИЙ ЗАХИСТ ТА СУД',
        features: [
          'Все з «Адвокатського»',
          'Паралельний статус',
          'Позов про бездіяльність',
          'Судове представництво',
        ],
        cta: 'КУПИТИ',
      },
    ],
  },
};

// --- КОМПОНЕНТ ---
export const PricingSection: React.FC = () => {
  const { language } = useLanguage();
  const currentLangData =
    (pricingContent as any)[language] || pricingContent.ru;
  const { section, packages: packagesData } = currentLangData;

  // Состояния для модалок
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsPkgId, setDetailsPkgId] = useState<number | null>(null);
  const [checkoutPkgId, setCheckoutPkgId] = useState<number | null>(null);

  const packages = packagesData.map((pkg: any) => ({
    ...pkg,
    price: pkg.id === 1 ? 249 : pkg.id === 2 ? 649 : pkg.id === 3 ? 949 : 1999,
    borderColor: 'border-blue-600 border-2 shadow-xl',
    subColor: 'text-blue-600',
    bgHeader: pkg.id === 1 ? 'bg-blue-50/50' : 'bg-white',
    badge: pkg.id === 1 ? null : section.badge_locked,
  }));

  const handleCta = (id: number) => {
    setCheckoutPkgId(id);
  };

  const closeCheckout = () => {
    setCheckoutPkgId(null);
  };

  const handleProceedPayment = (amount: number, name: string) => {
    console.log(`Proceeding: ${name} for ${amount}`);
  };

  return (
    <section
      id="assessment"
      className="py-16 lg:py-24 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">
            {section.title}
          </h2>
          <p className="text-base lg:text-lg text-slate-500 font-bold max-w-2xl mx-auto leading-normal">
            {section.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {packages.map((pkg: any) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col rounded-[20px] overflow-hidden transition-all duration-300 border h-full ${pkg.borderColor} bg-white group hover:shadow-2xl`}
            >
              {/* Badge area (Серый бейдж "Доступно после...") */}
              <div className="h-10 flex items-center justify-center mt-3">
                {pkg.badge && (
                  <span className="bg-slate-100 text-slate-500 text-[9px] lg:text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                    {pkg.badge}
                  </span>
                )}
              </div>

              {/* Title Header area */}
              <div
                className={`${pkg.bgHeader} p-6 flex flex-col items-center justify-center text-center h-32`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs lg:text-sm font-bold text-slate-500 uppercase tracking-tighter mb-0.5">
                    {pkg.num}
                  </span>
                  <h3 className="text-sm lg:text-base font-black text-slate-900 mb-2 tracking-tight leading-tight px-2">
                    {pkg.name}
                  </h3>
                </div>
                <p
                  className={`text-[9px] lg:text-[10px] font-black uppercase tracking-widest leading-snug px-4 ${pkg.subColor} h-8 flex items-center`}
                >
                  {pkg.subtitle}
                </p>
              </div>

              <div className="h-px bg-slate-100 mx-6"></div>

              <div className="px-6 py-8 flex flex-col flex-grow">
                {/* Price area (+ VAT Note) */}
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter leading-none">
                      {pkg.price} €
                    </span>
                  </div>
                  {/* VAT Note - под ценой */}
                  <span className="text-[10px] text-slate-400 font-bold mt-1">
                    {section.vat}
                  </span>
                </div>

                {/* Icons area */}
                <div className="h-16 mb-8 flex items-center justify-center">
                  {pkg.id === 1 ? (
                    <div className="flex flex-col items-center gap-1">
                      <RefreshCw size={16} className="text-blue-600" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {section.caps.upgrade}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-6">
                      <div className="flex flex-col items-center gap-1">
                        <User size={16} className="text-blue-600" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {section.caps.self}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Users size={16} className="text-blue-600" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {section.caps.family}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <RefreshCw size={16} className="text-blue-600" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {section.caps.upgrade}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* UPGRADE NOTE - По центру */}
                <div className="mb-6 flex items-center justify-center min-h-[48px]">
                  <p className="text-[11px] lg:text-[12px] font-medium text-blue-600 leading-tight text-center px-1">
                    {section.upgrade_note}
                  </p>
                </div>

                {/* Features area - Уменьшенный отступ (space-y-2) */}
                <div className="space-y-2 mb-6 flex-grow">
                  {pkg.features.map((feat: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="shrink-0 p-0.5 rounded-full bg-blue-100 text-blue-600">
                        <Check size={14} strokeWidth={4} />
                      </div>
                      <span className="text-[12px] text-slate-700 font-medium leading-tight">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer area */}
                <div className="mt-auto">
                  <div className="mb-8 text-center flex items-center justify-center gap-1.5 h-6">
                    <Info size={14} className="text-blue-600" />
                    <button
                      onClick={() => {
                        setDetailsPkgId(pkg.id);
                        setIsDetailsOpen(true);
                      }}
                      className="text-[11px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-transform duration-300 hover:scale-110 underline decoration-blue-200 underline-offset-4"
                    >
                      {section.details}
                    </button>
                  </div>

                  <button
                    onClick={() => handleCta(pkg.id)}
                    className={`w-full h-12 lg:h-14 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 px-6 bg-blue-900 text-white hover:bg-blue-800`}
                  >
                    {pkg.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {isDetailsOpen && (
        <PackageDetailsModal_v1
          pkgId={detailsPkgId || 1}
          onClose={() => setIsDetailsOpen(false)}
          onStart={() => {
            setIsDetailsOpen(false);
            handleCta(detailsPkgId || 1);
          }}
        />
      )}

      {/* Checkout Modals */}
      {checkoutPkgId === 1 && (
        <P1PreCheckoutModal_v2
          onClose={closeCheckout}
          onProceed={handleProceedPayment}
        />
      )}
      {checkoutPkgId === 2 && (
        <P2PreCheckoutModal
          onClose={closeCheckout}
          onProceed={handleProceedPayment}
        />
      )}
      {checkoutPkgId === 3 && (
        <P3PreCheckoutModal
          onClose={closeCheckout}
          onProceed={handleProceedPayment}
        />
      )}
      {checkoutPkgId === 4 && (
        <P4PreCheckoutModal
          onClose={closeCheckout}
          onProceed={handleProceedPayment}
        />
      )}
    </section>
  );
};
