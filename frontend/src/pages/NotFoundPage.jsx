import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Code2 } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-darker)',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, var(--blue-400) 0%, var(--blue-300) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <Code2 size={36} color="#ffffff" />
        </div>
        <h1 style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--blue-200)', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--blue-600)' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '380px', lineHeight: 1.5 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.4rem',
            background: 'linear-gradient(135deg, var(--blue-400) 0%, var(--blue-300) 100%)',
            color: '#ffffff',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: 'var(--shadow-md)',
            marginTop: '0.5rem',
          }}
        >
          <Home size={16} /> Return to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};
