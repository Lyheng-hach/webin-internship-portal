import React, { useState } from 'react'
import { fmtDate, logoColor, TYPE_COLORS } from '../../assets/Student/Helpers';
import { StatusPill } from './StatusPill';
import { supervisionRequestAPI } from '../../services/api';

// ── Supervisor request panel ───────────────────────────────────────────────────
const SupervisorPanel = ({ supervisors, supervisionRequests, setSupervisionRequests }) => {
  const [selectedSup, setSelectedSup] = useState("");
  const [message,     setMessage]     = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState(null);

  // Get the most recent active request (Pending or Approved)
  const activeReq = supervisionRequests.find(r => r.status === "Pending" || r.status === "Approved");
  const lastRejected = !activeReq && supervisionRequests.find(r => r.status === "Rejected");

  const handleRequest = async () => {
    if (!selectedSup) { setError("Please select a supervisor."); return; }
    setSubmitting(true);
    setError(null);
    try {
      const created = await supervisionRequestAPI.request(Number(selectedSup), message.trim() || undefined);
      setSupervisionRequests(p => [created, ...p]);
      setSelectedSup("");
      setMessage("");
    } catch(e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (requestId) => {
    try {
      await supervisionRequestAPI.cancel(requestId);
      setSupervisionRequests(p => p.filter(r => r.request_id !== requestId));
    } catch(e) {
      setError(e.message);
    }
  };

  // ── Approved state ──
  if (activeReq?.status === "Approved") {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          <span className="text-xs font-bold text-emerald-400" style={{fontFamily:"'Syne',sans-serif"}}>Supervisor Confirmed</span>
        </div>
        <div className="text-sm font-bold text-white">{activeReq.supervisor_name}</div>
        <div className="text-[11px] text-slate-500 font-mono">Your supervisor has approved your request.</div>
      </div>
    );
  }

  // ── Pending state ──
  if (activeReq?.status === "Pending") {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-400" style={{fontFamily:"'Syne',sans-serif"}}>Request Pending</span>
          </div>
          <button onClick={() => handleCancel(activeReq.request_id)}
            className="text-[10px] text-slate-500 hover:text-red-400 font-mono underline transition-colors">
            Cancel
          </button>
        </div>
        <div className="text-sm font-bold text-white">{activeReq.supervisor_name}</div>
        {activeReq.message && <div className="text-[11px] text-slate-400 font-mono italic">"{activeReq.message}"</div>}
        <div className="text-[11px] text-slate-500 font-mono">Awaiting supervisor approval…</div>
      </div>
    );
  }

  // ── Request form (no active request) ──
  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sky-400 text-sm">🎓</span>
        <span className="text-xs font-bold text-sky-400" style={{fontFamily:"'Syne',sans-serif"}}>Request a Supervisor</span>
      </div>

      {lastRejected && (
        <div className="text-[11px] text-red-400 font-mono bg-red-500/10 rounded-lg px-3 py-2 border border-red-500/15">
          ✕ Your previous request to <strong>{lastRejected.supervisor_name}</strong> was rejected. You may request a different supervisor.
        </div>
      )}

      <div className="space-y-2">
        <select value={selectedSup} onChange={e => setSelectedSup(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-sky-500/60 font-mono transition-colors">
          <option value="">— Select a supervisor —</option>
          {supervisors.map(s => (
            <option key={s.supervisor_id} value={s.supervisor_id}>
              {s.name} · {s.department}
            </option>
          ))}
        </select>
        <textarea value={message} onChange={e => setMessage(e.target.value)}
          placeholder="Optional message to the supervisor…"
          rows={2}
          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/60 font-mono resize-none transition-colors" />
      </div>
      {error && <p className="text-[11px] text-red-400 font-mono">✕ {error}</p>}
      <button onClick={handleRequest} disabled={submitting || !selectedSup}
        className="w-full py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-black transition-all hover:-translate-y-0.5 shadow-md shadow-sky-500/20 disabled:opacity-50"
        style={{fontFamily:"'Syne',sans-serif"}}>
        {submitting ? "Sending…" : "Send Request →"}
      </button>
    </div>
  );
};

// ── Main Applications component ────────────────────────────────────────────────
const Applications = ({
  applications = [],
  interviews = [],
  supervisors = [],
  supervisionRequests = [],
  setSupervisionRequests,
  internHistory = [],
}) => {
  const interviewByApp = Object.fromEntries(
    interviews.map(iv => [iv.application_id, iv])
  );
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Pending", "Accepted", "Rejected"];

  // Hide applications that have been converted into an active internship
  const internPositionIds = new Set(internHistory.map(i => i.intern_position_id));
  const visibleApplications = applications.filter(a => !internPositionIds.has(a.intern_position_id));

  const filtered = visibleApplications.filter(a => filter === "All" || a.status === filter);

  const counts = {
    All:      visibleApplications.length,
    Pending:  visibleApplications.filter(a => a.status === "Pending").length,
    Accepted: visibleApplications.filter(a => a.status === "Accepted").length,
    Rejected: visibleApplications.filter(a => a.status === "Rejected").length,
  };

  const hasAccepted = visibleApplications.some(a => a.status === "Accepted");

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {label:"Pending",  count: counts.Pending,  color:"text-amber-400",   bg:"bg-amber-500/10 border-amber-500/20"},
          {label:"Accepted", count: counts.Accepted, color:"text-emerald-400", bg:"bg-emerald-500/10 border-emerald-500/20"},
          {label:"Rejected", count: counts.Rejected, color:"text-red-400",     bg:"bg-red-500/10 border-red-500/20"},
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
            <div className={`text-2xl font-black ${s.color}`} style={{fontFamily:"'Syne',sans-serif"}}>{s.count}</div>
            <div className="text-xs text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Supervisor request panel — shown when student has ≥1 accepted application */}
      {hasAccepted && (
        <SupervisorPanel
          supervisors={supervisors}
          supervisionRequests={supervisionRequests}
          setSupervisionRequests={setSupervisionRequests}
        />
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-0">
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all duration-150 -mb-px ${filter === s ? "border-sky-500 text-sky-400" : "border-transparent text-slate-500 hover:text-slate-400"}`}>
            {s} <span className="ml-1 opacity-60">({counts[s] ?? applications.length})</span>
          </button>
        ))}
      </div>

      {/* Application list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-3xl mb-3">◎</div>
          <p className="text-slate-500 text-sm">
            {visibleApplications.length === 0 ? "You haven't applied to any positions yet" : `No ${filter.toLowerCase()} applications`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app, i) => (
            <div key={app.id} className="group rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 p-5 transition-all duration-200"
              style={{animationDelay:`${i*60}ms`}}>
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${logoColor(app.logo)}`}>{app.logo}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-slate-200 text-sm">{app.position}</span>
                    {app.type && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[app.type] || ""}`}>{app.type}</span>}
                  </div>
                  <div className="text-xs text-slate-400">{app.company} · {app.location}</div>
                </div>
                <div className="text-right flex-shrink-0 space-y-1.5">
                  <div><StatusPill status={app.status} /></div>
                  <div className="text-[10px] text-slate-600 font-mono">Applied {fmtDate(app.applyDate)}</div>
                  <div className="text-xs text-emerald-400 font-mono font-semibold">{app.salary}</div>
                </div>
              </div>

              {/* Interview details for accepted apps */}
              {app.status === "Accepted" && (() => {
                const iv = interviewByApp[app.id];
                if (iv) {
                  const ivDate = new Date(iv.scheduled_at);
                  const dateStr = ivDate.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
                  const timeStr = ivDate.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" });
                  const statusColor = iv.status === "Scheduled" ? "text-violet-400" : iv.status === "Completed" ? "text-emerald-400" : "text-red-400";
                  return (
                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                        <span className="text-xs text-emerald-400">Application accepted!</span>
                      </div>
                      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-3 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">🎤</span>
                          <span className="text-xs font-bold text-violet-300" style={{fontFamily:"'Syne',sans-serif"}}>Interview Scheduled</span>
                          <span className={`ml-auto text-[10px] font-bold ${statusColor}`}>{iv.status}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                          <div><span className="text-slate-600">Date: </span><span className="text-slate-300">{dateStr}</span></div>
                          <div><span className="text-slate-600">Time: </span><span className="text-slate-300">{timeStr}</span></div>
                          <div><span className="text-slate-600">Type: </span><span className="text-slate-300">{iv.interview_type}</span></div>
                          <div><span className="text-slate-600">Location: </span><span className="text-slate-300 truncate">{iv.location}</span></div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                    <span className="text-xs text-emerald-400">Congratulations! Your application was accepted.</span>
                    <span className="text-xs text-slate-600 ml-1">— Awaiting interview schedule.</span>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Applications
