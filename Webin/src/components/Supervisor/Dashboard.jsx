import React from 'react'
import { Avatar, Card, ProgressBar, SectionTitle } from '../../assets/Supervisor/Share_atom_UI_supervisor';
import { FIELD_CLS } from '../../assets/Supervisor/Helpers';

const Dashboard = ({ onNavigate, notifs = [], supervisor = null, students = [] }) => {
  const unread = notifs.filter(n => !n.is_read).length;

  const stats = [
    { label:"Assigned Students", value:students.length,  sub:`${students.length} registered`,  color:"text-violet-400", border:"border-violet-500/20", icon:"◉" },
    { label:"Pending Evals",     value:0,                sub:"evaluation module coming soon",   color:"text-amber-400",  border:"border-amber-500/20",  icon:"📋" },
    { label:"Completed",         value:0,                sub:"internships finished",             color:"text-indigo-400", border:"border-indigo-500/20", icon:"✓" },
    { label:"Notifications",     value:unread,           sub:"unread updates",                   color:"text-sky-400",    border:"border-sky-500/20",    icon:"🔔" },
  ];

  const supName = supervisor?.name || "Supervisor";

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#07090f] to-violet-950/30 p-7">
        <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-violet-500/6 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-24 w-52 h-36 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
        {[...Array(6)].map((_,i) => (
          <div key={i} className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500/8 to-transparent pointer-events-none" style={{left:`${i*18}%`,transform:"skewX(-20deg)"}} />
        ))}
        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_#c084fc] animate-pulse" />
              <span className="text-[10px] text-violet-400 font-black tracking-[2px] font-mono">ACADEMIC SUPERVISOR</span>
            </div>
            <h1 className="text-[clamp(22px,3.5vw,30px)] font-black text-white tracking-tight mb-1" style={{fontFamily:"'Syne',sans-serif"}}>
              Welcome, <span className="text-violet-400">{supName}</span>
            </h1>
            <p className="text-slate-400 text-sm mb-0.5">{supervisor?.position || "—"} · {supervisor?.department || "—"}</p>
            <p className="text-slate-600 text-xs font-mono">{supervisor?.university || "—"}</p>
            <div className="flex gap-3 mt-5 flex-wrap">
              <button onClick={() => onNavigate("evaluations")}
                className="px-5 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-sm font-black transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-violet-500/25"
                style={{fontFamily:"'Syne',sans-serif"}}>
                Write Evaluation →
              </button>
              <button onClick={() => onNavigate("students")}
                className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-violet-500/40 text-slate-300 text-sm font-semibold transition-all duration-200">
                View Students ({students.length})
              </button>
            </div>
          </div>
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

      {/* Students preview */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle>My Students</SectionTitle>
          <button onClick={() => onNavigate("students")} className="text-xs text-violet-400 hover:text-violet-300 font-mono">View all →</button>
        </div>
        {students.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 text-xs">No students assigned yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {students.slice(0, 6).map(s => (
              <div key={s.intern_id} className="flex items-center gap-3 p-3.5 rounded-xl border border-violet-500/15 bg-violet-500/5">
                <Avatar name={s.student_name} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-200 truncate">{s.student_name}</div>
                  <div className="text-[10px] text-violet-400 truncate">{s.position_title}</div>
                  <div className="text-[10px] text-slate-600 font-mono mt-0.5">{s.department} · {s.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Profile summary */}
      {supervisor && (
        <Card className="p-5">
          <SectionTitle>Profile Summary</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {[
              {l:"Specialization", v:supervisor.specialization||"—"},
              {l:"Office",         v:supervisor.office||"—"},
              {l:"Office Hours",   v:supervisor.office_hours||"—"},
              {l:"Department",     v:supervisor.department},
              {l:"Position",       v:supervisor.position},
              {l:"University",     v:supervisor.university},
            ].map(({l,v}) => (
              <div key={l}>
                <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-1">{l}</div>
                <div className="text-xs text-slate-300 font-mono">{v}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export default Dashboard
