import React from 'react';
import { useLanguage } from '../LanguageContext';

export const AboutFirm: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">{t('about_title')}</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                <div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">DE</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide whitespace-pre-line">{t('about_de')}</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">§</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide whitespace-pre-line">{t('about_lic')}</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">Mun</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide whitespace-pre-line">{t('about_mun')}</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">100%</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide whitespace-pre-line">{t('about_pure')}</div>
                </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 inline-block text-left">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">K</div>
                    <div>
                        <h4 className="font-bold text-slate-900">Kanzlei Klamert & Partner</h4>
                        <p className="text-sm text-slate-500">Rechtsanwälte</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};