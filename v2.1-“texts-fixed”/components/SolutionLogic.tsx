import React from 'react';
import { ClipboardCheck, Cpu, FileSearch } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const SolutionLogic: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      title: t('b3_s1_t'),
      text: t('b3_s1_txt'),
      icon: <ClipboardCheck size={40} className="text-blue-900" />
    },
    {
      title: t('b3_s2_t'),
      text: t('b3_s2_txt'),
      icon: <Cpu size={40} className="text-blue-900" />
    },
    {
      title: t('b3_s3_t'),
      text: t('b3_s3_txt'),
      icon: <FileSearch size={40} className="text-blue-900" />
    }
  ];

  return (
    <section className="py-12 lg:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-4xl mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 leading-tight">
            {t('b3_title')}
          </h2>
          <p className="text-base lg:text-lg text-slate-600 leading-normal">
            {t('b3_intro')}
          </p>
        </div>

        {/* Steps Grid - NO NUMBERS */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-start lg:items-center text-left lg:text-center group">
              {/* Icon Container */}
              <div className="mb-6 p-5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
                {step.icon}
              </div>
              
              {/* Step Title & Text */}
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm lg:text-[15px] leading-normal">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Final Accent */}
        <div className="mt-12 pt-8 border-t border-slate-200">
           <div className="max-w-3xl mx-auto text-center">
              <p className="text-base lg:text-lg font-medium text-slate-800 italic leading-normal">
                 "{t('b3_outro')}"
              </p>
           </div>
        </div>

      </div>
    </section>
  );
};