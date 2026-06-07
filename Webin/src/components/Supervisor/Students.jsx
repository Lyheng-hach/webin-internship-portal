import React, { useState } from 'react'
import { Avatar } from '../../assets/Supervisor/Share_atom_UI_supervisor';

// ── Helper ─────────────────────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
}

// ── Intern card for "Available to Supervise" section ──────────────────────────
const AvailableCard = ({ intern, onClaim, claiming }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400 font-black text-xs flex-shrink-0"
      style={{fontFamily:"'Syne',sans-serif"}}>
      {(intern.student_name||"??").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-bold text-slate-200 text-sm">{intern.student_name}</div>
      <div className="text-xs text-violet-400 mt-0.5">{intern.position_title}</div>
      <div className="text-[11px] text-slate-500 font-mono mt-1">
        {intern.department}{intern.field && intern.field !== "—" ? ` · ${intern.field}` : ""}
        {" · "}{fmtDate(intern.start_date)} → {fmtDate(intern.end_date)}
      </div>
    </div>
    <div className="flex-shrink-0 flex flex-col items-end gap-2">
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
        intern.status === "Active"    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" :
        intern.status === "Completed" ? "bg-sky-500/10 border-sky-500/25 text-sky-400" :
        "bg-amber-500/10 border-amber-500/25 text-amber-400"
      }`}>{intern.status}</span>
      <button
        onClick={() => onClaim(intern.intern_id)}
        disabled={claiming === intern.intern_id}
        className="px-4 py-1.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-xs font-black transition-all hover:-translate-y-0.5 shadow-md shadow-violet-500/20 disabled:opacity-60"
        style={{fontFamily:"'Syne',sans-serif"}}>
        {claiming === intern.intern_id ? "Picking…" : "+ Supervise"}
      </button>
    </div>
  </div>
);

// ── Intern card for "My Students" section ─────────────────────────────────────
const MyStudentCard = ({ intern, selected, onClick }) => (
  <div onClick={onClick}
    className={`group rounded-xl border p-5 cursor-pointer transition-all duration-200 ${selected?"border-violet-500/50 bg-violet-500/5":"border-slate-800 bg-slate-900/60 hover:border-slate-700"}`}>
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400 font-black text-xs flex-shrink-0"
        style={{fontFamily:"'Syne',sans-serif"}}>
        {(intern.student_name||"??").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-bold text-slate-200 text-sm">{intern.student_name}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            intern.status === "Active"     ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" :
            intern.status === "Completed"  ? "bg-sky-500/10 border-sky-500/25 text-sky-400" :
            intern.status === "Terminated" ? "bg-red-500/10 border-red-500/25 text-red-400" :
            "bg-amber-500/10 border-amber-500/25 text-amber-400"
          }`}>{intern.status}</span>
        </div>
        <div className="text-xs text-violet-400 mb-1">{intern.position_title}</div>
        <div className="text-[11px] text-slate-500 font-mono">
          {intern.department}{intern.field && intern.field !== "—" ? ` · ${intern.field}` : ""}
        </div>
      </div>
      <div className="text-[11px] text-slate-600 font-mono flex-shrink-0 text-right">
        <div>{fmtDate(intern.start_date)}</div>
        <div className="text-slate-700">→ {fmtDate(intern.end_date)}</div>
      </div>
    </div>
  </div>
);

// ── Supervision request card ──────────────────────────────────────────────────
const RequestCard = ({ req, onRespond, responding }) => {
  const statusColor = {
    Pending:  "bg-amber-500/10 border-amber-500/25 text-amber-400",
    Approved: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
    Rejected: "bg-red-500/10 border-red-500/25 text-red-400",
  };
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-400 font-black text-xs flex-shrink-0"
          style={{fontFamily:"'Syne',sans-serif"}}>
          {(req.student_name||"??").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-slate-200 text-sm">{req.student_name}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor[req.status]}`}>
              {req.status}
            </span>
          </div>
          {req.message && (
            <div className="text-[11px] text-slate-400 font-mono italic mb-1">"{req.message}"</div>
          )}
          <div className="text-[10px] text-slate-600 font-mono">
            {new Date(req.created_at).toLocaleDateString("en-GB", {day:"numeric",month:"short",year:"numeric"})}
          </div>
        </div>
        {req.status === "Pending" && (
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => onRespond(req.request_id, "Approved")}
              disabled={responding === req.request_id}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/20 transition-colors disabled:opacity-60">
              ✓ Approve
            </button>
            <button onClick={() => onRespond(req.request_id, "Rejected")}
              disabled={responding === req.request_id}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/20 transition-colors disabled:opacity-60">
              ✕ Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Students component ────────────────────────────────────────────────────
const Students = ({ availableInterns = [], myInterns = [], onClaim, incomingRequests = [], onRespond, supNotifs = [] }) => {
  const [tab,        setTab]       = useState("requests"); // start on requests tab
  const [selected,   setSelected]  = useState(null);
  const [claiming,   setClaiming]  = useState(null);
  const [responding, setResponding] = useState(null);

  const pendingCount = incomingRequests.filter(r => r.status === "Pending").length;
  const unreadNotifs = supNotifs.filter(n => !n.is_read).length;

  const handleClaim = async (internId) => {
    setClaiming(internId);
    try {
      await onClaim(internId);
    } finally {
      setClaiming(null);
    }
  };

  const handleRespond = async (requestId, status) => {
    setResponding(requestId);
    try {
      await onRespond(requestId, status);
    } finally {
      setResponding(null);
    }
  };

  return (
    <div className="flex gap-5">
      {/* ── Left panel ── */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-slate-800">
          {[
            { id: "requests",  label: "Requests",              count: pendingCount,           badge: pendingCount > 0 },
            { id: "my",        label: "My Students",           count: myInterns.length,       badge: false },
            { id: "available", label: "Available to Supervise",count: availableInterns.length, badge: false },
            { id: "notifs",    label: "Notifications",         count: unreadNotifs,           badge: unreadNotifs > 0 },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSelected(null); }}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all -mb-px flex items-center gap-2 ${tab===t.id?"border-violet-500 text-violet-400":"border-transparent text-slate-600 hover:text-slate-400"}`}
              style={{fontFamily:"'Syne',sans-serif"}}>
              {t.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${t.badge?"bg-violet-500 text-white":tab===t.id?"bg-violet-500/20 text-violet-400":"bg-slate-800 text-slate-600"}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Requests tab ── */}
        {tab === "requests" && (
          <>
            {incomingRequests.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-3xl mb-3">◉</div>
                <p className="text-slate-500 text-sm">No supervision requests yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 font-mono">
                  {pendingCount} pending · {incomingRequests.length} total requests
                </p>
                {incomingRequests.map(req => (
                  <RequestCard
                    key={req.request_id}
                    req={req}
                    onRespond={handleRespond}
                    responding={responding}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Notifications tab ── */}
        {tab === "notifs" && (
          <>
            {supNotifs.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-3xl mb-3">🔔</div>
                <p className="text-slate-500 text-sm">No notifications yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {supNotifs.map(n => (
                  <div key={n.id}
                    className={`rounded-xl border p-4 transition-all ${n.is_read ? "border-slate-800 bg-slate-900/40" : "border-violet-500/20 bg-violet-500/5"}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.is_read ? "bg-slate-700" : "bg-violet-400 shadow-[0_0_6px_#8b5cf6]"}`} />
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-200 mb-0.5">{n.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{n.message}</div>
                        <div className="text-[10px] text-slate-600 font-mono mt-1.5">
                          {new Date(n.created_at).toLocaleDateString("en-GB", {day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Available tab ── */}
        {tab === "available" && (
          <>
            {availableInterns.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-3xl mb-3">◉</div>
                <p className="text-slate-500 text-sm">No interns are waiting for a supervisor right now.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 font-mono">
                  {availableInterns.length} intern{availableInterns.length !== 1 ? "s" : ""} without a supervisor — click "+ Supervise" to pick one
                </p>
                {availableInterns.map(intern => (
                  <AvailableCard
                    key={intern.intern_id}
                    intern={intern}
                    onClaim={handleClaim}
                    claiming={claiming}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── My Students tab ── */}
        {tab === "my" && (
          <>
            {myInterns.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-3xl mb-3">◉</div>
                <p className="text-slate-500 text-sm">
                  You haven't picked any students yet.{" "}
                  <button onClick={() => setTab("available")} className="text-violet-400 underline underline-offset-2">
                    Browse available interns →
                  </button>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myInterns.map(intern => (
                  <MyStudentCard
                    key={intern.intern_id}
                    intern={intern}
                    selected={selected?.intern_id === intern.intern_id}
                    onClick={() => setSelected(s => s?.intern_id === intern.intern_id ? null : intern)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Detail panel (my students only) ── */}
      {tab === "my" && selected && (
        <div className="w-72 flex-shrink-0">
          <div className="sticky top-0 rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-400 to-violet-500" />
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 font-black text-sm flex-shrink-0"
                  style={{fontFamily:"'Syne',sans-serif"}}>
                  {(selected.student_name||"??").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-white text-sm" style={{fontFamily:"'Syne',sans-serif"}}>{selected.student_name}</h3>
                  <p className="text-xs text-violet-400 mt-0.5">{selected.position_title}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  {l:"Department", v: selected.department},
                  {l:"Field",      v: selected.field},
                  {l:"Start",      v: fmtDate(selected.start_date)},
                  {l:"End",        v: fmtDate(selected.end_date)},
                  {l:"Status",     v: selected.status},
                  {l:"Intern ID",  v: `#${selected.intern_id}`},
                ].map(({l,v}) => (
                  <div key={l} className="rounded-lg bg-slate-800/60 border border-slate-800 p-2.5">
                    <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-1">{l}</div>
                    <div className="text-[11px] text-slate-200 font-mono truncate">{v}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-violet-500/5 border border-violet-500/15 p-3 text-[11px] text-violet-400 font-mono">
                You are supervising this intern. Evaluations and monitoring coming soon.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students
