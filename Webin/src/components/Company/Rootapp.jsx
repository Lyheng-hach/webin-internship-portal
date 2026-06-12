import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NAV, { PAGE_TITLES } from '../../assets/Company/Navitems';
import { companyAPI, positionAPI, applicationAPI, interviewAPI, notificationAPI, internAPI } from '../../services/api';
import Dashboard from './Dashboard';
import Positions from './Positions';
import Applications from './Applications';
import Interns from './Interns';
import Interviews from './Interviews';
import Notifications from './Notifications';
import CompanyProfile from './CompanyProfile';

// ── Adapters ───────────────────────────────────────────────────────────────────
function initials(str) {
  return (str || "??").split(/\s+/).map(w => w[0]).join("").slice(0,2).toUpperCase();
}
function fmtSalary(min, max) {
  if (min && max) return `$${Math.round(min)}–${Math.round(max)}/mo`;
  if (min)        return `$${Math.round(min)}/mo`;
  return "Negotiable";
}

function adaptCompany(c) {
  return {
    company_id:   `COM-${c.company_id}`,
    _id:          c.company_id,
    name:         c.name,
    industry:     c.industry,
    phone:        c.phone,
    address:      c.address,
    website:      c.website || "",
    description:  c.description_company || "",
    logo:         initials(c.name),
    verified:     c.verified_status === "Verified",
    verified_status: c.verified_status,
    status:       c.status,
    size:         "",
    founded:      "",
  };
}

function adaptPosition(p) {
  return {
    position_id:        `POS-${p.intern_position_id}`,
    intern_position_id: p.intern_position_id,
    company_id:         p.company_id,
    title:              p.title,
    type:               p.position_type,
    location:           p.location,
    salary_min:         p.salary_min ? Math.round(Number(p.salary_min)) : 0,
    salary_max:         p.salary_max ? Math.round(Number(p.salary_max)) : 0,
    slots:              p.slots,
    filled:             p.filled_slots,
    deadline:           p.deadtime,
    posted:             p.posted_date,
    status:             p.status,
    description:        p.description_post || "",
    department:         p.department || "",
    skills:             p.skills || [],
  };
}

function adaptApplication(a) {
  return {
    application_id:     a.application_id,
    position_id:        `POS-${a.intern_position_id}`,
    intern_position_id: a.intern_position_id,
    position:           a.position_title || `Position #${a.intern_position_id}`,
    student_id:         a.student_id,
    student_name:       a.student_name || `Student #${a.student_id}`,
    university:         a.university_id ? `Univ. #${a.university_id}` : "N/A",
    apply_date:         a.apply_date,
    status:             a.status,
    interview_status:   null,
    cover_letter:       a.cover_letter || "",
    gpa:                "N/A",
    year:               "N/A",
    documents:          a.documents || [],
  };
}

function adaptInterview(iv, appsMap) {
  const app = appsMap[iv.application_id];
  return {
    interview_id:  iv.interview_id,
    application_id:`APP-${iv.application_id}`,
    student_name:  app?.student_name || `Student #${iv.student_id}`,
    position:      app?.position     || `App #${iv.application_id}`,
    scheduled_at:  iv.scheduled_at,
    type:          iv.interview_type,
    location:      iv.location,
    status:        iv.status,
    notes:         "",
  };
}

// ── Rootapp ────────────────────────────────────────────────────────────────────
const Rootapp = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login"); };

  const [page, setPage]           = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const [company,      setCompany]      = useState(null);
  const [positions,    setPositions]    = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews,   setInterviews]   = useState([]);
  const [interns,      setInterns]      = useState([]);
  const [notifs,       setNotifs]       = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.allSettled([
      companyAPI.getProfile(),
      positionAPI.myList(),
      applicationAPI.companyApps(),
      interviewAPI.myList(),
      notificationAPI.myList(),
      internAPI.myList(),
    ]).then(([coRes, posRes, appRes, ivRes, notifRes, intRes]) => {
      if (coRes.status   === "fulfilled") setCompany(adaptCompany(coRes.value));
      if (posRes.status  === "fulfilled") setPositions((posRes.value || []).map(adaptPosition));

      let adaptedApps = [];
      if (appRes.status === "fulfilled") {
        adaptedApps = (appRes.value || []).map(adaptApplication);
        setApplications(adaptedApps);
      }
      if (ivRes.status  === "fulfilled") {
        const appsMap = Object.fromEntries(adaptedApps.map(a => [a.application_id, a]));
        setInterviews((ivRes.value || []).map(iv => adaptInterview(iv, appsMap)));
      }
      if (notifRes.status === "fulfilled") setNotifs(notifRes.value || []);
      if (intRes.status   === "fulfilled") setInterns(intRes.value || []);
      setLoading(false);
    });
  }, []);

  // Called by CreateCompanyForm after a successful POST
  const handleProfileCreated = (raw) => {
    setCompany(adaptCompany(raw));
  };

  const markRead = (id) => {
    notificationAPI.markRead(id).catch(() => {});
    setNotifs(p => p.map(n => n.notification_id===id ? {...n,is_read:true} : n));
  };
  const markAll = () => {
    notifs.filter(n=>!n.is_read).forEach(n => notificationAPI.markRead(n.notification_id).catch(()=>{}));
    setNotifs(p => p.map(n => ({...n,is_read:true})));
  };
  const unread = notifs.filter(n => !n.is_read).length;

  const companyLogo = company?.logo || "TC";
  const companyName = company?.name || "Company";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        body{margin:0;background:#07090f;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#0a0d15;}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px;}
        select option{background:#111827;}
      `}</style>

      <div className="flex h-screen bg-[#07090f] text-slate-200 overflow-hidden" style={{fontFamily:"'IBM Plex Mono',monospace"}}>

        {/* ── SIDEBAR ── */}
        <aside className={`flex-shrink-0 flex flex-col bg-[#0a0d15] border-r border-slate-800/80 transition-all duration-300 ${collapsed?"w-[60px]":"w-56"}`}>
          <div className="flex items-center gap-3 px-3.5 h-16 border-b border-slate-800/80 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/25 flex items-center justify-center font-black text-orange-400 text-xs flex-shrink-0"
              style={{fontFamily:"'Syne',sans-serif"}}>W</div>
            {!collapsed && <span className="text-base font-black bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent" style={{fontFamily:"'Syne',sans-serif"}}>WEBIN</span>}
            <button onClick={()=>setCollapsed(p=>!p)} className="ml-auto text-slate-700 hover:text-slate-500 transition-colors text-[11px]">
              {collapsed?"▷":"◁"}
            </button>
          </div>

          <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
            {NAV.map(({id,label,icon}) => {
              const active  = page===id;
              const isNotif = id==="notifications";
              return (
                <button key={id} onClick={()=>setPage(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group relative border ${active?"bg-orange-500/15 text-orange-400 border-orange-500/20":"text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 border-transparent"}`}
                  style={{fontFamily:"'Syne',sans-serif"}}>
                  <span className="text-base flex-shrink-0">{icon}</span>
                  {!collapsed && <span className="truncate">{label}</span>}
                  {isNotif && unread>0 && (
                    <span className={`flex-shrink-0 min-w-[18px] h-[18px] rounded-full bg-orange-500 text-black text-[9px] font-black flex items-center justify-center ${collapsed?"absolute top-1 right-1 w-4 h-4 min-w-0":"ml-auto"}`}>
                      {unread}
                    </span>
                  )}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {label}{isNotif&&unread>0?` (${unread})`:""}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          <div className={`flex-shrink-0 border-t border-slate-800/80 p-3 ${collapsed?"flex flex-col items-center gap-2":"flex items-center gap-3"}`}>
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/25 flex items-center justify-center text-[10px] font-black text-orange-400 flex-shrink-0"
              style={{fontFamily:"'Syne',sans-serif"}}>{companyLogo}</div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-200 truncate">{companyName}</div>
                <div className="text-[10px] text-slate-600">{company?.company_id || "..."}</div>
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
          <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-slate-800/80 bg-[#0a0d15]/80 backdrop-blur-xl">
            <div>
              <h1 className="text-base font-black text-slate-100" style={{fontFamily:"'Syne',sans-serif"}}>{PAGE_TITLES[page]}</h1>
              <p className="text-[10px] text-slate-700 font-mono">Company Portal · {company?.company_id || "…"}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={()=>setPage("notifications")} className="relative w-8 h-8 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:border-slate-700 transition-all">
                🔔
                {unread>0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-black text-[9px] font-black flex items-center justify-center">{unread}</span>}
              </button>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 cursor-pointer hover:border-slate-700 transition-colors" onClick={() => setPage("profile")}>
                <div className="w-6 h-6 rounded-md bg-orange-500/25 flex items-center justify-center text-[9px] font-black text-orange-400"
                  style={{fontFamily:"'Syne',sans-serif"}}>{companyLogo}</div>
                <span className="text-xs text-slate-300 font-semibold hidden sm:block" style={{fontFamily:"'Syne',sans-serif"}}>{companyName.split(" ")[0]}</span>
                <span className="text-slate-700 text-[10px]">▼</span>
              </div>
            </div>
          </header>

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
                {page==="dashboard"     && <Dashboard     onNavigate={setPage} notifs={notifs} company={company} positions={positions} applications={applications} />}
                {page==="positions"     && <Positions     positions={positions} setPositions={setPositions} />}
                {page==="applications"  && <Applications  onNavigate={setPage} applications={applications} setApplications={setApplications} />}
                {page==="interns"       && <Interns       interns={interns} setInterns={setInterns} interviews={interviews} applications={applications} />}
                {page==="interviews"    && <Interviews    interviews={interviews} setInterviews={setInterviews} applications={applications} />}
                {page==="notifications" && <Notifications />}
                {page==="profile"       && <CompanyProfile company={company} onProfileCreated={handleProfileCreated} />}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default Rootapp
