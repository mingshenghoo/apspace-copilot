'use client';
import { useRef } from 'react';
export function ArchitectureDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  return <><button className="subtle-chip architecture-trigger" onClick={() => dialog.current?.showModal()}>Architecture &amp; Hackathon Specs</button>
    <dialog ref={dialog} className="architecture-dialog panel" aria-labelledby="architecture-title">
      <div className="section-heading"><h2 id="architecture-title">Architecture &amp; Hackathon Specs</h2><button className="text-button" autoFocus onClick={() => dialog.current?.close()}>Close</button></div>
      <p>Working prototype · Fictional data · No university system access</p>
      <ol className="architecture-flow" aria-label="Implemented request flow"><li>Student web app · Next.js / TypeScript / Tailwind</li><li>POST /api/chat · Input validation</li><li>Reusable mock assistant adapter · Extractive document search</li><li>Four academic documents + mock classroom schedule</li></ol>
      <h3>Implemented</h3><ul><li>Exact source excerpts and clickable references</li><li>Session-only simulated pod reservation and real .ics export</li><li>Frontend and API deployable on Vercel</li></ul>
      <h3>Proposed integrations · Not connected</h3><p>Gemini Enterprise (Drive / Gmail / SharePoint connectors) → agent orchestration → custom MCP server on Cloud Run.</p>
      <p>Gemini, Antigravity orchestration, enterprise connectors, vector search, Google Calendar sync and Google Chat delivery are future work. This prototype does not demonstrate live multi-agent execution.</p>
    </dialog></>;
}
