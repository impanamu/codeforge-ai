import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Lock, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Button, Alert } from '../components/common/UIComponents';

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPass) { setError('Passwords do not match.'); return; }
    setError(''); setLoading(true);
    try {
      // In production: await api.post('/api/v1/auth/reset-password', { token, password });
      await new Promise(r => setTimeout(r, 1000));
      setDone(true);
      toast.success('Password reset successfully! Please sign in.', 'Password Updated');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-bg">
      <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <motion.div whileHover={{ scale: 1.08 }}
            style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--blue-500), var(--blue-400))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)', marginBottom: '1rem' }}>
            <Code2 size={28} color="#fff" />
          </motion.div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '0.3rem' }}>Reset your password</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Choose a strong new password for your account.</p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
              style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckCircle size={28} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--blue-700)' }}>Password updated!</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Redirecting you to sign in…</p>
            </motion.div>
          ) : (
            <>
              {error && <Alert type="error" message={error} onClose={() => setError('')} />}
              <form onSubmit={handleSubmit}>
                {/* New password */}
                <div className="form-group">
                  <label className="form-label">New password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }} />
                    <input type={showPass ? 'text' : 'password'} className="form-input" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: '38px', paddingRight: '42px' }} required />
                    <button type="button" onClick={() => setShowPass(p => !p)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', padding: '2px', display: 'flex', alignItems: 'center' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div className="form-group">
                  <label className="form-label">Confirm new password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: confirmPass && confirmPass === password ? '#10b981' : 'var(--primary)', pointerEvents: 'none' }} />
                    <input type={showConfirm ? 'text' : 'password'} className="form-input" placeholder="Repeat new password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} style={{ paddingLeft: '38px', paddingRight: '42px', borderColor: confirmPass && confirmPass !== password ? '#f43f5e' : undefined }} required />
                    <button type="button" onClick={() => setShowConfirm(p => !p)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', padding: '2px', display: 'flex', alignItems: 'center' }}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    {confirmPass && confirmPass === password && (
                      <CheckCircle size={14} color="#10b981" style={{ position: 'absolute', right: '38px', top: '50%', transform: 'translateY(-50%)' }} />
                    )}
                  </div>
                </div>

                <Button type="submit" variant="primary" isLoading={loading} style={{ width: '100%', marginTop: '0.3rem' }}>
                  Reset Password
                </Button>
              </form>
            </>
          )}

          <div style={{ marginTop: '1.4rem', paddingTop: '1.1rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.86rem', color: 'var(--primary)', fontWeight: 600 }}>
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
