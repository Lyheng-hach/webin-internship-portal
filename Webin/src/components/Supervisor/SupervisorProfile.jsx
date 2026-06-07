import React, { useState, useEffect } from 'react'
import { supervisorAPI, universityAPI } from '../../services/api';
import { Card, SectionTitle } from '../../assets/Supervisor/Share_atom_UI_supervisor';

const POSITIONS = ["Lecturer", "Senior_Lecturer", "Associate_Professor", "Professor", "Advisor"];
const POSITION_LABELS = {
  "Lecturer":             "Lecturer",
  "Senior_Lecturer":      "Senior Lecturer",
  "Associate_Professor":  "Associate Professor",
  "Professor":            "Professor",
  "Advisor":              "Advisor",
};

const EMPTY = {
  name: "", phone: "", department: "", position: "Lecturer",
  university_id: "", specialization: "", office: "", office_hours: "",
};

// ── SupervisorProfile ──────────────────────────────────────────────────────────
const SupervisorProfile = ({ supervisor = null }) => {
  // When no profile, start in edit/create mode immediately
  const [editing, setEditing]     = useState(!supervisor);
  const [form, setForm]           = useState(supervisor
    ? {
        name:           supervisor.name          || "",
        phone:          supervisor.phone         || "",
        department:     supervisor.department    || "",
        // position stored as "Senior Lecturer" (spaces) after adapt — convert back to underscore for select value
        position:       (supervisor.position||"Lecturer").replace(/ /g,"_"),
        university_id:  supervisor.university_id || "",
        specialization: supervisor.specialization|| "",
        office:         supervisor.office        || "",
        office_hours:   supervisor.office_hours  || "",
      }
    : EMPTY
  );
  const [universities, setUniversities] = useState([]);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [saveError, setSaveError] = useState(null);

  const upd = (k, v) => setForm(p => ({...p, [k]: v}));

  // Load universities for the dropdown
  useEffect(() => {
    universityAPI.list().then(data => setUniversities(data || [])).catch(() => {});
  }, []);

  // If parent passes a profile after first load (e.g. after creation), sync form
  useEffect(() => {
    if (supervisor) {
      setForm({
        name:           supervisor.name          || "",
        phone:          supervisor.phone         || "",
        department:     supervisor.department    || "",
        position:       (supervisor.position||"Lecturer").replace(/ /g,"_"),
        university_id:  supervisor.university_id || "",
        specialization: supervisor.specialization|| "",
        office:         supervisor.office        || "",
        office_hours:   supervisor.office_hours  || "",
      });
      setEditing(false);
    }
  }, [supervisor]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      if (supervisor) {
        // Profile exists — update editable fields only (PUT)
        await supervisorAPI.updateProfile({
          phone:          form.phone          || undefined,
          department:     form.department     || undefined,
          specialization: form.specialization || undefined,
          office:         form.office         || undefined,
          office_hours:   form.office_hours   || undefined,
        });
      } else {
        // No profile — create (POST) — all fields required
        if (!form.name || !form.phone || !form.department || !form.university_id) {
          setSaveError("Name, Phone, Department and University are required."); return;
        }
        await supervisorAPI.createProfile({
          name:           form.name,
          phone:          form.phone,
          department:     form.department,
          position:       form.position,
          university_id:  Number(form.university_id),
          specialization: form.specialization || undefined,
          office:         form.office         || undefined,
          office_hours:   form.office_hours   || undefined,
        });
      }
      setSaved(true);
      setTimeout(() => { setSaved(false); setEditing(false); }, 1100);
    } catch(e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const iCls = "w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/60 transition-colors font-mono disabled:opacity-40 disabled:cursor-not-allowed";
  const lCls = "block text-[10px] font-black text-slate-600 tracking-widest uppercase mb-2";

  const nameInitials = form.name
    ? form.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()
    : "SV";

  // When creating, all fields are editable. When editing existing, only some are.
  const isCreate = !supervisor;
  const canEdit  = (field) => {
    if (!editing) return false;
    if (isCreate) return true;   // all fields editable during create
    // After creation: name, position, university are locked
    return !["name","position","university_id"].includes(field);
  };

  return (
    <div className="max-w-3xl space-y-5">

      {/* ── Header card ── */}
      {!isCreate && (
        <Card className="overflow-hidden">
          <div className="h-28 bg-gradient-to-br from-violet-950/50 via-[#07090f] to-indigo-950/30 relative overflow-hidden">
            {[...Array(8)].map((_,i) => (
              <div key={i} className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500/10 to-transparent"
                style={{left:`${i*14}%`,transform:"skewX(-20deg)"}} />
            ))}
          </div>
          <div className="px-6 pb-6 -mt-10 relative">
            <div className="flex items-end gap-4 mb-4 flex-wrap">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/40 to-indigo-500/30 border-4 border-[#07090f] outline outline-2 outline-violet-500/40 flex items-center justify-center text-2xl font-black text-violet-400 flex-shrink-0"
                style={{fontFamily:"'Syne',sans-serif"}}>{nameInitials}</div>
              <div className="pb-1 flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1 className="text-xl font-black text-white" style={{fontFamily:"'Syne',sans-serif"}}>{form.name || "—"}</h1>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/25">🎓 ACADEMIC</span>
                </div>
                <p className="text-xs text-slate-500 font-mono">{POSITION_LABELS[form.position] || form.position} · {form.department || "—"}</p>
              </div>
              <button onClick={() => { setEditing(e=>!e); setSaveError(null); }}
                className={`px-4 py-2 rounded-xl text-xs font-black border transition-all flex-shrink-0 ${editing?"bg-slate-800 border-slate-600 text-slate-300":"bg-violet-500/15 border-violet-500/35 text-violet-400 hover:bg-violet-500/25"}`}
                style={{fontFamily:"'Syne',sans-serif"}}>
                {editing ? "✕ Cancel" : "✎ Edit"}
              </button>
            </div>
            <div className="flex gap-2 flex-wrap text-[10px] font-mono text-slate-700">
              <span className="bg-slate-800 px-2 py-1 rounded-md border border-slate-700">{supervisor?.supervisor_id || "—"}</span>
            </div>
          </div>
        </Card>
      )}

      {/* ── Create-mode banner ── */}
      {isCreate && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-400 font-mono">
          ⚠ No supervisor profile found. Fill in the form below to create your profile.
        </div>
      )}

      {/* ── Professional info form ── */}
      <Card className="p-6 space-y-5">
        <SectionTitle>{isCreate ? "Create Your Profile" : "Professional Information"}</SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Name */}
          <div>
            <label className={lCls}>Full Name {isCreate && <span className="text-red-500 normal-case">*</span>}</label>
            <input
              type="text"
              disabled={!canEdit("name")}
              value={form.name}
              onChange={e => upd("name", e.target.value)}
              placeholder="e.g. Dr. Ahmad Bin Ali"
              className={iCls}
            />
          </div>

          {/* Phone */}
          <div>
            <label className={lCls}>Phone Number {isCreate && <span className="text-red-500 normal-case">*</span>}</label>
            <input
              type="text"
              disabled={!canEdit("phone")}
              value={form.phone}
              onChange={e => upd("phone", e.target.value)}
              placeholder="e.g. +60-12-3456789"
              className={iCls}
            />
          </div>

          {/* Department */}
          <div>
            <label className={lCls}>Department {isCreate && <span className="text-red-500 normal-case">*</span>}</label>
            <input
              type="text"
              disabled={!canEdit("department")}
              value={form.department}
              onChange={e => upd("department", e.target.value)}
              placeholder="e.g. Computer Science"
              className={iCls}
            />
          </div>

          {/* Position */}
          <div>
            <label className={lCls}>Position</label>
            <select
              disabled={!canEdit("position")}
              value={form.position}
              onChange={e => upd("position", e.target.value)}
              className={iCls}
            >
              {POSITIONS.map(p => (
                <option key={p} value={p}>{POSITION_LABELS[p]}</option>
              ))}
            </select>
          </div>

          {/* University */}
          <div>
            <label className={lCls}>University {isCreate && <span className="text-red-500 normal-case">*</span>}</label>
            {isCreate ? (
              <select
                disabled={!canEdit("university_id")}
                value={form.university_id}
                onChange={e => upd("university_id", e.target.value)}
                className={iCls}
              >
                <option value="">— Select University —</option>
                {universities.map(u => (
                  <option key={u.university_id} value={u.university_id}>{u.name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                disabled
                value={supervisor?.university || form.university_id ? `University #${form.university_id}` : "—"}
                className={iCls}
              />
            )}
          </div>

          {/* Specialization */}
          <div>
            <label className={lCls}>Specialization</label>
            <input
              type="text"
              disabled={!canEdit("specialization")}
              value={form.specialization}
              onChange={e => upd("specialization", e.target.value)}
              placeholder="e.g. Machine Learning"
              className={iCls}
            />
          </div>

          {/* Office */}
          <div>
            <label className={lCls}>Office Location</label>
            <input
              type="text"
              disabled={!canEdit("office")}
              value={form.office}
              onChange={e => upd("office", e.target.value)}
              placeholder="e.g. Block A, Room 203"
              className={iCls}
            />
          </div>

          {/* Office Hours */}
          <div>
            <label className={lCls}>Office Hours</label>
            <input
              type="text"
              disabled={!canEdit("office_hours")}
              value={form.office_hours}
              onChange={e => upd("office_hours", e.target.value)}
              placeholder="e.g. Mon–Wed 9am–12pm"
              className={iCls}
            />
          </div>

        </div>
      </Card>

      {/* ── Save / Create button ── */}
      {editing && (
        <div className="space-y-2">
          {saveError && <p className="text-xs text-red-400 font-mono text-right">✕ {saveError}</p>}
          <div className="flex justify-end gap-3">
            {!isCreate && (
              <button onClick={() => { setEditing(false); setSaveError(null); }}
                className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:border-slate-600 transition-colors">
                Cancel
              </button>
            )}
            <button onClick={handleSave} disabled={saving}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg ${
                saved
                  ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                  : "bg-violet-500 hover:bg-violet-400 text-white shadow-violet-500/20 hover:-translate-y-0.5 disabled:opacity-60"
              }`}
              style={{fontFamily:"'Syne',sans-serif"}}>
              {saved ? "✓ Saved!" : saving ? "Saving…" : isCreate ? "Create Profile →" : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupervisorProfile
