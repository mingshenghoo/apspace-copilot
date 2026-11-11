'use client';
import { useEffect, useState } from 'react';
import { ArrowRight, Bell, BookOpen, CalendarDays, Check, ChevronRight, Clock3, GraduationCap, LayoutDashboard, MapPin, Menu, Sparkles, Users, X } from 'lucide-react';
import { assignments, notifications, student, timetable } from '@/data/academic';
import { Assistant } from './assistant';
import { RoomFinder } from './room-finder';
import { ArchitectureDialog } from './architecture-dialog';
import { POD_SESSION_KEY, podInvitation } from '@/lib/pod';
type Tab = 'Dashboard' | 'Academic Assistant' | 'Classroom Finder';
const nav = [{title:'Dashboard' as Tab, icon:LayoutDashboard},{title:'Academic Assistant' as Tab,icon:Sparkles},{title:'Classroom Finder' as Tab,icon:MapPin}];
export function CopilotApp() {
  const [tab,setTab] = useState<Tab>('Dashboard'); const [menu,setMenu]=useState(false); const [showNotices,setShowNotices]=useState(false);
  // Views share one URL, so reset the document scroll after the selected view renders.
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, [tab]);
  const [afternoon, setAfternoon] = useState(false);
  const [podReserved, setPodReserved] = useState(false);
  const [bookingReady, setBookingReady] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('');
  useEffect(() => { try { setPodReserved(sessionStorage.getItem(POD_SESSION_KEY) === 'true'); } catch {} setBookingReady(true); }, []);
  function reservePod() {
    try {
      const url = URL.createObjectURL(new Blob([podInvitation()], { type: 'text/calendar;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = 'DEMO-study-pod-B-03.ics'; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      setPodReserved(true); try { sessionStorage.setItem(POD_SESSION_KEY, 'true'); } catch {}
      setBookingStatus('Campus Ops Agent simulation: Pod B-03 reserved in this demo session. Event exported. Google Calendar sync and Google Chat notification are simulated only.');
    } catch { setBookingStatus('Could not export the event. Please try again.'); }
  }
  function navigate(next:Tab) {setTab(next);setMenu(false);}
  return <div className="app-shell">
    <aside className={`sidebar ${menu?'is-open':''}`}>
      <a className="brand" href="#" onClick={e=>{e.preventDefault();navigate('Dashboard');}}><span className="brand-icon"><GraduationCap size={23}/></span><span>APSpace<span className="brand-sub">COPILOT</span></span></a>
      <div className="workspace-label">YOUR WORKSPACE</div>
      <nav aria-label="Main navigation">{nav.map(({title,icon:Icon})=><button key={title} onClick={()=>navigate(title)} className={`nav-item ${tab===title?'active':''}`} aria-current={tab===title?'page':undefined}><Icon size={19}/>{title}{title==='Academic Assistant'&&<span className="tiny-ai">AI</span>}</button>)}</nav>
      <div className="sidebar-note"><span className="small-orbit"><Sparkles size={20}/></span><h3>A little less admin.<br/>A lot more possibility.</h3><p>Your academic day, brought together in one place.</p><span className="sidebar-pill">HACKATHON EDITION ↗</span></div>
      <div className="sidebar-bottom"><span className="status-dot"/> Demo workspace <span className="version">v0.1</span></div>
      <div className="profile"><div className="avatar">AT</div><div><strong>{student.fullName}</strong><small>Fictional student profile</small></div></div>
    </aside>
    <div className="main-shell">
      <header className="topbar"><div className="breadcrumb"><button className="icon-button mobile-menu" aria-label="Toggle navigation" onClick={()=>setMenu(!menu)}>{menu?<X size={20}/>:<Menu size={20}/>}</button><span>My workspace</span><ChevronRight size={14}/><strong>{tab}</strong></div><div className="topbar-right"><ArchitectureDialog/><span className="demo-tag"><span/> DEMO MODE</span><button className="icon-button notification-button" aria-label="Toggle notifications" aria-expanded={showNotices} onClick={()=>setShowNotices(!showNotices)}><Bell size={19}/><i/></button><div className="avatar small">AT</div></div></header>
      {showNotices&&<section className="notification-popover"><div className="section-heading"><h3>Notifications</h3><button className="icon-button" onClick={()=>setShowNotices(false)} aria-label="Close notifications"><X size={18}/></button></div>{notifications.map(n=><div className="notice" key={n.title}><strong>{n.title}</strong><p>{n.detail}</p><small>{n.time} · demo</small></div>)}</section>}
      <main>
        <div className="demo-banner"><span><BookOpen size={15}/> A glimpse of a more connected campus.</span><span>Fictional data · No APU system access · Gemini Enterprise not connected</span></div>
        {tab==='Dashboard'&&<Dashboard navigate={navigate} afternoon={afternoon} toggleClock={() => setAfternoon(value => !value)} podReserved={podReserved} reservePod={reservePod} bookingReady={bookingReady} bookingStatus={bookingStatus}/>}
        <div hidden={tab!=='Academic Assistant'}><Assistant podReserved={podReserved}/></div>
        {tab==='Classroom Finder'&&<RoomFinder podReserved={podReserved}/>}
        <footer><span>APSpace Copilot <span className="muted">/</span> Built for the space between classes.</span><span>Independent hackathon prototype · All times MYT</span></footer>
      </main>
    </div>
  </div>;
}
function Dashboard({navigate, afternoon, toggleClock, podReserved, reservePod, bookingReady, bookingStatus}:{navigate:(tab:Tab)=>void; afternoon:boolean; toggleClock:()=>void; podReserved:boolean; reservePod:()=>void; bookingReady:boolean; bookingStatus:string}) {
  return <>
    <div className="page-heading"><div><div className="eyebrow">FRIDAY, 6 NOVEMBER 2026 · DEMO DAY</div><h1>A good day to get ahead, Alex <span className="wave">✺</span></h1><p>Here’s your campus day. A little clearer, a little easier.</p></div><div className="date-chip"><CalendarDays size={17}/> Week 7 <span>Semester 1</span></div></div>
    <section className="hero"><div className="hero-content"><div className="hero-kicker"><span className="status-dot"/> YOUR CAMPUS, CONNECTED</div><h2>Less searching.<br/>More <span>making things happen.</span></h2><p>From your next class to your next big question.<br/>Meet your everyday academic copilot.</p><button className="lime-button" onClick={()=>navigate('Academic Assistant')}><Sparkles size={17}/> Ask your copilot <ArrowRight size={18}/></button></div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/><div className="orb-center"><Sparkles size={51} strokeWidth={1.3}/></div><div className="floating-card float-top"><div className="mini-icon"><CalendarDays size={18}/></div><span>Everything in sync<small>Your day, made simple</small></span><Check size={15}/></div><div className="floating-card float-bottom"><span className="mini-icon lime"><MapPin size={18}/></span><span>A space for your next idea<small>Find a room. Find your focus.</small></span></div><div className="art-spark spark-one">✦</div><div className="art-spark spark-two">✧</div></div></section>
    <section className="stats-grid" aria-label="Your day at a glance">{[{title:'Classes today',value:'03',sub:afternoon?'1 session ahead':'2 sessions ahead',icon:CalendarDays,color:'purple'},{title:'Upcoming deadlines',value:'03',sub:'Next due in 3 days',icon:BookOpen,color:'orange'},{title:'Rooms available',value:podReserved?'04':'05',sub:'Today, 13:00–14:00',icon:MapPin,color:'green'},{title:'Your copilot',value:'Ready',sub:'Grounded in 4 demo documents',icon:Sparkles,color:'blue'}].map(s=><div className="stat-card" key={s.title}><div className="stat-top"><span>{s.title}</span><span className={`stat-icon ${s.color}`}><s.icon size={18}/></span></div><strong>{s.value}</strong><small>{s.sub}</small>{s.title==='Rooms available'&&<button className="text-button reserve-pod" disabled={!bookingReady || afternoon || podReserved} onClick={reservePod}>{podReserved?'Pod B-03 reserved · Demo':afternoon?'13:00 slot has started':'Reserve Pod & Export Event (.ics)'}</button>}</div>)}</section><p className="booking-status" role="status">{bookingStatus}</p>
    <div className="dashboard-grid"><section className="panel timetable"><div className="section-heading"><div><h2>Today’s timetable</h2><p>A plan for the day ahead.</p></div><span className="subtle-chip">3 sessions</span></div><div className="timeline">{timetable.map((session,i)=><div className={`class-row ${i===(afternoon?2:1)?'next-class':''}`} key={session.code}><div className="class-time"><strong>{session.time}</strong><span>{session.end}</span></div><div className="timeline-dot"/><div className="class-details"><div className="class-label"><span>{session.code} · {session.kind}</span><span className={`session-status ${i===(afternoon?2:1)?'up-next':''}`}>{i<(afternoon?2:1)&&<Check size={12}/>} {i<(afternoon?2:1)?'Completed':i===(afternoon?2:1)?'Up next':'Later today'}</span></div><h3>{session.title}</h3><p><MapPin size={13}/>{session.room}<span>·</span>{session.lecturer}</p></div></div>)}</div><div className="panel-bottom"><Clock3 size={14}/> Demo clock: {afternoon?'1:15 PM':'10:45 AM'} · Malaysia time (UTC+8) <button className="subtle-chip" aria-pressed={afternoon} onClick={toggleClock}>Switch to {afternoon?'10:45 AM':'1:15 PM'}</button></div></section>
    <section className="panel deadlines"><div className="section-heading"><div><h2>On your radar</h2><p>Small steps. Steady progress.</p></div><BookOpen size={20} className="muted"/></div>{assignments.map(a=><div className="assignment" key={a.title}><div className="assignment-top"><span className={`due-chip ${a.color}`}>{a.days}</span><span>Due {a.due}</span></div><h3>{a.title}</h3><p>{a.module}</p><div className="progress-line"><div className={`progress-track ${a.color}`}><span style={{width:`${a.progress}%`}}/></div><span>{a.progress}%</span></div></div>)}<div className="panel-bottom">Progress values are illustrative demo data.</div></section></div>
    <div className="bottom-grid"><section className="panel"><div className="section-heading"><h2>Campus updates</h2><span className="subtle-chip">2 new</span></div>{notifications.map((n,i)=><div className="update-row" key={n.title}><span className={`stat-icon ${i?'purple':'orange'}`}>{i?<Users size={18}/>:<Bell size={18}/>}</span><div><h3>{n.title}</h3><p>{n.detail}</p></div><small>{n.time}</small></div>)}</section><button className="find-room-card" onClick={()=>navigate('Classroom Finder')}><div><span className="eyebrow">SPACE TO THINK</span><h2>Good ideas need a room.</h2><p>Find a free space for your next study session.</p><span className="text-link">Explore classrooms <ArrowRight size={17}/></span></div><div className="room-illustration"><MapPin size={45} strokeWidth={1.3}/></div></button></div>
  </>;
}
