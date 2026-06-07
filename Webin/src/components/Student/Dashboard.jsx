import React from 'react'
import { daysLeft, fmtDate, logoColor } from '../../assets/Student/Helpers';
import { StatusPill } from './StatusPill';

const Dashboard = ({ onNavigate, positions = [], applications = [], profile = null }) => {
  const pendingApps = applications.filter(a => a.status === "Pending").length;

  const stats = [
    { label:"Active Internship", value:"0",                   sub:"None currently",             color:"text-emerald-400", bg:"bg-emerald-500/10 border-emerald-500/20", icon:"◉" },
    { label:"Applications",      value:applications.length,   sub:`${pendingApps} pending review`, color:"text-sky-400",     bg:"bg-sky-500/10 border-sky-500/20",     icon:"◎" },
    { label:"Open Positions",    value:positions.length,      sub:"available now",               color:"text-amber-400",   bg:"bg-amber-500/10 border-amber-500/20",   icon:"▣" },
    { label:"Profile Score",     value:"—",                   sub:"Complete your profile",       color:"text-violet-400",  bg:"bg-violet-500/10 border-violet-500/20", icon:"⬡" },
  ];

  const displayName = profile?.name?.split(" ")[0] || "Student";

  return (
    <div className="space-y-6">
      {/* welcome */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 p-7">
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-sky-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-20 w-48 h-32 rounded-full bg-violet-500/5 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="text-xs text-emerald-400 font-bold tracking-widest font-mono">ACTIVE SESSION</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-1" style={{fontFamily:"'Syne',sans-serif"}}>
            Good morning, <span className="text-sky-400">{displayName}</span> 👋
          </h1>
          <p className="text-slate-400 text-sm">Here's what's happening with your internship journey today.</p>
          <div className="flex gap-3 mt-5">
            <button onClick={() => onNavigate("browse")} className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-sky-500/20">
              Browse Positions →
            </button>
            <button onClick={() => onNavigate("profile")} className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 text-sm font-semibold transition-all duration-200">
              Complete Profile
            </button>
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border p-5 ${s.bg} hover:scale-[1.02] transition-transform duration-200`}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-xl">{s.icon}</span>
              <span className={`text-2xl font-black ${s.color}`} style={{fontFamily:"'Syne',sans-serif"}}>{s.value}</span>
            </div>
            <div className="text-xs font-bold text-slate-300 mb-1">{s.label}</div>
            <div className="text-[11px] text-slate-500">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* active internship placeholder */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-200" style={{fontFamily:"'Syne',sans-serif"}}>Current Internship</h2>
            <button onClick={() => onNavigate("internships")} className="text-xs text-sky-400 hover:text-sky-300">View all →</button>
          </div>
          <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
            <div className="text-3xl mb-2">◉</div>
            <p className="text-slate-500 text-sm">No active internship</p>
            <button onClick={() => onNavigate("browse")} className="mt-3 text-xs text-sky-400">Browse positions →</button>
          </div>
        </div>

        {/* recent applications */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-200" style={{fontFamily:"'Syne',sans-serif"}}>Recent Applications</h2>
            <button onClick={() => onNavigate("applications")} className="text-xs text-sky-400 hover:text-sky-300">See all →</button>
          </div>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 text-xs">No applications yet</p>
              <button onClick={() => onNavigate("browse")} className="mt-2 text-xs text-sky-400">Apply to a position →</button>
            </div>
          ) : (
            <div className="space-y-2">
              {applications.slice(0, 4).map((app) => (
                <div key={app.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800/60 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 ${logoColor(app.logo)}`}>{app.logo}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-200 truncate">{app.position}</div>
                    <div className="text-[10px] text-slate-500">{app.company}</div>
                  </div>
                  <StatusPill status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* open positions preview */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-200" style={{fontFamily:"'Syne',sans-serif"}}>Recommended Positions</h2>
          <button onClick={() => onNavigate("browse")} className="text-xs text-sky-400 hover:text-sky-300">Browse all →</button>
        </div>
        {positions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 text-xs">No positions available right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {positions.slice(0, 3).map((pos) => (
              <div key={pos.id} className="group rounded-xl border border-slate-800 hover:border-sky-500/40 bg-slate-900 hover:bg-sky-500/5 p-4 transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 ${logoColor(pos.logo)}`}>{pos.logo}</div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-sky-300 transition-colors">{pos.title}</div>
                    <div className="text-[10px] text-slate-500">{pos.company}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-mono font-semibold">{pos.salary}</span>
                  {pos.deadline && <span className="text-[10px] text-amber-400">{daysLeft(pos.deadline)}d left</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard
