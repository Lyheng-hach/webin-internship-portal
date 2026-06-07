import React, { useState } from 'react'
import { applicationAPI } from '../../services/api';
import { Avatar, StatusPill } from '../../assets/Company/Shared_ui_atoms';
import { fmtDate, STATUS_CLS } from '../../assets/Company/Helpers';

const Applications = ({ onNavigate, applications = [], setApplications }) => {
  const [filter, setFilter]       = useState("All");
  const [posFilter, setPosFilter] = useState("All");
  const [selected, setSelected]   = useState(null);
  const [updating, setUpdating]   = useState(false);

  const positions = ["All", ...new Set(applications.map(a => a.position))];
  const statuses  = ["All","Pending","Accepted","Rejected"];
  const counts    = {
    All:      applications.length,
    Pending:  applications.filter(a=>a.status==="Pending").length,
    Accepted: applications.filter(a=>a.status==="Accepted").length,
    Rejected: applications.filter(a=>a.status==="Rejected").length,
  };

  const filtered = applications.filter(a =>
    (filter==="All" || a.status===filter) &&
    (posFilter==="All" || a.position===posFilter)
  );

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      await applicationAPI.updateStatus(id, status, "");
      setApplications(p => p.map(a => a.application_id===id ? {...a, status} : a));
      if (selected?.application_id===id) setSelected(p => ({...p, status}));
    } catch(e) {
      // silently handle — could show toast
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex gap-5 h-full">
      {/* Left: list */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[{l:"Pending",c:counts.Pending,color:"text-amber-400",bg:"border-amber-500/20"},{l:"Accepted",c:counts.Accepted,color:"text-emerald-400",bg:"border-emerald-500/20"},{l:"Rejected",c:counts.Rejected,color:"text-red-400",bg:"border-red-500/20"}].map(s=>(
            <div key={s.l} className={`rounded-xl border p-3.5 ${s.bg}`}>
              <div className={`text-xl font-black ${s.color}`} style={{fontFamily:"'Syne',sans-serif"}}>{s.c}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap items-center">
          <select value={posFilter} onChange={e=>setPosFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-orange-500/40 font-mono">
            {positions.map(p => <option key={p} value={p}>{p==="All"?"All Positions":p}</option>)}
          </select>
          <div className="flex gap-1">
            {statuses.map(s => (
              <button key={s} onClick={()=>setFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${filter===s?"bg-orange-500/15 border-orange-500/35 text-orange-400":"bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400"}`}
                style={{fontFamily:"'Syne',sans-serif"}}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-3xl mb-3">◎</div>
            <p className="text-slate-500 text-sm">
              {applications.length === 0 ? "No applications received yet" : "No matching applications"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(app => (
              <div key={app.application_id} onClick={()=>setSelected(app)}
                className={`group flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${selected?.application_id===app.application_id?"border-orange-500/40 bg-orange-500/5":"border-slate-800 bg-slate-900/60 hover:border-slate-700"}`}>
                <Avatar name={app.student_name} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-200 text-sm">{app.student_name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{app.position} · {app.university}</div>
                  <div className="text-[10px] text-slate-600 font-mono mt-1">Applied {fmtDate(app.apply_date)}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusPill status={app.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: detail panel */}
      {selected && (
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-0 rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Avatar name={selected.student_name} size="lg" />
                <div>
                  <h3 className="font-black text-white text-sm" style={{fontFamily:"'Syne',sans-serif"}}>{selected.student_name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selected.university}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  {l:"Position",  v:selected.position},
                  {l:"App ID",    v:String(selected.application_id)},
                  {l:"Applied",   v:fmtDate(selected.apply_date)},
                  {l:"Status",    v:selected.status},
                ].map(({l,v})=>(
                  <div key={l} className="rounded-lg bg-slate-800/60 border border-slate-800 p-2.5">
                    <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-1">{l}</div>
                    <div className="text-[11px] text-slate-200 font-mono truncate">{v}</div>
                  </div>
                ))}
              </div>

              {selected.cover_letter && (
                <div>
                  <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-2">Cover Letter</div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                    <p className="text-xs text-slate-300 italic leading-relaxed">"{selected.cover_letter}"</p>
                  </div>
                </div>
              )}

              {selected.documents && selected.documents.length > 0 && (
                <div>
                  <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-2">
                    Attached Documents <span className="text-slate-700 normal-case tracking-normal font-normal">({selected.documents.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {selected.documents.map(doc => (
                      <a key={doc.doc_id} href={doc.doc_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-orange-500/40 transition-colors group">
                        <span className="text-orange-400 text-sm flex-shrink-0">▣</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-slate-200 font-bold truncate">{doc.doc_name || "Document"}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{doc.doc_type || "—"}</div>
                        </div>
                        <span className="text-slate-600 group-hover:text-orange-400 text-xs transition-colors flex-shrink-0">↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase">Current Status</div>
                <StatusPill status={selected.status} />
              </div>

              {selected.status === "Pending" && (
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={()=>updateStatus(selected.application_id,"Accepted")} disabled={updating}
                    className="py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-black border border-emerald-500/25 transition-all disabled:opacity-60" style={{fontFamily:"'Syne',sans-serif"}}>
                    ✓ Accept
                  </button>
                  <button onClick={()=>updateStatus(selected.application_id,"Rejected")} disabled={updating}
                    className="py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-black border border-red-500/20 transition-all disabled:opacity-60" style={{fontFamily:"'Syne',sans-serif"}}>
                    ✕ Reject
                  </button>
                </div>
              )}

              {selected.status === "Accepted" && onNavigate && (
                <button onClick={() => onNavigate("interviews")}
                  className="w-full py-2.5 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 text-violet-400 text-xs font-black border border-violet-500/25 transition-all" style={{fontFamily:"'Syne',sans-serif"}}>
                  🎤 Schedule Interview
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applications
