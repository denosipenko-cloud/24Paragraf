
import React from 'react';
import { X, Check, Info } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface PackageDetailsModalProps {
  pkgId: number;
  onClose: () => void;
}

export const PackageDetailsModal: React.FC<PackageDetailsModalProps> = ({ pkgId, onClose }) => {
  const { t } = useLanguage();

  // Mapping package data for the details view
  const details = {
    1: {
      title: t('b5_p1_title'),
      subtitle: t('b5_p1_sub'),
      fullDesc: "Этот этап является фундаментом для любого легального перехода. Мы проводим глубокий аудит вашей текущей ситуации, проверяем применимость всех параграфов миграционного законодательства Германии и формируем пошаговую стратегию.",
      items: [
        "Анализ дипломов и квалификаций (проверка в Anabin)",
        "Расчет необходимого дохода для всей семьи",
        "Оценка рисков по линии безопасности",
        "Проверка требований к жилью и страховке",
        "Письменное заключение адвоката с дорожной картой"
      ]
    },
    2: {
      title: t('b5_p2_title'),
      subtitle: t('b5_p2_sub'),
      fullDesc: "Полный административный цикл. Мы берем на себя всю бюрократическую работу, от заполнения сложных анкет до финальной коммуникации с ведомством по делам иностранцев.",
      items: [
        "Подготовка всех официальных формуляров",
        "Профессиональный перевод и заверение документов",
        "Подача заявления по адвокатской доверенности",
        "Контроль за соблюдением сроков обработки",
        "Прямая связь с вашим Sachbearbeiter"
      ]
    },
    3: {
      title: t('b5_p3_title'),
      subtitle: t('b5_p3_sub'),
      fullDesc: "Максимальный уровень защиты. Включает в себя активное адвокатское вмешательство при любых задержках или необоснованных требованиях со стороны властей.",
      items: [
        "Все услуги Пакета №2",
        "Адвокатские запросы для ускорения дела",
        "Защита от дискриминации и ошибок ведомства",
        "Приоритетное сопровождение 24/7",
        "Подготовка к собеседованию в ведомстве"
      ]
    },
    4: {
      title: t('b5_p4_title'),
      subtitle: t('b5_p4_sub'),
      fullDesc: "Решение самых сложных юридических задач через судебную систему Германии. Если ведомство бездействует или вынесло неправомерный отказ.",
      items: [
        "Подача иска о бездействии (Untätigkeitsklage)",
        "Оспаривание отказов в административном суде",
        "Представительство интересов на всех слушаниях",
        "Защита права на пребывание в экстренных случаях",
        "Полное ведение дела до вынесения решения"
      ]
    }
  }[pkgId as 1|2|3|4];

  if (!details) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors">
          <X size={24} />
        </button>

        <div className="p-8 lg:p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-50 text-blue-900 rounded-2xl">
              <Info size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{details.title}</h3>
              <p className="text-[10px] text-blue-900 font-black uppercase tracking-widest">{details.subtitle}</p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-sm text-slate-600 leading-relaxed italic">
              {details.fullDesc}
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              {details.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 text-emerald-500 shrink-0">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium text-slate-700 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <button 
              onClick={onClose}
              className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
            >
              Закрыть описание
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
