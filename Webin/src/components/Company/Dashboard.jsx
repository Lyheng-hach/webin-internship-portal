import React from 'react'
import { Avatar, Card, SectionTitle, SkillTag, StatusPill } from '../../assets/Company/Shared_ui_atoms';
import { TYPE_CLS, daysLeft } from '../../assets/Company/Helpers';

const Dashboard = ({ onNavigate, notifs = [], company = null, positions = [], applications = [] }) => {
  const pending       = applications.filter(a => a.status === "Pending").length;
  const activePos     = positions.filter(p => p.status === "Active").length;
  const unread        = notifs.filter(n => !n.is_read).length;

  const stats = [
    { label:"Open Positions",  value: activePos,     sub:`${positions.filter(p=>p.status==="Closed").length} closed`,  color:"text-sky-400",     border:"border-sky-500/20",     icon:"◈" },
    { label:"Applications",    value: applications.length, sub:`${pending} pending review`,                            color:"text-amber-400",   border:"border-amber-500/20",   icon:"◎" },
    { label:"Active Interns",  value: 0,             sub:"No intern tracking yet",                                    color:"text-emerald-400", border:"border-emerald-500/20", icon:"◉" },
    { label:"Notifications",   value: unread,        sub:"unread updates",                                            color:"text-violet-400",  border:"border-violet-500/20",  icon:"🔔" },
  ];

  const companyName = company?.name || "Company";

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#07090f] to-orange-950/30 p-7">
        <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-24 w-52 h-36 rounded-full bg-sky-500/5 blur-2xl pointer-events-none" />
        {[...Array(6)].map((_,i) => (
          <div key={i} className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-orange-500/8 to-transparent pointer-events-none" style={{left:`${i*18}%`,transform:"skewX(-20deg)"}} />
        ))}
        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-black tracking-[2px] font-mono">
                {company?.verified ? "VERIFIED COMPANY" : "COMPANY PORTAL"}
              </span>
            </div>
            <h1 className="text-[clamp(22px,3.5vw,30px)] font-black text-white tracking-tight mb-1" style={{fontFamily:"'Syne',sans-serif"}}>
              Welcome back, <span className="text-orange-400">{companyName}</span>
            </h1>
            <p className="text-slate-400 text-sm mb-0.5">{company?.industry || "—"}</p>
            <p className="text-slate-600 text-xs font-mono">{company?.company_id || "…"}</p>
            <div className="flex gap-3 mt-5 flex-wrap">
              <button onClick={() => onNavigate("positions")} className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-sm font-black transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-orange-500/20" style={{fontFamily:"'Syne',sans-serif"}}>
                + Post New Position
              </button>
              <button onClick={() => onNavigate("applications")} className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-amber-500/40 text-slate-300 text-sm font-semibold transition-all duration-200">
                Review Applications {pending > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black">{pending}</span>}
              </button>
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-2xl font-black text-orange-400 flex-shrink-0"
            style={{fontFamily:"'Syne',sans-serif"}}>{company?.logo || "CO"}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`rounded-xl border ${s.border} p-5 hover:scale-[1.02] transition-transform duration-200 cursor-default`}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-lg">{s.icon}</span>
              <span className={`text-2xl font-black ${s.color}`} style={{fontFamily:"'Syne',sans-serif"}}>{s.value}</span>
            </div>
            <div className="text-[11px] font-bold text-slate-300 mb-1" style={{fontFamily:"'Syne',sans-serif"}}>{s.label}</div>
            <div className="text-[10px] text-slate-600 font-mono">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Active positions */}
        <div className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <SectionTitle>Active Positions</SectionTitle>
              <button onClick={() => onNavigate("positions")} className="text-xs text-orange-400 hover:text-orange-300 font-mono">Manage all →</button>
            </div>
            {positions.filter(p => p.status === "Active").length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 text-xs">No active positions</p>
                <button onClick={() => onNavigate("positions")} className="mt-2 text-xs text-orange-400">Post a position →</button>
              </div>
            ) : (
              <div className="space-y-3">
                {positions.filter(p => p.status === "Active").map(pos => {
                  const appCount = applications.filter(a => a.intern_position_id === pos.intern_position_id).length;
                  return (
                    <div key={pos.position_id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/40 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-slate-200 text-sm">{pos.title}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_CLS[pos.type] || "bg-slate-500/10 text-slate-400"}`}>{pos.type}</span>
                        </div>
                        <div className="flex gap-1.5 flex-wrap mt-1.5">
                          {pos.skills.slice(0,3).map(s => (
                            <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 font-mono">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 space-y-1">
                        <div className="text-xs font-bold text-emerald-400 font-mono">${pos.salary_min}–{pos.salary_max}<span className="text-[10px] text-slate-600">/mo</span></div>
                        <div className="text-[10px] text-slate-500">{appCount} applicants</div>
                        {pos.deadline && <div className="text-[10px] text-amber-400">{daysLeft(pos.deadline)}d left</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Recent applications */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <SectionTitle>New Applications</SectionTitle>
            <button onClick={() => onNavigate("applications")} className="text-xs text-orange-400 hover:text-orange-300 font-mono">See all →</button>
          </div>
          {applications.filter(a => a.status === "Pending").length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 text-xs">No pending applications</p>
            </div>
          ) : (
            <div className="space-y-2">
              {applications.filter(a => a.status === "Pending").slice(0,5).map(app => (
                <div key={app.application_id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/50 transition-colors">
                  <Avatar name={app.student_name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-200 truncate">{app.student_name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{app.position}</div>
                  </div>
                  <StatusPill status={app.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Dashboard
