import React, { useState } from 'react';
import { ChevronDown, Mail, MapPin, Globe, Scale, Phone } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (id: string) => {
    const next = new Set(openSections);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenSections(next);
  };

  const renderSectionHeader = (title: string, id: string) => (
    <div
      onClick={() => toggleSection(id)}
      className="flex lg:hidden justify-between items-center py-4 border-b border-slate-800 cursor-pointer"
    >
      <h4 className="text-white font-bold text-sm uppercase tracking-wider">
        {title}
      </h4>
      <ChevronDown
        size={18}
        className={`text-slate-500 transition-transform ${
          openSections.has(id) ? 'rotate-180' : ''
        }`}
      />
    </div>
  );

  return (
    // ДОБАВЛЕН ID="footer" - теперь ссылки #footer будут работать
    <footer
      id="footer"
      className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-12 gap-y-0 lg:gap-y-12">
          {/* Column 1: Brand Info */}
          <div className="mb-8 lg:mb-0">
            <div className="hidden lg:block mb-6">
              <span className="text-white font-extrabold text-xl tracking-tight">
                Paragraf<span className="text-blue-500">24</span>
              </span>
            </div>
            {renderSectionHeader('Paragraf24', 'brand')}
            <div
              className={`lg:block overflow-hidden transition-all duration-300 ${
                openSections.has('brand')
                  ? 'max-h-40 py-4 opacity-100'
                  : 'max-h-0 lg:max-h-none opacity-0 lg:opacity-100'
              }`}
            >
              <p className="text-xs leading-relaxed max-w-xs">
                {t('footer_brand_desc')}
              </p>
            </div>
          </div>

          {/* Column 2: Legal Links */}
          <div className="mb-0">
            <h4 className="hidden lg:block text-white font-bold text-sm uppercase tracking-wider mb-6">
              {t('footer_legal_title')}
            </h4>
            {renderSectionHeader(t('footer_legal_title'), 'legal')}
            <div
              className={`lg:block overflow-hidden transition-all duration-300 ${
                openSections.has('legal')
                  ? 'max-h-60 py-4 opacity-100'
                  : 'max-h-0 lg:max-h-none opacity-0 lg:opacity-100'
              }`}
            >
              <ul className="space-y-3 text-xs font-medium">
                <li>
                  <a
                    href="/impressum"
                    className="hover:text-white transition-colors"
                  >
                    {t('footer_link_impressum')}
                  </a>
                </li>
                <li>
                  <a
                    href="/datenschutz"
                    className="hover:text-white transition-colors"
                  >
                    {t('footer_link_datenschutz')}
                  </a>
                </li>
                <li>
                  <a href="/agb" className="hover:text-white transition-colors">
                    {t('footer_link_agb')}
                  </a>
                </li>
                <li>
                  <a
                    href="/widerruf"
                    className="hover:text-white transition-colors"
                  >
                    {t('footer_link_widerruf')}
                  </a>
                </li>
                <li>
                  <a
                    href="/preise"
                    className="hover:text-white transition-colors"
                  >
                    {t('footer_link_preise')}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Anbieter */}
          <div className="mb-0">
            <h4 className="hidden lg:block text-white font-bold text-sm uppercase tracking-wider mb-6">
              {t('footer_anbieter_title')}
            </h4>
            {renderSectionHeader(t('footer_anbieter_title'), 'anbieter')}
            <div
              className={`lg:block overflow-hidden transition-all duration-300 ${
                openSections.has('anbieter')
                  ? 'max-h-[500px] py-4 opacity-100'
                  : 'max-h-0 lg:max-h-none opacity-0 lg:opacity-100'
              }`}
            >
              <div className="space-y-4 text-xs leading-relaxed">
                <div>
                  <p className="text-white font-bold mb-1">
                    {t('footer_anbieter_name')}
                  </p>
                  <div className="flex items-start gap-2 mt-2">
                    <MapPin size={12} className="shrink-0 mt-0.5" />
                    <span>{t('footer_anbieter_addr')}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone size={12} />
                    <span>{t('footer_anbieter_phone')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={12} />
                    <span>{t('footer_anbieter_contact')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={12} />
                    <span>www.paragraf24.de</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-start gap-2">
                    <Scale
                      size={12}
                      className="text-slate-500 shrink-0 mt-0.5"
                    />
                    <span className="text-[10px] text-slate-500">
                      {t('footer_anbieter_chamber')}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 pl-5 italic">
                    {t('footer_anbieter_title_professional')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Rechtlicher Hinweis */}
          <div className="mb-8 lg:mb-0">
            <div
              onClick={() => toggleSection('notice')}
              className="flex justify-between items-center py-4 lg:py-0 border-b border-slate-800 lg:border-none cursor-pointer group"
            >
              <h4 className="text-white lg:text-slate-500 font-bold text-sm uppercase tracking-wider lg:mb-6 group-hover:text-white transition-colors">
                {t('footer_notice_title')}
              </h4>
              <ChevronDown
                size={18}
                className={`text-slate-500 transition-transform lg:hidden ${
                  openSections.has('notice') ? 'rotate-180' : ''
                }`}
              />
              <ChevronDown
                size={14}
                className={`text-slate-500 transition-transform hidden lg:block mb-6 ml-2 ${
                  openSections.has('notice') ? 'rotate-180' : ''
                }`}
              />
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openSections.has('notice')
                  ? 'max-h-96 py-4 opacity-100'
                  : 'max-h-0 opacity-0'
              }`}
            >
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] leading-relaxed text-slate-500 text-justify whitespace-pre-line">
                  {t('footer_notice_text')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            <p>© 2025 Paragraf24</p>
            <p className="text-center md:text-right">
              {t('footer_bottom_text')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
