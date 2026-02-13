import React from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const TargetAudience: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="audience" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">{t('aud_title')}</h2>
          <p className="mt-4 text-slate-600">{t('aud_subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 uppercase tracking-wider border-b border-slate-100 pb-2">{t('aud_box_title')}</h3>
            <ul className="space-y-4">
                {[
                    t('aud_list_1'),
                    t('aud_list_2'),
                    t('aud_list_3'),
                    t('aud_list_4'),
                    t('aud_list_5')
                ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 bg-emerald-100 p-1 rounded-full">
                            <Check size={16} className="text-emerald-700" />
                        </div>
                        <span className="text-lg text-slate-700">{item}</span>
                    </li>
                ))}
            </ul>
        </div>

        <div className="mt-10 text-center">
            <p className="text-xl font-serif text-slate-500 italic">
                {t('aud_quote')}
            </p>
        </div>
      </div>
    </section>
  );
};