import React, { useState, useEffect, useRef } from 'react';
import { X, CreditCard, Shield, CheckCircle2, Loader2, AlertCircle, Lock, Mail, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { PaymentService } from '../services/PaymentService';
import { VerificationService } from '../services/VerificationService';

interface PaymentModalProps {
  onClose: () => void;
}

type Step = 'payment' | 'verification' | 'success';

declare global {
  interface Window {
    Stripe: any;
  }
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose }) => {
  const { t, language } = useLanguage();
  const [step, setStep] = useState<Step>('payment');
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');

  const stripeRef = useRef<any>(null);
  const elementsRef = useRef<any>(null);
  const cardElementRef = useRef<any>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Separate effect for Stripe initialization to avoid "already destroyed" errors
  useEffect(() => {
    let isMounted = true;

    const initStripe = async () => {
      if (!window.Stripe) return;
      
      // If we are not in payment step, or component is unmounting, or container is not ready
      if (step !== 'payment' || !cardContainerRef.current) return;

      try {
        if (!stripeRef.current) {
          stripeRef.current = window.Stripe('pk_test_51SjQl0AZOYeAbrt2XkJwbNOQCqPZyG1KbbdieWQaFxaHGmjVTc2W180kvMJIEEutPAGVgckFJnOYvLDq5Ti88s5W00do0lzsgy');
        }
        
        elementsRef.current = stripeRef.current.elements({
          locale: language === 'ua' ? 'uk' : language
        });
        
        const style = {
          base: {
            color: '#0f172a',
            fontFamily: '"Inter", sans-serif',
            fontSize: '16px',
            '::placeholder': { color: '#94a3b8' }
          },
          invalid: { color: '#ef4444', iconColor: '#ef4444' }
        };

        // If an element already exists, destroy it before creating a new one
        if (cardElementRef.current) {
          cardElementRef.current.destroy();
        }

        cardElementRef.current = elementsRef.current.create('card', { style, hidePostalCode: true });
        
        if (isMounted && cardContainerRef.current) {
          cardElementRef.current.mount(cardContainerRef.current);
        }
      } catch (err) {
        console.error("Stripe initialization error:", err);
      }
    };

    initStripe();

    return () => {
      isMounted = false;
      if (cardElementRef.current) {
        cardElementRef.current.destroy();
        cardElementRef.current = null;
      }
    };
  }, [language, step]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'processing') return;

    setStatus('processing');
    setErrorMessage(null);

    // Simulation of Stripe Payment
    setTimeout(async () => {
      const code = VerificationService.generateCode();
      setSentCode(code);
      PaymentService.saveEmail(formData.email);
      await VerificationService.sendCodeToEmail(formData.email, code);
      
      setStatus('idle');
      setStep('verification');
    }, 1800);
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 123456 is a master code for development/test
    if (verificationCode === sentCode || verificationCode === '123456') {
      setStep('success');
    } else {
      setErrorMessage(t('modal_verif_error'));
    }
  };

  const handleStartQuestionnaire = () => {
    onClose();
    // Здесь должна быть логика открытия опросника
    window.location.hash = "#questionnaire";
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
           <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={56} />
           </div>
           <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('modal_success_t')}</h3>
           <p className="text-slate-600 mb-8">{t('modal_success_txt')}</p>
           <button 
             onClick={handleStartQuestionnaire}
             className="w-full h-14 bg-blue-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-800 transition-all active:scale-95 shadow-lg"
           >
              {t('modal_success_btn')}
              <ArrowRight size={20} />
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-slate-200">
          <div className="bg-white px-6 pt-6 pb-6 sm:p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-50 text-blue-900 rounded-xl">
                   {step === 'payment' ? <Lock size={20} /> : <Mail size={20} />}
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">
                    {step === 'payment' ? t('modal_title') : t('modal_verif_t')}
                 </h3>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>
            
            {step === 'payment' && (
              <div className="mt-4">
                <div className="bg-slate-50 p-5 rounded-2xl mb-6 border border-slate-100">
                  <div className="flex justify-between items-center font-bold text-slate-900 mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <span className="text-sm">Индивидуальная оценка</span>
                    </div>
                    <span className="text-lg">249.00 €</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {t('modal_subtitle')}
                  </p>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{t('modal_name')}</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-200 bg-slate-50 rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 focus:bg-white transition-all text-sm font-medium" placeholder="Имя Фамилия" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{t('modal_email')}</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-200 bg-slate-50 rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 focus:bg-white transition-all text-sm font-medium" placeholder="email@example.com" />
                    </div>
                  </div>

                  <div className="pt-2">
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Данные карты (Stripe Secure)</label>
                     <div ref={cardContainerRef} className="min-h-[46px] bg-slate-50 rounded-xl border border-slate-200 p-3"></div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={status === 'processing'}
                      className="w-full h-14 inline-flex justify-center items-center gap-3 rounded-2xl shadow-xl px-6 bg-blue-900 text-white font-bold hover:bg-blue-800 focus:outline-none transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {status === 'processing' ? <Loader2 size={24} className="animate-spin" /> : <><CreditCard size={20} /> {t('modal_pay')} 249 €</>}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 'verification' && (
              <div className="mt-4">
                <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                  {t('modal_verif_txt')}
                </p>
                
                <form onSubmit={handleVerificationSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">{t('modal_verif_code')}</label>
                    <input 
                      required 
                      type="text" 
                      maxLength={6} 
                      value={verificationCode}
                      onChange={e => setVerificationCode(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-5 text-center text-3xl font-black tracking-[0.5em] focus:outline-none focus:border-blue-900 focus:bg-white transition-all text-slate-900"
                      placeholder="000000"
                    />
                    {errorMessage && (
                      <div className="mt-3 flex items-center justify-center gap-2 text-red-500 text-xs font-bold">
                        <AlertCircle size={14} />
                        {errorMessage}
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="w-full h-14 bg-blue-900 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-800 transition-all active:scale-95"
                  >
                    {t('modal_verif_btn')}
                  </button>
                </form>
              </div>
            )}
          </div>
          
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
             <Shield size={12} className="text-emerald-500" />
             <span>SSL SECURE PAYMENTS</span>
          </div>
        </div>
      </div>
    </div>
  );
};