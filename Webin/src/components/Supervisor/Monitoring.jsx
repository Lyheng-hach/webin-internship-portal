import React, { useState } from 'react'
import { Avatar, Card, SectionTitle, StatusPill } from '../../assets/Supervisor/Share_atom_UI_supervisor';
import { daysElapsed, daysLeft, fmtDate } from '../../assets/Supervisor/Helpers';

const Monitoring = ({ myInterns = [] }) => {
  const [selectedId, setSelectedId] = useState(myInterns[0]?.intern_id ?? null);

  if (myInterns.length === 0) {
    return (
      <div className="space-y-5">
        <SectionTitle>Internship Monitoring</SectionTitle>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-3xl mb-3">◉</div>
            <p className="text-slate-500 text-sm">No students to monitor yet.</p>
            <p className="text-slate-600 text-xs font-mono mt-1">Students will appear here once you start supervising interns.</p>
          </div>
        </div>
      </div>
    );
  }

  const selected = myInterns.find(i => i.intern_id === selectedId) || myInterns[0];
  const elapsed   = daysElapsed(selected.start_date, selected.end_date);
  const totalDays = Math.max(1, Math.ceil((new Date(selected.end_date) - new Date(selected.start_date)) / 86400000));
  const elDays    = Math.min(totalDays, Math.max(0, Math.ceil((new Date() - new Date(selected.start_date)) / 86400000)));
  const field     = selected.field && selected.field !== "—" ? selected.field : null;

  return (
    <div className="space-y-5">
      <SectionTitle>Internship Monitoring</SectionTitle>

      {/* Student selector tabs */}
      <div className="flex gap-2 flex-wrap">
        {myInterns.map(intern => (
          <button key={intern.intern_id} onClick={() => setSelectedId(intern.intern_id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${selected.intern_id === intern.intern_id ? "bg-violet-500/15 border-violet-500/40 text-violet-400" : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"}`}
            style={{fontFamily:"'Syne',sans-serif"}}>
            <div className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black flex-shrink-0 bg-violet-500/20 text-violet-400"
              style={{fontFamily:"'Syne',sans-serif"}}>
              {intern.student_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            {intern.student_name.split(" ")[0]}
            <StatusPill status={intern.status} />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Main info ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Overview card */}
          <Card className="overflow-hidden">
            <div className={`h-1 ${selected.status === "Active" ? "bg-gradient-to-r from-violet-500 to-indigo-400" : "bg-gradient-to-r from-indigo-500 to-slate-600"}`} />
            <div className="p-6">
              <div className="flex items-start gap-4 mb-5">
                <Avatar name={selected.student_name} size="lg" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="text-xl font-black text-white" style={{fontFamily:"'Syne',sans-serif"}}>{selected.student_name}</h2>
                    <StatusPill status={selected.status} />
                  </div>
                  <p className="text-violet-400 font-bold text-sm">{selected.position_title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {selected.department}{field ? ` · ${field}` : ""}
                  </p>
                </div>
              </div>

              {/* Progress timeline */}
              <div className="mb-5">
                <div className="flex justify-between text-[10px] mb-2">
                  <span className="text-slate-600 font-mono">{fmtDate(selected.start_date)}</span>
                  <span className="text-violet-400 font-black">{elapsed}% complete</span>
                  <span className="text-slate-600 font-mono">{fmtDate(selected.end_date)}</span>
                </div>
                <div className="relative h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-700"
                    style={{width:`${elapsed}%`}}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-black text-white/80">{elDays} of {totalDays} days</span>
                  </div>
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {l:"Progress",  v:`${elapsed}%`,                                         color:"text-violet-400"},
                  {l:"Days Left", v:`${daysLeft(selected.end_date)}d`,                      color:"text-amber-400"},
                  {l:"Status",    v:selected.status,                                         color:"text-emerald-400"},
                  {l:"Field",     v:field || "—",                                            color:"text-sky-400"},
                ].map(({l, v, color}) => (
                  <div key={l} className="rounded-xl bg-slate-800/40 border border-slate-800 p-3 text-center">
                    <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-1">{l}</div>
                    <div className={`text-base font-black ${color}`} style={{fontFamily:"'Syne',sans-serif"}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Internship Details */}
          <Card className="p-5">
            <SectionTitle>Internship Details</SectionTitle>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                {l:"Department",  v: selected.department || "—"},
                {l:"Field",       v: field || "—"},
                {l:"Intern ID",   v: `#${selected.intern_id}`},
                {l:"Student ID",  v: `#${selected.student_id}`},
                {l:"Start Date",  v: fmtDate(selected.start_date)},
                {l:"End Date",    v: fmtDate(selected.end_date)},
              ].map(({l, v}) => (
                <div key={l} className="rounded-lg bg-slate-800/40 border border-slate-800 p-3">
                  <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-1">{l}</div>
                  <div className="text-xs text-slate-300 font-mono">{v}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Sidebar: references ── */}
        <div className="space-y-5">
          <Card className="p-5">
            <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-3">References</div>
            <div className="space-y-1.5">
              {[
                {l:"Intern ID",  v:`#${selected.intern_id}`},
                {l:"Student ID", v:`#${selected.student_id}`},
              ].map(({l, v}) => (
                <div key={l} className="flex justify-between items-center py-1">
                  <span className="text-[9px] text-slate-600 uppercase tracking-wide">{l}</span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{v}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-3">Timeline</div>
            <div className="space-y-3">
              {[
                {l:"Start",    v:fmtDate(selected.start_date), color:"text-emerald-400"},
                {l:"Today",    v:fmtDate(new Date().toISOString()), color:"text-violet-400"},
                {l:"End",      v:fmtDate(selected.end_date),   color:"text-amber-400"},
              ].map(({l, v, color}) => (
                <div key={l} className="flex items-center justify-between">
                  <span className={`text-[9px] font-black uppercase tracking-wide ${color}`}>{l}</span>
                  <span className="text-[10px] font-mono text-slate-400">{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Monitoring
