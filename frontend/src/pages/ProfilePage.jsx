import React from 'react';
import { motion } from 'framer-motion';
import { User, Activity, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../hooks/useQueries';
import { Card, Button, Badge } from '../components/common/UIComponents';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { data: health, isLoading: healthLoading } = useHealth();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '860px' }}>

      <div>
        <h2 style={{ fontSize: '1.5rem' }}>User Profile & System Status</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Account information and backend API health diagnostics.
        </p>
      </div>

      {/* User card */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <motion.div whileHover={{ scale: 1.05, rotate: 5 }}
              style={{ width: '54px', height: '54px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--blue-500), var(--blue-400))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}>
              <User size={26} color="#fff" />
            </motion.div>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>{user?.full_name || 'User Account'}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>{user?.email || ''}</p>
            </div>
          </div>
          <Badge variant={user?.is_active ? 'success' : 'danger'}>
            {user?.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User ID</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--blue-700)' }}>#{user?.id}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>Software Engineer</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>CodeForge AI</div>
          </div>
        </div>
      </Card>

      {/* API Health */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <Activity size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.05rem' }}>Backend API Health</h3>
          </div>
          <Badge variant={health?.status === 'healthy' ? 'success' : 'danger'}>
            {healthLoading ? 'Checking…' : health?.status || 'Offline'}
          </Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', padding: '1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
          {[
            { label: 'Service', value: health?.service || 'CodeForge AI Backend' },
            { label: 'API Version', value: health?.version || '0.1.0' },
            { label: 'Protocol', value: 'REST / OpenAPI' },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{value}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Sign out */}
      <div>
        <Button variant="danger" icon={LogOut} onClick={logout}>Sign Out of CodeForge</Button>
      </div>
    </motion.div>
  );
};
