import React, { useState, useEffect } from 'react'
import { positionAPI, skillAPI } from '../../services/api';
import { Card, SectionTitle, StatusPill } from '../../assets/Company/Shared_ui_atoms';
import { daysLeft, fmtDate, TYPE_CLS } from '../../assets/Company/Helpers';

const BLANK_FORM = {
  title:"", position_type:"Full-Time", location:"Phnom Penh",
  salary_min:"", salary_max:"", slots:"1", deadtime:"",
  department:"", description_post:"", status:"Active",
  skill_ids:[],
};

// ── Skill multi-select pill picker ─────────────────────────────────────────────
const SkillPicker = ({ allSkills, selectedIds, onChange, lCls }) => {
  const toggle = (id) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter(s => s !== id)
        : [...selectedIds, id]
    );
  };

  // Group by category
  const grouped = allSkills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="md:col-span-2">
      <label className={lCls}>Skills Required</label>
      {allSkills.length === 0 ? (
        <p className="text-xs text-slate-600 font-mono">No skills in database yet.</p>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([cat, skills]) => (
            <div key={cat}>
              <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-1.5">{cat}</div>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => {
                  const active = selectedIds.includes(s.skill_id);
                  return (
                    <button
                      key={s.skill_id}
                      type="button"
                      onClick={() => toggle(s.skill_id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                        active
                          ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
                          : "bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      {active && <span className="mr-1">✓</span>}{s.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedIds.length > 0 && (
        <p className="text-[10px] text-orange-400 font-mono mt-2">{selectedIds.length} skill{selectedIds.length !== 1 ? "s" : ""} selected</p>
      )}
    </div>
  );
};

// ── Reusable position form fields ──────────────────────────────────────────────
const PositionForm = ({ form, upd, iCls, lCls, allSkills }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <div className="md:col-span-2">
      <label className={lCls}>Position Title *</label>
      <input value={form.title} onChange={e=>upd("title",e.target.value)} placeholder="e.g. Software Developer Intern" className={iCls} />
    </div>
    {[
      {k:"position_type", l:"Type",           t:"select", opts:["Full-Time","Part-Time","Remote","Hybrid"]},
      {k:"department",    l:"Department",      t:"text",   ph:"e.g. Engineering"},
      {k:"location",      l:"Location *",      t:"text",   ph:"e.g. Phnom Penh"},
      {k:"slots",         l:"Slots",           t:"number", ph:"e.g. 3"},
      {k:"salary_min",    l:"Salary Min ($)",  t:"number", ph:"e.g. 300"},
      {k:"salary_max",    l:"Salary Max ($)",  t:"number", ph:"e.g. 500"},
      {k:"deadtime",      l:"Deadline",        t:"date"},
      {k:"status",        l:"Status",          t:"select", opts:["Active","Draft","Closed"]},
    ].map(({k,l,t,opts,ph}) => (
      <div key={k}>
        <label className={lCls}>{l}</label>
        {t==="select"
          ? <select value={form[k]} onChange={e=>upd(k,e.target.value)} className={iCls}>
              {(opts||[]).map(o=><option key={o} value={o}>{o}</option>)}
            </select>
          : <input type={t} value={form[k]} onChange={e=>upd(k,e.target.value)} placeholder={ph} className={iCls} />
        }
      </div>
    ))}
    <div className="md:col-span-2">
      <label className={lCls}>Description</label>
      <textarea value={form.description_post} onChange={e=>upd("description_post",e.target.value)}
        rows={3} placeholder="Describe the role and responsibilities..." className={`${iCls} resize-none`} />
    </div>
    <SkillPicker
      allSkills={allSkills}
      selectedIds={form.skill_ids || []}
      onChange={ids => upd("skill_ids", ids)}
      lCls={lCls}
    />
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const Positions = ({ positions = [], setPositions }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);   // position being edited
  const [filter, setFilter]         = useState("All");

  const [createForm, setCreateForm] = useState(BLANK_FORM);
  const [editForm,   setEditForm]   = useState(BLANK_FORM);

  const [submitting, setSubmitting] = useState(false);
  const [formError,  setFormError]  = useState(null);
  const [allSkills,  setAllSkills]  = useState([]);

  useEffect(() => {
    skillAPI.list().then(data => setAllSkills(data || [])).catch(() => {});
  }, []);

  const updCreate = (k,v) => setCreateForm(p=>({...p,[k]:v}));
  const updEdit   = (k,v) => setEditForm(p=>({...p,[k]:v}));

  const filtered = positions.filter(p => filter==="All" || p.status===filter);

  const iCls = "w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500/60 transition-colors font-mono";
  const lCls = "block text-[10px] font-black text-slate-600 tracking-widest uppercase mb-2";

  // ── Create ──────────────────────────────────────────────────────────────────
  const handlePost = async () => {
    if (!createForm.title || !createForm.location) {
      setFormError("Title and Location are required."); return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const payload = {
        title:            createForm.title,
        description_post: createForm.description_post || undefined,
        location:         createForm.location,
        department:       createForm.department || undefined,
        salary_min:       createForm.salary_min ? parseFloat(createForm.salary_min) : undefined,
        salary_max:       createForm.salary_max ? parseFloat(createForm.salary_max) : undefined,
        position_type:    createForm.position_type,
        deadtime:         createForm.deadtime || undefined,
        slots:            parseInt(createForm.slots) || 1,
        status:           createForm.status,   // ← was missing before!
        skill_ids:        createForm.skill_ids || [],
      };
      const created = await positionAPI.create(payload);
      setPositions(p => [...p, adapt(created)]);
      setShowCreate(false);
      setCreateForm(BLANK_FORM);
    } catch(e) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Edit ────────────────────────────────────────────────────────────────────
  const openEdit = (pos) => {
    setEditTarget(pos);
    // Map skill names back to IDs using allSkills lookup
    const currentSkillIds = (pos.skills || [])
      .map(name => allSkills.find(s => s.name === name)?.skill_id)
      .filter(Boolean);
    setEditForm({
      title:            pos.title,
      position_type:    pos.type,
      location:         pos.location,
      salary_min:       pos.salary_min || "",
      salary_max:       pos.salary_max || "",
      slots:            String(pos.slots),
      deadtime:         pos.deadline || "",
      department:       pos.department || "",
      description_post: pos.description || "",
      status:           pos.status,
      skill_ids:        currentSkillIds,
    });
    setFormError(null);
  };

  const handleEdit = async () => {
    if (!editForm.title || !editForm.location) {
      setFormError("Title and Location are required."); return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const payload = {
        title:            editForm.title,
        description_post: editForm.description_post || undefined,
        location:         editForm.location,
        department:       editForm.department || undefined,
        salary_min:       editForm.salary_min ? parseFloat(editForm.salary_min) : undefined,
        salary_max:       editForm.salary_max ? parseFloat(editForm.salary_max) : undefined,
        position_type:    editForm.position_type,
        deadtime:         editForm.deadtime || undefined,
        slots:            parseInt(editForm.slots) || 1,
        status:           editForm.status,
        skill_ids:        editForm.skill_ids || [],
      };
      const updated = await positionAPI.update(editTarget.intern_position_id, payload);
      setPositions(p => p.map(pos =>
        pos.intern_position_id === editTarget.intern_position_id ? adapt(updated) : pos
      ));
      setEditTarget(null);
    } catch(e) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <SectionTitle>Internship Positions</SectionTitle>
          <p className="text-xs text-slate-600 font-mono mt-0.5">
            {positions.length} total · {positions.filter(p=>p.status==="Active").length} active
          </p>
        </div>
        <button onClick={() => { setShowCreate(true); setFormError(null); }}
          className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-sm font-black transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-orange-500/20"
          style={{fontFamily:"'Syne',sans-serif"}}>
          + Post Position
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-slate-800">
        {["All","Active","Draft","Closed"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all -mb-px ${filter===f?"border-orange-500 text-orange-400":"border-transparent text-slate-600 hover:text-slate-400"}`}
            style={{fontFamily:"'Syne',sans-serif"}}>
            {f} <span className="opacity-50 ml-1">({f==="All"?positions.length:positions.filter(p=>p.status===f).length})</span>
          </button>
        ))}
      </div>

      {/* Position cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-3xl mb-3">◈</div>
          <p className="text-slate-500 text-sm">
            {positions.length === 0 ? "No positions yet — post your first internship!" : "No positions match this filter"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(pos => {
            const fillPct = pos.slots > 0 ? Math.round((pos.filled/pos.slots)*100) : 0;
            return (
              <Card key={pos.position_id} className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-black text-slate-200 text-sm" style={{fontFamily:"'Syne',sans-serif"}}>{pos.title}</h3>
                      <StatusPill status={pos.status} />
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_CLS[pos.type]||"bg-slate-500/10 text-slate-400"}`}>{pos.type}</span>
                    </div>
                    {pos.description && <p className="text-xs text-slate-500 mb-3 leading-relaxed line-clamp-2">{pos.description}</p>}
                    {pos.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {pos.skills.map(skill => (
                          <span key={skill} className="px-2 py-0.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        {l:"Department", v:pos.department||"—"},
                        {l:"Location",   v:pos.location},
                        {l:"Salary",     v:pos.salary_min||pos.salary_max ? `$${pos.salary_min}–${pos.salary_max}/mo` : "Negotiable"},
                        {l:"Deadline",   v:pos.deadline?fmtDate(pos.deadline):"Open"},
                      ].map(({l,v}) => (
                        <div key={l}>
                          <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-1">{l}</div>
                          <div className="text-xs text-slate-300 font-mono">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right space-y-3 min-w-[110px]">
                    <div>
                      <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-1">SLOTS FILLED</div>
                      <div className="text-lg font-black text-slate-200" style={{fontFamily:"'Syne',sans-serif"}}>
                        {pos.filled}<span className="text-slate-600 text-sm">/{pos.slots}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-800 mt-1.5 w-24 ml-auto">
                        <div className="h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all" style={{width:`${fillPct}%`}} />
                      </div>
                    </div>
                    {pos.status==="Active" && pos.deadline &&
                      <div className="text-[10px] text-amber-400 font-mono">{daysLeft(pos.deadline)}d remaining</div>
                    }
                    {/* Edit button */}
                    <button onClick={() => openEdit(pos)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-orange-400 hover:border-orange-500/40 text-[11px] font-bold transition-all"
                      style={{fontFamily:"'Syne',sans-serif"}}>
                      ✎ Edit
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Create Modal ── */}
      {showCreate && (
        <Modal title="Post New Position" subtitle="Fill in details for the internship opening"
          onClose={() => { setShowCreate(false); setFormError(null); }}
          onSubmit={handlePost} submitLabel="Post Position →" submitting={submitting} formError={formError}>
          <PositionForm form={createForm} upd={updCreate} iCls={iCls} lCls={lCls} allSkills={allSkills} />
        </Modal>
      )}

      {/* ── Edit Modal ── */}
      {editTarget && (
        <Modal title="Edit Position" subtitle={`Editing: ${editTarget.title}`}
          onClose={() => { setEditTarget(null); setFormError(null); }}
          onSubmit={handleEdit} submitLabel="Save Changes" submitting={submitting} formError={formError}>
          <PositionForm form={editForm} upd={updEdit} iCls={iCls} lCls={lCls} allSkills={allSkills} />
        </Modal>
      )}
    </div>
  );
};

// ── Shared modal shell ─────────────────────────────────────────────────────────
const Modal = ({ title, subtitle, onClose, onSubmit, submitLabel, submitting, formError, children }) => (
  <div className="fixed inset-0 z-50 bg-[#07090f]/90 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
        <div>
          <h2 className="font-black text-white text-base" style={{fontFamily:"'Syne',sans-serif"}}>{title}</h2>
          <p className="text-xs text-slate-600 font-mono mt-0.5">{subtitle}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors">✕</button>
      </div>
      <div className="p-6 space-y-5">
        {children}
        {formError && <p className="text-xs text-red-400 font-mono">{formError}</p>}
      </div>
      <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
        <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:border-slate-600 transition-colors">Cancel</button>
        <button onClick={onSubmit} disabled={submitting}
          className="px-8 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-sm font-black transition-all hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 disabled:opacity-60"
          style={{fontFamily:"'Syne',sans-serif"}}>
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </div>
  </div>
);

// ── Adapter (keeps shape consistent with Rootapp's adaptPosition) ──────────────
function adapt(p) {
  function initials(str) { return (str||"??").split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase(); }
  const company = p.company_name || "";
  return {
    position_id:        `POS-${p.intern_position_id}`,
    intern_position_id: p.intern_position_id,
    company_id:         p.company_id,
    title:              p.title,
    type:               p.position_type,
    location:           p.location,
    salary_min:         p.salary_min ? Math.round(Number(p.salary_min)) : 0,
    salary_max:         p.salary_max ? Math.round(Number(p.salary_max)) : 0,
    slots:              p.slots,
    filled:             p.filled_slots ?? 0,
    deadline:           p.deadtime,
    posted:             p.posted_date,
    status:             p.status,
    description:        p.description_post || "",
    department:         p.department || "",
    skills:             p.skills || [],
    logo:               initials(company),
  };
}

export default Positions
