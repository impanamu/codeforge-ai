import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileCode, GitFork, Copy, Check, Code2, Sparkles, Tag } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
      const data = await searchMutation.mutateAsync({
        repositoryId: Number(selectedRepositoryId),
        question: question.trim(),
      });
      setSearchResults(data.results || []);
      if ((data.results || []).length > 0) {
        toast.info(`Found ${data.results.length} relevant code chunk${data.results.length > 1 ? 's' : ''}.`);
      } else {
        toast.warning('No matching code chunks found for your query. Try rephrasing or indexing.');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--blue-700)', fontWeight: 700 }}>Semantic & Hybrid Code Search</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Instantly discover relevant functions, classes, and logic across your indexed repository with exact keyword & vector precision.
        </p>
      </div>

      {/* Search control card */}
      <Card hoverEffect={false} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <GitFork size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>Repository:</span>
            <select
              value={selectedRepositoryId || ''}
              onChange={e => selectRepo(e.target.value ? Number(e.target.value) : null)}
              style={{
                background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                color: 'var(--blue-700)', padding: '0.38rem 0.75rem', borderRadius: '6px',
                fontSize: '0.85rem', outline: 'none', fontWeight: 600,
              }}
            >
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
                ? 'Search e.g. "Where is user authentication handled?" or "Find JWT token creation"'
                : 'Select a repository above to start searching…'}
              icon={Search}
              value={question}
              onChange={e => setQuestion(e.target.value)}
              disabled={!selectedRepositoryId || searchMutation.isPending}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            icon={Search}
            disabled={!selectedRepositoryId || !question.trim() || searchMutation.isPending}
            isLoading={searchMutation.isPending}
          >
            Search
          </Button>
        </form>
      </Card>

      {/* Results Section */}
      {searchMutation.isPending ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Skeleton height="180px" borderRadius="12px" />
          <Skeleton height="180px" borderRadius="12px" />
          <Skeleton height="180px" borderRadius="12px" />
        </div>
      ) : searchResults === null ? (
        <EmptyState
          icon={Search}
          title="Search Your Codebase"
          description="Type a question or query above to find matching file paths, line ranges, and syntax-highlighted code snippets ranked by relevance."
        />
      ) : searchResults.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No Results Found"
          description="No code chunks matched your query threshold. Try rephrasing your search or trigger repository re-indexing."
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.88rem', color: 'var(--blue-700)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={15} color="var(--primary)" />
              {searchResults.length} relevant match{searchResults.length > 1 ? 'es' : ''} found
            </div>
          </div>

          {searchResults.map((result, idx) => {
            const lang = detectLanguage(result.file_path);
            const fileName = result.file_path.split('/').pop();
            const copied = copiedIdx === idx;
            const score = result.score || 0;

            // Score badge variant & label
            let scoreVariant = 'warning';
            let scoreIcon = '🔍';
            if (score >= 75) {
              scoreVariant = 'success';
              scoreIcon = '🎯';
            } else if (score >= 50) {
              scoreVariant = 'info';
              scoreIcon = '⚡';
            }

            return (
              <motion.div
                key={idx}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                style={{ width: '100%' }}
              >
                <div className="search-result-card">
                  {/* File Header */}
                  <div className="search-result-header">
                    <div className="search-result-path-box">
                      <FileCode size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span className="search-result-filename">{fileName}</span>
                      <span className="search-result-filepath" title={result.file_path}>
                        {result.file_path}
                      </span>
                    </div>

                    <div className="search-result-meta">
                      {/* Relevance Score Badge */}
                      <Badge variant={scoreVariant}>
                        {scoreIcon} {score}% Match
                      </Badge>

                      {/* Language & Line Range */}
                      <span style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--blue-600)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
                        {lang}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--blue-700)', background: 'var(--primary-light)', border: '1px solid var(--border-color)', padding: '0.15rem 0.55rem', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        L{result.start_line}–{result.end_line}
                      </span>

                      {/* Copy Snippet Button */}
                      <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={() => handleCopy(result.content, idx)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          background: copied ? 'rgba(16,185,129,0.1)' : 'var(--bg-card)',
                          border: `1px solid ${copied ? 'rgba(16,185,129,0.35)' : 'var(--border-color)'}`,
                          color: copied ? '#059669' : 'var(--text-muted)',
                          padding: '0.22rem 0.6rem', borderRadius: '5px',
                          fontSize: '0.75rem', cursor: 'pointer',
                          transition: 'var(--transition-fast)', fontWeight: 600,
                        }}
                      >
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Matched Keywords / Highlights Row */}
                  {result.highlights && result.highlights.length > 0 && (
                    <div className="search-highlights-row">
                      <Tag size={12} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Matched Concepts:</span>
                      {result.highlights.map((term, i) => (
                        <span key={i} className="search-highlight-badge">
                          {term}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Code Snippet Container */}
                  <div className="search-code-wrapper">
                    <SyntaxHighlighter
                      language={lang}
                      style={syntaxTheme}
                      showLineNumbers
                      startingLineNumber={result.start_line || 1}
                      lineNumberStyle={{ color: isDark ? '#4a5568' : '#94a3b8', fontSize: '0.74rem', minWidth: '2.8em', userSelect: 'none' }}
                      customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.83rem', lineHeight: '1.65' }}
                    >
                      {result.content}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
