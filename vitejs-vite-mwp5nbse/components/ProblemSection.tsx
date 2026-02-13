import React from 'react';
import { AlertTriangle, Clock, Users } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section id="problem" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Почему важно действовать сейчас?</h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            § 24 AufenthG — это временная защита, не предназначенная для долгосрочной иммиграции.
            Ожидание без стратегии несет в себе риски.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <Clock size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Ограниченные сроки</h3>
            <p className="text-slate-600">
              Статус действует до 04.03.2027. Немецкое государство не планирует продлевать его дальше. 
              Для получения ВНЖ/ПМЖ нужно выполнить условия (язык, работа) уже сейчас.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Перегрузка ведомств</h3>
            <p className="text-slate-600">
              Более 1.3 млн украинцев в Германии. В 2026 году ожидается лавина заявлений. 
              Те, кто подадут документы позже, столкнутся с многолетними задержками.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Риск отказа</h3>
            <p className="text-slate-600">
              Подача заявлений "наугад" без предварительного анализа часто ведет к отказу. 
              UA2DE исключает это, проверяя применимые параграфы (§ 18, 19, 21 и др.) заранее.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};