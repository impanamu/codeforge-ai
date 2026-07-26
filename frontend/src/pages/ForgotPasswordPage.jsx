import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Mail, ArrowLeft, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Button, Alert } from '../components/common/UIComponents';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address.'); return; }
    setError(''); setLoading(true);
    try {
      // In production this would call a real backend endpoint
      // e.g. await api.post('/api/v1/auth/forgot-password', { email });
      await new Promise(r => setTimeout(r, 1000)); // Simulate API call
      setSent(true);
      toast.success('Password reset email sent!', 'Check your inbox');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset email.');
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
          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '0.3rem' }}>Forgot your password?</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
              style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Send size={26} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--blue-700)' }}>Check your inbox</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                We sent a password reset link to <strong style={{ color: 'var(--text-main)' }}>{email}</strong>.
                The link expires in 15 minutes.
              </p>
              <div style={{ marginTop: '1.2rem' }}>
                <Button variant="secondary" onClick={() => setSent(false)} style={{ width: '100%' }}>
                  Resend email
                </Button>
              </div>
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
