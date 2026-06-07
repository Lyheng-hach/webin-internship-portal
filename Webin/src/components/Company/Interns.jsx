import React, { useState, useEffect } from 'react'
import { internAPI, supervisorAPI } from '../../services/api';
import { Card, SectionTitle, StatusPill } from '../../assets/Company/Shared_ui_atoms';
import { fmtDate } from '../../assets/Company/Helpers';

// Candidates = completed interviews that don't have an InternInfo record yet
function getCandidates(interviews, applications, interns) {
  const internedStudentIds = new Set(interns.map(i => i.student_id));
  return interviews
    .filter(iv => iv.status === "Completed")
    .map(iv => {
      // raw interview_id is numeric; application_id stored as "APP-X" in adapted form
      const rawAppId = typeof iv.application_id === "string"
        ? parseInt(iv.application_id.replace("APP-", ""))
        : iv.application_id;
      const app = applications.find(a => a.application_id === rawAppId);
      return { ...iv, app, rawAppId };
    })
    .filter(iv => iv.app && !internedStudentIds.has(iv.app.student_id));
}

// ── Start Internship modal ─────────────────────────────────────────────────────
const StartInternshipModal = ({ candidate, onClose, onCreated }) => {
  const [form, setForm] = useState({
    department: candidate.app?.position || "",
    field: "",
    start_date: "",
    end_date: "",
    supervisor_id: "",
  });
  const [supervisors, setSupervisors] = useState([]);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState(null);
  const upd = (k,v) => setForm(p => ({...p,[k]:v}));

  const iCls = "w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500/60 transition-colors font-mono";
  const lCls = "block text-[10px] font-black text-slate-600 tracking-widest uppercase mb-2";

  useEffect(() => {
    supervisorAPI.list().then(data => setSupervisors(data || [])).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!form.department || !form.start_date || !form.end_date || !form.supervisor_id) {
      setError("Department, Start Date, End Date and Supervisor are required."); return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const created = await internAPI.start({
        student_id:         candidate.app.student_id,
        intern_position_id: candidate.app.intern_position_id,
        department:         form.department,
        field:              form.field || undefined,
        start_date:         form.start_date,
        end_date:           form.end_date,
        supervisor_id:      parseInt(form.supervisor_id),
      });
      onCreated(created);
      onClose();
    } catch(e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07090f]/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div>
            <h2 className="font-black text-white text-base" style={{fontFamily:"'Syne',sans-serif"}}>Start Internship</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{candidate.student_name} — {candidate.position}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={lCls}>Department *</label>
              <input value={form.department} onChange={e=>upd("department",e.target.value)} placeholder="e.g. Engineering" className={iCls} />
            </div>
            <div className="col-span-2">
              <label className={lCls}>Field / Specialization</label>
              <input value={form.field} onChange={e=>upd("field",e.target.value)} placeholder="e.g. Web Development" className={iCls} />
            </div>
            <div>
              <label className={lCls}>Start Date *</label>
              <input type="date" value={form.start_date} onChange={e=>upd("start_date",e.target.value)} className={iCls} />
            </div>
            <div>
              <label className={lCls}>End Date *</label>
              <input type="date" value={form.end_date} onChange={e=>upd("end_date",e.target.value)} className={iCls} />
            </div>
            <div className="col-span-2">
              <label className={lCls}>Assign Supervisor *</label>
              <select value={form.supervisor_id} onChange={e=>upd("supervisor_id",e.target.value)} className={iCls}>
                <option value="">— Select a supervisor —</option>
                {supervisors.map(s => (
                  <option key={s.supervisor_id} value={s.supervisor_id}>
                    {s.name} · {s.department}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-xs text-red-400 font-mono">✕ {error}</p>}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800">
          <button onClick={onClose} className="px-5 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:border-slate-600 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={submitting}
            className="px-7 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-sm font-black transition-all hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 disabled:opacity-60"
            style={{fontFamily:"'Syne',sans-serif"}}>
            {submitting ? "Starting…" : "Start Internship →"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Interns component ─────────────────────────────────────────────────────
const Interns = ({ interns = [], setInterns, interviews = [], applications = [] }) => {
  const [modal, setModal]     = useState(null);   // candidate being onboarded
  const [filter, setFilter]   = useState("All");
  const [updating, setUpdating] = useState(null);

  const candidates = getCandidates(interviews, applications, interns);

  const filtered = interns.filter(i => filter === "All" || i.status === filter);

  const handleCreated = (newIntern) => {
    setInterns(p => [...p, newIntern]);
  };

  const updateStatus = async (intern_id, status) => {
    setUpdating(intern_id);
    try {
      await internAPI.updateStatus(intern_id, status);
      setInterns(p => p.map(i => i.intern_id === intern_id ? {...i, status} : i));
    } catch(e) {
      console.error("Failed to update intern status:", e.message);
    } finally {
      setUpdating(null);
    }
  };

  const statusColor = {
    Active:     "text-emerald-400",
    Pending:    "text-amber-400",
    Completed:  "text-sky-400",
    Terminated: "text-red-400",
  };

  return (
    <div className="space-y-6">
      {/* ── Candidates ready to start ── */}
      {candidates.length > 0 && (
        <div className="space-y-3">
          <div>
            <SectionTitle>Ready to Start Internship</SectionTitle>
            <p className="text-xs text-slate-600 font-mono mt-0.5">
              {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} passed their interview
            </p>
          </div>
          <div className="grid gap-3">
            {candidates.map(cand => (
              <Card key={cand.interview_id} className="p-4 border-emerald-500/15">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 text-base flex-shrink-0">✓</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-200 text-sm">{cand.student_name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{cand.position} · Interview completed {fmtDate(cand.scheduled_at)}</div>
                  </div>
                  <button onClick={() => setModal(cand)}
                    className="flex-shrink-0 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-xs font-black transition-all hover:-translate-y-0.5 shadow-md shadow-orange-500/20"
                    style={{fontFamily:"'Syne',sans-serif"}}>
                    + Start Internship
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── Active intern list ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <SectionTitle>Intern Management</SectionTitle>
            <p className="text-xs text-slate-600 font-mono mt-0.5">{interns.length} total intern records</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            {l:"Active",     c:interns.filter(i=>i.status==="Active").length,     color:"text-emerald-400", bg:"border-emerald-500/20"},
            {l:"Pending",    c:interns.filter(i=>i.status==="Pending").length,    color:"text-amber-400",   bg:"border-amber-500/20"},
            {l:"Completed",  c:interns.filter(i=>i.status==="Completed").length,  color:"text-sky-400",     bg:"border-sky-500/20"},
            {l:"Terminated", c:interns.filter(i=>i.status==="Terminated").length, color:"text-red-400",     bg:"border-red-500/20"},
          ].map(s => (
            <div key={s.l} className={`rounded-xl border p-3.5 ${s.bg}`}>
              <div className={`text-xl font-black ${s.color}`} style={{fontFamily:"'Syne',sans-serif"}}>{s.c}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 border-b border-slate-800">
          {["All","Active","Pending","Completed","Terminated"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all -mb-px ${filter===f?"border-orange-500 text-orange-400":"border-transparent text-slate-600 hover:text-slate-400"}`}
              style={{fontFamily:"'Syne',sans-serif"}}>
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-3xl mb-3">◉</div>
            <p className="text-slate-500 text-sm">
              {interns.length === 0
                ? "No interns yet. Accept applicants, complete interviews, then start internships."
                : `No ${filter.toLowerCase()} interns`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map(intern => (
              <Card key={intern.intern_id} className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400 font-black text-xs flex-shrink-0"
                      style={{fontFamily:"'Syne',sans-serif"}}>
                      {(intern.student_name||"??").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-slate-200 text-sm">{intern.student_name || `Student #${intern.student_id}`}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          intern.status === "Active"     ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" :
                          intern.status === "Completed"  ? "bg-sky-500/10 border-sky-500/25 text-sky-400" :
                          intern.status === "Terminated" ? "bg-red-500/10 border-red-500/25 text-red-400" :
                          "bg-amber-500/10 border-amber-500/25 text-amber-400"
                        }`}>{intern.status}</span>
                      </div>
                      <div className="text-xs text-orange-400 mb-2">{intern.position_title || `Position #${intern.intern_position_id}`}</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          {l:"Department",  v: intern.department},
                          {l:"Field",       v: intern.field || "—"},
                          {l:"Start",       v: fmtDate(intern.start_date)},
                          {l:"End",         v: fmtDate(intern.end_date)},
                          {l:"Supervisor",  v: intern.supervisor_name || "Not assigned"},
                        ].map(({l,v}) => (
                          <div key={l}>
                            <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-1">{l}</div>
                            <div className="text-[11px] text-slate-300 font-mono">{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Status actions */}
                  <div className="flex gap-2 flex-shrink-0 flex-wrap">
                    {intern.status === "Pending" && (
                      <button onClick={() => updateStatus(intern.intern_id, "Active")}
                        disabled={updating === intern.intern_id}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/20 transition-colors disabled:opacity-60">
                        ▶ Activate
                      </button>
                    )}
                    {intern.status === "Active" && (
                      <button onClick={() => updateStatus(intern.intern_id, "Completed")}
                        disabled={updating === intern.intern_id}
                        className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-bold border border-sky-500/20 transition-colors disabled:opacity-60">
                        ✓ Complete
                      </button>
                    )}
                    {(intern.status === "Pending" || intern.status === "Active") && (
                      <button onClick={() => updateStatus(intern.intern_id, "Terminated")}
                        disabled={updating === intern.intern_id}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/20 transition-colors disabled:opacity-60">
                        ✕ Terminate
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Start Internship modal */}
      {modal && (
        <StartInternshipModal
          candidate={modal}
          onClose={() => setModal(null)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
};

export default Interns
