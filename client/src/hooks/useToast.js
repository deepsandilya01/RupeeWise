import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext.jsx';

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Provide safe no-op fallback if used outside ToastProvider
    return {
      toast: {
        success: (msg) => console.log('[Toast Success]:', msg),
        error: (msg) => console.error('[Toast Error]:', msg),
        warning: (msg) => console.warn('[Toast Warning]:', msg),
        info: (msg) => console.info('[Toast Info]:', msg),
      },
      addToast: () => {},
      removeToast: () => {},
    };
  }
  return context;
};

export default useToast;
