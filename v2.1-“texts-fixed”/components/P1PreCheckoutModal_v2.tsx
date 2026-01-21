
import React, { useState } from 'react';
import { X, User, Mail, Phone, CreditCard, CheckCircle2, ArrowLeft, Info, ShieldCheck } from 'lucide-react';

interface P1PreCheckoutModalProps {
  onClose: () => void;
}

type ModalStep = 'form' | 'success';

export const P1PreCheckoutModal_v2: React.FC<P1PreCheckoutModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<ModalStep>('form');
  const [formData, setFormData] = useState({ name: '', surname: '', email: '', phone: '' });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  // Validation logic
  const isNameValid = formData.name.trim().length > 1;
  const isSurnameValid = formData.surname.trim().length > 1;
  const isEmailValid = formData.email.includes('@');
  const isPhoneValid = formData.phone.trim().length > 5;
  const isValid = isNameValid && isSurnameValid && isEmailValid && isPhoneValid && isConfirmed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setShowErrors(true);
      return;
    }
    setStep('success');
  };

  const inputClass = (valid: boolean) => `
    w-full border rounded-xl py-3.5 px-10 focus:outline-none focus:ring-2 focus:ring-blue-900/10 transition-all text-sm font-medium
    ${showErrors && !valid ? 'border-red-500 bg-red-50 animate-pulse' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-900'}
  `;

  // Step 2: Success View
  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
           <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
           </div>
           <h3 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tight">Спасибо!</h3>
           <p className="text-slate-600 mb-8 font-medium">Оплата будет добавлена позже.</p>
           <button 
             onClick={onClose}
             className="w-full h-14 bg-blue-900 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-800 transition-all active:scale-95 shadow-lg uppercase tracking-widest text-xs"
           >
              Закрыть
           </button>
        </div>
      </div>
    );
  }

  // Step 1: Form View
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 lg:p-10 overflow-y-auto max-h-[95vh] animate-in slide-in-from-bottom-10">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 z-20 hover:bg-slate-100 rounded-full transition-all">
          <X size={28} />
        </button>

        <div className="pt-2">
          {/* Header matches P2-P4 checkout signature */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-900 text-white rounded-2xl shadow-lg">
              <CreditCard size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Предварительное оформление заказа</h3>
              <p className="text-[11px] text-blue-900 font-black uppercase tracking-widest mt-1.5">Пакет №1 «Стартовый»</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Input Fields grid matches P2-P4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div className="relative">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Имя *</label>
                <User size={16} className="absolute left-4 top-[38px] text-slate-300" />
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className={inputClass(isNameValid)}
                  placeholder="Иван"
                />
              </div>
              <div className="relative">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Фамилия *</label>
                <User size={16} className="absolute left-4 top-[38px] text-slate-300" />
                <input 
                  type="text" 
                  value={formData.surname} 
                  onChange={e => setFormData({...formData, surname: e.target.value})} 
                  className={inputClass(isSurnameValid)}
                  placeholder="Иванов"
                />
              </div>
              <div className="relative">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email *</label>
                <Mail size={16} className="absolute left-4 top-[38px] text-slate-300" />
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  className={inputClass(isEmailValid)}
                  placeholder="email@example.com"
                />
              </div>
              <div className="relative">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Телефон *</label>
                <Phone size={16} className="absolute left-4 top-[38px] text-slate-300" />
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  className={inputClass(isPhoneValid)}
                  placeholder="+49..."
                />
              </div>
            </div>

            <div className="mb-6 px-1 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">
              <Info size={12} className="text-slate-300" />
              Поля, отмеченные *, обязательны
            </div>

            {/* Price Summary styled as P2-P4 */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-8">
               <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <span>Базовая цена</span>
                     <span>249 €</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                     <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Итого к оплате</span>
                     <span className="text-3xl font-black text-blue-900">249 €</span>
                  </div>
               </div>
            </div>

            {/* Mandatory Checkbox styled as P2-P4 confirmation block */}
            <div className="mb-8">
              <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${isConfirmed ? 'bg-blue-50/50 border-blue-900 shadow-sm' : 'bg-slate-50 border-slate-100 hover:border-slate-200'} ${showErrors && !isConfirmed ? 'border-red-500 bg-red-50 animate-pulse' : ''}`}>
                <div className="mt-1">
                  <input 
                    type="checkbox" 
                    checked={isConfirmed} 
                    onChange={e => setIsConfirmed(e.target.checked)} 
                    className="w-5 h-5 rounded-md border-slate-300 text-blue-900 focus:ring-blue-900/10 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-slate-900 leading-tight">
                    Я понимаю, что пакет №1 является стартовой оценкой и не включает сопровождение административной реализации или судебного представительства.
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Обязательное подтверждение условий</span>
                </div>
              </label>
            </div>

            {/* Submit Button matches P2-P4 style */}
            <button 
              type="submit"
              className={`w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 ${isValid ? 'bg-blue-900 text-white hover:bg-blue-800' : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'}`}
            >
              Проверить и продолжить
              <ArrowLeft size={20} className="rotate-180" />
            </button>

            {/* Security Footer */}
            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <ShieldCheck size={14} className="text-emerald-500" />
               SSL SECURE ENCRYPTION
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
