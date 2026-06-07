import React, { useState, useEffect } from 'react'
import { evaluationAPI } from '../../services/api';
import { Avatar, ProgressBar, ScoreRing, StatusPill } from '../../assets/Supervisor/Share_atom_UI_supervisor';
import { fmtDate } from '../../assets/Supervisor/Helpers';

const EVAL_TYPES = ["Midterm", "Final"];

const BLANK_FORM = { evaluation_type: "Midterm", technical_score: 70, communication_score: 70, problem_solving: 70, attitude_score: 70, feedback: "" };

const Evaluations = ({ myInterns = [] }) => {
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [evals, setEvals]                   = useState({});   // intern_id → []
  const [viewEval, setViewEval]             = useState(null);
  const [showForm, setShowForm]             = useState(false);
  const [form, setForm]                     = useState(BLANK_FORM);
  const [submitting, setSubmitting]         = useState(false);
  const [saved, setSaved]                   = useState(false);
  const [error, setError]                   = useState(null);

  const upd = (k, v) => setForm(p => ({...p, [k]: v}));

  // Fetch evaluations for all supervised interns
  useEffect(() => {
    myInterns.forEach(intern => {
      evaluationAPI.forIntern(intern.intern_id)
        .then(data => setEvals(p => ({...p, [intern.intern_id]: data || []})))
        .catch(() => {});
    });
  }, [myInterns]);

  const internEvals = selectedIntern ? (evals[selectedIntern.intern_id] || []) : [];

  const handleSelectIntern = (intern) => {
    const evList = evals[intern.intern_id] || [];
    setSelectedIntern(intern);
    setViewEval(evList[evList.length - 1] || null);
    setShowForm(evList.length === 0);   // auto-open form if no evals yet
    setError(null);
    setSaved(false);
  };

  const handleSubmit = async () => {
    if (!selectedIntern) return;
    setSubmitting(true);
    setError(null);
    try {
      const t = Number(form.technical_score);
      const c = Number(form.communication_score);
      const p = Number(form.problem_solving);
      const a = Number(form.attitude_score);
      const payload = {
        intern_id:            selectedIntern.intern_id,
        evaluation_type:      form.evaluation_type,
        technical_score:      t,
        communication_score:  c,
        problem_solving:      p,
        attitude_score:       a,
        total_score:          Math.round((t + c + p + a) / 4),
        feedback:             form.feedback || undefined,
      };
      const created = await evaluationAPI.submit(payload);
      setEvals(p => ({...p, [selectedIntern.intern_id]: [...(p[selectedIntern.intern_id] || []), created]}));
      setViewEval(created);
      setSaved(true);
      setTimeout(() => { setSaved(false); setShowForm(false); setForm(BLANK_FORM); }, 1200);
    } catch(e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const iCls = "w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/60 transition-colors font-mono";
  const lCls = "block text-[10px] font-black text-slate-600 tracking-widest uppercase mb-2";

  const totalSubmitted = Object.values(evals).flat().length;
  const pendingInterns = myInterns.filter(i => (evals[i.intern_id] || []).length === 0);
  const evaluatedInterns = myInterns.filter(i => (evals[i.intern_id] || []).length > 0);

  if (myInterns.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-3xl mb-3">📋</div>
          <p className="text-slate-500 text-sm">No students assigned yet.</p>
          <p className="text-slate-600 text-xs font-mono mt-1">Evaluations will appear once you supervise interns.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-5">

      {/* ── Left: intern list ── */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-emerald-500/20 p-4">
            <div className="text-2xl font-black text-emerald-400" style={{fontFamily:"'Syne',sans-serif"}}>{totalSubmitted}</div>
            <div className="text-xs text-slate-400 mt-1">Submitted</div>
          </div>
          <div className="rounded-xl border border-amber-500/20 p-4">
            <div className="text-2xl font-black text-amber-400" style={{fontFamily:"'Syne',sans-serif"}}>{pendingInterns.length}</div>
            <div className="text-xs text-slate-400 mt-1">Awaiting Evaluation</div>
          </div>
        </div>

        {/* Interns needing eval */}
        {pendingInterns.length > 0 && (
          <div>
            <p className="text-[10px] font-black text-amber-400 tracking-widest uppercase mb-3">⏰ Action Required</p>
            <div className="space-y-2">
              {pendingInterns.map(intern => (
                <div key={intern.intern_id}
                  onClick={() => handleSelectIntern(intern)}
                  className={`group rounded-xl border p-4 cursor-pointer transition-all duration-200 ${selectedIntern?.intern_id === intern.intern_id ? "border-amber-500/50 bg-amber-500/5" : "border-amber-500/20 hover:border-amber-500/40"}`}>
                  <div className="flex items-center gap-3">
                    <Avatar name={intern.student_name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-200 text-sm">{intern.student_name}</div>
                      <div className="text-[11px] text-slate-500">{intern.position_title} · {intern.department}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-500/10 border-amber-500/25 text-amber-400 flex-shrink-0">No Eval</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interns already evaluated */}
        {evaluatedInterns.length > 0 && (
          <div>
            <p className="text-[10px] font-black text-slate-600 tracking-widest uppercase mb-3">Evaluated</p>
            <div className="space-y-2">
              {evaluatedInterns.map(intern => {
                const internEvList = evals[intern.intern_id] || [];
                const latest = internEvList[internEvList.length - 1];
                const avg = latest
                  ? Math.round((latest.technical_score + latest.communication_score + latest.problem_solving + latest.attitude_score) / 4)
                  : 0;
                return (
                  <div key={intern.intern_id}
                    onClick={() => handleSelectIntern(intern)}
                    className={`group rounded-xl border p-4 cursor-pointer transition-all duration-200 ${selectedIntern?.intern_id === intern.intern_id ? "border-violet-500/50 bg-violet-500/5" : "border-slate-800 bg-slate-900/60 hover:border-slate-700"}`}>
                    <div className="flex items-center gap-4">
                      <Avatar name={intern.student_name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-200 text-sm">{intern.student_name}</div>
                        <div className="text-[11px] text-slate-500">{intern.position_title} · {latest?.eval_type}</div>
                        <div className="text-[10px] text-slate-600 font-mono mt-0.5">Submitted {fmtDate(latest?.submitted_at)}</div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-lg font-black text-violet-400" style={{fontFamily:"'Syne',sans-serif"}}>{avg}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-500/10 border-emerald-500/25 text-emerald-400">Submitted</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Right: detail / form panel ── */}
      {selectedIntern && (
        <div className="w-96 flex-shrink-0">
          <div className="sticky top-0 rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden max-h-[calc(100vh-7rem)] overflow-y-auto">
            <div className="h-1 bg-gradient-to-r from-violet-500 to-indigo-400" />
            <div className="p-5 space-y-5">

              {/* Student header */}
              <div className="flex items-start gap-3">
                <Avatar name={selectedIntern.student_name} />
                <div className="flex-1">
                  <h3 className="font-black text-white text-sm" style={{fontFamily:"'Syne',sans-serif"}}>{selectedIntern.student_name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{selectedIntern.position_title}</p>
                  <p className="text-[10px] text-violet-400 font-mono mt-0.5">{selectedIntern.department}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-800 border-slate-700 text-slate-500 flex-shrink-0">
                  {internEvals.length} eval{internEvals.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* View existing eval */}
              {viewEval && !showForm && (
                <>
                  <div className="flex items-center justify-center py-1">
                    <ScoreRing
                      score={viewEval.total_score ?? Math.round((viewEval.technical_score + viewEval.communication_score + viewEval.problem_solving + viewEval.attitude_score) / 4)}
                      size={100}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase">Score Breakdown — {viewEval.evaluation_type}</div>
                    {[
                      {l:"Technical Skills",      v: viewEval.technical_score},
                      {l:"Communication",          v: viewEval.communication_score},
                      {l:"Problem Solving",        v: viewEval.problem_solving},
                      {l:"Attitude & Work Ethic",  v: viewEval.attitude_score},
                    ].map(({l, v}) => (
                      <div key={l}>
                        <label className={lCls}>{l}</label>
                        <ProgressBar value={v} color="bg-gradient-to-r from-violet-500 to-indigo-400" />
                      </div>
                    ))}
                  </div>

                  {viewEval.feedback && (
                    <div>
                      <label className={lCls}>Supervisor Feedback</label>
                      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                        <p className="text-sm text-slate-300 italic leading-relaxed">"{viewEval.feedback}"</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-700 font-mono">Submitted {fmtDate(viewEval.submitted_at)}</p>
                    <button onClick={() => { setShowForm(true); setForm(BLANK_FORM); }}
                      className="px-4 py-1.5 text-xs rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/25 font-bold transition-colors">
                      + New Eval
                    </button>
                  </div>
                </>
              )}

              {/* Eval submission form */}
              {showForm && (
                <div className="space-y-4">
                  <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase">New Evaluation</div>

                  <div>
                    <label className={lCls}>Evaluation Type</label>
                    <select value={form.evaluation_type} onChange={e => upd("evaluation_type", e.target.value)} className={iCls}>
                      {EVAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {[
                    {k:"technical_score",      l:"Technical Skills"},
                    {k:"communication_score",  l:"Communication"},
                    {k:"problem_solving",      l:"Problem Solving"},
                    {k:"attitude_score",       l:"Attitude & Work Ethic"},
                  ].map(({k, l}) => (
                    <div key={k}>
                      <label className={lCls}>{l}</label>
                      <div className="flex items-center gap-3">
                        <input type="range" min="0" max="100" value={form[k] || 0}
                          onChange={e => upd(k, e.target.value)} className="flex-1 accent-violet-500" />
                        <span className="text-sm font-black text-violet-400 w-10 text-right font-mono">{form[k] || 0}</span>
                      </div>
                    </div>
                  ))}

                  <div>
                    <label className={lCls}>Feedback</label>
                    <textarea
                      value={form.feedback}
                      onChange={e => upd("feedback", e.target.value)}
                      rows={3}
                      placeholder="Write feedback about the student's performance…"
                      className={`${iCls} resize-none`}
                    />
                  </div>

                  {error && <p className="text-xs text-red-400 font-mono">✕ {error}</p>}

                  <div className="flex gap-2">
                    {viewEval && (
                      <button onClick={() => setShowForm(false)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-xs font-semibold hover:border-slate-600 transition-colors">
                        Cancel
                      </button>
                    )}
                    <button onClick={handleSubmit} disabled={submitting}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-200 ${
                        saved
                          ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                          : "bg-violet-500 hover:bg-violet-400 text-white shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 disabled:opacity-60"
                      }`}
                      style={{fontFamily:"'Syne',sans-serif"}}>
                      {saved ? "✓ Submitted!" : submitting ? "Submitting…" : "Submit Evaluation →"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Evaluations
