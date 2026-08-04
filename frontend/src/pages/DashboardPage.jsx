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
  Sparkles,
  Zap,
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
  show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

// Animated stat card with count-up number & hover lift
const StatCard = ({ icon: Icon, iconColor, iconBg, label, value, sub, subColor, loading, isTextValue }) => {
  const animated = useCountUp(typeof value === 'number' ? value : 0, 1200, !loading);
  return (
    <Card style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={24} />
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 500 }}>{label}</div>
        <motion.div
          style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--blue-700)', fontVariantNumeric: 'tabular-nums' }}
        >
          {loading ? <Skeleton width="40px" height="24px" /> : isTextValue ? value : animated.toLocaleString()}
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
            background: 'radial-gradient(circle at 10% 10%, rgba(76,159,206,0.18) 0%, transparent 45%), var(--bg-card)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={14} color="var(--primary)" /> Engineering Workspace Overview
            </span>
            <h2 style={{ fontSize: '1.85rem', marginTop: '0.3rem', marginBottom: '0.4rem', color: 'var(--blue-700)' }}>
              Welcome back, {user?.full_name || 'Developer'} 👋
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '620px', lineHeight: 1.55 }}>
              Manage codebases, index AST repositories into vector embeddings, query code architectural questions with RAG, and perform semantic search.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button variant="primary" icon={Plus} onClick={() => navigate('/repositories')}>Add Repository</Button>
            <Button variant="secondary" icon={MessageSquareCode} onClick={() => navigate('/chat')}>AI Chat</Button>
          </div>
        </Card>
      </motion.div>

      {/* Animated Metrics Row */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <StatCard
          icon={GitFork} iconColor="var(--primary)" iconBg="var(--bg-input)"
          label="Repositories" value={repositories.length}
          sub={`${indexedRepos} Fully Indexed`} subColor="#10b981"
          loading={reposLoading}
        />
        <StatCard
          icon={FileCode} iconColor="var(--blue-400)" iconBg="var(--bg-input)"
          label="Indexed Files" value={totalIndexedFiles}
          sub="Across codebases"
          loading={reposLoading}
        />
        <StatCard
          icon={Layers} iconColor="var(--primary)" iconBg="var(--bg-input)"
          label="Vector Chunks" value={totalIndexedChunks}
          sub="AST & RAG Embeddings"
          loading={reposLoading}
        />
        <StatCard
          icon={Activity} iconColor="#10b981" iconBg="var(--bg-input)"
          label="Backend Service" value={health?.status === 'healthy' ? 'Online' : 'Connected'} isTextValue
          sub={`v${health?.version || '0.1.0'} FastAPI`}
          loading={false}
        />
      </motion.div>

      {/* Quick Launch & Repositories */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <Card hoverEffect={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--blue-700)' }}>Connected Repositories</h3>
            <Link to="/repositories" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 600 }}>
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
                      background: isSelected ? 'var(--primary-light)' : 'var(--bg-input)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      transition: 'var(--transition-fast)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--blue-700)' }}>{repo.name}</span>
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
          <h3 style={{ fontSize: '1.1rem', color: 'var(--blue-700)' }}>AI Engineering Shortcuts</h3>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
            onClick={() => navigate('/chat')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600, color: 'var(--blue-700)' }}>
              <MessageSquareCode size={18} color="var(--primary)" /> Interactive Code Chat
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.4 }}>
              Ask questions about function implementation, architecture, and bug fixes using RAG.
            </p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
            onClick={() => navigate('/search')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600, color: 'var(--blue-700)' }}>
              <Search size={18} color="var(--primary)" /> Semantic Code Search
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
