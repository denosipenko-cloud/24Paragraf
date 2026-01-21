
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, Info, X, Mail, Loader2, ArrowLeft, ShieldCheck, 
  Gavel, FileText, ChevronRight, CreditCard, Users, 
  RefreshCw, Plus, Minus, AlertCircle, User, Phone,
  TrendingDown, HelpCircle
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { PriceService, PriceBreakdown } from '../services/PriceService';
import { PackageDetailsModal_v1 } from './PackageDetailsModal_v1';

interface PricingSectionProps {
  onSelectAssessment: () => void;
  onSelectP1: () => void;
}

type ModalType = null | 'details' | 'checkout';

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectAssessment, onSelectP1 }) => {
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedPkgId, setSelectedPkgId] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Separate local state for Details Modal (UI only, no checkout logic)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsPkgTitle, setDetailsPkgTitle] = useState('');
  
  // Состояние формы (только для P2-P4)
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    surname: '',
    email: '',
    phone: ''
  });

  const [isFamilyActive, setIsFamilyActive] = useState(false);
  const [familyData, setFamilyData] = useState({ spouse: 0, children: 0 });
  const [activeCredits, setActiveCredits] = useState<number[]>([]);
  const [isStarterConfirmed, setIsStarterConfirmed] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Синхронизация зачётов для P2-P4
  useEffect(() => {
    if (selectedPkgId === 1) return;
    
    if (!isStarterConfirmed) {
      setActiveCredits([]);
    } else {
      setActiveCredits(prev => prev.includes(1) ? prev : [1, ...prev].sort());
    }
  }, [isStarterConfirmed, selectedPkgId]);

  // Валидация для P2-P4
  const isNameValid = checkoutForm.name.trim().length > 1;
  const isSurnameValid = checkoutForm.surname.trim().length > 1;
  const isEmailValid = checkoutForm.email.includes('@');
  const isPhoneValid = checkoutForm.phone.trim().length > 5;
  const areFieldsValid = isNameValid && isSurnameValid && isEmailValid && isPhoneValid;
  const isFormValid = areFieldsValid && isStarterConfirmed;

  const packages = [
    { id: 1, title: t('b5_p1_title'), subtitle: t('b5_p1_sub'), price: 249, desc: t('b5_p1_desc'), features: [t('b5_p1_f1'), t('b5_p1_f2'), t('b5_p1_f3'), t('b5_p1_f4')], cta: t('b5_p1_cta'), borderColor: 'border-blue-600', subColor: 'text-blue-600', bgHeader: 'bg-blue-50/50', icons: [], badge: null },
    { id: 2, title: t('b5_p2_title'), subtitle: t('b5_p2_sub'), price: 649, desc: t('b5_p2_desc'), features: [t('b5_p2_f1'), t('b5_p2_f2'), t('b5_p2_f3'), t('b5_p2_f4')], cta: t('b5_p2_cta'), borderColor: 'border-slate-200', subColor: 'text-blue-900', bgHeader: 'bg-white', icons: ['family', 'upgrade'], badge: t('b5_badge_locked') },
    { id: 3, title: t('b5_p3_title'), subtitle: t('b5_p3_sub'), price: 949, desc: t('b5_p3_desc'), features: [t('b5_p3_f1'), t('b5_p3_f2'), t('b5_p3_f3'), t('b5_p3_f4'), t('b5_p3_f5')], cta: t('b5_p3_cta'), borderColor: 'border-slate-200', subColor: 'text-blue-900', bgHeader: 'bg-white', icons: ['family', 'upgrade'], badge: t('b5_badge_locked') },
    { id: 4, title: t('b5_p4_title'), subtitle: t('b5_p4_sub'), price: 1999, desc: t('b5_p4_desc'), features: [t('b5_p4_f1'), t('b5_p4_f2'), t('b5_p4_f3')], cta: t('b5_p4_cta'), borderColor: 'border-slate-200', subColor: 'text-blue-900', bgHeader: 'bg-white', icons: ['family', 'upgrade'], badge: t('b5_badge_locked') }
  ];

  const currentPkg = packages.find(p => p.id === selectedPkgId);

  const breakdown = useMemo(() => {
    if (!currentPkg || selectedPkgId === 1) return null;
    const extraMembers = isFamilyActive ? (familyData.spouse + familyData.children) : 0;
    return PriceService.calculatePrice(currentPkg.price, extraMembers, activeCredits);
  }, [currentPkg, isFamilyActive, familyData, activeCredits, selectedPkgId]);

  const handlePackageClick = (pkgId: number) => {
    if (pkgId === 1) {
      onSelectP1();
    } else {
      setSelectedPkgId(pkgId);
      setActiveModal('checkout');
    }
  };

  const openDetails = (pkgTitle: string) => {
    setDetailsPkgTitle(pkgTitle);
    setIsDetailsModalOpen(true);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedPkgId(null);
    setIsFamilyActive(false);
    setIsStarterConfirmed(false);
    setFamilyData({ spouse: 0, children: 0 });
    setActiveCredits([]);
    setCheckoutForm({ name: '', surname: '', email: '', phone: '' });
    setShowValidationErrors(false);
  };

  const toggleCredit = (pkgId: number) => {
    if (pkgId === 1 && isStarterConfirmed) return;
    setActiveCredits(prev => {
      let next = prev.includes(pkgId) ? prev.filter(id => id !== pkgId) : [...prev, pkgId];
      if (pkgId === 1 && prev.includes(1)) setIsStarterConfirmed(false);
      return next.sort();
    });
  };

  const handleVerify = async () => {
    if (!isFormValid) {
      setShowValidationErrors(true);
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      alert("Verification successful. Forwarding to Stripe...");
      closeModal();
    }, 1500);
  };

  const inputClass = (isValid: boolean) => `w-full border rounded-xl py-3.5 px-10 focus:outline-none focus:ring-2 focus:ring-blue-900/10 transition-all text-sm font-medium ${showValidationErrors && !isValid ? 'border-red-500 bg-red-50 animate-pulse' : 'border-slate-200 bg-slate-50'}`;

  return (
    <section id="assessment" className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">{t('b5_title')}</h2>
          <p className="text-base lg:text-lg text-slate-500 font-bold max-w-2xl mx-auto leading-normal">{t('b5_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 border-2 h-full ${pkg.id === 1 ? 'border-blue-600 shadow-2xl z-10' : `${pkg.borderColor} bg-white hover:shadow-xl hover:border-slate-300`}`}>
              <div className={`${pkg.bgHeader} p-6 flex flex-col items-center justify-center text-center h-44 border-b border-inherit/30 pt-14`}>
                <h3 className="text-sm lg:text-base font-black text-slate-900 mb-1.5 tracking-tight leading-tight min-h-[2.5rem] flex items-center justify-center">{pkg.title}</h3>
                <p className={`text-[9px] font-black uppercase tracking-widest leading-snug px-4 min-h-[1rem] ${pkg.subColor}`}>{pkg.subtitle}</p>
              </div>
              <div className="px-6 py-8 flex flex-col flex-grow">
                <div className="flex flex-col items-center justify-center mb-8">
                  <span className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter leading-none">{pkg.price} €</span>
                  <div className="flex gap-6 mt-6 min-h-[3.5rem]">
                    {pkg.icons.includes('family') && <Users size={24} className="text-blue-900" />}
                    {pkg.icons.includes('upgrade') && <RefreshCw size={24} className="text-blue-900" />}
                  </div>
                </div>
                <div className="space-y-3.5 mb-6 flex-grow">
                  {pkg.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`shrink-0 p-0.5 rounded-full ${pkg.id === 1 ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}><Check size={14} strokeWidth={4} /></div>
                      <span className="text-[12px] text-slate-700 font-medium leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* "Подробнее" text link */}
                <div className="mb-8 text-center">
                  <button 
                    onClick={() => openDetails(pkg.title)}
                    className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-blue-900 hover:underline transition-all"
                  >
                    Подробнее
                  </button>
                </div>

                <button onClick={() => handlePackageClick(pkg.id)} className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 px-6 ${pkg.id === 1 ? 'bg-blue-900 text-white hover:bg-blue-800' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>{pkg.cta}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal Component */}
      <PackageDetailsModal_v1 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)} 
        packageTitle={detailsPkgTitle} 
      />

      {activeModal === 'checkout' && currentPkg && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 lg:p-10 overflow-y-auto max-h-[95vh] animate-in slide-in-from-bottom-10">
             <button onClick={closeModal} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 z-20"><X size={28} /></button>
             
             <div className="pt-2">
                <div className="flex items-center gap-4 mb-8">
                   <div className="p-3 bg-blue-900 text-white rounded-2xl"><CreditCard size={28} /></div>
                   <div>
                     <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{t('checkout_preorder_title')}</h3>
                     <p className="text-[11px] text-blue-900 font-black uppercase tracking-widest">{currentPkg.title}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                   <div className="relative">
                     <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">{t('checkout_name')} *</label>
                     <User size={16} className="absolute left-4 top-[38px] text-slate-300" />
                     <input type="text" value={checkoutForm.name} onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})} className={inputClass(isNameValid)} />
                   </div>
                   <div className="relative">
                     <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">{t('checkout_surname')} *</label>
                     <User size={16} className="absolute left-4 top-[38px] text-slate-300" />
                     <input type="text" value={checkoutForm.surname} onChange={e => setCheckoutForm({...checkoutForm, surname: e.target.value})} className={inputClass(isSurnameValid)} />
                   </div>
                   <div className="relative">
                     <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">{t('checkout_email')} *</label>
                     <Mail size={16} className="absolute left-4 top-[38px] text-slate-300" />
                     <input type="email" value={checkoutForm.email} onChange={e => setCheckoutForm({...checkoutForm, email: e.target.value})} className={inputClass(isEmailValid)} />
                   </div>
                   <div className="relative">
                     <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">{t('checkout_phone')} *</label>
                     <Phone size={16} className="absolute left-4 top-[38px] text-slate-300" />
                     <input type="tel" value={checkoutForm.phone} onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})} className={inputClass(isPhoneValid)} />
                   </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-6">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-black text-slate-900 uppercase">{t('checkout_family_mode')}</span>
                      <button onClick={() => setIsFamilyActive(!isFamilyActive)} className={`w-12 h-6 rounded-full transition-colors relative ${isFamilyActive ? 'bg-blue-900' : 'bg-slate-300'}`}>
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isFamilyActive ? 'left-7' : 'left-1'}`}></div>
                      </button>
                   </div>
                   {isFamilyActive && (
                     <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100">
                           <span className="text-xs font-bold">{t('checkout_spouse')}</span>
                           <div className="flex items-center gap-4">
                              <button onClick={() => setFamilyData(p => ({...p, spouse: Math.max(0, p.spouse - 1)}))}><Minus size={16} /></button>
                              <span className="text-sm font-black">{familyData.spouse}</span>
                              <button onClick={() => setFamilyData(p => ({...p, spouse: Math.min(1, p.spouse + 1)}))}><Plus size={16} /></button>
                           </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100">
                           <span className="text-xs font-bold">{t('checkout_children')}</span>
                           <div className="flex items-center gap-4">
                              <button onClick={() => setFamilyData(p => ({...p, children: Math.max(0, p.children - 1)}))}><Minus size={16} /></button>
                              <span className="text-sm font-black">{familyData.children}</span>
                              <button onClick={() => setFamilyData(p => ({...p, children: p.children + 1}))}><Plus size={16} /></button>
                           </div>
                        </div>
                     </div>
                   )}
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-8">
                   <h4 className="text-sm font-black text-slate-900 uppercase mb-4">{t('checkout_previous_pkgs')}</h4>
                   <div className="space-y-2">
                      {packages.filter(p => p.id < currentPkg.id).map(p => (
                        <label key={p.id} className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-100">
                           <div className="flex items-center gap-3">
                              <input type="checkbox" checked={activeCredits.includes(p.id)} onChange={() => toggleCredit(p.id)} className="w-4 h-4 rounded text-blue-900" />
                              <span className="text-xs font-bold">{p.title}</span>
                           </div>
                           <span className="text-[11px] font-black">{PriceService.getPackageContribution(p.id, activeCredits)} €</span>
                        </label>
                      ))}
                   </div>
                </div>

                {breakdown && (
                  <div className="space-y-3 mb-8 px-2 border-t pt-6 border-slate-100">
                     <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                        <span>{t('checkout_base_price')}</span>
                        <span>{breakdown.basePrice} €</span>
                     </div>
                     {breakdown.familyAddon > 0 && (
                       <div className="flex justify-between text-xs font-bold text-blue-900 uppercase">
                          <span>{t('checkout_family_addon')}</span>
                          <span>+ {breakdown.familyAddon} €</span>
                       </div>
                     )}
                     {breakdown.appliedCredits.map((credit, i) => (
                       <div key={i} className="flex justify-between text-[11px] font-black uppercase text-emerald-600">
                          <span>{t('checkout_credit_prefix')} {credit.name}</span>
                          <span>- {credit.amount} €</span>
                       </div>
                     ))}
                     <div className="flex justify-between items-center pt-4">
                        <span className="text-sm font-black text-slate-900 uppercase">{t('checkout_total')}</span>
                        <span className="text-3xl font-black text-blue-900">{breakdown.finalTotal} €</span>
                     </div>
                  </div>
                )}

                <div className="mb-6">
                   <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${isStarterConfirmed ? 'bg-blue-50/50 border-blue-900' : 'bg-slate-50 border-slate-100'} ${showValidationErrors && !isStarterConfirmed ? 'border-red-500' : ''}`}>
                      <input type="checkbox" checked={isStarterConfirmed} onChange={e => setIsStarterConfirmed(e.target.checked)} className="mt-1 w-5 h-5 rounded text-blue-900" />
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-slate-900">{t('checkout_confirm_p1')}</span>
                         <span className="text-[10px] text-slate-400 uppercase tracking-widest">{t('checkout_confirm_p1_sub')}</span>
                      </div>
                   </label>
                </div>

                <button onClick={handleVerify} disabled={isVerifying} className={`w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all ${isFormValid ? 'bg-blue-900 text-white active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                   {isVerifying ? <Loader2 size={24} className="animate-spin" /> : <>{t('checkout_btn_continue')} <ArrowLeft size={20} className="rotate-180" /></>}
                </button>
             </div>
          </div>
        </div>
      )}
    </section>
  );
};
