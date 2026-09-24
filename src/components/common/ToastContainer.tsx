import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  AlertOctagon,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#FFBB38] flex-shrink-0" />;
      case 'error':
        return <AlertOctagon className="w-5 h-5 text-[#FE5C73] flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-[#2D60FF] flex-shrink-0" />;
    }
  };

  const getBgClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-[#10B981]/30 bg-white shadow-[0_10px_30px_rgba(16,185,129,0.15)]';
      case 'warning':
        return 'border-[#FFBB38]/30 bg-white shadow-[0_10px_30px_rgba(255,187,56,0.15)]';
      case 'error':
        return 'border-[#FE5C73]/30 bg-white shadow-[0_10px_30px_rgba(254,92,115,0.18)]';
      default:
        return 'border-[#2D60FF]/25 bg-white shadow-[0_10px_30px_rgba(45,96,255,0.12)]';
    }
  };

  return (
    <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl border ${getBgClass(
            t.type
          )} transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-in select-none`}
        >
          {getIcon(t.type)}
          <div className="flex-1 min-w-0">
            {t.title && (
              <h5 className="text-xs font-bold text-[#343C6A] leading-tight">
                {t.title}
              </h5>
            )}
            <p className="text-xs text-[#718EBF] mt-0.5 leading-snug">
              {t.message}
            </p>
            {t.action && (
              <button
                onClick={() => {
                  t.action?.onClick();
                  removeToast(t.id);
                }}
                className="mt-2 text-xs font-bold text-[#2D60FF] hover:underline flex items-center gap-1"
              >
                {t.action.label} →
              </button>
            )}
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-[#8BA3CB] hover:text-[#343C6A] p-1 rounded-lg hover:bg-[#F5F7FA] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
