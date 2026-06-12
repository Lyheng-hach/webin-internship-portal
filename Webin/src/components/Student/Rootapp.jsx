import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NAV from '../../assets/Student/NavItems';
import { studentAPI, applicationAPI, positionAPI, interviewAPI, supervisorAPI, supervisionRequestAPI, internAPI, documentAPI, universityAPI, notificationAPI } from '../../services/api';
import Dashboard from './Dashboard';
import Browse from './Browse';
import Applications from './Applications';
import Interviews from './Interviews';
import Internships from './Internships';
import Documents from './Documents';
import Profile from './Profile';
import MySupervisor from './MySupervisor';
import Notifications from './Notifications';

// ── Field adapters ─────────────────────────────────────────────────────────────
function fmtSalary(min, max) {
  if (min && max) return `$${Math.round(min)}–${Math.round(max)}/mo`;
  if (min)        return `$${Math.round(min)}/mo`;
  return "Negotiable";
}
function initials(str) {
  return (str || "??").split(/\s+/).map(w => w[0]).join("").slice(0,2).toUpperCase();
}

function adaptPosition(p) {
  const company = p.company_name || `Company #${p.company_id}`;
  return {
    id:          p.intern_position_id,
    company,
    logo:        initials(company),
    title:       p.title,
    location:    p.location,
    salary:      fmtSalary(p.salary_min, p.salary_max),
    deadline:    p.deadtime,
    slots:       p.slots,
    skills:      p.skills || [],
    type:        p.position_type,
    posted:      p.posted_date,
    description: p.description_post || "",
  };
}

function adaptApplication(a) {
  const company = a.company_name || `Company #${a.company_id || ""}`;
  return {
    id:                 a.application_id,
    intern_position_id: a.intern_position_id,
    company,
    logo:               initials(company),
    position:           a.position_title || `Position #${a.intern_position_id}`,
    location:           a.location || "N/A",
    salary:             fmtSalary(a.salary_min, a.salary_max),
    applyDate:          a.apply_date,
    status:             a.status,
    type:               a.position_type || "",
    cover_letter:       a.cover_letter || "",
  };
}

function adaptProfile(s, uniMap = {}) {
  return {
    id:             `STU-${s.student_id}`,
    student_id:     s.student_id,
    university_id:  s.university_id,
    universityName: uniMap[s.university_id] || `University #${s.university_id}`,
    name:           s.name,
    email:          "",
    phone:          s.phone,
    gender:         s.gender || "M",
    date_of_birth:  s.date_of_birth || "",
    nationality:    s.nationality,
    marital_status: s.marital_status || "Single",
    address:        s.address,
    year_of_study:  s.year_of_study || 1,
    major:          s.major,
    skills:         [],
    gpa:            s.gpa ? String(s.gpa) : "",
    profilePicture: s.profile_picture || null,
  };
}

// ── Rootapp ────────────────────────────────────────────────────────────────────
const Rootapp = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [page, setPage]         = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [positions,          setPositions]          = useState([]);
  const [applications,       setApplications]       = useState([]);
  const [interviews,         setInterviews]         = useState([]);
  const [profile,            setProfile]            = useState(null);
  const [supervisors,         setSupervisors]         = useState([]);
  const [supervisionRequests, setSupervisionRequests] = useState([]);
  const [internHistory,       setInternHistory]       = useState([]);
  const [documents,           setDocuments]           = useState([]);
  const [notifs,              setNotifs]              = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const handleLogout = () => { logout(); navigate("/login"); };

  // Called by Profile's CreateProfileForm after a successful POST
  const handleProfileCreated = (raw) => {
    universityAPI.list()
      .then(unis => {
        const uniMap = {};
        (unis || []).forEach(u => { uniMap[u.university_id] = u.name; });
        setProfile(adaptProfile(raw, uniMap));
      })
      .catch(() => setProfile(adaptProfile(raw)));
  };

  useEffect(() => {
    Promise.allSettled([
      positionAPI.list(),
      applicationAPI.myApplications(),
      studentAPI.getProfile(),
      interviewAPI.myList(),
      supervisorAPI.list(),
      supervisionRequestAPI.myList(),
      internAPI.studentHistory(),
      documentAPI.myList(),
      universityAPI.list(),
      notificationAPI.myList(),
    ]).then(([posRes, appRes, proRes, ivRes, supRes, sreqRes, intRes, docRes, uniRes, notifRes]) => {
      // Build university id → name lookup
      const uniMap = {};
      if (uniRes.status === "fulfilled") {
        (uniRes.value || []).forEach(u => { uniMap[u.university_id] = u.name; });
      }
      if (posRes.status   === "fulfilled") setPositions((posRes.value || []).map(adaptPosition));
      if (appRes.status   === "fulfilled") setApplications((appRes.value || []).map(adaptApplication));
      if (proRes.status   === "fulfilled") setProfile(adaptProfile(proRes.value, uniMap));
      if (ivRes.status    === "fulfilled") setInterviews(ivRes.value || []);
      if (supRes.status   === "fulfilled") setSupervisors(supRes.value || []);
      if (sreqRes.status  === "fulfilled") setSupervisionRequests(sreqRes.value || []);
      if (intRes.status   === "fulfilled") setInternHistory(intRes.value || []);
      if (docRes.status   === "fulfilled") setDocuments(docRes.value || []);
      if (notifRes.status === "fulfilled") setNotifs(notifRes.value || []);
      setLoading(false);
    });
  }, []);

  const titles = {
    dashboard:     "Dashboard",
    browse:        "Browse Positions",
    applications:  "My Applications",
    interviews:    "My Interviews",
    internships:   "Internship History",
    supervisor:    "My Supervisor",
    documents:     "Documents",
    notifications: "Notifications",
    profile:       "My Profile",
  };

  const unreadNotifs = notifs.filter(n => !n.is_read).length;
  const notifCount   = unreadNotifs;
  const displayName = profile?.name?.split(" ")[0] || "Student";
  const displayInitials = profile ? initials(profile.name) : "DS";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #07090f; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d1322; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
      `}</style>

      <div className="flex h-screen bg-[#07090f] text-slate-200 overflow-hidden" style={{fontFamily:"'IBM Plex Mono',monospace"}}>

        {/* ── SIDEBAR ── */}
        <aside className={`flex-shrink-0 flex flex-col bg-[#0a0d15] border-r border-slate-800/80 transition-all duration-300 ${sidebarOpen ? "w-56" : "w-16"}`}>
          {/* logo */}
          <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800/80 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500/30 to-indigo-500/30 border border-sky-500/30 flex items-center justify-center text-sky-400 text-xs font-black flex-shrink-0"
              style={{fontFamily:"'Syne',sans-serif"}}>W</div>
            {sidebarOpen && (
              <span className="text-base font-black tracking-tight bg-gradient-to-r from-sky-400 to-sky-300 bg-clip-text text-transparent" style={{fontFamily:"'Syne',sans-serif"}}>
                WEBIN
              </span>
            )}
            <button onClick={() => setSidebarOpen(p => !p)} className="ml-auto text-slate-600 hover:text-slate-400 transition-colors text-xs">
              {sidebarOpen ? "◁" : "▷"}
            </button>
          </div>

          {/* nav */}
          <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
            {NAV.map(({ id, label, icon }) => {
              const active = page === id;
              return (
                <button key={id} onClick={() => setPage(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group relative ${active ? "bg-sky-500/15 text-sky-400 border border-sky-500/25" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/60"}`}>
                  <span className={`text-base flex-shrink-0 transition-transform duration-150 ${active ? "" : "group-hover:scale-110"}`}>{icon}</span>
                  {sidebarOpen && <span className="truncate" style={{fontFamily:"'Syne',sans-serif"}}>{label}</span>}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {label}
                    </div>
                  )}
                  {id === "notifications" && notifCount > 0 && (
                    <span className={`ml-auto flex-shrink-0 min-w-[18px] h-[18px] rounded-full bg-sky-500 text-black text-[9px] font-black flex items-center justify-center ${!sidebarOpen ? "absolute top-1 right-1 w-4 h-4 min-w-0" : ""}`}>
                      {notifCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* user avatar + logout */}
          <div className={`flex-shrink-0 border-t border-slate-800/80 p-3 ${sidebarOpen ? "flex items-center gap-3" : "flex flex-col items-center gap-2"}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500/40 to-indigo-500/40 border border-sky-500/40 flex items-center justify-center text-[10px] font-black text-sky-400 flex-shrink-0"
              style={{fontFamily:"'Syne',sans-serif"}}>{displayInitials}</div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-200 truncate">{profile?.name || "Student"}</div>
                <div className="text-[10px] text-slate-500 truncate">Student</div>
              </div>
            )}
            <button onClick={handleLogout} title="Logout"
              className="flex-shrink-0 w-7 h-7 rounded-lg border border-slate-700 bg-slate-800/60 flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-500/40 transition-all text-sm">
              ⏻
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* topbar */}
          <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-slate-800/80 bg-[#0a0d15]/80 backdrop-blur-xl">
            <div>
              <h1 className="text-base font-black text-slate-100" style={{fontFamily:"'Syne',sans-serif"}}>{titles[page]}</h1>
              <p className="text-[10px] text-slate-600 font-mono">Student Portal · {profile?.id || "..."}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* bell */}
              <div className="relative">
                <button onClick={() => setPage("notifications")} className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all text-sm">
                  🔔
                </button>
                {notifCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-black text-[9px] font-black flex items-center justify-center">{notifCount}</span>}
              </div>
              {/* avatar */}
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800/60 cursor-pointer hover:border-slate-600 transition-colors" onClick={() => setPage("profile")}>
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-sky-500/50 to-indigo-500/50 flex items-center justify-center text-[9px] font-black text-sky-400">{displayInitials}</div>
                <span className="text-xs text-slate-300 font-semibold hidden sm:block" style={{fontFamily:"'Syne',sans-serif"}}>{displayName}</span>
                <span className="text-slate-600 text-[10px]">▼</span>
              </div>
            </div>
          </header>

          {/* content */}
          <main className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"/>
                  <div className="text-slate-500 text-sm">Loading data…</div>
                </div>
              </div>
            ) : (
              <div key={page} className="animate-fade-up">
                {page === "dashboard"     && <Dashboard      onNavigate={setPage} positions={positions} applications={applications} profile={profile} />}
                {page === "browse"        && <Browse         positions={positions} documents={documents} applications={applications} />}
                {page === "applications"  && <Applications   applications={applications} interviews={interviews} supervisors={supervisors} supervisionRequests={supervisionRequests} setSupervisionRequests={setSupervisionRequests} internHistory={internHistory} />}
                {page === "interviews"    && <Interviews     interviews={interviews} applications={applications} />}
                {page === "internships"   && <Internships    internHistory={internHistory} />}
                {page === "supervisor"    && <MySupervisor   supervisors={supervisors} supervisionRequests={supervisionRequests} setSupervisionRequests={setSupervisionRequests} />}
                {page === "documents"     && <Documents      documents={documents} setDocuments={setDocuments} />}
                {page === "notifications" && <Notifications  notifs={notifs} setNotifs={setNotifs} />}
                {page === "profile"       && <Profile        profile={profile} onProfileCreated={handleProfileCreated} />}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default Rootapp
