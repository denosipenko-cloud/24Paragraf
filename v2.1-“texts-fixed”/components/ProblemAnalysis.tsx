import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, UserCheck, Briefcase, GraduationCap, Users, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const ProblemAnalysis: React.FC = () => {
  const { t } = useLanguage();
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const accordionItems = [
    { title: t('b2_acc1_t'), text: t('b2_acc1_txt'), icon: <BookOpen className="text-blue-900" size={18} /> },
    { title: t('b2_acc2_t'), text: t('b2_acc2_txt'), icon: <UserCheck className="text-blue-900" size={18} /> },
    { title: t('b2_acc3_t'), text: t('b2_acc3_txt'), icon: <GraduationCap className="text-blue-900" size={18} /> },
    { title: t('b2_acc4_t'), text: t('b2_acc4_txt'), icon: <Users className="text-blue-900" size={18} /> },
    { title: t('b2_acc5_t'), text: t('b2_acc5_txt'), icon: <Briefcase className="text-blue-900" size={18} /> },
    { title: t('b2_acc6_t'), text: t('b2_acc6_txt'), icon: <ShieldCheck className="text-blue-900" size={18} /> },
  ];

  return (
    <section className="py-12 lg:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Column */}
        <div className="max-w-4xl mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6 text-center lg:text-left leading-tight">
            {t('b2_title')}
          </h2>

          {/* Static Content */}
          <div className="space-y-3 mb-8 text-slate-700 leading-normal text-center lg:text-left text-sm lg:text-base">
            <p className="font-semibold text-slate-900">
              {t('b2_static_p1')}
            </p>
            <p>
              {t('b2_static_p2')}
            </p>
            <p className="font-semibold text-blue-900">
              {t('b2_static_p3')}
            </p>
            <p>
              {t('b2_static_p4')}
            </p>
          </div>
        </div>

        {/* Accordion Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 items-start">
          {accordionItems.map((item, idx) => (
            <div 
              key={idx} 
              className={`border rounded-xl transition-all duration-300 h-fit ${openItems.has(idx) ? 'border-blue-200 bg-blue-50/30 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}
            >
              <button
                onClick={() => toggleItem(idx)}
                className="w-full flex items-center justify-between p-3.5 lg:p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
                aria-expanded={openItems.has(idx)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors shrink-0 ${openItems.has(idx) ? 'bg-blue-100 shadow-inner' : 'bg-slate-50'}`}>
                    {item.icon}
                  </div>
                  <span className="font-bold text-slate-900 text-[13px] lg:text-sm pr-2 leading-snug">
                    {item.title}
                  </span>
                </div>
                <div className="text-slate-400 shrink-0">
                  {openItems.has(idx) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openItems.has(idx) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-4 pb-4 lg:px-6 lg:pb-5 text-slate-600 text-xs lg:text-sm leading-normal border-t border-slate-100 pt-3 mt-1 text-justify">
                  {item.text}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};