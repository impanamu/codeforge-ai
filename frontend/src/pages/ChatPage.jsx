import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Send, Bot, User, GitFork, Trash2, Copy, Check, ChevronDown, ChevronRight, FileText, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRepositories, useChatRepository } from '../hooks/useQueries';
import { useTypewriter } from '../hooks/useAnimations';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Badge, Button } from '../components/common/UIComponents';

/* ── Blinking cursor ─────────────────────────────── */
const BlinkStyle = () => (
  <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}.tw-cursor{display:inline-block;width:2px;height:1.1em;background:var(--primary);margin-left:2px;vertical-align:middle;animation:blink .7s step-end infinite}`}</style>
);

/* ── Language detection ──────────────────────────── */
const detectLang = (className = '') => (className || '').replace('language-', '') || 'text';

/* ── Code block — no copy button inside ─────────── */
const CodeBlock = ({ children, className }) => {
  const lang = detectLang(className);
  const code = String(children).replace(/\n$/, '');
  const { isDark } = useTheme();
  return (
    <div style={{ margin: '0.55rem 0', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0.3rem 0.8rem', background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'var(--font-mono)' }}>{lang}</span>
      </div>
      <SyntaxHighlighter language={lang} style={isDark ? oneDark : oneLight} PreTag="div"
        showLineNumbers={code.split('\n').length > 4}
        lineNumberStyle={{ color: 'var(--text-subtle)', fontSize: '0.68rem', minWidth: '2.2em' }}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.8rem', background: isDark ? '#0a0f14' : '#f8fafc', padding: '0.8rem 1rem', lineHeight: '1.6' }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

/* ── Single copy button ──────────────────────────── */
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <motion.button whileTap={{ scale: 0.92 }} onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ display: 'flex', alignItems: 'center', gap: '4px', background: copied ? 'rgba(16,185,129,0.12)' : 'var(--bg-input)', border: `1px solid ${copied ? 'rgba(16,185,129,0.35)' : 'var(--border-color)'}`, color: copied ? '#10b981' : 'var(--text-muted)', borderRadius: '6px', padding: '0.28rem 0.65rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500, transition: 'var(--transition-fast)', flexShrink: 0 }}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : 'Copy response'}
    </motion.button>
  );
};

/* ── Source chip ─────────────────────────────────── */
const SourceChip = ({ src }) => (
  <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.12 }}
    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.65rem', borderRadius: '20px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
    <FileText size={12} color="var(--primary)" />
    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--blue-700)' }}>{src.file_path.split('/').pop()}</span>
    <span style={{ color: 'var(--text-subtle)' }}>L{src.start_line}–{src.end_line}</span>
  </motion.div>
);

/* ── AI Message ──────────────────────────────────── */
const AIMessage = ({ message, isStreaming }) => {
  const { displayed, isDone } = useTypewriter(isStreaming ? message.text : '', 8);
  const renderText = isStreaming ? displayed : message.text;
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isLong = message.text.length > 1400;

  return (
    <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '90%', width: '100%', alignSelf: 'flex-start' }}>
      {/* Avatar */}
      <div style={{ flexShrink: 0, width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg, var(--blue-500), var(--blue-400))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>
        <Bot size={17} color="#fff" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header: label + copy button (top right) + collapse */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>CodeForge AI</span>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            {isLong && (
              <motion.button whileTap={{ scale: 0.93 }} onClick={() => setCollapsed(p => !p)}
                style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: '6px', padding: '0.25rem 0.55rem', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}>
                {collapsed ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                {collapsed ? 'Expand' : 'Collapse'}
              </motion.button>
            )}
            {/* ✅ Single copy button at top of AI message */}
            <CopyButton text={message.text} />
          </div>
        </div>

        {/* Bubble */}
        <div style={{ background: 'var(--msg-ai-bg)', border: '1px solid var(--border-color)', borderRadius: '0 var(--radius-lg) var(--radius-lg) var(--radius-lg)', padding: '1rem 1.2rem', boxShadow: 'var(--shadow-sm)' }}>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
                <div className="md-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        if (inline) return <code className={className} {...props}>{children}</code>;
                        return <CodeBlock className={className}>{children}</CodeBlock>;
                      },
                    }}>
                    {renderText}
                  </ReactMarkdown>
                  {isStreaming && !isDone && <span className="tw-cursor" />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {collapsed && <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>Response collapsed — click Expand above to read.</div>}
        </div>

        {/* Sources */}
        {message.sources?.length > 0 && (
          <div style={{ marginTop: '0.6rem' }}>
            <button onClick={() => setSourcesOpen(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: '0 0.1rem', marginBottom: '0.45rem' }}>
              {sourcesOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              {message.sources.length} source {message.sources.length === 1 ? 'file' : 'files'}
            </button>
            <AnimatePresence>
              {sourcesOpen && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {message.sources.map((s, i) => <SourceChip key={i} src={s} />)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <div style={{ fontSize: '0.67rem', color: 'var(--text-subtle)', marginTop: '0.4rem' }}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

/* ── User Message ────────────────────────────────── */
const UserMessage = ({ message }) => (
  <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '80%', alignSelf: 'flex-end', flexDirection: 'row-reverse' }}>
    <div style={{ flexShrink: 0, width: '32px', height: '32px', borderRadius: '9px', background: 'var(--blue-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>
      <User size={17} color="#fff" />
    </div>
    <div>
      <div style={{ textAlign: 'right', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.4rem' }}>You</div>
      <div style={{ background: 'var(--msg-user-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg) 0 var(--radius-lg) var(--radius-lg)', padding: '0.8rem 1rem', color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.65, wordBreak: 'break-word' }}>
        {message.text}
      </div>
      <div style={{ textAlign: 'right', fontSize: '0.67rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  </div>
);

/* ── Thinking bubble ─────────────────────────────── */
const ThinkingBubble = ({ stage }) => (
  <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start' }}>
    <div style={{ flexShrink: 0, width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg, var(--blue-500), var(--blue-400))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Bot size={17} color="#fff" />
    </div>
    <div style={{ background: 'var(--msg-ai-bg)', border: '1px solid var(--border-color)', borderRadius: '0 var(--radius-lg) var(--radius-lg) var(--radius-lg)', padding: '0.75rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[0,1,2].map(i => (
          <motion.span key={i} animate={{ y: [0,-6,0], opacity: [0.4,1,0.4] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.18 }}
            style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} />
        ))}
      </div>
      <motion.span key={stage} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.18 }}
        style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        {stage}
      </motion.span>
    </div>
  </div>
);

/* ── Suggestion chips ────────────────────────────── */
const SUGGESTIONS = [
  { icon: '💡', text: 'How does authentication work?' },
  { icon: '🔍', text: 'Where is the database initialized?' },
  { icon: '🏗️', text: 'Explain the project architecture' },
  { icon: '🐛', text: 'Where are errors handled?' },
  { icon: '🔒', text: 'How is authorization enforced?' },
  { icon: '📡', text: 'Show all API endpoints' },
];

const THINKING_STAGES = ['Searching repository AST…', 'Analyzing vector chunks…', 'Synthesizing RAG response…'];
const STORAGE_KEY = 'cf-chat-history';
const WELCOME_MSG = {
  id: 'welcome', sender: 'assistant', sources: [], timestamp: new Date(),
  text: "Hello! I'm your **AI Code Assistant**.\n\nAsk me anything about your indexed codebase — architecture, functions, authentication flows, database schemas, and more.\n\n> 💡 **Tip:** Select a repository above, then try one of the suggested questions below.",
};

/* ── Main ChatPage ───────────────────────────────── */
export const ChatPage = () => {
  const { selectedRepositoryId, selectRepo } = useAuth();
  const { data: repositories = [] } = useRepositories();
  const chatMutation = useChatRepository();
  const toast = useToast();

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
    } catch {}
    return [WELCOME_MSG];
  });

  const [streamingMsgId, setStreamingMsgId] = useState(null);
  const [question, setQuestion] = useState('');
  const [thinkingIdx, setThinkingIdx] = useState(0);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const activeRepo = repositories.find(r => r.id === Number(selectedRepositoryId));

  useEffect(() => {
    const toSave = messages.filter(m => m.id !== 'welcome').slice(-50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [messages]);

  useEffect(() => {
    if (!chatMutation.isPending) return;
    setThinkingIdx(0);
    const iv = setInterval(() => setThinkingIdx(p => (p + 1) % THINKING_STAGES.length), 1900);
    return () => clearInterval(iv);
  }, [chatMutation.isPending]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, chatMutation.isPending]);

  useKeyboardShortcuts([
    { keys: ['ctrl', '/'], handler: () => inputRef.current?.focus() },
    { keys: ['escape'],    handler: () => inputRef.current?.blur() },
  ]);

  const clearChat = useCallback(() => {
    setMessages([{ ...WELCOME_MSG, text: 'Chat cleared! Ask me anything.', timestamp: new Date() }]);
    localStorage.removeItem(STORAGE_KEY);
    toast.info('Chat history cleared.');
  }, [toast]);

  const handleSend = useCallback(async (e, override) => {
    e?.preventDefault();
    const q = (override || question).trim();
    if (!q) return;
    if (!selectedRepositoryId) { toast.warning('Select a repository first.'); return; }

    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text: q, sources: [], timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setQuestion('');
    inputRef.current?.focus();

    try {
      const res = await chatMutation.mutateAsync({ repositoryId: Number(selectedRepositoryId), question: q });
      const botId = `a-${Date.now()}`;
      setMessages(prev => [...prev, { id: botId, sender: 'assistant', text: res.answer, sources: res.sources || [], timestamp: new Date() }]);
      setStreamingMsgId(botId);
      setTimeout(() => setStreamingMsgId(null), res.answer.length * 9 + 600);
    } catch (err) {
      const errText = err.response?.data?.detail || 'Internal server error.';
      toast.error(errText, 'AI Chat Error');
      setMessages(prev => [...prev, { id: `err-${Date.now()}`, sender: 'assistant', text: `> ⚠️ **Error:** ${errText}`, sources: [], timestamp: new Date() }]);
    }
  }, [question, selectedRepositoryId, chatMutation, toast]);

  return (
    <>
      <BlinkStyle />
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 128px)', gap: '0.8rem' }}>

        {/* Repo bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <GitFork size={15} color="var(--primary)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>Repository:</span>
            {activeRepo
              ? <><span style={{ fontWeight: 700, color: 'var(--blue-700)', fontSize: '0.88rem' }}>{activeRepo.name}</span>
                  <Badge variant={activeRepo.status === 'indexed' ? 'success' : 'warning'}>{activeRepo.status}</Badge></>
              : <span style={{ fontSize: '0.83rem', color: '#f43f5e', fontWeight: 600 }}>None selected</span>}
          </div>
          <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center' }}>
            <select value={selectedRepositoryId || ''} onChange={e => selectRepo(e.target.value ? Number(e.target.value) : null)}
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.33rem 0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', outline: 'none' }}>
              <option value="">Select repository…</option>
              {repositories.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} onClick={clearChat}
              title="Clear chat history"
              style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)', padding: '0.33rem 0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <RotateCcw size={13} />
            </motion.button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.1rem', padding: '1.1rem', background: 'var(--chat-stream-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                style={{ display: 'flex', width: '100%' }}>
                {msg.sender === 'user' ? <UserMessage message={msg} /> : <AIMessage message={msg} isStreaming={streamingMsgId === msg.id} />}
              </motion.div>
            ))}
          </AnimatePresence>
          <AnimatePresence>
            {chatMutation.isPending && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <ThinkingBubble stage={THINKING_STAGES[thinkingIdx]} />
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion chips */}
        <AnimatePresence>
          {!chatMutation.isPending && selectedRepositoryId && messages.length <= 2 && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
              style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', flexShrink: 0 }}>
              {SUGGESTIONS.map(s => (
                <motion.button key={s.text} whileHover={{ scale: 1.03, borderColor: 'var(--primary)', background: 'var(--bg-card-hover)' }} whileTap={{ scale: 0.97 }}
                  onClick={() => handleSend(null, s.text)}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '0.32rem 0.8rem', fontSize: '0.79rem', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'var(--transition-fast)' }}>
                  {s.icon} {s.text}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div style={{ display: 'flex', gap: '0.65rem', flexShrink: 0 }}>
          <input ref={inputRef} type="text" className="form-input"
            placeholder={chatMutation.isPending ? 'AI is thinking…' : selectedRepositoryId ? `Ask about ${activeRepo?.name || 'the codebase'}… (Ctrl+/)` : 'Select a repository first…'}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend(e)}
            disabled={!selectedRepositoryId || chatMutation.isPending}
            style={{ flex: 1 }}
          />
          <Button variant="primary" icon={Send}
            disabled={!selectedRepositoryId || !question.trim() || chatMutation.isPending}
            isLoading={chatMutation.isPending}
            onClick={handleSend}>
            Send
          </Button>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--text-subtle)' }}>
          <kbd>Ctrl+/</kbd> focus &nbsp;·&nbsp; <kbd>Enter</kbd> send &nbsp;·&nbsp; <kbd>Esc</kbd> blur
        </div>
      </div>
    </>
  );
};
