import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  User, Activity, LogOut, Mail, Shield, Calendar, GitFork,
  CheckCircle2, Clock, Database, Hash, Star, Code2, Globe,
  KeyRound, Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHealth, useRepositories } from '../hooks/useQueries';
import { Card, Button, Badge } from '../components/common/UIComponents';

/* ── animation helpers ────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay },
});

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

/* ── Stat tile ─────────────────────────────────────── */
const StatTile = ({ label, value, icon: Icon, color = 'var(--primary)', subtext }) => (
  <motion.div
    variants={staggerItem}
    style={{
      background: 'var(--bg-input)', border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)', padding: '1rem 1.1rem',
      display: 'flex', flexDirection: 'column', gap: '0.35rem',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.1rem' }}>
      <Icon size={13} color={color} />
      <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
        {label}
      </span>
    </div>
    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>{value}</div>
    {subtext && <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{subtext}</div>}
  </motion.div>
);

/* ── Health dot ─────────────────────────────────────── */
const HealthDot = ({ ok }) => (
  <span style={{
    display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
    background: ok ? '#10b981' : '#f43f5e',
    boxShadow: ok ? '0 0 6px rgba(16,185,129,0.6)' : '0 0 6px rgba(244,63,94,0.5)',
    marginRight: 6,
  }} />
);

/* ── Main ─────────────────────────────────────────────── */
export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { data: health, isLoading: healthLoading } = useHealth();
  const { data: repositories = [] } = useRepositories();

  const indexedRepos   = repositories.filter(r => r.status === 'indexed').length;
  const indexingRepos  = repositories.filter(r => r.status === 'indexing').length;
  const totalRepos     = repositories.length;

  // Derive initials for avatar
  const initials = useMemo(() => {
    const name = user?.full_name || user?.email || 'U';
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }, [user]);

  // Account age
  const memberSince = useMemo(() => {
    if (!user?.created_at) return 'Unknown';
    return new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [user]);

  const isHealthy = health?.status === 'healthy';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}
    >
      {/* Header */}
      <motion.div {...fadeUp(0)}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Profile & Account</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Your account details, repository stats, and platform health.
        </p>
      </motion.div>

      {/* ─── Avatar + Identity card ─────────────────────── */}
      <motion.div {...fadeUp(0.05)}>
        <Card style={{ padding: '1.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.4rem', flexWrap: 'wrap' }}>

            {/* Animated avatar */}
            <motion.div
              whileHover={{ scale: 1.06, rotate: 4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              style={{
                width: 72, height: 72, borderRadius: '18px', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--blue-500), var(--blue-400))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(76,159,206,0.35)',
                fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em',
              }}
            >
              {initials}
            </motion.div>

            {/* Name / email / status */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
                  {user?.full_name || 'Your Account'}
                </h3>
                <Badge variant={user?.is_active ? 'success' : 'danger'}>
                  {user?.is_active ? '● Active' : '● Inactive'}
                </Badge>
                {user?.is_superuser && (
                  <Badge variant="warning">
                    <Star size={10} style={{ marginRight: 3 }} />Admin
                  </Badge>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.35rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                <Mail size={13} color="var(--primary)" />
                <span>{user?.email || '—'}</span>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.9rem', flexWrap: 'wrap' }}>
                {[
                  { icon: Hash,     label: 'User ID',     value: `#${user?.id ?? '—'}` },
                  { icon: Calendar, label: 'Member since', value: memberSince },
                  { icon: Shield,   label: 'Auth method',  value: 'Email / OAuth' },
                  { icon: Globe,    label: 'Platform',     value: 'CodeForge AI' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '2px' }}>
                      <Icon size={10} /> {label}
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--blue-700)', fontFamily: label === 'User ID' ? 'var(--font-mono)' : undefined }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ─── Repository stat tiles ──────────────────────── */}
      <motion.div {...fadeUp(0.1)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <GitFork size={16} color="var(--primary)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Repository Overview</h3>
        </div>

        <motion.div
          variants={staggerContainer} initial="hidden" animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem' }}
        >
          <StatTile label="Total Repos"    value={totalRepos}   icon={Layers}        color="var(--primary)"  subtext="Connected repositories" />
          <StatTile label="Indexed"        value={indexedRepos} icon={CheckCircle2}   color="#10b981"         subtext="Ready to query" />
          <StatTile label="Indexing"       value={indexingRepos}icon={Clock}          color="#f59e0b"         subtext="Processing now" />
          <StatTile label="Languages"      value="Multi"        icon={Code2}          color="#8b5cf6"         subtext="Python, JS, TS & more" />
        </motion.div>
      </motion.div>

      {/* ─── API Health panel ───────────────────────────── */}
      <motion.div {...fadeUp(0.15)}>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Activity size={18} color={isHealthy ? '#10b981' : '#f43f5e'} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Backend API Health</h3>
            </div>
            <Badge variant={isHealthy ? 'success' : 'danger'}>
              <HealthDot ok={isHealthy} />
              {healthLoading ? 'Checking…' : health?.status || 'Offline'}
            </Badge>
          </div>

          <motion.div
            variants={staggerContainer} initial="hidden" animate="show"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem' }}
          >
            {[
              { icon: Database,  label: 'Service',     value: health?.service || 'CodeForge AI Backend', color: 'var(--primary)' },
              { icon: Layers,    label: 'API Version', value: `v${health?.version || '0.1.0'}`,          color: '#8b5cf6' },
              { icon: Globe,     label: 'Protocol',    value: 'REST / OpenAPI',                          color: '#06b6d4' },
              { icon: KeyRound,  label: 'Auth',        value: 'JWT Bearer Token',                        color: '#f59e0b' },
            ].map(({ icon, label, value, color }) => (
              <StatTile key={label} icon={icon} label={label} value={value} color={color} />
            ))}
          </motion.div>
        </Card>
      </motion.div>

      {/* ─── Sign out ──────────────────────────────────── */}
      <motion.div {...fadeUp(0.2)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '0.5rem' }}>
        <Button variant="danger" icon={LogOut} onClick={logout}>Sign Out of CodeForge</Button>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
          You will be redirected to the sign-in page.
        </span>
      </motion.div>
    </motion.div>
  );
};
