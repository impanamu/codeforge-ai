import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Lock, ArrowLeft, Eye, EyeOff, CheckCircle, ShieldCheck } from 'lucide-react';
import { authApi } from '../api/authApi';
import { useToast } from '../context/ToastContext';
import { Button, Alert } from '../components/common/UIComponents';

const fieldVariants = {
  hidden: { opacity: 0, x: -12 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.22 } },
};
const formVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/* Minimal strength bar reused from RegisterPage */
const strengthLabel = (p) => {
  if (!p) return null;
  const s = [/[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/, /.{8,}/].filter(r => r.test(p)).length;
  return [null,
    { label: 'Weak',   color: '#f43f5e', w: '25%' },
    { label: 'Fair',   color: '#f59e0b', w: '50%' },
    { label: 'Good',   color: '#3b82f6', w: '75%' },
    { label: 'Strong', color: '#10b981', w: '100%' },
  ][s];
};

export const ResetPasswordPage = () => {
  const [token,       setToken]       = useState('');
  const [password,    setPassword]    = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [done,        setDone]        = useState(false);
  const [error,       setError]       = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const strength = strengthLabel(password);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('No reset token found in URL. Please request a new password reset link.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token)              { setError('Invalid or missing reset token.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPass) { setError('Passwords do not match.'); return; }
    setError(''); setLoading(true);
    try {
      await authApi.resetPassword({ token, new_password: password });
      setDone(true);
      toast.success('Password reset successfully! Please sign in.', 'Password Updated');
      setTimeout(() => navigate('/login'), 2200);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. The link may have expired.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-bg">
      <motion.div
        initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <motion.div
            whileHover={{ scale: 1.08, rotate: 6 }}
            animate={{ boxShadow: ['0 0 0px rgba(76,159,206,0.3)', '0 0 18px rgba(76,159,206,0.5)', '0 0 0px rgba(76,159,206,0.3)'] }}
            transition={{ boxShadow: { repeat: Infinity, duration: 3, ease: 'easeInOut' }, scale: { duration: 0.2 } }}
            style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--blue-500), var(--blue-400))',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <ShieldCheck size={26} color="#fff" />
          </motion.div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '0.3rem' }}>Reset your password</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Choose a strong new password for your account.</p>
        </div>

        <motion.div
          className="glass-card"
          style={{ padding: '2rem' }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, delay: 0.08 }}
        >
          <AnimatePresence mode="wait">
            {done ? (
              /* ── Success state ── */
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                style={{ textAlign: 'center', padding: '1rem 0' }}
              >
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
                  style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'rgba(16,185,129,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem',
                    boxShadow: '0 0 20px rgba(16,185,129,0.25)',
                  }}
                >
                  <CheckCircle size={32} color="#10b981" />
                </motion.div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--blue-700)', fontWeight: 700 }}>
                  Password updated!
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Redirecting you to sign in…
                </p>
                {/* Countdown bar */}
                <motion.div
                  initial={{ scaleX: 1 }} animate={{ scaleX: 0 }}
                  transition={{ duration: 2.2, ease: 'linear' }}
                  style={{
                    height: 3, background: '#10b981', borderRadius: 3,
                    marginTop: '1.2rem', transformOrigin: 'left',
                  }}
                />
              </motion.div>
            ) : (
              /* ── Form state ── */
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AnimatePresence>
                  {error && (
                    <motion.div key="err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <Alert type="error" message={error} onClose={() => setError('')} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.form onSubmit={handleSubmit} variants={formVariants} initial="hidden" animate="show">

                  {/* New password */}
                  <motion.div variants={fieldVariants} className="form-group">
                    <label className="form-label">New password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }} />
                      <input type={showPass ? 'text' : 'password'} className="form-input"
                        placeholder="Min. 6 characters" value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ paddingLeft: '38px', paddingRight: '42px' }} required />
                      <button type="button" onClick={() => setShowPass(p => !p)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', padding: '2px', display: 'flex', alignItems: 'center' }}>
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {strength && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '0.4rem' }}>
                        <div style={{ height: '4px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: strength.w }} transition={{ duration: 0.35 }}
                            style={{ height: '100%', background: strength.color, borderRadius: '4px' }} />
                        </div>
                        <span style={{ fontSize: '0.72rem', color: strength.color, fontWeight: 600, marginTop: '0.2rem', display: 'block' }}>
                          {strength.label} password
                        </span>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Confirm password */}
                  <motion.div variants={fieldVariants} className="form-group">
                    <label className="form-label">Confirm new password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: confirmPass && confirmPass === password ? '#10b981' : 'var(--primary)', pointerEvents: 'none' }} />
                      <input type={showConfirm ? 'text' : 'password'} className="form-input"
                        placeholder="Repeat new password" value={confirmPass}
                        onChange={e => setConfirmPass(e.target.value)}
                        style={{ paddingLeft: '38px', paddingRight: '42px', borderColor: confirmPass && confirmPass !== password ? '#f43f5e' : undefined }} required />
                      <button type="button" onClick={() => setShowConfirm(p => !p)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', padding: '2px', display: 'flex', alignItems: 'center' }}>
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      {confirmPass && confirmPass === password && (
                        <CheckCircle size={14} color="#10b981" style={{ position: 'absolute', right: '38px', top: '50%', transform: 'translateY(-50%)' }} />
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={fieldVariants}>
                    <Button type="submit" variant="primary" isLoading={loading} disabled={!token} style={{ width: '100%', marginTop: '0.3rem' }}>
                      Reset Password
                    </Button>
                  </motion.div>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ marginTop: '1.4rem', paddingTop: '1.1rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.86rem', color: 'var(--primary)', fontWeight: 600 }}>
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
