import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { NAV, PAGE_TITLES } from '../../assets/Supervisor/NAV';
import { NOTIFS_DATA } from '../../assets/Supervisor/MockData';
import { supervisorAPI, internAPI, notificationAPI, supervisionRequestAPI, supervisorNotifAPI, universityAPI } from '../../services/api';
import Dashboard from './Dashboard';
import Students from './Students';
import Evaluations from './Evaluations';
import Monitoring from './Monitoring';
import NotificationsPage from './NotificationsPage';
import SupervisorProfile from './SupervisorProfile';

// ── Adapters ───────────────────────────────────────────────────────────────────
function initials(str) {
  return (str || "??").split(/\s+/).map(w => w[0]).join("").slice(0,2).toUpperCase();
}

function adaptSupervisor(s, uniMap = {}) {
  return {
    supervisor_id:  `SUP-${s.supervisor_id}`,
    _id:            s.supervisor_id,
    name:           s.name,
    phone:          s.phone,
    department:     s.department,
    position:       s.position.replace(/_/g, " "),
    university_id:  s.university_id,
    university:     uniMap[s.university_id] || `University #${s.university_id}`,
    specialization: s.specialization || "",
    office:         s.office || "",
    office_hours:   s.office_hours || "",
  };
}

function adaptIntern(i) {
  return {
    intern_id:      i.intern_id,
    student_id:     i.student_id,
    student_name:   i.student_name || `Student #${i.student_id}`,
    position_title: i.position_title || `Position #${i.intern_position_id}`,
    department:     i.department,
    field:          i.field || "—",
    start_date:     i.start_date,
    end_date:       i.end_date,
    status:         i.status,
    supervisor_name: i.supervisor_name,
  };
}

// ── Rootapp ────────────────────────────────────────────────────────────────────
const Rootapp = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login"); };

  const [page, setPage]           = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const [supervisor,        setSupervisor]        = useState(null);
  const [availableInterns,  setAvailableInterns]  = useState([]);
  const [myInterns,         setMyInterns]         = useState([]);
  const [incomingRequests,  setIncomingRequests]  = useState([]);
  const [supNotifs,         setSupNotifs]         = useState([]);
  const [notifs,            setNotifs]            = useState([]);
  const [loading,           setLoading]           = useState(true);

  useEffect(() => {
    Promise.allSettled([
      supervisorAPI.getProfile(),
      internAPI.available(),
      internAPI.supervised(),
      notificationAPI.myList(),
      supervisionRequestAPI.incoming(),
      supervisorNotifAPI.myList(),
      universityAPI.list(),
    ]).then(([supRes, availRes, supvdRes, notifRes, reqRes, snRes, uniRes]) => {
      const uniMap = {};
      if (uniRes.status === "fulfilled") {
        (uniRes.value || []).forEach(u => { uniMap[u.university_id] = u.name; });
      }
      if (supRes.status   === "fulfilled") setSupervisor(adaptSupervisor(supRes.value, uniMap));
      if (availRes.status === "fulfilled") setAvailableInterns((availRes.value || []).map(adaptIntern));
      if (supvdRes.status === "fulfilled") setMyInterns((supvdRes.value || []).map(adaptIntern));
      if (notifRes.status === "fulfilled") setNotifs(notifRes.value || []);
      else setNotifs(NOTIFS_DATA);
      if (reqRes.status   === "fulfilled") setIncomingRequests(reqRes.value || []);
      if (snRes.status    === "fulfilled") setSupNotifs(snRes.value || []);
      setLoading(false);
    });
  }, []);

  const handleRespond = (requestId, status) => {
    supervisionRequestAPI.respond(requestId, status).then(() => {
      setIncomingRequests(p => p.map(r => r.request_id === requestId ? {...r, status} : r));
    }).catch(e => console.error("Respond failed:", e.message));
  };

  const handleClaim = (internId) => {
    // Move from available → my students optimistically, then refresh from API result
    internAPI.claim(internId).then(updated => {
      setAvailableInterns(p => p.filter(i => i.intern_id !== internId));
      setMyInterns(p => [...p, adaptIntern(updated)]);
    }).catch(e => console.error("Claim failed:", e.message));
  };

  const markRead = (id) => {
    notificationAPI.markRead(id).catch(() => {});
    setNotifs(p => p.map(n => n.notification_id===id ? {...n,is_read:true} : n));
  };
  const markAll = () => {
    notifs.filter(n=>!n.is_read).forEach(n => notificationAPI.markRead(n.notification_id).catch(()=>{}));
    setNotifs(p => p.map(n => ({...n,is_read:true})));
  };
  const pendingRequests = incomingRequests.filter(r => r.status === "Pending").length;
  const unreadSupNotifs = supNotifs.filter(n => !n.is_read).length;
  const unread = notifs.filter(n => !n.is_read).length;

  const supInitials = supervisor ? initials(supervisor.name) : "SV";
  const supName     = supervisor?.name || "Supervisor";

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
        input[type=range]{-webkit-appearance:none;height:4px;border-radius:2px;background:#1e293b;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#8b5cf6;cursor:pointer;}
      `}</style>

      <div className="flex h-screen bg-[#07090f] text-slate-200 overflow-hidden" style={{fontFamily:"'IBM Plex Mono',monospace"}}>

        {/* ── SIDEBAR ── */}
        <aside className={`flex-shrink-0 flex flex-col bg-[#0a0d15] border-r border-slate-800/80 transition-all duration-300 ${collapsed?"w-[60px]":"w-56"}`}>
          <div className="flex items-center gap-3 px-3.5 h-16 border-b border-slate-800/80 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/25 flex items-center justify-center font-black text-violet-400 text-xs flex-shrink-0">W</div>
            {!collapsed && <span className="text-base font-black bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent" style={{fontFamily:"'Syne',sans-serif"}}>WEBIN</span>}
            <button onClick={() => setCollapsed(p=>!p)} className="ml-auto text-slate-700 hover:text-slate-500 transition-colors text-[11px]">
              {collapsed?"▷":"◁"}
            </button>
          </div>

          {/* University badge */}
          {!collapsed && supervisor && (
            <div className="mx-2 mt-3 px-3 py-2 rounded-xl bg-violet-500/5 border border-violet-500/15">
              <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-0.5">University</div>
              <div className="text-[10px] text-violet-400 font-mono leading-tight truncate">{supervisor.university}</div>
            </div>
          )}

          <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
            {NAV.map(({id,label,icon}) => {
              const active      = page===id;
              const isNotif     = id==="notifications";
              const isStudents  = id==="students";
              const badge       = isNotif ? unread : isStudents ? pendingRequests : 0;
              const badgeColor  = isNotif ? "bg-violet-500 text-white" : "bg-amber-500 text-black";
              return (
                <button key={id} onClick={() => setPage(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group relative border ${active?"bg-violet-500/15 text-violet-400 border-violet-500/20":"text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 border-transparent"}`}
                  style={{fontFamily:"'Syne',sans-serif"}}>
                  <span className="text-base flex-shrink-0">{icon}</span>
                  {!collapsed && <span className="truncate">{label}</span>}
                  {badge > 0 && (
                    <span className={`flex-shrink-0 min-w-[18px] h-[18px] rounded-full ${badgeColor} text-[9px] font-black flex items-center justify-center ${collapsed?"absolute top-1 right-1 w-4 h-4 min-w-0":"ml-auto"}`}>
                      {badge}
                    </span>
                  )}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {label}{badge>0?` (${badge})`:""}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          <div className={`flex-shrink-0 border-t border-slate-800/80 p-3 ${collapsed?"flex flex-col items-center gap-2":"flex items-center gap-3"}`}>
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/25 flex items-center justify-center text-[10px] font-black text-violet-400 flex-shrink-0"
              style={{fontFamily:"'Syne',sans-serif"}}>{supInitials}</div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-200 truncate">{supName}</div>
                <div className="text-[10px] text-slate-600 truncate">{supervisor?.position || "Supervisor"}</div>
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
              <p className="text-[10px] text-slate-700 font-mono">Supervisor Portal · {supervisor?.supervisor_id || "…"}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setPage("notifications")} className="relative w-8 h-8 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:border-slate-700 transition-all">
                🔔
                {unread>0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-500 text-white text-[9px] font-black flex items-center justify-center">{unread}</span>}
              </button>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 cursor-pointer hover:border-slate-700 transition-colors" onClick={() => setPage("profile")}>
                <div className="w-6 h-6 rounded-md bg-violet-500/30 flex items-center justify-center text-[9px] font-black text-violet-400"
                  style={{fontFamily:"'Syne',sans-serif"}}>{supInitials}</div>
                <span className="text-xs text-slate-300 font-semibold hidden sm:block" style={{fontFamily:"'Syne',sans-serif"}}>
                  {supName.split(" ")[0]}
                </span>
                <span className="text-slate-700 text-[10px]">▼</span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-slate-500 text-sm font-mono animate-pulse">Loading data…</div>
              </div>
            ) : (
              <>
                {page==="dashboard"     && <Dashboard      onNavigate={setPage} notifs={notifs} supervisor={supervisor} students={myInterns} />}
                {page==="students"      && <Students        availableInterns={availableInterns} myInterns={myInterns} onClaim={handleClaim} incomingRequests={incomingRequests} onRespond={handleRespond} supNotifs={supNotifs} />}
                {page==="evaluations"   && <Evaluations    myInterns={myInterns} />}
                {page==="monitoring"    && <Monitoring     myInterns={myInterns} />}
                {page==="notifications" && <NotificationsPage notifs={notifs} onMarkRead={markRead} onMarkAll={markAll} />}
                {page==="profile"       && <SupervisorProfile supervisor={supervisor} />}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default Rootapp
