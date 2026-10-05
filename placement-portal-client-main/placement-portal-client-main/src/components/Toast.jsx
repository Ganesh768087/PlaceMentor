import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === 'success';

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 scale-100 ${
      isSuccess 
        ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200' 
        : 'bg-rose-950/80 border-rose-500/30 text-rose-200'
    }`}>
      {isSuccess ? (
        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
      )}
      <p className="text-sm font-medium">{message}</p>
      <button 
        onClick={onClose} 
        className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
