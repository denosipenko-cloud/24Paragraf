import React from 'react';
import { Check, X, Lock, Info } from 'lucide-react';

interface PackagesProps {
  onSelectPackage1: () => void;
}

export const Packages: React.FC<PackagesProps> = ({ onSelectPackage1 }) => {
  return (
    <section id="pricing" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Пакеты услуг</h2>
          <p className="mt-4 text-slate-600">
            Прозрачное ценообразование. Единая точка входа.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Packet 1 */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-600 transform scale-105 z-10 relative overflow-hidden">
            <div className="bg-blue-600 text-white text-center py-2 text-sm font-bold uppercase tracking-wider">
              Старт (Обязательный)
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-slate-900">Пакет 1: Диагностика</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-slate-900">150 €</span>
                <span className="ml-1 text-slate-500">/ кейс</span>
              </div>
              <p className="mt-2 text-sm text-emerald-600 font-medium flex items-center gap-1">
                <Check size={14} /> Включает всю семью
              </p>
              
              <ul className="mt-8 space-y-4">
                {[
                  "Анализ документов и ситуации",
                  "Проверка семьи (супруг, дети)",
                  "Подбор параграфа (§ 18, 19, 21...)",
                  "Оценка рисков отказа",
                  "Письменная стратегия (PDF)",
                  "Зачет стоимости при апгрейде"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mr-3" />
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={onSelectPackage1}
                className="mt-8 w-full block bg-blue-600 text-white text-center py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
              >
                Заказать Диагностику
              </button>
              <p className="mt-4 text-xs text-center text-slate-400">
                Оплата картой через Stripe
              </p>
            </div>
          </div>

          {/* Packet 2 */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 relative opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
             <div className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full text-slate-500">
               <Lock size={20} />
             </div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-slate-900">Пакет 2: Реализация</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-slate-900">949 €</span>
                <span className="ml-1 text-slate-500">/ кейс</span>
              </div>
               <p className="mt-2 text-sm text-slate-400">
                Минус 150€ (цена Пакета 1)
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "Подготовка полного пакета документов",
                  "Заполнение формуляров",
                  "Коммуникация с Ausländerbehörde",
                  "Контроль сроков",
                  "Подача по доверенности",
                  "Mahnung (требование) при задержках"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button disabled className="mt-8 w-full block bg-slate-100 text-slate-400 text-center py-3 rounded-lg font-semibold cursor-not-allowed border border-slate-200">
                Доступно после Диагностики
              </button>
            </div>
          </div>

          {/* Packet 3 */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 relative opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <div className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full text-slate-500">
               <Lock size={20} />
             </div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-slate-900">Пакет 3: Суд + Адвокат</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-slate-900">1 999 €</span>
                <span className="ml-1 text-slate-500">/ кейс</span>
              </div>
               <p className="mt-2 text-sm text-slate-400">
                Минус 150€ (цена Пакета 1)
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "Всё, что в Пакете 2",
                  "Полная адвокатская защита",
                  "Иск Untätigkeitsklage (§ 75 VwGO)",
                  "Параллельные титулы (§ 24 + ВНЖ)",
                  "Представительство в суде",
                  "Сложные случаи и отказы"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button disabled className="mt-8 w-full block bg-slate-100 text-slate-400 text-center py-3 rounded-lg font-semibold cursor-not-allowed border border-slate-200">
                Доступно после Диагностики
              </button>
            </div>
          </div>

        </div>

        <div className="mt-12 bg-blue-50 border border-blue-100 rounded-lg p-6 flex flex-col md:flex-row gap-4 items-start">
          <Info className="text-blue-600 shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-blue-900">Важно про семейные апгрейды</h4>
            <p className="text-sm text-blue-800 mt-1">
              Стоимость Пакета 1 (150 €) фиксирована для семьи.
              Для Пакетов 2 и 3 применяются доплаты за членов семьи: +50% за супруга и ребенка (до 3 человек), +50% за каждого последующего.
              Точный расчет предоставляется в Стратегии.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};