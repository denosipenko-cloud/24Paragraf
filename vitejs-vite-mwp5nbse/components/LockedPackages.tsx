import React from 'react';
import { Lock } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const LockedPackages: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* BLOCK 6: Advanced */}
          <div className="relative group">
             {/* Overlay */}
             <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center border-2 border-slate-100 rounded-2xl text-center p-6">
                <div className="bg-slate-100 p-4 rounded-full mb-4 text-slate-400">
                    <Lock size={32} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{t('lock_overlay_assess')}</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-xs">
                    {t('lock_overlay_assess_desc')}
                </p>
             </div>

             {/* Content (Blurred visual) */}
             <div className="bg-white border border-slate-200 rounded-2xl p-8 opacity-40 grayscale pointer-events-none select-none h-full">
                <div className="uppercase tracking-wide text-xs font-bold text-slate-400 mb-2">{t('language') === 'de' ? 'Paket Nr. 2' : 'Пакет №2'}</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6">{t('lock_pkg2_name')}</h3>
                <ul className="space-y-4 text-slate-600">
                    <li className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-400 rounded-full"></div> {t('lock_pkg2_l1')}</li>
                    <li className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-400 rounded-full"></div> {t('lock_pkg2_l2')}</li>
                    <li className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-400 rounded-full"></div> {t('lock_pkg2_l3')}</li>
                </ul>
             </div>
          </div>

          {/* BLOCK 7: Premium */}
          <div className="relative group">
             {/* Overlay */}
             <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center border-2 border-slate-100 rounded-2xl text-center p-6">
                <div className="bg-slate-100 p-4 rounded-full mb-4 text-slate-400">
                    <Lock size={32} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{t('lock_overlay_violation')}</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-xs">
                    {t('lock_overlay_violation_desc')}
                </p>
             </div>

             {/* Content (Blurred visual) */}
             <div className="bg-white border border-slate-200 rounded-2xl p-8 opacity-40 grayscale pointer-events-none select-none h-full">
                <div className="uppercase tracking-wide text-xs font-bold text-slate-400 mb-2">{t('language') === 'de' ? 'Paket Nr. 3' : 'Пакет №3'}</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6">{t('lock_pkg3_name')}</h3>
                <ul className="space-y-4 text-slate-600">
                    <li className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-400 rounded-full"></div> {t('lock_pkg3_l1')}</li>
                    <li className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-400 rounded-full"></div> {t('lock_pkg3_l2')}</li>
                    <li className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-400 rounded-full"></div> {t('lock_pkg3_l3')}</li>
                </ul>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};