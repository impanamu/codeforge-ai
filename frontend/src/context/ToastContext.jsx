import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};

const TOAST_ICONS = {
  success: <CheckCircle size={18} color="#059669" />,
  error: <AlertTriangle size={18} color="#e11d48" />,
  warning: <AlertTriangle size={18} color="#d97706" />,
  info: <Info size={18} color="var(--primary)" />,
};

const TOAST_COLORS = {
  success: { bg: '#f0fdf4', border: 'rgba(16, 185, 129, 0.35)', text: '#065f46' },
  error: { bg: '#fff1f2', border: 'rgba(244, 63, 94, 0.35)', text: '#9f1239' },
  warning: { bg: '#fffbeb', border: 'rgba(245, 158, 11, 0.35)', text: '#92400e' },
  info: { bg: '#eff6ff', border: 'rgba(76, 159, 206, 0.35)', text: '#1e40af' },
};

const Toast = ({ toast, onDismiss }) => {
  const colors = TOAST_COLORS[toast.type] || TOAST_COLORS.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.85rem 1rem',
        borderRadius: '10px',
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        minWidth: '280px',
        maxWidth: '360px',
        pointerEvents: 'all',
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '1px' }}>{TOAST_ICONS[toast.type]}</div>
      <div style={{ flex: 1 }}>
        {toast.title && (
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: colors.text, marginBottom: '0.15rem' }}>
            {toast.title}
          </div>
        )}
        <div style={{ fontSize: '0.83rem', color: colors.text, opacity: 0.85, lineHeight: 1.4 }}>
          {toast.message}
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.text, opacity: 0.5, padding: '2px', flexShrink: 0 }}
      >
        <X size={15} />
      </button>
    </motion.div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = 'info', title, message, duration = 3500 }) => {
      const id = `toast-${++counterRef.current}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  // Convenience methods
  toast.success = (message, title) => toast({ type: 'success', title, message });
  toast.error = (message, title) => toast({ type: 'error', title, message });
  toast.warning = (message, title) => toast({ type: 'warning', title, message });
  toast.info = (message, title) => toast({ type: 'info', title, message });

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container — fixed bottom-right */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
