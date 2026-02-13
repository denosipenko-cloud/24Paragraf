import React from 'react';
import { ClipboardCheck, Cpu, FileSearch } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const SolutionLogic: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      title: t('b3_s1_t'),
      text: t('b3_s1_txt'),
      icon: <ClipboardCheck size={20} className="text-blue-900" />,
    },
    {
      title: t('b3_s2_t'),
      text: t('b3_s2_txt'),
      icon: <Cpu size={20} className="text-blue-900" />,
    },
    {
      title: t('b3_s3_t'),
      text: t('b3_s3_txt'),
      icon: <FileSearch size={20} className="text-blue-900" />,
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Текст теперь полностью отцентрован */}
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 leading-tight">
            {t('b3_title')}
          </h2>
          <p className="text-base lg:text-lg text-slate-600 leading-normal">
            {t('b3_intro')}
          </p>
        </div>

        {/* Steps Grid - Всегда 3 в ряд на десктопе для симметрии */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-full"
            >
              {/* Компактный контейнер иконки */}
              <div className="shrink-0 p-2.5 bg-slate-50 rounded-xl">
                {step.icon}
              </div>

              {/* Контент шага */}
              <div className="flex-grow">
                <h3 className="text-base font-bold text-slate-900 mb-1 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-[13px] lg:text-sm leading-snug">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Финальный акцент */}
        <div className="mt-10 pt-8 border-t border-slate-200">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm lg:text-base font-medium text-slate-800 italic leading-normal">
              "{t('b3_outro')}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
