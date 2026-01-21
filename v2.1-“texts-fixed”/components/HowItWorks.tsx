import React from 'react';
import { ArrowDown, CheckCircle2, Lock } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="process" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Логика продукта UA2DE</h2>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
            Мы не продаем кота в мешке. Вы не можете купить юридическое сопровождение, 
            пока мы не убедимся, что ваш кейс имеет правовые перспективы.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-700 -translate-y-1/2 z-0"></div>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {/* Step 1 */}
            <div className="bg-slate-800 p-8 rounded-xl border-2 border-emerald-500 shadow-2xl relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                Шаг 1: Обязательно
              </div>
              <div className="mb-6 flex justify-center">
                 <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-emerald-400 font-bold text-2xl border-4 border-slate-600">
                    1
                 </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-white">Диагностика и Стратегия</h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Анализ ситуации семьи</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Выбор параграфа перехода</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Оценка рисков</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 opacity-90 relative">
               <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-600 text-slate-200 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                <Lock size={12} /> Закрыто
              </div>
               <div className="mb-6 flex justify-center">
                 <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 font-bold text-2xl border-4 border-slate-600">
                    2
                 </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-white">Административная реализация</h3>
              <p className="text-sm text-slate-400 text-center mb-4">
                Доступно только при положительном результате диагностики.
              </p>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li className="flex gap-2"><span className="w-4 h-4 rounded-full border border-slate-500 shrink-0 block"></span> Подготовка документов</li>
                <li className="flex gap-2"><span className="w-4 h-4 rounded-full border border-slate-500 shrink-0 block"></span> Контроль сроков</li>
                <li className="flex gap-2"><span className="w-4 h-4 rounded-full border border-slate-500 shrink-0 block"></span> Коммуникация с ведомством</li>
              </ul>
            </div>

             {/* Step 3 */}
             <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 opacity-90 relative">
               <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-600 text-slate-200 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                <Lock size={12} /> Закрыто
              </div>
               <div className="mb-6 flex justify-center">
                 <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 font-bold text-2xl border-4 border-slate-600">
                    3
                 </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-white">Суд и Адвокат</h3>
              <p className="text-sm text-slate-400 text-center mb-4">
                При задержках или отказах.
              </p>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li className="flex gap-2"><span className="w-4 h-4 rounded-full border border-slate-500 shrink-0 block"></span> Иск о бездействии</li>
                <li className="flex gap-2"><span className="w-4 h-4 rounded-full border border-slate-500 shrink-0 block"></span> Представительство в суде</li>
                <li className="flex gap-2"><span className="w-4 h-4 rounded-full border border-slate-500 shrink-0 block"></span> Адвокатская стратегия</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
           <div className="inline-flex items-center gap-2 text-emerald-400 font-medium bg-emerald-400/10 px-4 py-2 rounded-full">
              <CheckCircle2 size={18} />
              Вы платите только за то, что реально возможно
           </div>
        </div>
      </div>
    </section>
  );
};