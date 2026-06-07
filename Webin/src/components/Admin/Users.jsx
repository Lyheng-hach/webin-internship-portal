import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";

const ROLE_STYLE = {
  student:    { color: "#38bdf8", bg: "#38bdf810", border: "#38bdf830" },
  company:    { color: "#fb923c", bg: "#fb923c10", border: "#fb923c30" },
  supervisor: { color: "#a78bfa", bg: "#a78bfa10", border: "#a78bfa30" },
  admin:      { color: "#34d399", bg: "#34d39910", border: "#34d39930" },
};

export default function Users() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");

  useEffect(() => {
    adminAPI.listUsers()
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => {
    const matchRole   = filter === "all" || u.role === filter;
    const matchSearch = u.user_email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  async function handleDelete(userId) {
    if (!confirm("Remove this user? This cannot be undone.")) return;
    try {
      await adminAPI.deleteUser(userId);
      setUsers(p => p.filter(u => u.user_id !== userId));
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by email…"
          className="flex-1 min-w-[200px] px-3 py-2 rounded-xl bg-[#0d1322] border border-slate-800 text-slate-300 text-xs placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 transition-colors" />
        {["all","student","company","supervisor","admin"].map(r => (
          <button key={r} onClick={() => setFilter(r)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all capitalize ${filter===r ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "border-slate-800 text-slate-500 hover:border-slate-700"}`}
            style={{fontFamily:"'Syne',sans-serif"}}>
            {r}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0d1322] border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800/80 flex items-center justify-between">
          <h2 className="text-xs font-black text-slate-400" style={{fontFamily:"'Syne',sans-serif"}}>
            {filtered.length} User{filtered.length !== 1 ? "s" : ""}
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-600">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-600">No users found</div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {filtered.map(u => {
              const s = ROLE_STYLE[u.role] || ROLE_STYLE.admin;
              return (
                <div key={u.user_id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-800/20 transition-colors">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{background: s.bg, border:`1px solid ${s.border}`, color: s.color}}>
                    {u.user_email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-300 truncate">{u.user_email}</div>
                    <div className="text-[10px] text-slate-600 font-mono">ID #{u.user_id}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold capitalize flex-shrink-0"
                    style={{color: s.color, background: s.bg, border:`1px solid ${s.border}`}}>
                    {u.role}
                  </span>
                  <button onClick={() => handleDelete(u.user_id)}
                    className="text-[10px] px-2 py-1 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
                    style={{fontFamily:"'Syne',sans-serif"}}>
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
