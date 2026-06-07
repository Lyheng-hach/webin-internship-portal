import React, { useState, useEffect } from 'react'
import { companyAPI } from '../../services/api';
import { Card, SectionTitle } from '../../assets/Company/Shared_ui_atoms';

const EMPTY = {
  company_id:"", name:"", industry:"", phone:"", address:"", website:"", description:"", logo:"CO", verified:false, size:"", founded:"",
};

// ── Create Profile Form ────────────────────────────────────────────────────────
const CreateCompanyForm = ({ onCreated }) => {
  const [form, setForm] = useState({
    name:"", industry:"", phone:"", address:"", website:"", description_company:"",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const upd = (k,v) => setForm(p=>({...p,[k]:v}));

  const iCls = "w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500/60 transition-colors font-mono";
  const lCls = "block text-[10px] font-black text-slate-600 tracking-widest uppercase mb-2";

  const handleCreate = async () => {
    if (!form.name || !form.industry || !form.phone || !form.address) {
      setError("Please fill in all required fields."); return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const created = await companyAPI.createProfile({
        name:                form.name,
        industry:            form.industry,
        phone:               form.phone,
        address:             form.address,
        website:             form.website || undefined,
        description_company: form.description_company || undefined,
      });
      onCreated(created);
    } catch(e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-5">
      {/* Prompt card */}
      <div className="relative rounded-2xl border border-orange-500/25 bg-gradient-to-br from-orange-950/30 via-slate-900 to-slate-900 p-7 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-orange-500/8 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse shadow-[0_0_8px_#f97316]" />
            <span className="text-[10px] text-orange-400 font-black tracking-widest font-mono">FIRST TIME SETUP</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-1" style={{fontFamily:"'Syne',sans-serif"}}>
            Create Company Profile
          </h2>
          <p className="text-slate-400 text-sm">Set up your company profile to start posting internship positions.</p>
        </div>
      </div>

      <Card className="p-6 space-y-5">
        <SectionTitle>Company Details</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={lCls}>Company Name *</label>
            <input value={form.name} onChange={e=>upd("name",e.target.value)} placeholder="e.g. TechCorp Ltd." className={iCls} />
          </div>
          <div>
            <label className={lCls}>Industry *</label>
            <input value={form.industry} onChange={e=>upd("industry",e.target.value)} placeholder="e.g. Software, Finance…" className={iCls} />
          </div>
          <div>
            <label className={lCls}>Phone Number *</label>
            <input value={form.phone} onChange={e=>upd("phone",e.target.value)} placeholder="+855 12 345 678" className={iCls} />
          </div>
          <div className="md:col-span-2">
            <label className={lCls}>Address *</label>
            <input value={form.address} onChange={e=>upd("address",e.target.value)} placeholder="e.g. Phnom Penh, Cambodia" className={iCls} />
          </div>
          <div className="md:col-span-2">
            <label className={lCls}>Website URL</label>
            <input value={form.website} onChange={e=>upd("website",e.target.value)} placeholder="https://example.com" className={iCls} />
          </div>
          <div className="md:col-span-2">
            <label className={lCls}>Company Description</label>
            <textarea value={form.description_company} onChange={e=>upd("description_company",e.target.value)}
              rows={4} className={`${iCls} resize-none`} placeholder="Describe your company…" />
          </div>
        </div>
      </Card>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400 font-mono">
          ✕ {error}
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={handleCreate} disabled={submitting}
          className="px-10 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-sm font-black transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 disabled:opacity-60"
          style={{fontFamily:"'Syne',sans-serif"}}>
          {submitting ? "Creating…" : "Create Profile →"}
        </button>
      </div>
    </div>
  );
};

// ── View / Edit Profile ────────────────────────────────────────────────────────
const ViewProfile = ({ company }) => {
  const initial = { ...EMPTY, ...company };
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState(initial);
  const [saved, setSaved]     = useState(false);
  const [saving, setSaving]   = useState(false);
  const [saveError, setSaveError] = useState(null);
  const upd = (k,v) => setForm(p=>({...p,[k]:v}));

  useEffect(() => { setForm({ ...EMPTY, ...company }); }, [company]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await companyAPI.updateProfile({
        industry:            form.industry,
        phone:               form.phone,
        address:             form.address,
        website:             form.website || undefined,
        description_company: form.description || undefined,
      });
      setSaved(true);
      setTimeout(()=>{setSaved(false);setEditing(false);},1100);
    } catch(e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const iCls = "w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500/60 transition-colors font-mono disabled:opacity-50";
  const lCls = "block text-[10px] font-black text-slate-600 tracking-widest uppercase mb-2";

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header */}
      <Card className="overflow-hidden">
        <div className="h-28 bg-gradient-to-br from-orange-950/40 via-[#07090f] to-slate-900 relative overflow-hidden">
          {[...Array(8)].map((_,i)=>(
            <div key={i} className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-orange-500/10 to-transparent" style={{left:`${i*14}%`,transform:"skewX(-20deg)"}}/>
          ))}
        </div>
        <div className="px-6 pb-6 -mt-10 relative">
          <div className="flex items-end gap-4 mb-4 flex-wrap">
            <div className="w-20 h-20 rounded-2xl bg-orange-500/20 border-4 border-[#07090f] outline outline-2 outline-orange-500/40 flex items-center justify-center text-2xl font-black text-orange-400 flex-shrink-0"
              style={{fontFamily:"'Syne',sans-serif"}}>{form.logo}</div>
            <div className="pb-1 flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-xl font-black text-white" style={{fontFamily:"'Syne',sans-serif"}}>{form.name || "—"}</h1>
                {form.verified
                  ? <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">✓ VERIFIED</span>
                  : <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25">PENDING VERIFICATION</span>
                }
              </div>
              <p className="text-xs text-slate-500 font-mono">{form.industry || "—"}</p>
            </div>
            <button onClick={()=>setEditing(e=>!e)}
              className={`px-4 py-2 rounded-xl text-xs font-black border transition-all flex-shrink-0 ${editing?"bg-slate-800 border-slate-600 text-slate-300":"bg-orange-500/15 border-orange-500/35 text-orange-400 hover:bg-orange-500/25"}`}
              style={{fontFamily:"'Syne',sans-serif"}}>
              {editing?"✕ Cancel":"✎ Edit Profile"}
            </button>
          </div>
          <div className="flex gap-2 flex-wrap text-[10px] font-mono text-slate-700">
            <span className="bg-slate-800 px-2 py-1 rounded-md border border-slate-700">{form.company_id || "—"}</span>
          </div>
        </div>
      </Card>

      {/* Details */}
      <Card className="p-6 space-y-5">
        <SectionTitle>Company Details</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {k:"name",     l:"Company Name",  t:"text",  editable:false},  // name is set at creation only
            {k:"industry", l:"Industry",       t:"text",  editable:true},
            {k:"phone",    l:"Phone Number",  t:"text",  editable:true},
            {k:"address",  l:"Address",        t:"text",  editable:true},
            {k:"website",  l:"Website URL",   t:"text",  editable:true},
          ].map(({k,l,t,editable})=>(
            <div key={k} className={k==="address"||k==="website"?"md:col-span-2":""}>
              <label className={lCls}>{l}{!editable && editing && <span className="ml-1 text-slate-700">(cannot change)</span>}</label>
              <input type={t} disabled={!editing || !editable} value={form[k]||""} onChange={e=>upd(k,e.target.value)} className={iCls} />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className={lCls}>Company Description</label>
            <textarea disabled={!editing} value={form.description||""} onChange={e=>upd("description",e.target.value)}
              rows={4} className={`${iCls} resize-none`} placeholder="Describe your company…" />
          </div>
        </div>
      </Card>

      {editing && (
        <div className="space-y-2">
          {saveError && <p className="text-xs text-red-400 font-mono text-right">{saveError}</p>}
          <div className="flex justify-end gap-3">
            <button onClick={()=>setEditing(false)} className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:border-slate-600 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg ${saved?"bg-emerald-500/15 border border-emerald-500/30 text-emerald-400":"bg-orange-500 hover:bg-orange-400 text-black shadow-orange-500/20 hover:-translate-y-0.5 disabled:opacity-60"}`}>
              {saved?"✓ Saved!":saving?"Saving…":"Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main export ────────────────────────────────────────────────────────────────
const CompanyProfile = ({ company = null, onProfileCreated }) => {
  if (!company) return <CreateCompanyForm onCreated={onProfileCreated} />;
  return <ViewProfile company={company} />;
};

export default CompanyProfile
