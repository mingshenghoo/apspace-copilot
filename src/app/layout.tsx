import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'APSpace Copilot | Your campus, connected', description: 'A fictional academic assistant hackathon demo. No APU systems or Gemini Enterprise connection.' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
