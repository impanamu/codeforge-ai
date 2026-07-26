import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, GitFork, MessageSquareCode, Search, User, LogOut, Code2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard',       path: '/',            icon: LayoutDashboard },
  { label: 'Repositories',    path: '/repositories', icon: GitFork },
  { label: 'AI Code Chat',    path: '/chat',         icon: MessageSquareCode },
  { label: 'Semantic Search', path: '/search',       icon: Search },
  { label: 'Profile',         path: '/profile',      icon: User },
];

export const Sidebar = () => {
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? '68px' : '256px' }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      style={{ backgroundColor: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '100vh', zIndex: 20, position: 'relative', flexShrink: 0, transition: 'background-color 0.35s' }}
    >
      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(p => !p)}
        style={{ position: 'absolute', right: '-13px', top: '22px', width: '26px', height: '26px', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 30, boxShadow: 'var(--shadow-sm)' }}>
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>

      {/* Brand */}
      <div style={{ padding: collapsed ? '1.2rem 0.7rem' : '1.4rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.7rem', borderBottom: '1px solid var(--border-color)', justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <motion.div whileHover={{ rotate: 12, scale: 1.08 }} transition={{ type: 'spring', stiffness: 280 }}
          style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--blue-500) 0%, var(--blue-400) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 3px 10px var(--primary-glow)' }}>
          <Code2 size={20} color="#ffffff" />
        </motion.div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--blue-700)', letterSpacing: '-0.02em' }}>
              CodeForge <span style={{ color: 'var(--primary)' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Engineering Platform</div>
          </motion.div>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ padding: collapsed ? '1rem 0.4rem' : '1rem 0.65rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem', overflowY: 'auto' }}>
        {!collapsed && (
          <div style={{ padding: '0 0.6rem 0.4rem', fontSize: '0.67rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Navigation
          </div>
        )}
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path} end={path === '/'} style={{ textDecoration: 'none' }} title={collapsed ? label : undefined}>
            {({ isActive }) => (
              <motion.div whileHover={{ x: collapsed ? 0 : 3 }} transition={{ duration: 0.12 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: '0.65rem', padding: collapsed ? '0.7rem 0' : '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)', fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  borderLeft: isActive && !collapsed ? '3px solid var(--primary)' : '3px solid transparent',
                  transition: 'var(--transition-fast)',
                }}>
                <Icon size={17} />
                {!collapsed && <span>{label}</span>}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: collapsed ? '0.9rem 0.5rem' : '0.9rem 1.1rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', gap: '0.5rem', flexShrink: 0 }}>
        {!collapsed && (
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.full_name || 'User'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email || ''}
            </div>
          </div>
        )}
        <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.93 }} onClick={logout} title="Sign Out"
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.45rem', borderRadius: '6px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <LogOut size={17} />
        </motion.button>
      </div>
    </motion.aside>
  );
};
