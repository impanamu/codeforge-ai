import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, Mail, Lock, User, ArrowRight,
  Eye, EyeOff, CheckCircle, Sparkles, ShieldCheck, Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Alert } from '../components/common/UIComponents';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

/* Password strength meter */
const strengthLabel = (p) => {
  if (!p) return null;
  const s = [/[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/, /.{8,}/].filter(r => r.test(p)).length;
  const levels = [
    null,
    { label: 'Weak',   color: '#f43f5e', w: '25%' },
    { label: 'Fair',   color: '#f59e0b', w: '50%' },
    { label: 'Good',   color: '#3b82f6', w: '75%' },
    { label: 'Strong', color: '#10b981', w: '100%' },
  ];
  return levels[s];
};

/* Stagger variants for form fields */
const formVariants = {
  hidden: { opacity: 0 },
  show:  { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const fieldVariants = {
  hidden: { opacity: 0, x: -12 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

/* Mini feature badges shown below the logo */
const BADGES = [
  { icon: Sparkles, label: 'RAG Code Intelligence' },
  { icon: ShieldCheck, label: 'Secure & Private' },
  { icon: Zap, label: 'Instant Indexing' },
];

export const RegisterPage = () => {
  const [fullName,    setFullName]    = useState('');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = strengthLabel(password);

  const handleOAuth = (provider) => {
    const base = 'http://localhost:8000/api/v1/auth';
    window.location.href = provider === 'Google' ? `${base}/google` : `${base}/github`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) { setError('All fields are required.'); return; }
    if (password !== confirmPass)          { setError('Passwords do not match.'); return; }
    if (password.length < 6)              { setError('Password must be at least 6 characters.'); return; }
    setError(''); setLoading(true);
    try {
      await register({ full_name: fullName, email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-bg">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        style={{ width: '100%', maxWidth: '460px' }}
      >
        {/* Logo + badge strip */}
        <div style={{ textAlign: 'center', marginBottom: '1.6rem' }}>
          <motion.div
            whileHover={{ scale: 1.08, rotate: 6 }}
            style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--blue-500), var(--blue-400))',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-md)', marginBottom: '0.9rem',
            }}
          >
            <Code2 size={28} color="#fff" />
          </motion.div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.3rem' }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '0.9rem' }}>
            Join CodeForge AI — your AI-powered engineering platform
          </p>

          {/* Animated feature badge strip */}
          <motion.div
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
            style={{ display: 'flex', gap: '0.45rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {BADGES.map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem',
                  fontWeight: 600, background: 'var(--primary-light)', color: 'var(--primary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <Icon size={11} /> {label}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Card */}
        <motion.div
          className="glass-card"
          style={{ padding: '2rem' }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, delay: 0.1 }}
        >
          <AnimatePresence>
            {error && (
              <motion.div key="err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Alert type="error" message={error} onClose={() => setError('')} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* OAuth */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.2rem' }}
          >
            {[['Google', <GoogleIcon />], ['GitHub', <GitHubIcon />]].map(([name, icon]) => (
              <motion.button key={name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => handleOAuth(name)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem', padding: '0.65rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)', transition: 'var(--transition-fast)' }}>
                {icon} {name}
              </motion.button>
            ))}
          </motion.div>
          <div className="oauth-divider">or sign up with email</div>

          {/* Form fields with stagger */}
          <motion.form onSubmit={handleSubmit} variants={formVariants} initial="hidden" animate="show">

            {/* Full name */}
            <motion.div variants={fieldVariants} className="form-group">
              <label className="form-label">Full name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }} />
                <input type="text" className="form-input" placeholder="Jane Developer"
                  value={fullName} onChange={e => setFullName(e.target.value)}
                  style={{ paddingLeft: '38px' }} required />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={fieldVariants} className="form-group">
              <label className="form-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }} />
                <input type="email" className="form-input" placeholder="jane@company.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: '38px' }} required />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={fieldVariants} className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }} />
                <input type={showPass ? 'text' : 'password'} className="form-input"
                  placeholder="Min. 6 characters"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px', paddingRight: '42px' }} required />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', padding: '2px', display: 'flex', alignItems: 'center' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Animated strength bar */}
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
              <label className="form-label">Confirm password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: confirmPass && confirmPass === password ? '#10b981' : 'var(--primary)', pointerEvents: 'none' }} />
                <input type={showConfirm ? 'text' : 'password'} className="form-input"
                  placeholder="Repeat your password"
                  value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                  style={{ paddingLeft: '38px', paddingRight: '42px', borderColor: confirmPass && confirmPass !== password ? '#f43f5e' : undefined }} required />
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', padding: '2px', display: 'flex', alignItems: 'center' }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {confirmPass && confirmPass === password && (
                  <CheckCircle size={15} color="#10b981" style={{ position: 'absolute', right: '38px', top: '50%', transform: 'translateY(-50%)' }} />
                )}
              </div>
            </motion.div>

            <motion.div variants={fieldVariants}>
              <Button type="submit" variant="primary" isLoading={loading} style={{ width: '100%', marginTop: '0.3rem' }}>
                Create Account <ArrowRight size={15} />
              </Button>
            </motion.div>
          </motion.form>

          <div style={{ marginTop: '1.4rem', paddingTop: '1.1rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign in</Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
