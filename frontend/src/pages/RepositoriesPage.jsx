import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitFork, Plus, RefreshCw, Trash2, ExternalLink, Layers, FileCode, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRepositories, useCreateRepository, useDeleteRepository, useIndexRepository } from '../hooks/useQueries';
import { useToast } from '../context/ToastContext';
import { Card, Button, Input, Modal, Badge, Alert, EmptyState, Skeleton } from '../components/common/UIComponents';

export const RepositoriesPage = () => {
  const { selectedRepositoryId, selectRepo } = useAuth();
  const { data: repositories = [], isLoading } = useRepositories();
  const toast = useToast();

  const createMutation = useCreateRepository();
  const deleteMutation = useDeleteRepository();
  const indexMutation = useIndexRepository();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [defaultBranch, setDefaultBranch] = useState('main');
  const [formError, setFormError] = useState('');
  const [indexingRepoId, setIndexingRepoId] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !githubUrl) {
      setFormError('Name and GitHub URL are required.');
      return;
    }
    setFormError('');
    try {
      const createdRepo = await createMutation.mutateAsync({ name, github_url: githubUrl, default_branch: defaultBranch || 'main' });
      selectRepo(createdRepo.id);
      setIsModalOpen(false);
      setName(''); setGithubUrl(''); setDefaultBranch('main');
      toast.success(`Repository "${createdRepo.name}" connected successfully!`, 'Repository Added');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to create repository.';
      setFormError(msg);
      toast.error(msg, 'Connection Failed');
    }
  };

  const handleIndex = async (repoId) => {
    setIndexingRepoId(repoId);
    try {
      const res = await indexMutation.mutateAsync(repoId);
      toast.success(res.message || `Indexed ${res.chunks || 0} chunks successfully!`, 'Indexing Complete');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Indexing failed.';
      toast.error(msg, 'Indexing Failed');
    } finally {
      setIndexingRepoId(null);
    }
  };

  const handleDelete = async (repo) => {
    const confirmed = window.confirm(`Delete "${repo.name}"? This cannot be undone.`);
    if (!confirmed) return;
    try {
      await deleteMutation.mutateAsync(repo.id);
      if (selectedRepositoryId === repo.id) selectRepo(null);
      toast.success(`"${repo.name}" has been removed.`, 'Repository Deleted');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete repository.', 'Delete Failed');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--blue-700)' }}>Repository Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Connect GitHub repositories and index source code into vector AST chunks for AI analysis.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>Add Repository</Button>
      </div>

      {/* Repositories Grid */}
      {isLoading ? (
        <div className="grid-responsive">
          <Skeleton height="220px" borderRadius="14px" />
          <Skeleton height="220px" borderRadius="14px" />
        </div>
      ) : repositories.length === 0 ? (
        <EmptyState
          icon={GitFork} title="No Repositories Connected"
          description="Connect your GitHub repository to index AST code structure and start asking AI architectural questions."
          action={<Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>Add Repository</Button>}
        />
      ) : (
        <motion.div initial="hidden" animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid-responsive">
          {repositories.map((repo) => {
            const isSelected = selectedRepositoryId === repo.id;
            const isIndexing = indexingRepoId === repo.id;

            return (
              <motion.div key={repo.id} variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}>
                <Card style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                  background: isSelected ? 'var(--primary-light)' : 'var(--bg-card)',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', color: 'var(--blue-700)' }}>{repo.name}</h3>
                        <a href={repo.github_url} target="_blank" rel="noreferrer"
                          style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          {repo.github_url} <ExternalLink size={12} />
                        </a>
                      </div>
                      <Badge variant={repo.status === 'indexed' ? 'success' : repo.status === 'indexing' ? 'warning' : 'secondary'}>
                        {repo.status}
                      </Badge>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '0.2rem 0.55rem', borderRadius: '4px', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                        branch: {repo.default_branch}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileCode size={16} color="var(--primary)" />
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Files</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--blue-700)' }}>{repo.indexed_files || 0}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Layers size={16} color="var(--primary)" />
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Chunks</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--blue-700)' }}>{repo.indexed_chunks || 0}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button size="sm" variant={isSelected ? 'primary' : 'secondary'} onClick={() => selectRepo(repo.id)}>
                        {isSelected ? 'Active' : 'Select'}
                      </Button>
                      <Button size="sm" variant="secondary" icon={RefreshCw} isLoading={isIndexing} onClick={() => handleIndex(repo.id)}>
                        Index
                      </Button>
                    </div>
                    <motion.button whileHover={{ scale: 1.1, color: '#f43f5e' }} whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(repo)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px' }}
                      title="Delete Repository">
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Add Repository Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Connect New Repository">
        {formError && <Alert type="error" message={formError} onClose={() => setFormError('')} />}
        <form onSubmit={handleCreate}>
          <Input label="Repository Name" placeholder="e.g. backend-service" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="GitHub Repository URL" placeholder="https://github.com/org/repo" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} required />
          <Input label="Default Branch" placeholder="main" value={defaultBranch} onChange={(e) => setDefaultBranch(e.target.value)} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={createMutation.isPending}>Connect & Save</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};
