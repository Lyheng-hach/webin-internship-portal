import React, { useState } from 'react'
import { documentAPI } from '../../services/api';

const DOC_TYPES = ["Resume", "ID Card", "Transcript", "Offer Letter", "Certificate", "Other"];

const DOC_ICONS = {
  "Resume":       "📄",
  "ID Card":      "🪪",
  "Transcript":   "📋",
  "Offer Letter": "📩",
  "Certificate":  "🏅",
  "Other":        "📎",
};

const STATUS_STYLE = {
  Pending:  "bg-amber-500/10 border-amber-500/25 text-amber-400",
  Verified: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
  Rejected: "bg-red-500/10 border-red-500/25 text-red-400",
};

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ── Add / Edit modal ───────────────────────────────────────────────────────────
const DocModal = ({ existing, takenTypes, onClose, onSaved, defaultType = "" }) => {
  const isEdit = !!existing;
  const [form, setForm] = useState({
    document_type: existing?.document_type || defaultType,
    file_name:     existing?.file_name     || "",
    file_url:      existing?.file_url      || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const availableTypes = isEdit
    ? DOC_TYPES  // editing: can keep same type
    : DOC_TYPES.filter(t => !takenTypes.includes(t));

  const handleSubmit = async () => {
    if (!form.document_type) { setError("Select a document type."); return; }
    if (!form.file_name.trim()) { setError("Enter a file name."); return; }
    if (!form.file_url.trim()) { setError("Enter a document link (URL)."); return; }
    setSubmitting(true);
    setError(null);
    try {
      let result;
      if (isEdit) {
        result = await documentAPI.update(existing.document_id, {
          file_name: form.file_name.trim(),
          file_url:  form.file_url.trim(),
        });
      } else {
        result = await documentAPI.add({
          document_type: form.document_type,
          file_name:     form.file_name.trim(),
          file_url:      form.file_url.trim(),
        });
      }
      onSaved(result, isEdit);
      onClose();
    } catch(e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const iCls = "w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/60 transition-colors font-mono disabled:opacity-40";
  const lCls = "block text-[10px] font-black text-slate-600 tracking-widest uppercase mb-2";

  return (
    <div className="fixed inset-0 z-50 bg-[#07090f]/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <h2 className="font-black text-white text-base" style={{ fontFamily: "'Syne',sans-serif" }}>
            {isEdit ? "Update Document" : "Add Document"}
          </h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className={lCls}>Document Type *</label>
            <select disabled={isEdit} value={form.document_type} onChange={e => upd("document_type", e.target.value)} className={iCls}>
              <option value="">— Select type —</option>
              {availableTypes.map(t => <option key={t} value={t}>{DOC_ICONS[t]} {t}</option>)}
            </select>
          </div>
          <div>
            <label className={lCls}>File Name *</label>
            <input type="text" value={form.file_name} onChange={e => upd("file_name", e.target.value)}
              placeholder="e.g. Ahmad_Resume_2025.pdf"
              className={iCls} />
          </div>
          <div>
            <label className={lCls}>Document Link (URL) *</label>
            <input type="url" value={form.file_url} onChange={e => upd("file_url", e.target.value)}
              placeholder="e.g. https://drive.google.com/..."
              className={iCls} />
            <p className="text-[10px] text-slate-600 font-mono mt-1.5">
              Paste a shareable Google Drive, Dropbox, or OneDrive link.
            </p>
          </div>
          {error && <p className="text-xs text-red-400 font-mono">✕ {error}</p>}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800">
          <button onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:border-slate-600 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={submitting}
            className="px-7 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-black transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-500/20 disabled:opacity-60"
            style={{ fontFamily: "'Syne',sans-serif" }}>
            {submitting ? "Saving…" : isEdit ? "Update →" : "Add Document →"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Document card ──────────────────────────────────────────────────────────────
const DocCard = ({ doc, onEdit, onDelete, deleting }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-2xl flex-shrink-0">
      {DOC_ICONS[doc.document_type] || "📎"}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className="font-bold text-slate-200 text-sm">{doc.document_type}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[doc.status] || STATUS_STYLE.Pending}`}>
          {doc.status}
        </span>
      </div>
      <div className="text-xs text-slate-400 font-mono truncate">{doc.file_name}</div>
      <div className="text-[10px] text-slate-600 font-mono mt-1">Uploaded {fmtDate(doc.upload_date)}</div>
    </div>
    <div className="flex gap-2 flex-shrink-0">
      <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-bold border border-slate-700 transition-colors">
        View ↗
      </a>
      <button onClick={() => onEdit(doc)}
        className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-bold border border-sky-500/20 transition-colors">
        ✎ Edit
      </button>
      <button onClick={() => onDelete(doc.document_id)} disabled={deleting === doc.document_id}
        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/20 transition-colors disabled:opacity-50">
        {deleting === doc.document_id ? "…" : "✕"}
      </button>
    </div>
  </div>
);

// ── Empty slot card ────────────────────────────────────────────────────────────
const EmptySlot = ({ type, onAdd }) => (
  <div className="rounded-xl border border-dashed border-slate-800 p-4 flex items-center gap-4 opacity-50 hover:opacity-75 transition-opacity cursor-pointer group"
    onClick={() => onAdd(type)}>
    <div className="w-12 h-12 rounded-xl bg-slate-800/60 flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-slate-800 transition-colors">
      {DOC_ICONS[type]}
    </div>
    <div className="flex-1">
      <div className="text-sm font-bold text-slate-500">{type}</div>
      <div className="text-[11px] text-slate-700 font-mono mt-0.5">Not uploaded yet — click to add</div>
    </div>
    <div className="w-7 h-7 rounded-lg border border-slate-700 flex items-center justify-center text-slate-600 group-hover:text-slate-400 group-hover:border-slate-600 text-sm transition-colors">+</div>
  </div>
);

// ── Main Documents component ───────────────────────────────────────────────────
const Documents = ({ documents = [], setDocuments }) => {
  const [modal,    setModal]    = useState(null);   // null | "add" | doc object (edit)
  const [addType,  setAddType]  = useState("");
  const [deleting, setDeleting] = useState(null);

  const takenTypes = documents.map(d => d.document_type);

  const openAdd = (type = "") => {
    setAddType(type);
    setModal("add");
  };

  const handleSaved = (result, isEdit) => {
    if (isEdit) {
      setDocuments(p => p.map(d => d.document_id === result.document_id ? result : d));
    } else {
      setDocuments(p => [...p, result]);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await documentAPI.remove(id);
      setDocuments(p => p.filter(d => d.document_id !== id));
    } catch(e) {
      console.error("Delete failed:", e.message);
    } finally {
      setDeleting(null);
    }
  };

  const missingTypes = DOC_TYPES.filter(t => !takenTypes.includes(t) && t !== "Other");

  return (
    <div className="max-w-3xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-100" style={{ fontFamily: "'Syne',sans-serif" }}>My Documents</h2>
          <p className="text-xs text-slate-600 font-mono mt-0.5">{documents.length} document{documents.length !== 1 ? "s" : ""} uploaded</p>
        </div>
        <button onClick={() => openAdd()}
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-black transition-all hover:-translate-y-0.5 shadow-md shadow-sky-500/20"
          style={{ fontFamily: "'Syne',sans-serif" }}>
          + Add Document
        </button>
      </div>

      {/* Checklist hint */}
      {missingTypes.length > 0 && (
        <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 space-y-2">
          <div className="text-xs font-bold text-amber-400">📋 Documents to upload</div>
          <div className="flex flex-wrap gap-2">
            {missingTypes.map(t => (
              <button key={t} onClick={() => openAdd(t)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-400 text-[11px] font-mono hover:bg-amber-500/10 transition-colors">
                {DOC_ICONS[t]} {t} <span className="text-amber-600">+</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded documents */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <div className="text-[10px] text-slate-600 font-black tracking-widest uppercase">Uploaded</div>
          {documents.map(doc => (
            <DocCard
              key={doc.document_id}
              doc={doc}
              onEdit={d => setModal(d)}
              onDelete={handleDelete}
              deleting={deleting}
            />
          ))}
        </div>
      )}

      {/* Empty slots for missing types */}
      {documents.length === 0 && (
        <div className="space-y-3">
          <div className="text-[10px] text-slate-600 font-black tracking-widest uppercase">Required Documents</div>
          {DOC_TYPES.filter(t => t !== "Other").map(t => (
            <EmptySlot key={t} type={t} onAdd={openAdd} />
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <DocModal
          existing={modal === "add" ? null : modal}
          takenTypes={takenTypes}
          onClose={() => { setModal(null); setAddType(""); }}
          onSaved={handleSaved}
          defaultType={addType}
        />
      )}
    </div>
  );
};

export default Documents
