import React, { useState } from 'react';
import {
  Star,
  Scale,
  MapPin,
  Users,
  ArrowRight,
  Play,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface HeroProps {
  onCtaClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  const { t, language } = useLanguage();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // --- ТЕКСТЫ ЗАГОЛОВКОВ ---
  const heroContent = {
    ru: {
      title_1: 'Вы хотите получить долгосрочный статус вместо §24.',
      title_2: 'У нас есть возможные решения для Вас.',
    },
    de: {
      title_1: 'Sie wollen einen dauerhaften Status statt §24.',
      title_2: 'Wir haben die möglichen Lösungen für Sie.',
    },
    ua: {
      title_1: 'Ви хочете отримати довгостроковий статус замість §24.',
      title_2: 'У нас є можливі рішення для Вас.',
    },
  };

  const currentHero = (heroContent as any)[language] || heroContent.ru;

  const videoId = t('hero_video_id');
  const directUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1`;

  const handleOpenYouTube = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(directUrl, '_blank', 'noopener,noreferrer');
  };

  const handleScrollToPricing = () => {
    const pricingSection = document.getElementById('assessment');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      onCtaClick();
    }
  };

  return (
    <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 transform origin-top-right z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column: Content */}
          <div className="max-w-2xl">
            <h1 className="text-3xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
              {currentHero.title_1}
              <span className="text-blue-900 block mt-4">
                {currentHero.title_2}
              </span>
            </h1>

            <h2 className="text-base lg:text-lg text-slate-600 mb-6 font-medium leading-normal max-w-lg whitespace-pre-line">
              {t('hero_subtitle')}
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleScrollToPricing}
                className="px-8 py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-lg rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {t('hero_cta')}
                <ArrowRight size={20} className="opacity-80" />
              </button>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-4">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-orange-500">
                    <Star size={14} fill="currentColor" />
                    <span className="font-bold text-slate-900 text-sm">
                      4,9 / 5
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {t('hero_trust_anwalt')}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-blue-900">
                    <Scale size={16} />
                    <span className="font-bold text-slate-900 text-sm">
                      30+
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {t('hero_trust_exp')}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-blue-900">
                    <Users size={16} />
                    <span className="font-bold text-slate-900 text-sm">
                      20 000+
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {t('hero_trust_won')}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-blue-900">
                    <MapPin size={16} />
                    <span className="font-bold text-slate-900 text-sm">
                      München
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {t('hero_trust_office')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual / Video - ТУТ ВКЛЮЧЕНА ОБЛОЖКА */}
          <div className="relative flex flex-col items-center justify-center mt-6 lg:mt-0">
            <div className="relative w-full max-w-lg">
              <div className="absolute top-3 left-3 w-full h-full bg-slate-100 rounded-2xl border border-slate-200 -z-10"></div>
              <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-xl aspect-video group cursor-pointer border border-slate-800">
                {!isVideoPlaying ? (
                  <div
                    onClick={() => setIsVideoPlaying(true)}
                    className="relative w-full h-full"
                  >
                    {/* ПОДТЯГИВАЕМ КАДР ИЗ ВИДЕО В КАЧЕСТВЕ ОБЛОЖКИ */}
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                      alt="Video Preview"
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* СЛОЙ С КНОПКОЙ PLAY */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-300 z-10">
                      <div className="relative w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-xl group-hover:bg-white/20 transition-all group-hover:scale-110">
                        <Play
                          size={24}
                          className="text-white fill-white ml-1"
                        />
                      </div>
                      <div className="relative mt-4 flex flex-col items-center">
                        <span className="text-white font-semibold text-xs tracking-wide uppercase">
                          {t('hero_video_label')}
                        </span>
                        <span className="text-slate-400 text-[10px] mt-0.5">
                          {t('hero_video_sub')}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <iframe
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                  ></iframe>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={handleOpenYouTube}
                className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-blue-900 transition-colors uppercase tracking-widest group"
              >
                {t('hero_open_youtube')}
                <ExternalLink
                  size={12}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
