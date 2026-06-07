import { useState, useEffect } from "react";
import { adminAPI, companyAPI } from "../../services/api";

const STATUS_STYLE = {
  Pending:  { color: "#fb923c", bg: "#fb923c10", border: "#fb923c30" },
  Verified: { color: "#34d399", bg: "#34d39910", border: "#34d39930" },
  Rejected: { color: "#f87171", bg: "#f8717110", border: "#f8717130" },
};

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    companyAPI.list()
      .then(setCompanies)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleVerify(id, status) {
    try {
      await adminAPI.verifyCompany(id, status);
      setCompanies(p => p.map(c => c.company_id === id ? { ...c, verified_status: status } : c));
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#0d1322] border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800/80">
          <h2 className="text-xs font-black text-slate-400" style={{fontFamily:"'Syne',sans-serif"}}>
            Company Verification — {companies.length} Total
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-600">Loading companies…</div>
        ) : companies.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-600">No companies registered yet</div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {companies.map(c => {
              const s = STATUS_STYLE[c.verified_status] || STATUS_STYLE.Pending;
              return (
                <div key={c.company_id} className="px-5 py-4 hover:bg-slate-800/20 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-slate-200" style={{fontFamily:"'Syne',sans-serif"}}>{c.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                          style={{color: s.color, background: s.bg, border:`1px solid ${s.border}`}}>
                          {c.verified_status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">{c.industry} · {c.address}</div>
                      {c.website && <div className="text-[10px] text-slate-700 mt-0.5">{c.website}</div>}
                    </div>
                    {c.verified_status === "Pending" && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => handleVerify(c.company_id, "Verified")}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                          style={{fontFamily:"'Syne',sans-serif"}}>Approve</button>
                        <button onClick={() => handleVerify(c.company_id, "Rejected")}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                          style={{fontFamily:"'Syne',sans-serif"}}>Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
