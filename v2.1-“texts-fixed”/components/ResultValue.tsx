import React, { useState } from 'react';
import { Compass, ShieldAlert, FileStack, Map, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const ResultValue: React.FC = () => {
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

  const results = [
    {
      title: t('b4_r1_t'),
      text: t('b4_r1_txt'),
      icon: <Compass size={20} className="text-blue-900" />
    },
    {
      title: t('b4_r2_t'),
      text: t('b4_r2_txt'),
      icon: <ShieldAlert size={20} className="text-blue-900" />
    },
    {
      title: t('b4_r3_t'),
      text: t('b4_r3_txt'),
      icon: <FileStack size={20} className="text-blue-900" />
    },
    {
      title: t('b4_r4_t'),
      text: t('b4_r4_txt'),
      icon: <Map size={20} className="text-blue-900" />
    }
  ];

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-4xl mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 leading-tight">
            {t('b4_title')}
          </h2>
          <p className="text-base lg:text-lg text-slate-600 leading-normal">
            {t('b4_intro')}
          </p>
        </div>

        {/* Results Accordion Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mb-12 items-start">
          {results.map((result, idx) => (
            <div 
              key={idx} 
              className={`border rounded-2xl transition-all duration-300 h-fit ${openItems.has(idx) ? 'border-blue-100 bg-blue-50/20 shadow-sm' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'}`}
            >
              <button
                onClick={() => toggleItem(idx)}
                className="w-full flex items-center justify-between p-4 lg:p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl"
                aria-expanded={openItems.has(idx)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-colors shrink-0 ${openItems.has(idx) ? 'bg-white shadow-sm' : 'bg-white border border-slate-100'}`}>
                    {result.icon}
                  </div>
                  <span className="font-bold text-slate-900 text-[13px] lg:text-sm leading-snug">
                    {result.title}
                  </span>
                </div>
                <div className="text-slate-400 shrink-0">
                  {openItems.has(idx) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openItems.has(idx) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-5 pb-5 lg:px-6 lg:pb-6 text-slate-600 text-[13px] lg:text-sm leading-normal border-t border-blue-50/50 pt-4 mt-1 text-justify">
                  {result.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transition Sub-block */}
        <div className="bg-slate-900 rounded-2xl p-6 lg:p-10 relative overflow-hidden text-white mb-6">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
          
          <div className="relative z-10 w-full text-center">
            <h3 className="text-base lg:text-lg font-bold mb-4">
              {t('b4_trans_t')}
            </h3>
            <p className="text-slate-300 leading-normal text-xs lg:text-sm w-full">
              {t('b4_trans_txt').replace(/\n/g, ' ')}
            </p>
          </div>
        </div>

        {/* Micro-logic Sub-block */}
        <div className="bg-blue-50 rounded-2xl p-5 lg:p-8 border border-blue-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="p-2 bg-white rounded-xl shadow-sm text-blue-600 shrink-0">
            <AlertCircle size={18} />
          </div>
          <div className="flex-grow w-full text-center">
            <p className="text-blue-900 text-[11px] lg:text-xs font-semibold leading-normal w-full italic">
              {t('b4_logic_txt').replace(/\n/g, ' ')}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};