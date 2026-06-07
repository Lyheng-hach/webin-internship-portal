import React, { useState, useEffect } from 'react'
import { studentAPI, universityAPI } from '../../services/api';

const EMPTY_PROFILE = {
  id: "", name: "", email: "", phone: "", gender: "Male",
  dateOfBirth: "", nationality: "", maritalStatus: "Single", address: "",
  universityName: "", yearOfStudy: "Year 1", major: "", fieldOfStudy: "",
  skills: [], gpa: "", profilePicture: null,
};

// ── Create Profile Form (shown when no profile exists yet) ─────────────────────
const CreateProfileForm = ({ onCreated }) => {
  const [form, setForm] = useState({
    name: "", phone: "", gender: "M", date_of_birth: "",
    nationality: "", marital_status: "Single", address: "",
    year_of_study: "1", major: "", gpa: "",
    university_id: "",
  });
  const [universities, setUniversities] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    universityAPI.list().then(data => {
      setUniversities(data || []);
      if (data && data.length > 0) upd("university_id", String(data[0].university_id));
    }).catch(() => {}); // silently ignore if endpoint unreachable
  }, []);

  const iCls = "w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/60 transition-colors font-mono";
  const lCls = "block text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-2";

  const handleCreate = async () => {
    if (!form.name || !form.phone || !form.major || !form.address || !form.nationality || !form.date_of_birth) {
      setError("Please fill in all required fields."); return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        university_id:  parseInt(form.university_id) || 1,
        name:           form.name,
        gender:         form.gender,
        date_of_birth:  form.date_of_birth,
        nationality:    form.nationality,
        marital_status: form.marital_status,
        phone:          form.phone,
        address:        form.address,
        year_of_study:  parseInt(form.year_of_study) || 1,
        major:          form.major,
        gpa:            form.gpa ? parseFloat(form.gpa) : undefined,
      };
      const created = await studentAPI.createProfile(payload);
      onCreated(created);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-5">
      {/* Prompt card */}
      <div className="relative rounded-2xl border border-sky-500/25 bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-900 p-7 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-sky-500/8 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
            <span className="text-[10px] text-sky-400 font-black tracking-widest font-mono">FIRST TIME SETUP</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-1" style={{fontFamily:"'Syne',sans-serif"}}>
            Create Your Profile
          </h2>
          <p className="text-slate-400 text-sm">Fill in your details to get started on the WEBIN internship portal.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-6">
        <h2 className="text-sm font-bold text-slate-200" style={{fontFamily:"'Syne',sans-serif"}}>Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={lCls}>Full Name *</label>
            <input value={form.name} onChange={e=>upd("name",e.target.value)} placeholder="e.g. Dara Sopheak" className={iCls} />
          </div>
          <div>
            <label className={lCls}>Phone Number *</label>
            <input value={form.phone} onChange={e=>upd("phone",e.target.value)} placeholder="+855 12 345 678" className={iCls} />
          </div>
          <div>
            <label className={lCls}>Gender *</label>
            <select value={form.gender} onChange={e=>upd("gender",e.target.value)} className={iCls}>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div>
            <label className={lCls}>Date of Birth *</label>
            <input type="date" value={form.date_of_birth} onChange={e=>upd("date_of_birth",e.target.value)} className={iCls} />
          </div>
          <div>
            <label className={lCls}>Nationality *</label>
            <input value={form.nationality} onChange={e=>upd("nationality",e.target.value)} placeholder="e.g. Cambodian" className={iCls} />
          </div>
          <div>
            <label className={lCls}>Marital Status</label>
            <select value={form.marital_status} onChange={e=>upd("marital_status",e.target.value)} className={iCls}>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={lCls}>Address *</label>
            <input value={form.address} onChange={e=>upd("address",e.target.value)} placeholder="e.g. Phnom Penh, Cambodia" className={iCls} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
        <h2 className="text-sm font-bold text-slate-200" style={{fontFamily:"'Syne',sans-serif"}}>Academic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={lCls}>University *</label>
            {universities.length > 0 ? (
              <select value={form.university_id} onChange={e=>upd("university_id",e.target.value)} className={iCls}>
                {universities.map(u => (
                  <option key={u.university_id} value={u.university_id}>{u.name}</option>
                ))}
              </select>
            ) : (
              <div className={`${iCls} flex items-center gap-2 text-slate-500`}>
                <span className="w-3 h-3 rounded-full border-2 border-slate-500 border-t-transparent animate-spin flex-shrink-0" />
                Loading universities…
              </div>
            )}
          </div>
          <div>
            <label className={lCls}>Major *</label>
            <input value={form.major} onChange={e=>upd("major",e.target.value)} placeholder="e.g. Computer Science" className={iCls} />
          </div>
          <div>
            <label className={lCls}>Year of Study</label>
            <select value={form.year_of_study} onChange={e=>upd("year_of_study",e.target.value)} className={iCls}>
              {[1,2,3,4,5].map(y=><option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
          <div>
            <label className={lCls}>GPA (optional)</label>
            <input type="number" step="0.01" min="0" max="4" value={form.gpa} onChange={e=>upd("gpa",e.target.value)} placeholder="e.g. 3.8" className={iCls} />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400 font-mono">
          ✕ {error}
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={handleCreate} disabled={submitting}
          className="px-10 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black text-sm font-black transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-sky-500/20 disabled:opacity-60"
          style={{fontFamily:"'Syne',sans-serif"}}>
          {submitting ? "Creating…" : "Create Profile →"}
        </button>
      </div>
    </div>
  );
};

// ── View/Edit Profile (shown when profile exists) ──────────────────────────────
const ViewProfile = ({ profile, onSaved }) => {
  const initial = { ...EMPTY_PROFILE, ...profile };
  const [editing, setEditing]       = useState(false);
  const [form, setForm]             = useState(initial);
  const [saved, setSaved]           = useState(false);
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [universities, setUniversities] = useState([]);

  useEffect(() => { setForm({ ...EMPTY_PROFILE, ...profile }); }, [profile]);
  useEffect(() => {
    universityAPI.list().then(data => setUniversities(data || [])).catch(() => {});
  }, []);

  const upd       = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const addSkill  = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      upd("skills", [...form.skills, skillInput.trim()]);
      setSkillInput("");
    }
  };
  const removeSkill = (s) => upd("skills", form.skills.filter(sk => sk !== s));

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        university_id:  form.university_id ? parseInt(form.university_id) : undefined,
        name:           form.name           || undefined,
        gender:         form.gender         || undefined,
        date_of_birth:  form.date_of_birth  || undefined,
        nationality:    form.nationality    || undefined,
        marital_status: form.marital_status || undefined,
        phone:          form.phone          || undefined,
        address:        form.address        || undefined,
        year_of_study:  form.year_of_study  ? parseInt(form.year_of_study) : undefined,
        major:          form.major          || undefined,
        gpa:            form.gpa            ? parseFloat(form.gpa) : undefined,
      };
      const updated = await studentAPI.updateProfile(payload);
      if (onSaved) onSaved(updated);
      setSaved(true);
      setTimeout(() => { setSaved(false); setEditing(false); }, 1200);
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/60 transition-colors font-mono disabled:opacity-50";
  const labelCls = "block text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-2";
  const nameInitials = form.name ? form.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() : "??";

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header card */}
      <div className="relative rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="h-28 bg-gradient-to-br from-sky-950 via-slate-900 to-violet-950 relative overflow-hidden">
          {[...Array(8)].map((_,i) => (
            <div key={i} className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-sky-500/10 to-transparent" style={{left:`${i*14}%`,transform:"skewX(-20deg)"}} />
          ))}
        </div>
        <div className="px-6 pb-6 -mt-10 relative">
          <div className="flex items-end gap-4 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500/40 to-indigo-500/40 border-4 border-slate-900 outline outline-2 outline-sky-500/50 flex items-center justify-center text-2xl font-black text-sky-400 flex-shrink-0 shadow-xl"
              style={{fontFamily:"'Syne',sans-serif"}}>
              {nameInitials}
            </div>
            <div className="pb-1 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-black text-white" style={{fontFamily:"'Syne',sans-serif"}}>{form.name || "—"}</h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">STUDENT</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">{form.major || "—"} · Year {form.year_of_study} · {form.universityName}</p>
            </div>
            <button onClick={() => setEditing(e => !e)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border flex-shrink-0 ${editing ? "bg-slate-800 border-slate-600 text-slate-300" : "bg-sky-500/15 border-sky-500/35 text-sky-400 hover:bg-sky-500/25"}`}>
              {editing ? "✕ Cancel" : "✎ Edit Profile"}
            </button>
          </div>

          {form.gpa && (
            <div>
              <div className="flex justify-between text-[10px] mb-1.5">
                <span className="text-slate-500">GPA</span>
                <span className="text-sky-400 font-bold font-mono">{form.gpa} / 4.0</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-sky-500 to-violet-500" style={{width:`${Math.min(parseFloat(form.gpa)/4*100,100)}%`}} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Personal info */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-6">
        <h2 className="text-sm font-bold text-slate-200" style={{fontFamily:"'Syne',sans-serif"}}>Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelCls}>Full Name</label>
            <input disabled={!editing} value={form.name||""} onChange={e=>upd("name",e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Phone Number</label>
            <input disabled={!editing} value={form.phone||""} onChange={e=>upd("phone",e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Gender</label>
            <select disabled={!editing} value={form.gender||"M"} onChange={e=>upd("gender",e.target.value)} className={inputCls}>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Date of Birth</label>
            <input type="date" disabled={!editing} value={form.date_of_birth||""} onChange={e=>upd("date_of_birth",e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Nationality</label>
            <input disabled={!editing} value={form.nationality||""} onChange={e=>upd("nationality",e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Marital Status</label>
            <select disabled={!editing} value={form.marital_status||"Single"} onChange={e=>upd("marital_status",e.target.value)} className={inputCls}>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Address</label>
            <input disabled={!editing} value={form.address||""} onChange={e=>upd("address",e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Academic info */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
        <h2 className="text-sm font-bold text-slate-200" style={{fontFamily:"'Syne',sans-serif"}}>Academic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>University</label>
            {editing ? (
              <select value={form.university_id||""} onChange={e=>upd("university_id",e.target.value)} className={inputCls}>
                {universities.map(u => (
                  <option key={u.university_id} value={u.university_id}>{u.name}</option>
                ))}
              </select>
            ) : (
              <input disabled value={form.universityName||""} className={inputCls} />
            )}
          </div>
          <div>
            <label className={labelCls}>Major</label>
            <input disabled={!editing} value={form.major||""} onChange={e=>upd("major",e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Year of Study</label>
            <select disabled={!editing} value={form.year_of_study||1} onChange={e=>upd("year_of_study",e.target.value)} className={inputCls}>
              {[1,2,3,4,5].map(y=><option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>GPA</label>
            <input type="number" step="0.01" min="0" max="4" disabled={!editing} value={form.gpa||""} onChange={e=>upd("gpa",e.target.value)} placeholder="e.g. 3.8" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-200" style={{fontFamily:"'Syne',sans-serif"}}>Skills &amp; Qualifications</h2>
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {form.skills.length === 0
            ? <span className="text-xs text-slate-600 italic">No skills added yet</span>
            : form.skills.map(s => (
              <span key={s} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/25 font-mono">
                {s}
                {editing && <button onClick={() => removeSkill(s)} className="text-sky-600 hover:text-red-400 transition-colors text-xs">✕</button>}
              </span>
            ))
          }
        </div>
        {editing && (
          <div className="flex gap-2">
            <input value={skillInput} onChange={e=>setSkillInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addSkill()}
              placeholder="Add a skill…" className={`${inputCls} flex-1`} />
            <button onClick={addSkill} className="px-4 py-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 text-sm font-bold hover:bg-sky-500/25 transition-colors">+ Add</button>
          </div>
        )}
      </div>

      {editing && (
        <div className="space-y-2">
          {saveError && <p className="text-xs text-red-400 font-mono text-right">{saveError}</p>}
          <div className="flex justify-end gap-3">
            <button onClick={() => setEditing(false)} className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:border-slate-600 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg ${saved ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400" : "bg-sky-500 hover:bg-sky-400 text-black shadow-sky-500/20 hover:-translate-y-0.5 disabled:opacity-60"}`}>
              {saved ? "✓ Saved!" : saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Profile component ─────────────────────────────────────────────────────
const Profile = ({ profile = null, onProfileCreated }) => {
  if (!profile) {
    return <CreateProfileForm onCreated={onProfileCreated} />;
  }
  return <ViewProfile profile={profile} />;
};

export default Profile
