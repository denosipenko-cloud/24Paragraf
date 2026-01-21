import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface PackageProps {
  onSelect: () => void;
}

export const PackageAssessment: React.FC<PackageProps> = ({ onSelect }) => {
  const { t } = useLanguage();

  return (
    <section id="assessment" className="py-20 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="bg-blue-600 py-3 text-center text-sm font-bold uppercase tracking-widest text-white">
                {t('pkg_badge')}
            </div>
            
            <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">{t('pkg_title')}</h2>
                        <p className="text-slate-400 text-sm max-w-md">
                            {t('pkg_desc')}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="block text-4xl font-bold text-white">150 €</span>
                        <span className="text-slate-500 text-sm">{t('pkg_price_sub')}</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 border-t border-slate-700 pt-8">
                    <div>
                        <h4 className="font-semibold text-white mb-4">{t('pkg_includes')}</h4>
                        <ul className="space-y-3">
                            {[
                                t('pkg_item_1'),
                                t('pkg_item_2'),
                                t('pkg_item_3'),
                                t('pkg_item_4')
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300">
                                    <Check size={18} className="text-blue-500 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                         <h4 className="font-semibold text-amber-400 mb-2 text-sm uppercase">{t('pkg_imp_title')}</h4>
                         <p className="text-slate-300 text-sm leading-relaxed">
                            {t('pkg_imp_text_pre')} 
                            <span className="text-white font-bold">{t('pkg_imp_pos')}</span>, 
                            <span className="text-white font-bold">{t('pkg_imp_cond')}</span>{t('language') === 'de' ? ' oder ' : ' или '}
                            <span className="text-white font-bold">{t('pkg_imp_neg')}</span>
                            {t('pkg_imp_text_post')}
                         </p>
                    </div>
                </div>

                <div className="mt-10">
                    <button 
                        onClick={onSelect}
                        className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-lg py-4 rounded-xl shadow-lg transition-transform transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        {t('pkg_cta')}
                        <ArrowRight size={20} />
                    </button>
                    <p className="text-center text-slate-500 text-xs mt-4">
                        {t('pkg_secure')}
                    </p>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};