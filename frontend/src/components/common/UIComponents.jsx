import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export const Spinner = ({ size = 20 }) => (
  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    style={{ display: 'inline-flex' }}>
    <Loader2 size={size} style={{ color: 'var(--primary)' }} />
  </motion.div>
);

export const Skeleton = ({ width = '100%', height = '20px', borderRadius = '6px', style = {} }) => (
  <div className="skeleton" style={{ width, height, borderRadius, ...style }} />
);

export const PageTransition = ({ children }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22, ease: 'easeOut' }}
    style={{ width: '100%' }}>
    {children}
  </motion.div>
);

export const Button = ({ children, variant = 'primary', size = 'md', isLoading = false, disabled = false, icon: Icon, className = '', ...props }) => (
  <motion.button
    whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
    whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
    transition={{ duration: 0.1 }}
    className={`btn btn-${variant} ${className}`}
    disabled={disabled || isLoading}
    style={{ fontSize: size === 'sm' ? '0.82rem' : '0.9rem', padding: size === 'sm' ? '0.42rem 0.85rem' : undefined, ...props.style }}
    {...props}
  >
    {isLoading ? <Spinner size={15} /> : Icon ? <Icon size={size === 'sm' ? 14 : 16} /> : null}
    {children}
  </motion.button>
);

export const Input = ({ label, error, helperText, icon: Icon, className = '', ...props }) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {Icon && <Icon size={17} style={{ position: 'absolute', left: '11px', color: 'var(--primary)', pointerEvents: 'none', flexShrink: 0 }} />}
      <input className={`form-input ${className}`} style={Icon ? { paddingLeft: '36px' } : {}} {...props} />
    </div>
    {error && <span style={{ fontSize: '0.78rem', color: '#f43f5e', marginTop: '0.2rem' }}>{error}</span>}
    {helperText && !error && <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>{helperText}</span>}
  </div>
);

export const Badge = ({ variant = 'secondary', children, className = '' }) => (
  <span className={`badge badge-${variant} ${className}`}>{children}</span>
);

export const Card = ({ children, className = '', style = {}, onClick, hoverEffect = true }) => (
  <motion.div
    whileHover={hoverEffect ? { y: -2, boxShadow: 'var(--shadow-md)', borderColor: 'var(--border-hover)' } : {}}
    transition={{ duration: 0.18 }}
    className={`glass-card ${className}`}
    style={{ padding: '1.4rem', ...style }}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

export const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }} className="modal-overlay" onClick={onClose}>
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 18 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 18 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="modal-content" onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--blue-700)' }}>{title}</h3>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}>
              <X size={20} />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const Alert = ({ type = 'info', title, message, onClose }) => {
  const configs = {
    info:    { icon: Info,          color: 'var(--primary)',  bg: 'var(--primary-light)', border: 'var(--border-color)' },
    success: { icon: CheckCircle,   color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)' },
    warning: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
    error:   { icon: AlertTriangle, color: '#f43f5e', bg: 'rgba(244,63,94,0.1)',  border: 'rgba(244,63,94,0.3)' },
  };
  const c = configs[type] || configs.info;
  const Icon = c.icon;
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
      style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.9rem 1rem', borderRadius: 'var(--radius-md)', background: c.bg, border: `1px solid ${c.border}`, marginBottom: '1rem' }}>
      <Icon size={18} style={{ color: c.color, flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{title}</div>}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{message}</div>
      </div>
      {onClose && <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: '2px' }}><X size={15} /></button>}
    </motion.div>
  );
};

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.28 }}
    style={{ textAlign: 'center', padding: '3.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
    {Icon && (
      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)', boxShadow: 'var(--shadow-sm)' }}>
        <Icon size={28} />
      </div>
    )}
    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--blue-700)' }}>{title}</h3>
    {description && <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '1.4rem', lineHeight: 1.55 }}>{description}</p>}
    {action}
  </motion.div>
);
