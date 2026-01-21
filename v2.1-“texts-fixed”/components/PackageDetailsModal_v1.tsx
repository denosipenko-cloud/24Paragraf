
import React from 'react';
import { X, Info } from 'lucide-react';

interface PackageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageTitle: string;
}

export const PackageDetailsModal_v1: React.FC<PackageDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  packageTitle 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-900 rounded-xl">
              <Info size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">Подробнее</h3>
              <p className="text-[10px] text-blue-900 font-black uppercase tracking-widest mt-1">Информация о пакете</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="mb-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Выбранный пакет:</span>
            <h4 className="text-xl font-bold text-slate-900 mt-1">{packageTitle}</h4>
          </div>
          
          <div className="py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 mb-8">
            <p className="text-slate-500 font-medium italic">
              Контент будет добавлен позже.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-full h-14 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all active:scale-95 shadow-lg uppercase tracking-widest text-xs"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
