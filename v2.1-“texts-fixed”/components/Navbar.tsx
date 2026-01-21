import React, { useState, useEffect } from 'react';
import { Menu, X, Star } from 'lucide-react';
import { useLanguage, Language } from '../LanguageContext';

interface NavbarProps {
  onCtaClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCtaClick }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav_audience'), href: '#audience' },
    { name: t('nav_process'), href: '#process' },
    { name: t('nav_pricing'), href: '#assessment' },
  ];

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-md py-3 border-b border-slate-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Branding */}
          <div className="flex flex-col justify-center cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                Paragraf<span className="text-blue-900">24</span>
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide mt-0.5 group-hover:text-blue-900 transition-colors">
              by Klamert & Partner Rechtsanwälte, München
            </span>
          </div>

          {/* Desktop Right Side: Nav + Lang + Trust */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Nav Links */}
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-slate-600 hover:text-blue-900 font-medium text-sm transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-slate-200"></div>

            {/* Lang Switcher */}
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-400">
               <span onClick={() => handleLangChange('ua')} className={`${language === 'ua' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-slate-300 hover:text-slate-500'} cursor-pointer transition-colors`}>UA</span>
               <span onClick={() => handleLangChange('ru')} className={`${language === 'ru' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-slate-300 hover:text-slate-500'} cursor-pointer transition-colors`}>RU</span>
               <span onClick={() => handleLangChange('de')} className={`${language === 'de' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-slate-300 hover:text-slate-500'} cursor-pointer transition-colors`}>DE</span>
            </div>

            {/* Trust Icon (Anwalt.de placeholder) */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
               <Star size={14} className="text-orange-400 fill-orange-400" />
               <span className="text-xs font-bold text-slate-700">anwalt.de</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded uppercase">
                {language}
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t absolute w-full shadow-lg h-screen">
          <div className="px-4 pt-4 pb-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-4 border-b border-slate-50 text-lg font-medium text-slate-900"
              >
                {link.name}
              </a>
            ))}
            
            <div className="mt-8 px-3">
               <div className="text-xs text-slate-400 uppercase tracking-widest mb-4">{t('nav_lang')}</div>
               <div className="flex gap-6 text-lg font-bold">
                  <span onClick={() => handleLangChange('ua')} className={`${language === 'ua' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-slate-300'} cursor-pointer`}>UA</span>
                  <span onClick={() => handleLangChange('ru')} className={`${language === 'ru' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-slate-300'} cursor-pointer`}>RU</span>
                  <span onClick={() => handleLangChange('de')} className={`${language === 'de' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-slate-300'} cursor-pointer`}>DE</span>
               </div>
            </div>

            <div className="mt-8 px-3">
                <div className="flex items-center gap-2 text-slate-500">
                    <Star size={16} className="text-orange-400 fill-orange-400" />
                    <span className="font-bold text-slate-700">anwalt.de</span>
                    <span className="text-xs">{t('nav_profile')}</span>
                </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};