import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const Disclaimer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-slate-50 border-b border-slate-200 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-4">
            <AlertCircle className="text-slate-400" size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-4">{t('pkg_title')}:</h3>
        <ul className="text-slate-600 text-sm space-y-2 mb-6">
            <li>• {t('disc_list_1')}</li>
            <li>• {t('disc_list_2')}</li>
            <li>• {t('disc_list_3')}</li>
            <li>• {t('disc_list_4')}</li>
        </ul>
        <p className="font-serif italic text-slate-500 text-lg">
            {t('disc_quote')}
        </p>
      </div>
    </section>
  );
};