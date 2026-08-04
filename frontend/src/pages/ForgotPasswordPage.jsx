import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Mail, ArrowLeft, Send, ExternalLink, CheckCircle } from 'lucide-react';
import { authApi } from '../api/authApi';
import { useToast } from '../context/ToastContext';
import { Button, Alert } from '../components/common/UIComponents';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [resetUrl, setResetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address.'); return; }
    setError(''); setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      setSent(true);
      if (res.reset_link) {
        setResetUrl(res.reset_link);
      }
      toast.success('Password reset link generated!', 'Check your inbox or test link');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset email.');
    } finally { setLoading(false); }
  };

  const handleOpenResetLink = () => {
    if (resetUrl) {
      const tokenMatch = resetUrl.match(/token=([^&]+)/);
      if (tokenMatch && tokenMatch[1]) {
        navigate(`/reset-password?token=${tokenMatch[1]}`);
      }
    }
  };

  return (
    <div className="auth-bg">
      <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <motion.div whileHover={{ scale: 1.08, rotate: 6 }}
            style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--blue-500), var(--blue-400))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)', marginBottom: '1rem' }}>
            <Code2 size={28} color="#fff" />
          </motion.div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '0.3rem' }}>Forgot your password?</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
            Enter your email and we'll generate a secure link to reset your password.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
              style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckCircle size={28} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--blue-700)' }}>Reset Link Ready</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '1.2rem' }}>
                We generated a password reset link for <strong style={{ color: 'var(--text-main)' }}>{email}</strong>.
              </p>

              {resetUrl && (
                <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.9rem', marginBottom: '1.2rem', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    🔗 Reset URL (Dev Preview)
                  </div>
                  <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', wordBreak: 'break-all', marginBottom: '0.8rem', background: 'var(--bg-card)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                    {resetUrl}
                  </div>
                  <Button variant="primary" icon={ExternalLink} onClick={handleOpenResetLink} style={{ width: '100%', fontSize: '0.84rem' }}>
                    Open Password Reset Form
                  </Button>
                </div>
              )}

              <Button variant="secondary" onClick={() => setSent(false)} style={{ width: '100%' }}>
                Request Another Link
              </Button>
            </motion.div>
          ) : (
            <>
              {error && <Alert type="error" message={error} onClose={() => setError('')} />}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }} />
                    <input type="email" className="form-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: '38px' }} required />
                  </div>
                </div>
                <Button type="submit" variant="primary" isLoading={loading} style={{ width: '100%', marginTop: '0.3rem' }}>
                  Send Reset Link
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
