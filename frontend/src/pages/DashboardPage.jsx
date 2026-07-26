import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GitFork,
  FileCode,
  Layers,
  MessageSquareCode,
  Search,
  Plus,
  ArrowUpRight,
  Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRepositories, useHealth } from '../hooks/useQueries';
import { useCountUp } from '../hooks/useAnimations';
import { Card, Button, Badge, Skeleton } from '../components/common/UIComponents';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

// Animated stat card with count-up number
const StatCard = ({ icon: Icon, iconColor, iconBg, label, value, sub, subColor, loading }) => {
  const animated = useCountUp(value || 0, 1200, !loading);
  return (
    <Card style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={24} />
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 500 }}>{label}</div>
        <motion.div
          key={animated}
          style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--blue-600)', fontVariantNumeric: 'tabular-nums' }}
        >
          {loading ? <Skeleton width="40px" height="24px" /> : animated.toLocaleString()}
        </motion.div>
        <div style={{ fontSize: '0.75rem', color: subColor || 'var(--text-muted)' }}>{sub}</div>
      </div>
    </Card>
  );
};

export const DashboardPage = () => {
  const { user, selectRepo, selectedRepositoryId } = useAuth();
  const { data: repositories = [], isLoading: reposLoading } = useRepositories();
  const { data: health } = useHealth();
  const navigate = useNavigate();

  const totalIndexedFiles = repositories.reduce((sum, r) => sum + (r.indexed_files || 0), 0);
  const totalIndexedChunks = repositories.reduce((sum, r) => sum + (r.indexed_chunks || 0), 0);
  const indexedRepos = repositories.filter((r) => r.status === 'indexed').length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Welcome Banner */}
      <motion.div variants={itemVariants}>
        <Card
          hoverEffect={false}
          style={{
            padding: '2.2rem',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #BCD8EC 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            border: '1px solid var(--blue-200)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--blue-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Platform Overview
            </span>
            <h2 style={{ fontSize: '1.85rem', marginTop: '0.2rem', marginBottom: '0.4rem', color: 'var(--blue-600)' }}>
              Welcome back, {user?.full_name || 'Developer'} 👋
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '620px', lineHeight: 1.5 }}>
              Manage codebases, index AST repositories into vector embeddings, query code architectural questions with RAG, and perform semantic search.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="primary" icon={Plus} onClick={() => navigate('/repositories')}>Add Repository</Button>
            <Button variant="secondary" icon={MessageSquareCode} onClick={() => navigate('/chat')}>AI Chat</Button>
          </div>
        </Card>
      </motion.div>

      {/* Animated Metrics Row */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <StatCard
          icon={GitFork} iconColor="var(--primary)" iconBg="var(--blue-50)"
          label="Repositories" value={repositories.length}
          sub={`${indexedRepos} Fully Indexed`} subColor="#059669"
          loading={reposLoading}
        />
        <StatCard
          icon={FileCode} iconColor="var(--blue-300)" iconBg="rgba(114,182,223,0.18)"
          label="Indexed Files" value={totalIndexedFiles}
          sub="Across codebases"
          loading={reposLoading}
        />
        <StatCard
          icon={Layers} iconColor="var(--primary)" iconBg="rgba(76,159,206,0.15)"
          label="Vector Chunks" value={totalIndexedChunks}
          sub="AST & RAG Embeddings"
          loading={reposLoading}
        />
        <StatCard
          icon={Activity} iconColor="#059669" iconBg="rgba(16,185,129,0.15)"
          label="Backend Service" value={null}
          sub={`v${health?.version || '0.1.0'} FastAPI`}
          loading={false}
          // Override value display for health
        />
      </motion.div>

      {/* Quick Launch & Repositories */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <Card hoverEffect={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--blue-600)' }}>Connected Repositories</h3>
            <Link to="/repositories" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>
              View all <ArrowUpRight size={14} />
            </Link>
          </div>

          {reposLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Skeleton height="56px" /><Skeleton height="56px" />
            </div>
          ) : repositories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <GitFork size={36} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
              <p>No repositories connected yet.</p>
              <Button variant="primary" size="sm" style={{ marginTop: '1rem' }} onClick={() => navigate('/repositories')}>
                Add First Repository
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {repositories.slice(0, 5).map((repo) => {
                const isSelected = selectedRepositoryId === repo.id;
                return (
                  <motion.div
                    key={repo.id}
                    whileHover={{ x: 4 }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.9rem 1rem', borderRadius: '10px',
                      background: isSelected ? 'var(--blue-50)' : '#f8fafc',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      transition: 'var(--transition-fast)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--blue-600)' }}>{repo.name}</span>
                        <Badge variant={repo.status === 'indexed' ? 'success' : repo.status === 'indexing' ? 'warning' : 'secondary'}>
                          {repo.status}
                        </Badge>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                        {repo.github_url} • branch: {repo.default_branch}
                      </div>
                    </div>
                    <Button size="sm" variant={isSelected ? 'primary' : 'secondary'} onClick={() => selectRepo(repo.id)}>
                      {isSelected ? 'Active' : 'Select'}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>

        <Card hoverEffect={false} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--blue-600)' }}>AI Engineering Shortcuts</h3>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(76,159,206,0.1)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
            onClick={() => navigate('/chat')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600, color: 'var(--blue-600)' }}>
              <MessageSquareCode size={18} color="var(--primary)" /> Interactive Code Chat
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.4 }}>
              Ask questions about function implementation, architecture, and bug fixes using RAG.
            </p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(114,182,223,0.12)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
            onClick={() => navigate('/search')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600, color: 'var(--blue-600)' }}>
              <Search size={18} color="var(--blue-300)" /> Semantic Code Search
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.4 }}>
              Locate exact code chunks across files with line numbers and AST context matching.
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
