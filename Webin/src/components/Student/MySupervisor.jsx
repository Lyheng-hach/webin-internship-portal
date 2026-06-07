import React, { useState } from 'react'
import { supervisionRequestAPI } from '../../services/api';

// ── Status badge ───────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = {
    Approved: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    Pending:  "bg-amber-500/10  border-amber-500/30  text-amber-400",
    Rejected: "bg-red-500/10   border-red-500/30   text-red-400",
  };
  return (
    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${cfg[status] || "bg-slate-500/10 border-slate-500/30 text-slate-400"}`}>
      {status}
    </span>
  );
};

// ── Supervisor card (browse list) ──────────────────────────────────────────────
const SupervisorCard = ({ sup, onRequest, requesting }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 flex items-start gap-4">
    <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-400 font-black text-sm flex-shrink-0"
      style={{fontFamily:"'Syne',sans-serif"}}>
      {sup.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-bold text-slate-200 text-sm">{sup.name}</div>
      <div className="text-xs text-sky-400 font-mono mt-0.5">{sup.position?.replace("_"," ")} · {sup.department}</div>
      {sup.specialization && (
        <div className="text-[11px] text-slate-500 mt-1">{sup.specialization}</div>
      )}
      <div className="flex gap-4 mt-2 flex-wrap">
        {sup.office && (
          <span className="text-[10px] text-slate-600 font-mono">📍 {sup.office}</span>
        )}
        {sup.office_hours && (
          <span className="text-[10px] text-slate-600 font-mono">🕐 {sup.office_hours}</span>
        )}
      </div>
    </div>
    <button
      onClick={() => onRequest && onRequest(sup)}
      disabled={requesting || !onRequest}
      title={requesting ? "Cancel your current request first" : ""}
      className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
        onRequest
          ? "bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border-sky-500/25 hover:-translate-y-0.5"
          : "bg-slate-800/60 text-slate-600 border-slate-700 cursor-not-allowed"
      }`}
      style={{fontFamily:"'Syne',sans-serif"}}>
      {onRequest ? "+ Request" : "Unavailable"}
    </button>
  </div>
);

// ── Request modal ──────────────────────────────────────────────────────────────
const RequestModal = ({ supervisor, onClose, onSent }) => {
  const [message, setMessage]     = useState("");
  const [sending, setSending]     = useState(false);
  const [error, setError]         = useState(null);

  const handleSend = async () => {
    setSending(true);
    setError(null);
    try {
      const created = await supervisionRequestAPI.request(supervisor.supervisor_id, message.trim() || undefined);
      onSent(created);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  const iCls = "w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/60 transition-colors font-mono";
  const lCls = "block text-[10px] font-black text-slate-600 tracking-widest uppercase mb-2";

  return (
    <div className="fixed inset-0 z-50 bg-[#07090f]/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div>
            <h2 className="font-black text-white text-base" style={{fontFamily:"'Syne',sans-serif"}}>Request Supervision</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{supervisor.name} · {supervisor.department}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className={lCls}>Message to Supervisor <span className="text-slate-700 normal-case tracking-normal">(optional)</span></label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              placeholder="Introduce yourself and explain why you'd like this supervisor…"
              className={`${iCls} resize-none`}
            />
          </div>
          {error && <p className="text-xs text-red-400 font-mono">✕ {error}</p>}
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800">
          <button onClick={onClose} className="px-5 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:border-slate-600 transition-colors">Cancel</button>
          <button onClick={handleSend} disabled={sending}
            className="px-7 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black text-sm font-black transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-500/20 disabled:opacity-60"
            style={{fontFamily:"'Syne',sans-serif"}}>
            {sending ? "Sending…" : "Send Request →"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main page ──────────────────────────────────────────────────────────────────
const MySupervisor = ({ supervisors = [], supervisionRequests = [], setSupervisionRequests }) => {
  const [modal, setModal]       = useState(null);   // supervisor being requested
  const [cancelling, setCancelling] = useState(null);
  const [search, setSearch]     = useState("");

  const activeReq    = supervisionRequests.find(r => r.status === "Pending" || r.status === "Approved");
  const history      = supervisionRequests.filter(r => r.status === "Rejected");
  const approvedSup  = activeReq?.status === "Approved"
    ? supervisors.find(s => s.supervisor_id === activeReq.supervisor_id)
    : null;

  const handleSent = (newReq) => {
    setSupervisionRequests(prev => [newReq, ...prev]);
  };

  const handleCancel = async (requestId) => {
    setCancelling(requestId);
    try {
      await supervisionRequestAPI.cancel(requestId);
      setSupervisionRequests(prev => prev.filter(r => r.request_id !== requestId));
    } catch (e) {
      console.error("Cancel failed:", e.message);
    } finally {
      setCancelling(null);
    }
  };

  const filteredSups = supervisors.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase()) ||
    (s.specialization || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Current status card ── */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-sm font-black text-slate-200 mb-4" style={{fontFamily:"'Syne',sans-serif"}}>My Supervisor Status</h2>

        {!activeReq && history.length === 0 && (
          <div className="text-center py-8">
            <div className="text-3xl mb-3">⬡</div>
            <p className="text-slate-500 text-sm">You haven't requested a supervisor yet.</p>
            <p className="text-slate-600 text-xs font-mono mt-1">Browse supervisors below and send a request.</p>
          </div>
        )}

        {/* Approved */}
        {activeReq?.status === "Approved" && (
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 font-black flex-shrink-0"
              style={{fontFamily:"'Syne',sans-serif"}}>
              {activeReq.supervisor_name?.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() || "SV"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-black text-slate-200 text-base" style={{fontFamily:"'Syne',sans-serif"}}>{activeReq.supervisor_name}</span>
                <StatusBadge status="Approved" />
              </div>
              {approvedSup && (
                <>
                  <div className="text-xs text-sky-400 font-mono">{approvedSup.position?.replace("_"," ")} · {approvedSup.department}</div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {[
                      {l:"Specialization", v: approvedSup.specialization || "—"},
                      {l:"Office",         v: approvedSup.office || "—"},
                      {l:"Office Hours",   v: approvedSup.office_hours || "—"},
                      {l:"Phone",          v: approvedSup.phone || "—"},
                    ].map(({l,v}) => (
                      <div key={l}>
                        <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-0.5">{l}</div>
                        <div className="text-xs text-slate-300 font-mono">{v}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {activeReq.message && (
                <div className="mt-3 p-3 rounded-xl bg-slate-800 border border-slate-700">
                  <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-1">Your Message</div>
                  <p className="text-xs text-slate-400 font-mono">{activeReq.message}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pending */}
        {activeReq?.status === "Pending" && (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 font-black flex-shrink-0"
              style={{fontFamily:"'Syne',sans-serif"}}>
              {activeReq.supervisor_name?.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() || "SV"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="font-bold text-slate-200 text-sm">{activeReq.supervisor_name}</span>
                <StatusBadge status="Pending" />
              </div>
              <p className="text-xs text-slate-500 font-mono">Awaiting supervisor approval…</p>
              {activeReq.message && (
                <p className="text-[11px] text-slate-600 mt-1 italic">"{activeReq.message}"</p>
              )}
            </div>
            <button
              onClick={() => handleCancel(activeReq.request_id)}
              disabled={cancelling === activeReq.request_id}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/20 transition-colors disabled:opacity-50">
              {cancelling === activeReq.request_id ? "…" : "✕ Cancel"}
            </button>
          </div>
        )}

        {/* Rejected history */}
        {!activeReq && history.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-red-400 font-mono mb-3">Your last request was rejected. You can request a different supervisor below.</p>
            {history.map(r => (
              <div key={r.request_id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 border border-red-500/10">
                <div className="text-red-400 text-sm">✕</div>
                <div className="flex-1">
                  <span className="text-xs text-slate-300 font-bold">{r.supervisor_name}</span>
                  <StatusBadge status="Rejected" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Browse supervisors — always visible ── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-black text-slate-200" style={{fontFamily:"'Syne',sans-serif"}}>Available Supervisors</h2>
          <p className="text-xs text-slate-600 font-mono mt-0.5">{supervisors.length} supervisors registered</p>
          {activeReq?.status === "Approved" && (
            <p className="text-xs text-amber-400 font-mono mt-1">
              You already have an approved supervisor. Cancel your current request first to request a different one.
            </p>
          )}
          {activeReq?.status === "Pending" && (
            <p className="text-xs text-amber-400 font-mono mt-1">
              Cancel your pending request above to request a different supervisor.
            </p>
          )}
        </div>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, department or specialization…"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition-colors font-mono"
        />

        {filteredSups.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">No supervisors match your search.</p>
        ) : (
          <div className="grid gap-3">
            {filteredSups.map(sup => (
              <SupervisorCard
                key={sup.supervisor_id}
                sup={sup}
                onRequest={activeReq ? null : setModal}
                requesting={!!activeReq}
              />
            ))}
          </div>
        )}
      </div>

      {/* Request modal */}
      {modal && (
        <RequestModal
          supervisor={modal}
          onClose={() => setModal(null)}
          onSent={handleSent}
        />
      )}
    </div>
  );
};

export default MySupervisor;
