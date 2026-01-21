import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Scale, FileText, Clock, Gavel, Octagon, Landmark, Layers } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const RisksSection: React.FC = () => {
  const { t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const risks = [
    {
      id: 1,
      title: t('b6_r1_t'),
      c: t('b6_r1_c'),
      d: t('b6_r1_d'),
      s: t('b6_r1_s'),
      icon: <Scale size={20} className="text-blue-900" />
    },
    {
      id: 2,
      title: t('b6_r2_t'),
      c: t('b6_r2_c'),
      d: t('b6_r2_d'),
      s: t('b6_r2_s'),
      icon: <FileText size={20} className="text-blue-900" />
    },
    {
      id: 3,
      title: t('b6_r3_t'),
      c: t('b6_r3_c'),
      d: t('b6_r3_d'),
      s: t('b6_r3_s'),
      icon: <Clock size={20} className="text-blue-900" />
    },
    {
      id: 4,
      title: t('b6_r4_t'),
      c: t('b6_r4_c'),
      d: t('b6_r4_d'),
      s: t('b6_r4_s'),
      icon: <Gavel size={20} className="text-blue-900" />
    },
    {
      id: 5,
      title: t('b6_r5_t'),
      c: t('b6_r5_c'),
      d: t('b6_r5_d'),
      s: t('b6_r5_s'),
      icon: <Octagon size={20} className="text-blue-900" />
    },
    {
      id: 6,
      title: t('b6_r6_t'),
      c: t('b6_r6_c'),
      d: t('b6_r6_d'),
      s: t('b6_r6_s'),
      icon: <Landmark size={20} className="text-blue-900" />
    }
  ];

  return (
    <section className="py-12 lg:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-4xl mb-10 text-center lg:text-left">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
            {t('b6_title')}
          </h2>
          <p className="text-base lg:text-lg text-slate-600 font-medium leading-normal max-w-2xl">
            {t('b6_lead')}
          </p>
        </div>

        {/* Risks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mb-10">
          {risks.map((risk, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className={`flex flex-col rounded-2xl p-5 lg:p-6 transition-all duration-300 border h-fit ${isOpen ? 'bg-blue-50/30 border-blue-100 shadow-sm' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg shrink-0 ${isOpen ? 'bg-white text-blue-900' : 'bg-white border border-slate-100'}`}>
                    {risk.icon}
                  </div>
                  <h3 className="text-[13px] lg:text-sm font-bold text-slate-900 leading-snug">{risk.title}</h3>
                </div>

                <div className="mb-4">
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('b6_consequence')}</p>
                   <p className="text-[13px] font-semibold text-slate-700 leading-tight">
                      {risk.c}
                   </p>
                </div>

                <button 
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className={`flex items-center justify-between w-full py-2 px-3.5 rounded-lg text-[11px] font-bold transition-all ${isOpen ? 'bg-blue-900 text-white' : 'bg-white text-slate-500 hover:text-blue-900 border border-slate-100'}`}
                >
                  <span className="flex items-center gap-2">
                    {t('b6_meaning')}
                  </span>
                  {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[400px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                   <div className="space-y-4 pt-4 border-t border-blue-100/50">
                      <p className="text-[13px] text-slate-600 leading-normal text-justify">
                         {risk.d}
                      </p>
                      <div className="bg-white/80 p-4 rounded-xl border border-blue-100/30">
                         <p className="text-[9px] font-bold text-blue-900 uppercase tracking-widest mb-1.5">{t('b6_solution_label')}</p>
                         <p className="text-[13px] text-slate-800 font-medium leading-normal">
                            {risk.s}
                         </p>
                      </div>
                   </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Accent */}
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl p-6 lg:p-10 text-white mb-8 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
          <div className="space-y-4 text-center">
             <p className="text-base lg:text-lg font-bold leading-normal">
                {t('b6_accent_1')}
             </p>
             <p className="text-base lg:text-lg font-bold text-blue-400 leading-normal">
                {t('b6_accent_2')}
             </p>
          </div>
        </div>

        {/* Connection text */}
        <div className="max-w-full mx-auto flex items-center justify-center gap-3 p-4">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-900 shrink-0">
             <Layers size={18} />
          </div>
          <p className="text-[11px] lg:text-xs text-slate-500 font-medium italic whitespace-nowrap">
            {t('b6_steps')}
          </p>
        </div>

      </div>
    </section>
  );
};