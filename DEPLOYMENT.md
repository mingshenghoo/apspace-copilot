# Publish the hackathon demo

This project requires a Next.js server because `/api/assistant` handles document search. Do not deploy it as a static-only GitHub Pages site.

## Vercel configuration

Import this GitHub repository as a new Vercel project. Keep the application in the repository root.

| Setting | Value |
| --- | --- |
| Framework preset | Next.js |
| Root directory | `.` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | Framework default; do not override |
| Node.js version | 24.x |
| Environment variables | None required |

Use the existing account/plan; no paid API, custom domain, database, or Gemini credentials are required by this prototype. If the hosting service asks for a purchase or account permission change, review it separately.

Official import guide: https://vercel.com/docs/git

## Check the actual production URL

- Open the deployed HTTPS URL in a signed-out/private browser to confirm judges can reach it.
- Dashboard: timetable, deadlines, notifications, and navigation work.
- Assistant: ask about database normalization, Database Systems assignment due date, and library hours. Expand each source and verify the excerpt.
- Ask “What is my tuition fee balance?” and confirm no answer or citation is fabricated.
- Navigate away and back, refresh, and verify chat history. Then clear it.
- Classroom Finder: use 11:00–12:00 on the fixed demo date to see occupied rooms. Use 13:00–14:00 to select an available room and download a demo `.ics` event.
- Test a narrow phone window and confirm the navigation menu and chat input remain usable.
- Confirm Mock Data / Demo Mode and “Gemini Enterprise not connected” remain visible.

Record the verified production URL in the team entry. A localhost address or build-dashboard URL is not a public demo link.

## Submission checklist

Deadline supplied by the organizer: **10 November 2026, 11:59 PM MYT**.

- Project title: **APSpace Copilot**.
- Choose one of the official challenge areas in the team portal; do not guess the option name.
- Project summary (more than 50 characters):

  APSpace Copilot brings an APU student's academic day into one workspace: a timetable and deadline dashboard, source-grounded academic document search, and a smart classroom finder with simulated calendar invitations. The prototype uses clearly labeled fictional data and a replaceable AI service adapter for future Gemini Enterprise integration. No real university systems or external LLM are connected.

- HTTPS code repository link: verify that judges have access.
- PDF pitch deck: maximum 10 MB; still to be prepared.
- HTTPS demo link: verify the deployed production URL.
- Team leader reviews and confirms the final entry at https://apu-cloud-innovation-hackathon.gdgocapu.com/portal/.

Saving a draft does not submit the entry. The project and PDF become locked after final submission.
