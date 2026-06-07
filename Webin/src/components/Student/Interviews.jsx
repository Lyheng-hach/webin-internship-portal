import React, { useState } from 'react'

const STATUS_STYLE = {
  Scheduled:  { pill: "bg-sky-500/15 border-sky-500/30 text-sky-400",     dot: "bg-sky-400"     },
  Completed:  { pill: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400", dot: "bg-emerald-400" },
  Cancelled:  { pill: "bg-red-500/15 border-red-500/30 text-red-400",     dot: "bg-red-400"     },
  Rescheduled:{ pill: "bg-amber-500/15 border-amber-500/30 text-amber-400", dot: "bg-amber-400"  },
};

const TYPE_ICON = {
  Online:     "💻",
  "In-person":"🏢",
  Phone:      "📞",
};

function fmtDate(dt) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function daysUntil(dt) {
  if (!dt) return null;
  const diff = Math.ceil((new Date(dt) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
}

const Interviews = ({ interviews = [], applications = [] }) => {
  const [filter, setFilter] = useState("All");

  // Build app lookup so we can show position name
  const appMap = {};
  applications.forEach(a => { appMap[a.id] = a; });

  const statuses = ["All", "Scheduled", "Completed", "Cancelled", "Rescheduled"];
  const filtered = interviews.filter(iv =>
    filter === "All" || iv.status === filter
  );

  // Sort: upcoming first, then past
  const sorted = [...filtered].sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-black text-slate-100" style={{fontFamily:"'Syne',sans-serif"}}>My Interviews</h2>
          <p className="text-xs text-slate-600 font-mono mt-0.5">{interviews.length} total · scheduled by companies</p>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => {
          const count = s === "All" ? interviews.length : interviews.filter(iv => iv.status === s).length;
          const st = STATUS_STYLE[s];
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${filter === s ? (st ? `${st.pill}` : "bg-sky-500/15 border-sky-500/35 text-sky-400") : "bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400"}`}
              style={{fontFamily:"'Syne',sans-serif"}}>
              {s} <span className="opacity-50 ml-1">{count}</span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-3xl mb-3">🎤</div>
          <p className="text-slate-500 text-sm font-mono">
            {interviews.length === 0 ? "No interviews scheduled yet" : "No interviews match this filter"}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {sorted.map(iv => {
            const st = STATUS_STYLE[iv.status] || STATUS_STYLE.Scheduled;
            const app = appMap[iv.application_id];
            const days = daysUntil(iv.scheduled_at);
            const isPast = days !== null && days < 0;
            const isToday = days === 0;
            const isSoon = days !== null && days > 0 && days <= 3;

            return (
              <div key={iv.interview_id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 hover:border-slate-700 transition-colors">

                {/* Top row */}
                <div className="flex items-start gap-4">
                  {/* Type icon */}
                  <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl flex-shrink-0">
                    {TYPE_ICON[iv.interview_type] || "🎤"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-black text-slate-200 text-sm" style={{fontFamily:"'Syne',sans-serif"}}>
                        {app?.position || `Application #${iv.application_id}`}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.pill}`}>
                        {iv.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {app?.company || "Company"} · {iv.interview_type || "Interview"}
                    </div>
                  </div>

                  {/* Countdown */}
                  {!isPast && days !== null && iv.status === "Scheduled" && (
                    <div className={`flex-shrink-0 text-right`}>
                      <div className={`text-sm font-black ${isToday ? "text-red-400" : isSoon ? "text-amber-400" : "text-sky-400"}`}
                        style={{fontFamily:"'Syne',sans-serif"}}>
                        {isToday ? "Today!" : `${days}d`}
                      </div>
                      <div className="text-[9px] text-slate-600 font-mono">until interview</div>
                    </div>
                  )}
                  {isPast && iv.status === "Scheduled" && (
                    <div className="flex-shrink-0 text-right">
                      <div className="text-sm font-black text-slate-600" style={{fontFamily:"'Syne',sans-serif"}}>
                        {Math.abs(days)}d ago
                      </div>
                    </div>
                  )}
                </div>

                {/* Detail grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-800/60 border border-slate-800 p-2.5">
                    <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-1">Date & Time</div>
                    <div className="text-[11px] text-slate-200 font-mono">{fmtDate(iv.scheduled_at)}</div>
                  </div>
                  <div className="rounded-lg bg-slate-800/60 border border-slate-800 p-2.5">
                    <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-1">Type</div>
                    <div className="text-[11px] text-slate-200 font-mono">{iv.interview_type || "—"}</div>
                  </div>
                  {iv.location && (
                    <div className="col-span-2 rounded-lg bg-slate-800/60 border border-slate-800 p-2.5">
                      <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-1">Location / Link</div>
                      <div className="text-[11px] text-slate-200 font-mono break-all">{iv.location}</div>
                    </div>
                  )}
                </div>

                {/* Upcoming alert */}
                {isSoon && iv.status === "Scheduled" && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/8 border border-amber-500/20 text-amber-400 text-xs font-mono">
                    ⏰ Interview in {days} day{days !== 1 ? "s" : ""} — be prepared!
                  </div>
                )}
                {isToday && iv.status === "Scheduled" && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-xs font-mono">
                    🔴 Interview is today — good luck!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Interviews;
