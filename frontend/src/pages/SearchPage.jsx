import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileCode, GitFork, Copy, Check, Code2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useRepositories, useSearchRepository } from '../hooks/useQueries';
import { useToast } from '../context/ToastContext';
import { Card, Button, Input, EmptyState, Badge, Skeleton } from '../components/common/UIComponents';

// Detect language from file extension
const detectLanguage = (filePath = '') => {
  const ext = filePath.split('.').pop()?.toLowerCase();
  const map = {
    py: 'python', js: 'javascript', jsx: 'jsx', ts: 'typescript', tsx: 'tsx',
    java: 'java', go: 'go', rs: 'rust', rb: 'ruby', php: 'php',
    cs: 'csharp', cpp: 'cpp', c: 'c', sh: 'bash', yaml: 'yaml',
    yml: 'yaml', json: 'json', html: 'html', css: 'css', md: 'markdown',
    sql: 'sql', kt: 'kotlin', swift: 'swift',
  };
  return map[ext] || 'text';
};

export const SearchPage = () => {
  const { selectedRepositoryId, selectRepo } = useAuth();
  const { data: repositories = [] } = useRepositories();
  const searchMutation = useSearchRepository();
  const toast = useToast();
  const { isDark } = useTheme();

  const [question, setQuestion] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const activeRepo = repositories.find(r => r.id === Number(selectedRepositoryId));
  const syntaxTheme = isDark ? oneDark : oneLight;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    if (!selectedRepositoryId) {
      toast.warning('Please select a repository before searching.', 'No Repository');
      return;
    }
    try {
      const data = await searchMutation.mutateAsync({ repositoryId: Number(selectedRepositoryId), question: question.trim() });
      setSearchResults(data.results || []);
      if ((data.results || []).length > 0) {
        toast.info(`Found ${data.results.length} matching result${data.results.length > 1 ? 's' : ''}.`);
      } else {
        toast.warning('No code chunks matched your query. Try re-indexing or rephrasing.');
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Search query failed.', 'Search Error');
    }
  };

  const handleCopy = (content, idx) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
    toast.success('Code snippet copied to clipboard.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--blue-600)' }}>Semantic Code Search</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Locate precise functions, classes, and logic across your indexed codebase.
        </p>
      </div>

      {/* Search control card */}
      <Card hoverEffect={false} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <GitFork size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>Repository:</span>
            <select value={selectedRepositoryId || ''} onChange={e => selectRepo(e.target.value ? Number(e.target.value) : null)}
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--blue-600)', padding: '0.38rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', outline: 'none', fontWeight: 600 }}>
              <option value="">Select repository…</option>
              {repositories.map(r => <option key={r.id} value={r.id}>{r.name} ({r.indexed_chunks || 0} chunks)</option>)}
            </select>
          </div>
          {activeRepo && (
            <Badge variant={activeRepo.status === 'indexed' ? 'success' : 'warning'}>
              {activeRepo.status} · {activeRepo.indexed_files || 0} files
            </Badge>
          )}
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.7rem' }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder={selectedRepositoryId
                ? 'e.g. Where is user authentication handled? or Find the database session manager'
                : 'Select a repository to begin searching…'}
              icon={Search} value={question}
              onChange={e => setQuestion(e.target.value)}
              disabled={!selectedRepositoryId || searchMutation.isPending}
            />
          </div>
          <Button type="submit" variant="primary" icon={Search}
            disabled={!selectedRepositoryId || !question.trim() || searchMutation.isPending}
            isLoading={searchMutation.isPending}>
            Search
          </Button>
        </form>
      </Card>

      {/* Results */}
      {searchMutation.isPending ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Skeleton height="160px" borderRadius="12px" />
          <Skeleton height="160px" borderRadius="12px" />
          <Skeleton height="160px" borderRadius="12px" />
        </div>
      ) : searchResults === null ? (
        <EmptyState icon={Search} title="Search Your Codebase"
          description="Type a question or query above to find matching file paths and syntax-highlighted code snippets." />
      ) : searchResults.length === 0 ? (
        <EmptyState icon={Code2} title="No Results Found"
          description="No code chunks matched your query. Try rephrasing or re-index the repository." />
      ) : (
        <motion.div initial="hidden" animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

          <div style={{ fontSize: '0.88rem', color: 'var(--blue-500)', fontWeight: 600 }}>
            {searchResults.length} result{searchResults.length > 1 ? 's' : ''} found
          </div>

          {searchResults.map((result, idx) => {
            const lang = detectLanguage(result.file_path);
            const fileName = result.file_path.split('/').pop();
            const copied = copiedIdx === idx;

            return (
              <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                  {/* File header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.65rem 1rem',
                    background: 'var(--blue-50)', borderBottom: '1px solid var(--border-color)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <FileCode size={16} color="var(--primary)" />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue-600)' }}>
                        {fileName}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>
                        {result.file_path}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--blue-500)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
                        {lang}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--blue-500)', background: 'rgba(76,159,206,0.12)', border: '1px solid var(--blue-200)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
                        L{result.start_line}–{result.end_line}
                      </span>
                      <motion.button whileTap={{ scale: 0.93 }} onClick={() => handleCopy(result.content, idx)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: copied ? 'rgba(16,185,129,0.1)' : 'var(--bg-card)', border: `1px solid ${copied ? 'rgba(16,185,129,0.35)' : 'var(--border-color)'}`, color: copied ? '#059669' : 'var(--text-muted)', padding: '0.2rem 0.55rem', borderRadius: '5px', fontSize: '0.73rem', cursor: 'pointer', transition: 'var(--transition-fast)', fontWeight: 500 }}>
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Syntax-highlighted code */}
                  <SyntaxHighlighter
                    language={lang} style={syntaxTheme}
                    showLineNumbers
                    startingLineNumber={result.start_line || 1}
                    lineNumberStyle={{ color: isDark ? '#4a5568' : '#9ab', fontSize: '0.72rem', minWidth: '2.8em', userSelect: 'none' }}
                    customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.82rem', lineHeight: '1.65', maxHeight: '420px', overflow: 'auto' }}
                  >
                    {result.content}
                  </SyntaxHighlighter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
