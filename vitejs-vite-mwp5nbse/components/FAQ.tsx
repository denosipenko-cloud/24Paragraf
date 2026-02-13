import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const FAQ: React.FC = () => {
    const { t } = useLanguage();
    const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

    const toggleIndex = (idx: number) => {
        const newIndices = new Set(openIndices);
        if (newIndices.has(idx)) {
            newIndices.delete(idx);
        } else {
            newIndices.add(idx);
        }
        setOpenIndices(newIndices);
    };

    const faqs = [
        { q: t('faq_q1'), a: t('faq_a1') },
        { q: t('faq_q2'), a: t('faq_a2') },
        { q: t('faq_q3'), a: t('faq_a3') },
        { q: t('faq_q4'), a: t('faq_a4') },
        { q: t('faq_q5'), a: t('faq_a5') },
        { q: t('faq_q6'), a: t('faq_a6') },
        { q: t('faq_q7'), a: t('faq_a7') },
    ];

    return (
        <section id="faq" className="py-12 lg:py-16 bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center mb-10">
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                    {t('faq_title')}
                  </h2>
                </div>

                {/* FAQ List */}
                <div className="space-y-3 mb-12">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndices.has(idx);
                        return (
                            <div key={idx} className={`bg-white border transition-all duration-300 rounded-xl overflow-hidden ${isOpen ? 'border-blue-100 shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}>
                                <button 
                                    onClick={() => toggleIndex(idx)}
                                    className="w-full px-5 py-4 text-left flex justify-between items-center focus:outline-none group"
                                    aria-expanded={isOpen}
                                >
                                    <span className={`font-semibold text-[13px] lg:text-[15px] leading-snug transition-colors ${isOpen ? 'text-blue-900' : 'text-slate-800 group-hover:text-blue-900'}`}>
                                      {faq.q}
                                    </span>
                                    <div className={`shrink-0 ml-3 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-900' : 'text-slate-400'}`}>
                                      <ChevronDown size={18} />
                                    </div>
                                </button>
                                
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100 border-t border-slate-50' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-5 py-4 lg:px-7 lg:py-5 text-slate-600 text-xs lg:text-[14px] leading-normal whitespace-pre-line text-justify">
                                        {faq.a}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Micro-text */}
                <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
                  <p className="text-[13px] lg:text-[14px] text-slate-600 font-medium leading-normal italic">
                    {t('faq_footer')}
                  </p>
                </div>

            </div>
        </section>
    );
};