# APSpace Copilot

A demo-ready academic assistant MVP built with Next.js App Router, TypeScript, and Tailwind CSS. This is an independent hackathon prototype, not an official APU application.

**All student profiles, modules, staff names, policies, rooms, schedules, deadlines, notifications, and progress figures are fictional. Gemini Enterprise is not connected. No APU credentials, APIs, or university systems are used.**

## Run locally

Prerequisite: Node.js 20.9 or newer (Node 24 LTS recommended) and npm.

```powershell
cd apspace-copilot
npm install
npm run dev
```

Open http://localhost:3000. No environment variables, account, or API key are needed. Stop the development server with Ctrl+C.

Development and production scripts use Next.js's supported Webpack option because the default Turbopack CSS compiler failed to start in the build environment. The package lock records the tested dependency versions; use `npm ci` for a clean, reproducible installation.

For a production build:

```sh
npm run build
npm start
```

Validation:

```sh
npm run typecheck
npm test
```

## Demo walkthrough

1. **Dashboard:** review three classes, three assignment deadlines, and fictional campus updates. The bell opens notifications. Dashboard actions navigate to the assistant and finder.
2. **Academic Assistant:** ask “When is my assignment due?” or “What are the library hours?” Each matching response includes numbered source references and expandable excerpts. Expand the knowledge shelf to inspect every fictional source. Unmatched questions receive an explicit no-source response. Clear chat resets the conversation and its browser-session copy.
3. **Classroom Finder:** starts at 13:00–14:00 on 6 November 2026. Filter by building and capacity. Try 11:00–12:00 to see occupied rooms. Select an available room and download a simulated `.ics` invitation. The event is tentative and marked `[DEMO]`; no booking is made and no invitation is sent.

The demo is intentionally anchored to **6 November 2026, 10:45 MYT (UTC+08:00)**. It does not read a live clock or live university timetable. Room search uses the fixed date with selectable times from 08:00–20:00. Dashboard room count describes its fixed 13:00–14:00 slot. The dashboard and room filters reset on refresh. Chat history is stored in sessionStorage for the current browser tab, survives refresh and navigation, and is removed by Clear chat. It is not stored on a server. If browser storage is disabled, chat remains available in memory only.

## Architecture

```text
src/
  app/
    page.tsx                 App entry point
    layout.tsx               Metadata and root layout
    globals.css              Tailwind import and responsive visual system
    api/assistant/route.ts   Validated server-side assistant endpoint
  components/
    copilot-app.tsx          Navigation, shell, dashboard, notifications
    assistant.tsx            Chat, citations, document shelf, error/loading states
    room-finder.tsx          Availability filters and calendar export
  data/
    academic.ts              Fictional student, timetable, deadlines
    academic-documents.ts    Four fictional documents with searchable passages
    classrooms.json          Fictional classroom inventory and occupied slots
  services/ai/
    types.ts                 Adapter and source contracts
    mock-adapter.ts          Exact excerpt answers and source construction
    retrieval.ts             Conservative passage-level lexical search
    index.ts                 Provider selection boundary
  lib/rooms.ts               Interval overlap checks and UTC calendar encoding
tests/domain.test.ts          Availability, export, and source-grounding checks
```

## Future Gemini Enterprise integration

Implement `AcademicAssistantAdapter` in a new server-side adapter and select it in `src/services/ai/index.ts`. The UI calls only `/api/assistant`; provider credentials must stay on the server. Preserve the answer text and source contract, and widen the provider type when a real provider is implemented. The current mock adapter searches normalized keywords and aliases within individual passages, quotes matching excerpts, and has no conversational reasoning or network AI calls. Conversation history is for display only; ask each question in full.

Before connecting real academic data, implement authentication, document access controls, approved data ingestion, provider-specific API handling, rate limits, and source-grounding verification. Obtain appropriate authorization separately; the prototype assumes none. Update the UI connection label only after a real integration is configured and verified.

## Scope and limitations

- Calendar downloads are local files, not calendar service integration or room reservations.
- The room schedule supports only the fixed demo date; adjacent intervals are permitted and overlapping intervals are rejected.
- No database, login, analytics, external fonts, or remote image dependencies.
- Layout adapts to desktop, tablet, and mobile. Controls include labels, keyboard focus styles, and an invitation dialog with a keyboard focus loop.
- Next.js setup reference: https://nextjs.org/docs/app/getting-started/installation

## Verification

Run `npm test`, `npm run typecheck`, and `npm run build`. The test suite covers exact citation grounding, unsupported facts, request validation, session-history parsing, and the existing classroom availability/calendar behavior.

Feature 2 verification: all 13 tests, TypeScript checks, and the production build passed. Live HTTP checks exercised the three supported examples and unsupported example below. Visual/browser interaction checks could not be completed in this pass because the browser automation connection was unavailable.

## Feature 2: Mock Academic Assistant

Open **Academic Assistant** in the existing navigation. The four documents in `src/data/academic-documents.ts` contain fictional lecture notes, three assignment briefs, campus FAQs, and a timetable for 6 November 2026. They are not official APU records or policies. Every supported answer quotes stored passages and offers clickable source titles with the matching section and exact excerpt. The knowledge shelf exposes all four documents.

Retrieval uses normalized words and explicit aliases (for example, normalization/normalisation). All meaningful query words must match within one passage; up to three matching passages are ranked by overlap with the excerpt. This is deliberately conservative: unfamiliar wording can return “information not found” even if a related topic exists. It does not infer missing facts, dates, or follow-up context, and it never fabricates citations. There is no real LLM, paid API, or embedded credential.

Try these three supported questions and one unsupported question:

| Question | Expected result |
| --- | --- |
| What is database normalization? | Lecture notes explaining 1NF, 2NF, and 3NF, with an expandable source. |
| When is the Database Systems assignment due? | The fictional brief states 9 November 2026 at 23:59 MYT and its deliverables. |
| What are the library hours? | The fictional FAQ states weekday 08:00–20:00 and Saturday 09:00–17:00 MYT. |
| What is my tuition fee balance? | Information not found; no citations. |

Also try “What classes do I have today?” to inspect the fixed demo timetable. Navigate to Dashboard and back, then refresh: the conversation remains in this tab’s session. **Clear chat** removes it. To test the error/retry state, stop the local server after loading the page and submit a question; restart it and use **Retry last question**. Pending requests show a searching state and time out after 15 seconds.

The replaceable integration point remains `AcademicAssistantAdapter` in `src/services/ai/types.ts`, selected by `src/services/ai/index.ts` and invoked only by `/api/assistant`. A future Gemini Enterprise adapter must run server-side and return verified titles, sections, and excerpts through this contract. Gemini Enterprise is **not connected** in this MVP.



## Hosting and submission

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Next.js hosting settings, the production demo test checklist, and the hackathon entry summary.
