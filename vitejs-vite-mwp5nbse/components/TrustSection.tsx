import React from 'react';

export const TrustSection: React.FC = () => {
  return (
    <section id="trust" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Юридическая экспертиза</h2>
        
        <div className="bg-slate-50 rounded-2xl p-8 max-w-3xl mx-auto border border-slate-200">
          <p className="text-lg text-slate-700 italic mb-6">
            «Мы создали UA2DE, чтобы заменить хаос системной юридической логикой. 
            Наша цель — не просто консультация, а реальный результат: ВНЖ и гражданство.»
          </p>
          <div className="flex flex-col items-center">
             <div className="w-16 h-16 bg-slate-300 rounded-full mb-3 flex items-center justify-center text-slate-500 font-bold text-xl">
               K
             </div>
             <h4 className="font-bold text-slate-900">Kanzlei Klamert & Partner</h4>
             <p className="text-sm text-slate-500">Мюнхен, Германия</p>
          </div>
        </div>
      </div>
    </section>
  );
};