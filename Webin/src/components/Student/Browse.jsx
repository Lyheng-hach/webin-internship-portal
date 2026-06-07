import React, { useState } from 'react'
import { applicationAPI } from '../../services/api';
import { daysLeft, fmtDate, logoColor, TYPE_COLORS } from '../../assets/Student/Helpers';

const Browse = ({ positions = [], documents = [], applications = [] }) => {
  const [search, setSearch]     = useState("");
  const [typeFilter, setType]   = useState("All");
  const [selected, setSelected] = useState(null);
  const [applied, setApplied]   = useState([]);
  const [applying, setApplying]         = useState(false);
  const [applyError, setApplyError]     = useState(null);
  const [selectedDocIds, setSelectedDocIds] = useState([]);   // multi-select
  const [coverLetter, setCoverLetter]   = useState("");

  // Position IDs where student already has an Accepted application — hide these entirely
  const acceptedPositionIds = new Set(
    applications.filter(a => a.status === "Accepted").map(a => a.intern_position_id)
  );
  // Position IDs where student applied but not yet accepted — show as "Already Applied"
  const pendingPositionIds = new Set(
    applications.filter(a => a.status !== "Accepted").map(a => a.intern_position_id)
  );

  const isAlreadyApplied = (posId) => applied.includes(posId) || pendingPositionIds.has(posId);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const types = ["All", ...new Set(positions.map(p => p.type).filter(Boolean))];
  const filtered = positions.filter(p =>
    !acceptedPositionIds.has(p.id) &&
    !(p.deadline && new Date(p.deadline) <= today) &&
    (typeFilter === "All" || p.type === typeFilter) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.company.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleDoc = (docId) => {
    setSelectedDocIds(prev =>
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const handleApply = async () => {
    if (!selected || isAlreadyApplied(selected.id)) return;
    setApplying(true);
    setApplyError(null);
    try {
      await applicationAPI.apply(selected.id, selectedDocIds, coverLetter.trim() || undefined);
      setApplied(p => [...p, selected.id]);
      setSelectedDocIds([]);
      setCoverLetter("");
    } catch (e) {
      setApplyError(e.message);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="flex gap-5 h-full">
      {/* list */}
      <div className="flex-1 min-w-0 space-y-4">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">◎</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search positions or companies..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition-colors font-mono" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {types.map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 border ${typeFilter === t ? "bg-sky-500/15 border-sky-500/40 text-sky-400" : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-3xl mb-3">◎</div>
            <p className="text-slate-500 text-sm">{positions.length === 0 ? "No positions available right now" : "No positions match your search"}</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((pos) => (
              <div key={pos.id} onClick={() => setSelected(pos)}
                className={`group rounded-xl border p-5 cursor-pointer transition-all duration-200 ${selected?.id === pos.id ? "border-sky-500/50 bg-sky-500/5" : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${logoColor(pos.logo)}`}>{pos.logo}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-slate-200 text-sm group-hover:text-sky-300 transition-colors">{pos.title}</span>
                      {pos.type && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[pos.type] || "bg-slate-500/10 text-slate-400"}`}>{pos.type}</span>}
                    </div>
                    <div className="text-xs text-slate-400 mb-2">{pos.company} · {pos.location}</div>
                    {pos.skills.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {pos.skills.slice(0, 3).map(s => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 font-mono">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-emerald-400 font-mono mb-1">{pos.salary}</div>
                    <div className="text-[10px] text-slate-500">{pos.slots} slot{pos.slots !== 1 ? "s" : ""}</div>
                    {pos.deadline && <div className="text-[10px] text-amber-400 mt-1">{daysLeft(pos.deadline)}d left</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* detail panel */}
      {selected && (
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-0 rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-sky-500 via-violet-500 to-sky-500" />
            <div className="p-5 space-y-5">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${logoColor(selected.logo)}`}>{selected.logo}</div>
                <div>
                  <h3 className="font-black text-white text-sm leading-tight" style={{fontFamily:"'Syne',sans-serif"}}>{selected.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selected.company}</p>
                </div>
              </div>

              {selected.description && <p className="text-xs text-slate-400 leading-relaxed">{selected.description}</p>}

              <div className="grid grid-cols-2 gap-3">
                {[
                  {l:"Location", v: selected.location},
                  {l:"Salary",   v: selected.salary},
                  {l:"Slots",    v: `${selected.slots} openings`},
                  {l:"Deadline", v: selected.deadline ? fmtDate(selected.deadline) : "Open"},
                ].map(({l,v}) => (
                  <div key={l} className="rounded-lg bg-slate-800/60 border border-slate-800 p-3">
                    <div className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mb-1">{l}</div>
                    <div className="text-xs text-slate-200 font-mono font-semibold">{v}</div>
                  </div>
                ))}
              </div>

              {selected.skills.length > 0 && (
                <div>
                  <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-2">Required Skills</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {selected.skills.map(s => (
                      <span key={s} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-mono">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {selected.deadline && (
                <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-mono">
                  <span>⏰</span> {daysLeft(selected.deadline)} days remaining
                </div>
              )}

              {/* Application form — only show if not yet applied */}
              {!isAlreadyApplied(selected.id) && (
                <div className="space-y-3">

                  {/* Cover letter */}
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-2">
                      Message to Company <span className="text-slate-700 normal-case tracking-normal">(optional)</span>
                    </div>
                    <textarea
                      value={coverLetter}
                      onChange={e => setCoverLetter(e.target.value)}
                      rows={3}
                      placeholder="Introduce yourself and explain why you're a great fit…"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition-colors font-mono resize-none"
                    />
                  </div>

                  {/* Multi-document picker */}
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-2">
                      Attach Documents <span className="text-slate-700 normal-case tracking-normal">(optional — select any)</span>
                    </div>
                    {documents.length === 0 ? (
                      <div className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-500 font-mono">
                        No documents uploaded yet — add one in the Documents tab first.
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {documents.map(d => {
                          const checked = selectedDocIds.includes(d.document_id);
                          return (
                            <label key={d.document_id}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${checked ? "border-sky-500/40 bg-sky-500/8" : "border-slate-700 bg-slate-800 hover:border-slate-600"}`}>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleDoc(d.document_id)}
                                className="accent-sky-500 w-3.5 h-3.5 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-slate-200 font-mono truncate">{d.file_name}</div>
                                <div className="text-[10px] text-slate-500">{d.document_type}</div>
                              </div>
                              {checked && <span className="text-sky-400 text-xs flex-shrink-0">✓</span>}
                            </label>
                          );
                        })}
                      </div>
                    )}
                    {selectedDocIds.length > 0 && (
                      <p className="text-[10px] text-sky-400 font-mono mt-1.5">
                        {selectedDocIds.length} document{selectedDocIds.length > 1 ? "s" : ""} will be attached
                      </p>
                    )}
                  </div>
                </div>
              )}

              {applyError && <p className="text-xs text-red-400 font-mono">{applyError}</p>}

              <button
                onClick={handleApply}
                disabled={applying || isAlreadyApplied(selected.id)}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  isAlreadyApplied(selected.id)
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 cursor-default"
                    : applying
                    ? "bg-sky-500/30 text-sky-300 cursor-wait"
                    : "bg-sky-500 hover:bg-sky-400 text-black hover:-translate-y-0.5 shadow-lg shadow-sky-500/20"
                }`}
              >
                {isAlreadyApplied(selected.id) ? "✓ Applied" : applying ? "Applying…" : "Apply Now →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Browse
