import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  GitBranch,
  Search,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button, Alert } from '../components/common/UIComponents';

/* Google & GitHub SVG icons */
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

const HERO_SLIDES = [
  {
    icon: Sparkles,
    tag: 'RAG Code Intelligence',
    title: 'Instant Code Intelligence & Semantic Search',
    description: 'Ask deep architectural questions and get precise answers grounded in your exact repository codebase.',
    badge: 'Vector AST Indexer',
  },
  {
    icon: GitBranch,
    tag: 'Automated Repository Indexing',
    title: 'Seamless Repository Parsing & Dependency Graphs',
    description: 'Chunk and index Python, TypeScript, Go, and Java repositories in seconds for real-time AI assistance.',
    badge: 'AST Chunking Engine',
  },
  {
    icon: Zap,
    tag: 'ChatGPT & Claude-Level UX',
    title: 'Rich Markdown Responses & Code Highlights',
    description: 'Beautiful callout cards, syntax-highlighted code blocks, interactive citations, and follow-up question chips.',
    badge: 'Real-Time Streaming',
  },
  {
    icon: ShieldCheck,
    tag: 'Enterprise Security',
    title: 'Isolated & Private Engineering Workspace',
    description: 'Your codebase stays secure with strict access controls, token security, and customizable indexing rules.',
    badge: 'Private & Secure',
  },
];

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError(''); setLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  const handleOAuth = (provider) => {
    const base = 'http://localhost:8000/api/v1/auth';
    window.location.href = provider === 'Google'
      ? `${base}/google`
      : `${base}/github`;
  };

  const SlideIcon = HERO_SLIDES[activeSlide].icon;

  return (
    <div className="login-split-container">
      {/* ── LEFT HERO SECTION (Auto-sliding Carousel & Framer Motion Animations) ── */}
      <div
        className="login-hero-section"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Animated Radial Background Glows */}
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(76,159,206,0.3) 0%, rgba(114,182,223,0.05) 70%, transparent 100%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{ scale: [1.15, 1, 1.15], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(114,182,223,0.3) 0%, rgba(76,159,206,0.05) 70%, transparent 100%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        {/* Floating Particles */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -35, 0],
                x: [0, i % 2 === 0 ? 15 : -15, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 6 + i * 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.8,
              }}
              style={{
                position: 'absolute',
                top: `${15 + i * 14}%`,
                left: `${10 + i * 15}%`,
                width: `${6 + (i % 3) * 3}px`,
                height: `${6 + (i % 3) * 3}px`,
                borderRadius: '50%',
                background: 'var(--primary)',
                boxShadow: '0 0 10px var(--primary-glow)',
              }}
            />
          ))}
        </div>

        {/* Top Branding Header */}
        <div style={{ position: 'relative', zIndex: 5, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.08 }}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--blue-500), var(--blue-400))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 18px var(--primary-glow)',
            }}
          >
            <Code2 size={24} color="#fff" />
          </motion.div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--blue-700)', letterSpacing: '-0.02em' }}>
              CodeForge <span style={{ color: 'var(--primary)' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              AI Engineering Platform
            </div>
          </div>
        </div>

        {/* Center Interactive Orbit & Floating Badges */}
        <div style={{ position: 'relative', zIndex: 5, my: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
          
          {/* Rotating Ring & Center Orb */}
          <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
            
            {/* Rotating Dotted Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px dashed var(--border-color)',
              }}
            />

            {/* Orbiting Badge 1 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '20px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--blue-700)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Cpu size={12} color="var(--primary)" /> AST RAG
              </motion.div>
            </motion.div>

            {/* Orbiting Badge 2 */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '20px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Layers size={12} color="var(--primary)" /> Vector Search
              </motion.div>
            </motion.div>

            {/* Center Pulsing Icon Core */}
            <motion.div
              key={activeSlide}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '28px',
                background: 'linear-gradient(135deg, var(--blue-500) 0%, var(--blue-400) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 36px var(--primary-glow)',
              }}
            >
              <SlideIcon size={48} color="#fff" />
            </motion.div>

            {/* Floating Glass Parallax Card (Top Right) */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                right: '-40px',
                top: '20px',
                background: 'var(--bg-card)',
                backdropFilter: 'var(--backdrop-blur)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '0.5rem 0.8rem',
                boxShadow: 'var(--shadow-md)',
                fontSize: '0.74rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span className="pulse-dot online" /> 100% Grounded
            </motion.div>
          </div>

          {/* Auto-sliding Carousel Text Content */}
          <div style={{ width: '100%', minHeight: '130px', textAlign: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                <div style={{ marginBottom: '0.5rem' }}>
                  <span className="badge badge-info">{HERO_SLIDES[activeSlide].tag}</span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--blue-700)', marginBottom: '0.6rem', lineHeight: 1.3 }}>
                  {HERO_SLIDES[activeSlide].title}
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto' }}>
                  {HERO_SLIDES[activeSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Carousel Controls & Pagination Dots */}
        <div style={{ position: 'relative', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                style={{
                  width: activeSlide === idx ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: activeSlide === idx ? 'var(--primary)' : 'var(--border-color)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={() => setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                borderRadius: '6px',
                padding: '0.3rem 0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                borderRadius: '6px',
                padding: '0.3rem 0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT LOGIN FORM SECTION (Existing Logic & Form Fully Unchanged) ── */}
      <div className="login-form-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
          style={{ width: '100%', maxWidth: '420px' }}
        >
          {/* Mobile Logo Header */}
          <div className="mobile-logo-header" style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <motion.div
              whileHover={{ scale: 1.08, rotate: 6 }}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--blue-500), var(--blue-400))',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
                marginBottom: '0.8rem',
              }}
            >
              <Code2 size={24} color="#fff" />
            </motion.div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--blue-700)', marginBottom: '0.2rem' }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Sign in to your CodeForge AI account
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-card" style={{ padding: '2.2rem' }}>
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}

            {/* OAuth buttons */}
            <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.2rem' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleOAuth('Google')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  padding: '0.65rem',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  transition: 'var(--transition-fast)',
                }}
              >
                <GoogleIcon /> Google
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleOAuth('GitHub')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  padding: '0.65rem',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  transition: 'var(--transition-fast)',
                }}
              >
                <GitHubIcon /> GitHub
              </motion.button>
            </div>

            <div className="oauth-divider">or continue with email</div>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }} />
                  <input type="email" className="form-input" placeholder="developer@company.com" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: '38px' }} required />
                </div>
              </div>

              {/* Password with show/hide */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>Forgot password?</Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }} />
                  <input type={showPassword ? 'text' : 'password'} className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: '38px', paddingRight: '42px' }} required />
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', padding: '2px', display: 'flex', alignItems: 'center' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="primary" isLoading={loading} style={{ width: '100%', marginTop: '0.4rem' }}>
                Sign In <ArrowRight size={15} />
              </Button>
            </form>

            <div style={{ marginTop: '1.4rem', paddingTop: '1.1rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Create account</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
