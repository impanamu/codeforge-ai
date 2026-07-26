import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitBranch, Sun, Moon, Command } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRepositories, useHealth } from '../../hooks/useQueries';
import { useTheme } from '../../context/ThemeContext';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

const PAGE_TITLES = {
  '/':             'Engineering Dashboard',
  '/repositories': 'Repositories',
  '/chat':         'AI Code Assistant',
  '/search':       'Semantic Code Search',
  '/profile':      'User Profile & API Status',
};

export const Navbar = () => {
  const location = useLocation();
  const { selectedRepositoryId, selectRepo } = useAuth();
  const { data: repositories = [] } = useRepositories();
  const { data: health, isLoading: healthLoading, isError: healthError } = useHealth();
  const { isDark, toggle } = useTheme();

  // Keyboard shortcut: Ctrl+D to toggle dark mode
  useKeyboardShortcuts([{ keys: ['ctrl', 'd'], handler: toggle }]);

  const title = PAGE_TITLES[location.pathname]
    ?? (location.pathname.startsWith('/repositories/') ? 'Repository Details' : 'CodeForge AI');

  // Show pulsing badge if any repo is currently indexing
  const isAnyIndexing = repositories.some(r => r.status === 'indexing');

  return (
    <header style={{
      height: '64px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-navbar)',
      backdropFilter: 'var(--backdrop-blur)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem', position: 'sticky', top: 0, zIndex: 10,
      boxShadow: 'var(--shadow-sm)', transition: 'background-color 0.3s',
    }}>
      {/* Page title */}
      <motion.div key={location.pathname} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
        <h1 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--blue-600)' }}>{title}</h1>
      </motion.div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>

        {/* Indexing indicator */}
        {isAnyIndexing && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.7rem', borderRadius: '20px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', fontSize: '0.78rem', fontWeight: 600, color: '#d97706' }}>
            <span className="pulse-dot indexing-pulse" style={{ background: '#f59e0b', width: '7px', height: '7px' }} />
            Indexing…
          </motion.div>
        )}

        {/* Active repo selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-card)', padding: '0.35rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <GitBranch size={14} color="var(--primary)" />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 500 }}>Repo:</span>
          <select value={selectedRepositoryId || ''} onChange={e => selectRepo(e.target.value ? Number(e.target.value) : null)}
            style={{ background: 'transparent', border: 'none', color: 'var(--blue-600)', fontSize: '0.83rem', fontWeight: 700, outline: 'none', cursor: 'pointer', maxWidth: '160px' }}>
            <option value="" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>Select repo…</option>
            {repositories.map(r => (
              <option key={r.id} value={r.id} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                {r.name}{r.status === 'indexing' ? ' ⟳' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Dark / Light mode toggle */}
        <motion.button
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
          onClick={toggle}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode (Ctrl+D)`}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', cursor: 'pointer', color: 'var(--text-muted)', boxShadow: 'var(--shadow-sm)', transition: 'var(--transition-fast)' }}
        >
          <motion.div key={isDark ? 'moon' : 'sun'} initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.25 }}>
            {isDark ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="var(--blue-400)" />}
          </motion.div>
        </motion.button>

        {/* Health status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.35rem 0.75rem', borderRadius: '20px', background: healthError ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)', border: `1px solid ${healthError ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)'}`, fontSize: '0.78rem', fontWeight: 500 }}
          title={healthError ? 'Backend offline' : `v${health?.version || '?'}`}>
          <span className={`pulse-dot ${healthError ? 'offline' : 'online'}`} />
          <span style={{ color: healthError ? '#e11d48' : '#059669' }}>
            {healthLoading ? '…' : healthError ? 'Offline' : 'Online'}
          </span>
        </div>
      </div>
    </header>
  );
};
