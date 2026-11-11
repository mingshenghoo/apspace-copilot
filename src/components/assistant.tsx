'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp, BookOpen, FileText, Sparkles } from 'lucide-react';
import { documents, exampleQuestions } from '@/data/academic-documents';
import { quickPrompts } from '@/data/quick-prompts';
import type { AcademicAnswer } from '@/services/ai/types';
import { readConversation, SESSION_KEY, type ChatMessage } from '@/lib/conversation';

export function Assistant({podReserved = false}:{podReserved?:boolean}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [configured, setConfigured] = useState<boolean | null>(null);
  useEffect(() => { const controller = new AbortController(); fetch('/api/chat', {signal:controller.signal}).then(response => response.ok ? response.json() : Promise.reject()).then(data => setConfigured(data.configured === true)).catch(() => setConfigured(null)); return () => controller.abort(); }, []);
  const [ready, setReady] = useState(false);
  const busy = useRef(false);
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { setMessages(readConversation(sessionStorage.getItem(SESSION_KEY))); } catch { /* Storage may be disabled; in-memory chat still works. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages)); } catch { /* Quota/privacy settings must not break chatting. */ }
  }, [messages, ready]);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, loading]);

  async function ask(value: string, retry = false) {
    const trimmed = value.trim();
    if (!trimmed || busy.current || !ready) return;
    busy.current = true; setLoading(true); setError(''); setQuestion('');
    if (!retry) setMessages(previous => [...previous, { role: 'user', text: trimmed }]);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed, podReserved }), signal: controller.signal,
      });
      if (!response.ok) throw new Error('The document search is unavailable. Please retry your question.');
      const result: AcademicAnswer = await response.json();
      setMessages(previous => [...previous, { role: 'assistant', text: result.text, sources: result.sources, provider: result.provider, notice: result.notice }]);
    } catch (cause) {
      setError(cause instanceof Error && cause.name === 'AbortError'
        ? 'The search timed out. Please retry your question.'
        : 'The document search could not be reached. Check your connection and retry.');
      setQuestion(trimmed);
    } finally { clearTimeout(timer); busy.current = false; setLoading(false); }
  }
  function clearChat() {
    setMessages([]); setError(''); setQuestion('');
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* In-memory reset still works. */ }
  }
  const lastMessage = messages[messages.length - 1];
  const retryQuestion = lastMessage?.role === 'user' ? lastMessage.text : '';

  return <>
    <div className="page-heading">
      <div><div className="eyebrow">A LITTLE CLARITY GOES A LONG WAY</div><h1>Your academic copilot <Sparkles className="inline-icon"/></h1><p>Ask a question. Get a grounded answer. See where it came from.</p></div>
      <span className="subtle-chip">Mock Data / Demo Mode</span>
    </div>
    <div className="assistant-layout">
      <section className="panel chat-panel" aria-label="Academic Assistant chat">
        <div className="chat-header">
          <span className="stat-icon purple"><Sparkles size={20}/></span>
          <div><h3>Academic Assistant</h3><p>{configured === null ? 'Checking provider configuration…' : configured ? 'Gemini API configured · Fictional references' : 'Mock search · No live model configured'} · Gemini Enterprise not connected</p></div>
          <button className="text-button" disabled={loading || !messages.length} onClick={clearChat}>Clear chat</button>
        </div>
        <div ref={log} className="chat-messages" role="log" aria-label="Conversation" aria-live="polite" aria-busy={loading} tabIndex={0}>
          {!messages.length ? <div className="chat-welcome">
            <span className="welcome-icon"><Sparkles size={34}/></span><h2>Big question or small,<br/>start here.</h2>
            <p>Explore fictional lecture notes, assignment briefs,<br/>campus FAQs, and the 6 November 2026 demo timetable.</p>
            <div className="prompt-grid">{exampleQuestions.map(prompt => <button key={prompt} disabled={!ready || loading} onClick={() => ask(prompt)}>{prompt}<ArrowUp size={15}/></button>)}</div>
          </div> : messages.map((message, index) => <article key={index} className={`message ${message.role}`}>
            <div className="message-label">{message.role === 'user' ? 'YOU' : message.provider === 'gemini' ? 'COPILOT · GEMINI API · SOURCE SELECTION' : 'COPILOT · MOCK DOCUMENT SEARCH'}</div>
            {message.notice && <p className="error" role="status">{message.notice}</p>}<p>{message.text}</p>
            {!!message.sources?.length && <div className="sources">
              <strong><BookOpen size={14}/> Sources · Fictional documents</strong>
              {message.sources.map((source, sourceIndex) => <details key={source.id}>
                <summary>[{sourceIndex + 1}] {source.title}<span>{source.section}</span></summary>
                <p>{source.excerpt}</p>
              </details>)}
            </div>}
          </article>)}
          {loading && <p className="loading-text" role="status">Searching fictional reference data…</p>}
        </div>
        <div className="chat-input-area"><div className="quick-prompts" aria-label="Quick questions">{quickPrompts.map(prompt => <button className="subtle-chip" key={prompt} disabled={!ready || loading} onClick={() => ask(prompt)}>{prompt}</button>)}</div>
          {error && <div className="chat-error"><p role="alert" className="error">{error}</p><button className="text-button" disabled={loading || !retryQuestion} onClick={() => ask(retryQuestion, true)}>Retry last question</button></div>}
          <form onSubmit={event => { event.preventDefault(); ask(question, !!error && question.trim() === retryQuestion); }} className="chat-form">
            <input aria-label="Ask an academic question" aria-describedby="assistant-note" placeholder="What would you like to know?" maxLength={1000} value={question} onChange={event => setQuestion(event.target.value)} disabled={loading || !ready}/>
            <button aria-label="Send question" disabled={loading || !ready || !question.trim()}><ArrowUp size={21}/></button>
          </form>
          <p id="assistant-note">Fictional sources, not official university advice. History stays in this browser tab’s session. Ask each question in full.</p>
          {!!messages.length && <details className="chat-examples"><summary>Suggested questions</summary><div className="prompt-grid">{exampleQuestions.map(prompt => <button key={prompt} disabled={loading} onClick={() => ask(prompt)}>{prompt}</button>)}</div></details>}
        </div>
      </section>
      <aside className="source-sidebar">
        <div className="panel">
          <div className="section-heading"><h2>The knowledge shelf</h2><span className="subtle-chip">{documents.length}</span></div>
          <p className="source-intro">Four fictional documents. Click a title to inspect its exact source passages.</p>
          {documents.map(document => <details className="document" key={document.id}>
            <summary><FileText size={18}/><span>{document.title}<small>{document.category} · Mock data · {document.updated}</small></span></summary>
            {document.passages.map(passage => <div className="document-passage" key={passage.id}><h3>{passage.section}</h3><p>{passage.excerpt}</p></div>)}
          </details>)}
        </div>
        <div className="integration-card"><Sparkles size={21}/><h3>Built for what comes next.</h3><p>Mock mode matches words and known aliases. Gemini mode uses a model to select passages. Both return stored excerpts; selection can still be imperfect, so inspect the references. Questions sent in Gemini mode are processed by Google. Do not enter personal records.</p><p>An optional server-side Gemini API adapter selects relevant passages; the server verifies source IDs and copies exact excerpts. If unconfigured or unavailable, labeled mock search is used. Gemini Enterprise is a separate future integration.</p><span className="subtle-chip">Integration planned · Not connected</span></div>
      </aside>
    </div>
  </>;
}
