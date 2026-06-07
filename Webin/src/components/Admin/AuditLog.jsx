import { useState, useEffect, useMemo } from "react";
import { adminAPI } from "../../services/api";

// Colour-code actions
const ACTION_STYLE = {
  DELETE_USER:            "bg-red-500/15 text-red-400 border-red-500/25",
  UPDATE_VERIFY_STATUS:   "bg-violet-500/15 text-violet-400 border-violet-500/25",
  UPDATE:                 "bg-amber-500/15 text-amber-400 border-amber-500/25",
  CREATE:                 "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
};
function actionStyle(action = "") {
  for (const key of Object.keys(ACTION_STYLE)) {
    if (action.startsWith(key)) return ACTION_STYLE[key];
  }
  return "bg-slate-700/30 text-slate-400 border-slate-700";
}

function fmtDate(dt) {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })
    + " " + d.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit", second:"2-digit" });
}

const TABLE_LABELS = {
  Company:     "Company",
  UserAccount: "User",
  Student:     "Student",
  Supervisor:  "Supervisor",
  Application: "Application",
  InternInfo:  "Intern",
};

export default function AuditLog() {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [action,  setAction]  = useState("All");
  const [table,   setTable]   = useState("All");
  const [expanded, setExpanded] = useState(null);

  function fetchLogs() {
    setLoading(true);
    adminAPI.auditLogs()
      .then(data => setLogs(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchLogs(); }, []);

  // Unique filter options from data
  const actionOpts = useMemo(() => ["All", ...new Set(logs.map(l => l.action))], [logs]);
  const tableOpts  = useMemo(() => ["All", ...new Set(logs.map(l => l.target_table))], [logs]);

  const filtered = useMemo(() => logs.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.action.toLowerCase().includes(q)
      || l.target_table.toLowerCase().includes(q)
      || String(l.target_id || "").includes(q)
      || String(l.admin_id).includes(q)
      || (l.old_value || "").toLowerCase().includes(q)
      || (l.new_value || "").toLowerCase().includes(q);
    return matchSearch
      && (action === "All" || l.action === action)
      && (table  === "All" || l.target_table === table);
  }), [logs, search, action, table]);

  return (
    <div className="space-y-4">

      {/* Header bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs">◎</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search action, table, ID, value…"
            className="w-full pl-8 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 placeholder-slate-700 focus:outline-none focus:border-emerald-500/40 font-mono transition-colors"
          />
        </div>
        <select value={action} onChange={e => setAction(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/40 font-mono">
          {actionOpts.map(a => <option key={a} value={a}>{a === "All" ? "All Actions" : a}</option>)}
        </select>
        <select value={table} onChange={e => setTable(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/40 font-mono">
          {tableOpts.map(t => <option key={t} value={t}>{t === "All" ? "All Tables" : (TABLE_LABELS[t] || t)}</option>)}
        </select>
        <button onClick={fetchLogs}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all font-mono">
          ↻ Refresh
        </button>
        <div className="text-[10px] text-slate-700 font-mono flex-shrink-0">
          {filtered.length} / {logs.length} entries
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: "Total",   count: logs.length,                                                color: "text-slate-400 border-slate-700 bg-slate-800/40" },
          { label: "Deletes", count: logs.filter(l => l.action.startsWith("DELETE")).length,     color: "text-red-400 border-red-500/20 bg-red-500/8" },
          { label: "Updates", count: logs.filter(l => l.action.startsWith("UPDATE")).length,     color: "text-amber-400 border-amber-500/20 bg-amber-500/8" },
          { label: "Creates", count: logs.filter(l => l.action.startsWith("CREATE")).length,     color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/8" },
        ].map(s => (
          <div key={s.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono ${s.color}`}>
            <span className="font-black text-sm">{s.count}</span>
            <span className="text-[10px] opacity-70">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#0d1322] overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-[140px_1fr_100px_100px_24px] gap-4 px-5 py-2.5 border-b border-slate-800/80 bg-slate-900/40">
          {["Timestamp", "Action · Target", "Table", "Admin", ""].map((h, i) => (
            <div key={i} className="text-[9px] font-black text-slate-600 tracking-widest uppercase">{h}</div>
          ))}
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-slate-600 font-mono animate-pulse">Loading audit logs…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-2xl mb-2">📋</div>
            <p className="text-xs text-slate-600 font-mono">
              {logs.length === 0 ? "No audit logs recorded yet" : "No logs match your filters"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/40">
            {filtered.map(log => {
              const isOpen = expanded === log.log_id;
              const hasDetails = log.old_value || log.new_value;
              return (
                <div key={log.log_id}
                  className={`transition-colors ${hasDetails ? "cursor-pointer hover:bg-slate-800/20" : ""} ${isOpen ? "bg-slate-800/20" : ""}`}
                  onClick={() => hasDetails && setExpanded(isOpen ? null : log.log_id)}>

                  {/* Main row */}
                  <div className="grid grid-cols-[140px_1fr_100px_100px_24px] gap-4 px-5 py-3 items-center font-mono text-xs">
                    {/* Timestamp */}
                    <div className="text-[10px] text-slate-600 leading-relaxed">
                      {fmtDate(log.performed_at)}
                    </div>

                    {/* Action + target */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border flex-shrink-0 ${actionStyle(log.action)}`}>
                        {log.action}
                      </span>
                      {log.target_id && (
                        <span className="text-slate-600 text-[10px] flex-shrink-0">#{log.target_id}</span>
                      )}
                    </div>

                    {/* Table */}
                    <div className="text-slate-400 text-[10px] truncate">
                      {TABLE_LABELS[log.target_table] || log.target_table}
                    </div>

                    {/* Admin */}
                    <div className="text-[10px] text-slate-600">
                      Admin #{log.admin_id}
                    </div>

                    {/* Expand toggle */}
                    <div className="text-slate-700 text-[10px]">
                      {hasDetails ? (isOpen ? "▲" : "▼") : ""}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && hasDetails && (
                    <div className="px-5 pb-4 grid grid-cols-2 gap-3">
                      {log.old_value && (
                        <div className="rounded-xl bg-red-500/8 border border-red-500/20 p-3">
                          <div className="text-[9px] text-red-500/60 font-black tracking-widest uppercase mb-1.5">Before</div>
                          <p className="text-[10px] text-red-300/80 font-mono break-all">{log.old_value}</p>
                        </div>
                      )}
                      {log.new_value && (
                        <div className="rounded-xl bg-emerald-500/8 border border-emerald-500/20 p-3">
                          <div className="text-[9px] text-emerald-500/60 font-black tracking-widest uppercase mb-1.5">After</div>
                          <p className="text-[10px] text-emerald-300/80 font-mono break-all">{log.new_value}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
