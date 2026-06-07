import React, { useState } from 'react'
import { Card, SectionTitle, StatusPill } from '../../assets/Company/Shared_ui_atoms';
import { interviewAPI } from '../../services/api';
import { fmtDate } from '../../assets/Company/Helpers';

const Interviews = ({ interviews = [], setInterviews, applications = [] }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ application_id:"", scheduled_at:"", type:"Online", location:"" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const upd = (k,v) => setForm(p=>({...p,[k]:v}));

  const iCls = "w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500/60 transition-colors font-mono";
  const lCls = "block text-[10px] font-black text-slate-600 tracking-widest uppercase mb-2";

  const updateStatus = async (id, status) => {
    try {
      await interviewAPI.updateStatus(id, status);
      setInterviews(p => p.map(iv => iv.interview_id === id ? { ...iv, status } : iv));
    } catch(e) {
      console.error("Failed to update interview status:", e.message);
    }
  };

  const handleSubmit = async () => {
    if (!form.application_id || !form.scheduled_at || !form.location) {
      setFormError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      // Find student_id from matched application
      const matchedApp = applications.find(a => String(a.application_id) === String(form.application_id));
      await interviewAPI.schedule({
        application_id:  parseInt(form.application_id),
        student_id:      matchedApp?.student_id || 0,
        scheduled_at:    form.scheduled_at,
        location:        form.location,
        interview_type:  form.type,
      });
      setShowForm(false);
      setForm({ application_id:"", scheduled_at:"", type:"Online", location:"" });
      // Reload interviews
      const fresh = await interviewAPI.myList();
      const appsMap = Object.fromEntries(applications.map(a => [a.application_id, a]));
      setInterviews((fresh || []).map(iv => ({
        interview_id:  iv.interview_id,
        application_id:`APP-${iv.application_id}`,
        student_name:  appsMap[iv.application_id]?.student_name || `Student #${iv.student_id}`,
        position:      appsMap[iv.application_id]?.position     || `App #${iv.application_id}`,
        scheduled_at:  iv.scheduled_at,
        type:          iv.interview_type,
        location:      iv.location,
        status:        iv.status,
        notes:         "",
      })));
    } catch(e) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fmtDateTime = (dt) => {
    if (!dt) return "—";
    try { return new Date(dt).toLocaleString("en-US", { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" }); }
    catch { return dt; }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <SectionTitle>Interview Management</SectionTitle>
          <p className="text-xs text-slate-600 font-mono mt-0.5">{interviews.length} interviews total</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-5 py-2.5 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 text-violet-400 text-sm font-black border border-violet-500/25 transition-all" style={{fontFamily:"'Syne',sans-serif"}}>
          + Schedule Interview
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {l:"Scheduled",c:interviews.filter(i=>i.status==="Scheduled").length,  color:"text-violet-400", bg:"border-violet-500/20"},
          {l:"Completed",c:interviews.filter(i=>i.status==="Completed").length,  color:"text-indigo-400", bg:"border-indigo-500/20"},
          {l:"Cancelled",c:interviews.filter(i=>i.status==="Cancelled").length,  color:"text-red-400",    bg:"border-red-500/20"},
        ].map(s=>(
          <div key={s.l} className={`rounded-xl border p-4 ${s.bg}`}>
            <div className={`text-2xl font-black ${s.color}`} style={{fontFamily:"'Syne',sans-serif"}}>{s.c}</div>
            <div className="text-xs text-slate-400 mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Schedule form */}
      {showForm && (
        <Card className="p-5 border-violet-500/20">
          <div className="flex items-center justify-between mb-5">
            <SectionTitle>Schedule New Interview</SectionTitle>
            <button onClick={()=>{setShowForm(false);setFormError(null);}} className="text-slate-500 hover:text-slate-300 text-lg transition-colors">✕</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={lCls}>Application ID *</label>
              <select value={form.application_id} onChange={e=>upd("application_id",e.target.value)} className={iCls}>
                <option value="">Select accepted application…</option>
                {applications.filter(a=>a.status==="Accepted").map(a=>(
                  <option key={a.application_id} value={a.application_id}>#{a.application_id} — {a.student_name} ({a.position})</option>
                ))}
              </select>
            </div>
            <div>
              <label className={lCls}>Scheduled At *</label>
              <input type="datetime-local" value={form.scheduled_at} onChange={e=>upd("scheduled_at",e.target.value)} className={iCls} />
            </div>
            <div>
              <label className={lCls}>Interview Type</label>
              <select value={form.type} onChange={e=>upd("type",e.target.value)} className={iCls}>
                <option value="Online">Online</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>
            <div>
              <label className={lCls}>Location / Link *</label>
              <input placeholder="e.g. Google Meet / Office" value={form.location} onChange={e=>upd("location",e.target.value)} className={iCls} />
            </div>
          </div>
          {formError && <p className="text-xs text-red-400 font-mono mt-3">{formError}</p>}
          <div className="flex justify-end gap-3 mt-5">
            <button onClick={()=>{setShowForm(false);setFormError(null);}} className="px-5 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:border-slate-600 transition-colors">Cancel</button>
            <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-sm font-black transition-all disabled:opacity-60" style={{fontFamily:"'Syne',sans-serif"}}>
              {submitting ? "Scheduling…" : "Schedule →"}
            </button>
          </div>
        </Card>
      )}

      {/* Interview cards */}
      {interviews.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-3xl mb-3">🎤</div>
          <p className="text-slate-500 text-sm">No interviews scheduled yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {interviews.map(iv => (
            <Card key={iv.interview_id} className="p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400 text-base flex-shrink-0">🎤</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-slate-200 text-sm">{iv.student_name}</span>
                      <StatusPill status={iv.status} />
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">{iv.type}</span>
                    </div>
                    <div className="text-xs text-orange-400 mb-2">{iv.position}</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        {l:"Scheduled", v:fmtDateTime(iv.scheduled_at)},
                        {l:"Location",  v:iv.location},
                        {l:"Ref",       v:iv.application_id},
                      ].map(({l,v})=>(
                        <div key={l}>
                          <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-1">{l}</div>
                          <div className="text-[11px] text-slate-300 font-mono">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {iv.status === "Scheduled" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={()=>updateStatus(iv.interview_id,"Completed")} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/20 transition-colors">✓ Complete</button>
                    <button onClick={()=>updateStatus(iv.interview_id,"Cancelled")} className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/20 transition-colors">✕ Cancel</button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Interviews
