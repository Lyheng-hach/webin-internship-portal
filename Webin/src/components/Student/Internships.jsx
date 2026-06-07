import React, { useState, useEffect } from 'react'
import { evaluationAPI } from '../../services/api';

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function daysLeft(end) {
  if (!end) return null;
  return Math.ceil((new Date(end) - new Date()) / 86400000);
}

function duration(start, end) {
  if (!start || !end) return "—";
  const s = new Date(start), e = new Date(end);
  const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  if (months < 1) return "< 1 month";
  return `${months} month${months !== 1 ? "s" : ""}`;
}

const STATUS_STYLE = {
  Active:     { pill: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400", dot: "bg-emerald-400 shadow-[0_0_6px_#34d399]", bar: "bg-emerald-500" },
  Pending:    { pill: "bg-amber-500/10 border-amber-500/25 text-amber-400",       dot: "bg-amber-400",                              bar: "bg-amber-500" },
  Completed:  { pill: "bg-sky-500/10 border-sky-500/25 text-sky-400",             dot: "bg-sky-400",                                bar: "bg-sky-500" },
  Terminated: { pill: "bg-red-500/10 border-red-500/25 text-red-400",             dot: "bg-red-400",                                bar: "bg-red-500" },
};

// ── Progress bar ───────────────────────────────────────────────────────────────
const ProgressBar = ({ start, end }) => {
  if (!start || !end) return null;
  const total = new Date(end) - new Date(start);
  const done  = Math.min(Math.max(new Date() - new Date(start), 0), total);
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-600">
        <span>Progress</span>
        <span className="text-slate-400">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

// ── Score bar ──────────────────────────────────────────────────────────────────
const ScoreBar = ({ label, value }) => (
  <div>
    <div className="flex justify-between text-[10px] font-mono mb-1">
      <span className="text-slate-500">{label}</span>
      <span className="text-sky-400 font-bold">{value ?? "—"}</span>
    </div>
    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
      <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-400 transition-all"
        style={{ width: `${value ?? 0}%` }} />
    </div>
  </div>
);

// ── Evaluation card ────────────────────────────────────────────────────────────
const EvalCard = ({ ev }) => {
  const avg = ev.total_score ??
    Math.round((ev.technical_score + ev.communication_score + ev.problem_solving + ev.attitude_score) / 4);

  const scoreColor = avg >= 80 ? "text-emerald-400" : avg >= 60 ? "text-sky-400" : avg >= 40 ? "text-amber-400" : "text-red-400";
  const borderColor = avg >= 80 ? "border-emerald-500/20" : avg >= 60 ? "border-sky-500/20" : avg >= 40 ? "border-amber-500/20" : "border-red-500/20";

  return (
    <div className={`rounded-xl border ${borderColor} p-4 space-y-3`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-black text-slate-200" style={{ fontFamily: "'Syne',sans-serif" }}>
            {ev.evaluation_type} Evaluation
          </div>
          <div className="text-[10px] text-slate-600 font-mono mt-0.5">{fmtDate(ev.submitted_at)}</div>
        </div>
        <div className={`text-2xl font-black ${scoreColor}`} style={{ fontFamily: "'Syne',sans-serif" }}>
          {avg}
        </div>
      </div>

      <div className="space-y-2">
        <ScoreBar label="Technical"     value={ev.technical_score} />
        <ScoreBar label="Communication" value={ev.communication_score} />
        <ScoreBar label="Problem Solving" value={ev.problem_solving} />
        <ScoreBar label="Attitude"      value={ev.attitude_score} />
      </div>

      {ev.feedback && (
        <div className="rounded-lg bg-slate-800/60 border border-slate-700 p-3">
          <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-1">Supervisor Feedback</div>
          <p className="text-[11px] text-slate-300 italic leading-relaxed">"{ev.feedback}"</p>
        </div>
      )}
    </div>
  );
};

// ── Single intern card ─────────────────────────────────────────────────────────
const InternCard = ({ intern, onClick, selected }) => {
  const st = STATUS_STYLE[intern.status] || STATUS_STYLE.Pending;
  const dl = intern.status === "Active" ? daysLeft(intern.end_date) : null;

  return (
    <div onClick={onClick}
      className={`rounded-xl border p-5 cursor-pointer transition-all duration-200 space-y-4 ${selected ? "border-sky-500/50 bg-sky-500/5" : "border-slate-800 bg-slate-900/60 hover:border-slate-700"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-400 font-black text-xs flex-shrink-0"
            style={{ fontFamily: "'Syne',sans-serif" }}>
            {(intern.position_title || "IN").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-slate-200 text-sm truncate">{intern.position_title || `Position #${intern.intern_position_id}`}</div>
            <div className="text-xs text-sky-400 font-mono mt-0.5">
              {intern.department}{intern.field && intern.field !== "—" ? ` · ${intern.field}` : ""}
            </div>
          </div>
        </div>
        <span className={`flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border ${st.pill}`}>{intern.status}</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { l: "Start",    v: fmtDate(intern.start_date) },
          { l: "End",      v: fmtDate(intern.end_date) },
          { l: "Duration", v: duration(intern.start_date, intern.end_date) },
        ].map(({ l, v }) => (
          <div key={l} className="rounded-lg bg-slate-800/60 border border-slate-800 p-2.5">
            <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-1">{l}</div>
            <div className="text-[11px] text-slate-300 font-mono">{v}</div>
          </div>
        ))}
      </div>

      {intern.status === "Active" && (
        <div className="space-y-1.5">
          <ProgressBar start={intern.start_date} end={intern.end_date} />
          {dl !== null && (
            <div className="text-[10px] font-mono text-slate-600">
              {dl > 0 ? <><span className="text-emerald-400">{dl}</span> days remaining</> : <span className="text-amber-400">Ending today</span>}
            </div>
          )}
        </div>
      )}

      {intern.supervisor_name && (
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
          <span>👤</span>
          <span className="text-slate-400">Supervisor: <span className="text-violet-400">{intern.supervisor_name}</span></span>
        </div>
      )}
    </div>
  );
};

// ── Main Internships component ─────────────────────────────────────────────────
const Internships = ({ internHistory = [] }) => {
  const [filter,   setFilter]   = useState("All");
  const [selected, setSelected] = useState(null);
  const [evals,    setEvals]    = useState([]);
  const [evLoading, setEvLoading] = useState(false);

  // Fetch evaluations when an intern record is selected
  useEffect(() => {
    if (!selected) { setEvals([]); return; }
    setEvLoading(true);
    evaluationAPI.forIntern(selected.intern_id)
      .then(data => setEvals(data || []))
      .catch(() => setEvals([]))
      .finally(() => setEvLoading(false));
  }, [selected?.intern_id]);

  const statuses = ["All", "Active", "Pending", "Completed", "Terminated"];
  const filtered = internHistory.filter(i => filter === "All" || i.status === filter);

  const counts = {
    Active:     internHistory.filter(i => i.status === "Active").length,
    Pending:    internHistory.filter(i => i.status === "Pending").length,
    Completed:  internHistory.filter(i => i.status === "Completed").length,
    Terminated: internHistory.filter(i => i.status === "Terminated").length,
  };

  return (
    <div className="flex gap-5">
      {/* ── Left: list ── */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { l: "Active",     c: counts.Active,     color: "text-emerald-400", border: "border-emerald-500/20" },
            { l: "Pending",    c: counts.Pending,    color: "text-amber-400",   border: "border-amber-500/20" },
            { l: "Completed",  c: counts.Completed,  color: "text-sky-400",     border: "border-sky-500/20" },
            { l: "Terminated", c: counts.Terminated, color: "text-red-400",     border: "border-red-500/20" },
          ].map(s => (
            <div key={s.l} className={`rounded-xl border p-3.5 ${s.border}`}>
              <div className={`text-xl font-black ${s.color}`} style={{ fontFamily: "'Syne',sans-serif" }}>{s.c}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 border-b border-slate-800">
          {statuses.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all -mb-px ${filter === f ? "border-sky-500 text-sky-400" : "border-transparent text-slate-600 hover:text-slate-400"}`}
              style={{ fontFamily: "'Syne',sans-serif" }}>
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">◉</div>
            <p className="text-slate-500 text-sm">
              {internHistory.length === 0
                ? "No internship records yet. Complete an interview and your company will start your internship."
                : `No ${filter.toLowerCase()} internships`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(intern => (
              <InternCard
                key={intern.intern_id}
                intern={intern}
                selected={selected?.intern_id === intern.intern_id}
                onClick={() => setSelected(s => s?.intern_id === intern.intern_id ? null : intern)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Right: detail panel ── */}
      {selected && (
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-0 rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden max-h-[calc(100vh-7rem)] overflow-y-auto">
            <div className="h-1 bg-gradient-to-r from-sky-500 via-indigo-400 to-sky-500" />
            <div className="p-5 space-y-5">

              {/* Header */}
              <div>
                <h3 className="font-black text-white text-sm mb-0.5" style={{ fontFamily: "'Syne',sans-serif" }}>
                  {selected.position_title || "Internship"}
                </h3>
                <p className="text-xs text-sky-400 font-mono">{selected.department}</p>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { l: "Intern ID",  v: `#${selected.intern_id}` },
                  { l: "Status",     v: selected.status },
                  { l: "Department", v: selected.department },
                  { l: "Field",      v: selected.field || "—" },
                  { l: "Start",      v: fmtDate(selected.start_date) },
                  { l: "End",        v: fmtDate(selected.end_date) },
                  { l: "Duration",   v: duration(selected.start_date, selected.end_date) },
                  { l: "Supervisor", v: selected.supervisor_name || "Not assigned" },
                ].map(({ l, v }) => (
                  <div key={l} className="rounded-lg bg-slate-800/60 border border-slate-800 p-2.5">
                    <div className="text-[9px] text-slate-600 font-black tracking-widests uppercase mb-1">{l}</div>
                    <div className="text-[11px] text-slate-200 font-mono truncate">{v}</div>
                  </div>
                ))}
              </div>

              {selected.status === "Active" && (
                <div className="space-y-1">
                  <ProgressBar start={selected.start_date} end={selected.end_date} />
                  {(() => {
                    const dl = daysLeft(selected.end_date);
                    return dl !== null && (
                      <div className="text-[10px] font-mono text-slate-600">
                        {dl > 0 ? <><span className="text-emerald-400">{dl}</span> days remaining</> : <span className="text-amber-400">Ending today</span>}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ── Evaluations section ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Evaluations</div>
                  {evals.length > 0 && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400">
                      {evals.length} submitted
                    </span>
                  )}
                </div>

                {evLoading ? (
                  <div className="text-center py-4">
                    <div className="text-slate-600 text-xs font-mono animate-pulse">Loading…</div>
                  </div>
                ) : evals.length === 0 ? (
                  <div className="rounded-xl border border-slate-800 p-4 text-center">
                    <div className="text-2xl mb-2">📋</div>
                    <p className="text-slate-500 text-xs">No evaluations yet.</p>
                    <p className="text-slate-600 text-[10px] font-mono mt-0.5">Your supervisor hasn't submitted one.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {evals.map(ev => <EvalCard key={ev.evaluation_id} ev={ev} />)}
                  </div>
                )}
              </div>

              {selected.status === "Completed" && (
                <div className="rounded-xl bg-sky-500/5 border border-sky-500/15 p-3 text-[11px] text-sky-400 font-mono">
                  ✓ Internship completed successfully.
                </div>
              )}
              {selected.status === "Terminated" && (
                <div className="rounded-xl bg-red-500/5 border border-red-500/15 p-3 text-[11px] text-red-400 font-mono">
                  This internship was terminated early.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Internships
