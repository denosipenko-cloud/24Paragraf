import React from 'react';
import { ClipboardList, FileText, Scale } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const ProcessLogic: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="process" className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">{t('proc_title')}</h2>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto text-sm lg:text-base leading-normal">
            {t('proc_subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 text-center relative">
          
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-slate-100 -z-10"></div>

          {/* Step 1 */}
          <div className="bg-white p-4">
            <div className="w-20 h-20 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-md border-4 border-white">
               <ClipboardList size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{t('proc_step1_title')}</h3>
            <p className="text-slate-600 text-xs lg:text-sm leading-normal">
              {t('proc_step1_desc')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-4">
             <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-white shadow-sm">
               <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{t('proc_step2_title')}</h3>
            <p className="text-slate-600 text-xs lg:text-sm leading-normal">
              {t('proc_step2_desc')}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-4">
             <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-white shadow-sm">
               <Scale size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{t('proc_step3_title')}</h3>
            <p className="text-slate-600 text-xs lg:text-sm leading-normal">
              {t('proc_step3_desc')}
            </p>
          </div>

        </div>

        <div className="mt-10 text-center">
           <div className="bg-blue-50 py-3 px-6 rounded-xl inline-block border border-blue-100 shadow-sm">
             <p className="text-blue-900 font-bold text-xs lg:text-sm">
               {t('proc_bottom')}
             </p>
           </div>
        </div>
      </div>
    </section>
  );
};