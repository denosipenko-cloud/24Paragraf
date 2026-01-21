import React from 'react';
import { ArrowRight, Milestone } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface FinalCTAProps {
  onCtaClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onCtaClick }) => {
  const { t } = useLanguage();

  return (
    <section className="py-12 lg:py-16 bg-white relative overflow-hidden text-center">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1e3a8a 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        {/* Abstract Symbol */}
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-xl text-blue-900 mb-6 shadow-sm">
          <Milestone size={28} strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 tracking-tight leading-tight w-full">
          {t('final_cta_title')}
        </h2>

        {/* Lead Text */}
        <p className="text-base lg:text-lg text-slate-600 mb-8 leading-normal w-full whitespace-pre-line">
          {t('final_cta_lead')}
        </p>

        {/* Main CTA Button */}
        <div className="mb-4">
          <button 
            onClick={onCtaClick}
            className="w-full sm:w-auto px-8 py-4 bg-blue-900 hover:bg-blue-800 text-white font-bold text-lg rounded-xl shadow hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 mx-auto"
          >
            {t('final_cta_btn')}
            <ArrowRight size={18} className="opacity-80" />
          </button>
        </div>

        {/* Micro-text under button */}
        <p className="text-[11px] text-slate-500 font-medium mb-10 max-w-sm mx-auto leading-normal">
          {t('final_cta_sub')}
        </p>

        {/* Trust Trigger */}
        <div className="pt-8 border-t border-slate-100 w-full">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            {t('final_cta_trust')}
          </p>
        </div>

      </div>
    </section>
  );
};
