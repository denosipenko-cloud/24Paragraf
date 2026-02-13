import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  UserCheck,
  Briefcase,
  GraduationCap,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const ProblemAnalysis: React.FC = () => {
  const { t, language } = useLanguage();
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  // --- ЛОКАЛЬНЫЕ ТЕКСТЫ (ЗАМЕНА ДЛИННОГО БЛОКА) ---
  const problemContent = {
    ru: {
      title: 'Какой путь правильный?',
      subtitle:
        'Мы анализируем Вашу ситуацию и находим индивидуальную стратегию.',
    },
    de: {
      title: 'Welcher Weg ist der richtige?',
      subtitle:
        'Wir analysieren Ihre Situation und finden eine individuelle Strategie.',
    },
    ua: {
      title: 'Який шлях правильний?',
      subtitle:
        'Ми аналізуємо Вашу ситуацію та знаходимо індивідуальну стратегію.',
    },
  };

  const currentText = (problemContent as any)[language] || problemContent.ru;

  // Accordion items остаются из глобальных переводов, как и были
  const accordionItems = [
    {
      title: t('b2_acc1_t'),
      text: t('b2_acc1_txt'),
      icon: <BookOpen className="text-blue-900" size={18} />,
    },
    {
      title: t('b2_acc2_t'),
      text: t('b2_acc2_txt'),
      icon: <UserCheck className="text-blue-900" size={18} />,
    },
    {
      title: t('b2_acc3_t'),
      text: t('b2_acc3_txt'),
      icon: <GraduationCap className="text-blue-900" size={18} />,
    },
    {
      title: t('b2_acc4_t'),
      text: t('b2_acc4_txt'),
      icon: <Users className="text-blue-900" size={18} />,
    },
    {
      title: t('b2_acc5_t'),
      text: t('b2_acc5_txt'),
      icon: <Briefcase className="text-blue-900" size={18} />,
    },
    {
      title: t('b2_acc6_t'),
      text: t('b2_acc6_txt'),
      icon: <ShieldCheck className="text-blue-900" size={18} />,
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Column - ОБНОВЛЕНО */}
        <div className="max-w-4xl mb-10">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 text-center lg:text-left leading-tight tracking-tight">
            {currentText.title}
          </h2>

          <p className="text-lg lg:text-xl text-blue-900 font-medium leading-relaxed text-center lg:text-left">
            {currentText.subtitle}
          </p>
        </div>

        {/* Accordion Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 items-start">
          {accordionItems.map((item, idx) => (
            <div
              key={idx}
              className={`border rounded-xl transition-all duration-300 h-fit ${
                openItems.has(idx)
                  ? 'border-blue-200 bg-blue-50/30 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <button
                onClick={() => toggleItem(idx)}
                className="w-full flex items-center justify-between p-3.5 lg:p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
                aria-expanded={openItems.has(idx)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg transition-colors shrink-0 ${
                      openItems.has(idx)
                        ? 'bg-blue-100 shadow-inner'
                        : 'bg-slate-50'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="font-bold text-slate-900 text-[13px] lg:text-sm pr-2 leading-snug">
                    {item.title}
                  </span>
                </div>
                <div className="text-slate-400 shrink-0">
                  {openItems.has(idx) ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openItems.has(idx)
                    ? 'max-h-[500px] opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 pb-4 lg:px-6 lg:pb-5 text-slate-600 text-xs lg:text-sm leading-normal border-t border-slate-100 pt-3 mt-1 text-justify">
                  {item.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
