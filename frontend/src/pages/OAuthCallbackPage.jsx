import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * OAuthCallbackPage
 * The backend redirects here after a successful OAuth login:
 *   http://localhost:5173/auth/callback#token=<jwt>
 *
 * We read the token from the URL fragment, store it via AuthContext,
 * then redirect to the dashboard.
 */
export const OAuthCallbackPage = () => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('Completing sign-in…');
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    // Read token from URL fragment  e.g.  #token=eyJhbGci...
    const fragment = window.location.hash.replace('#', '');
    const params = new URLSearchParams(fragment);
    const token = params.get('token');

    // Also check for error from query string  ?error=google_denied
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setMessage('Sign-in was cancelled or denied. Redirecting to login…');
      setTimeout(() => navigate('/login'), 2500);
      return;
    }

    if (!token) {
      setStatus('error');
      setMessage('No authentication token received. Redirecting to login…');
      setTimeout(() => navigate('/login'), 2500);
      return;
    }

    try {
      loginWithToken(token);           // store JWT in AuthContext / localStorage
      setStatus('success');
      setMessage('Signed in successfully! Redirecting…');
      setTimeout(() => navigate('/'), 1200);
    } catch {
      setStatus('error');
      setMessage('Failed to complete sign-in. Please try again.');
      setTimeout(() => navigate('/login'), 2500);
    }
  }, [navigate, loginWithToken]);

  return (
    <div className="auth-bg">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
        style={{ textAlign: 'center', maxWidth: '380px', width: '100%' }}>

        {/* Logo */}
        <motion.div whileHover={{ scale: 1.08 }}
          style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--blue-500), var(--blue-400))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)', marginBottom: '1.5rem' }}>
          <Code2 size={28} color="#fff" />
        </motion.div>

        <div className="glass-card" style={{ padding: '2.2rem' }}>
          {status === 'loading' && (
            <>
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '1.2rem' }}>
                {[0, 1, 2].map(i => (
                  <motion.span key={i} animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
                    style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} />
                ))}
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--blue-700)', marginBottom: '0.4rem' }}>Completing sign-in…</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Please wait while we verify your account.</p>
            </>
          )}

          {status === 'success' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckCircle size={28} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--blue-700)', marginBottom: '0.4rem' }}>Signed in!</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Redirecting to your dashboard…</p>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(244,63,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <XCircle size={28} color="#f43f5e" />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#f43f5e', marginBottom: '0.4rem' }}>Sign-in failed</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{message}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
