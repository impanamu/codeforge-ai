import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  GitFork,
  RefreshCw,
  MessageSquareCode,
  Search,
  ExternalLink,
  Folder,
  Layers,
  FileCode,
  ArrowLeft,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  useRepositoryDetail,
  useIndexRepository,
  useDeleteRepository,
} from '../hooks/useQueries';
import { Card, Button, Badge, Spinner, Alert } from '../components/common/UIComponents';
import { useToast } from '../context/ToastContext';

export const RepositoryDetailPage = () => {
  const { id } = useParams();
  const repoId = Number(id);
  const navigate = useNavigate();
  const { selectedRepositoryId, selectRepo } = useAuth();

  const { data: repo, isLoading, isError } = useRepositoryDetail(repoId);
  const indexMutation = useIndexRepository();
  const deleteMutation = useDeleteRepository();

  const [indexMessage, setIndexMessage] = useState(null);
  const toast = useToast();

  const handleIndex = async () => {
    setIndexMessage(null);
    try {
      const res = await indexMutation.mutateAsync(repoId);
      setIndexMessage({
        type: 'success',
        text: res.message || `Successfully indexed repository into ${res.chunks || 0} chunks!`,
      });
    } catch (err) {
      setIndexMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Indexing failed.',
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this repository?')) {
      try {
        await deleteMutation.mutateAsync(repoId);
        if (selectedRepositoryId === repoId) selectRepo(null);
        toast.success('Repository deleted successfully.', 'Deleted');
        navigate('/repositories');
      } catch (err) {
        toast.error(err.response?.data?.detail || 'Failed to delete repository.', 'Delete Failed');
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <Spinner size={32} />
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading repository details...</p>
      </div>
    );
  }

  if (isError || !repo) {
    return (
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Alert type="error" title="Repository Not Found" message="The requested repository does not exist or you lack authorization." />
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/repositories')}>
          Back to Repositories
        </Button>
      </div>
    );
  }

  const isSelected = selectedRepositoryId === repo.id;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Navigation & Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/repositories')}>
            Back
          </Button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--blue-600)' }}>{repo.name}</h2>
              <Badge variant={repo.status === 'indexed' ? 'success' : repo.status === 'indexing' ? 'warning' : 'secondary'}>
                {repo.status}
              </Badge>
            </div>
            <a
              href={repo.github_url}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.85rem', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '0.2rem' }}
            >
              {repo.github_url} <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant={isSelected ? 'primary' : 'secondary'}
            onClick={() => selectRepo(repo.id)}
          >
            {isSelected ? 'Active Repository' : 'Set as Active'}
          </Button>
          <Button
            variant="secondary"
            icon={RefreshCw}
            isLoading={indexMutation.isPending}
            onClick={handleIndex}
          >
            Index Repository
          </Button>
          <Button variant="danger" icon={Trash2} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {indexMessage && (
        <Alert type={indexMessage.type} message={indexMessage.text} onClose={() => setIndexMessage(null)} />
      )}

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <Card>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.3rem' }}>Default Branch</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--blue-600)' }}>{repo.default_branch}</div>
        </Card>

        <Card>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.3rem' }}>Indexed Files</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>{repo.indexed_files || 0}</div>
        </Card>

        <Card>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.3rem' }}>Vector Chunks</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--blue-400)' }}>{repo.indexed_chunks || 0}</div>
        </Card>

        <Card>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.3rem' }}>Last Index Date</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--text-muted)' }}>
            {repo.last_indexed_at ? new Date(repo.last_indexed_at).toLocaleString() : 'Not indexed yet'}
          </div>
        </Card>
      </div>

      {/* Action Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquareCode size={22} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--blue-600)' }}>Ask AI Code Assistant</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Start a RAG-enhanced conversation with AI model regarding {repo.name}'s structure and logic.
          </p>
          <Button
            variant="primary"
            icon={MessageSquareCode}
            onClick={() => {
              selectRepo(repo.id);
              navigate('/chat');
            }}
          >
            Launch Chat Session
          </Button>
        </Card>

        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(114, 182, 223, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={22} color="var(--blue-300)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--blue-600)' }}>Search Code Chunks</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Perform natural language search to extract specific function snippets and line references.
          </p>
          <Button
            variant="secondary"
            icon={Search}
            onClick={() => {
              selectRepo(repo.id);
              navigate('/search');
            }}
          >
            Open Code Search
          </Button>
        </Card>
      </div>
    </div>
  );
};
