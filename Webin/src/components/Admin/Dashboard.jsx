import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";

const ROLE_COLOR = {
  student:    { text: "#38bdf8", bg: "#38bdf810", border: "#38bdf830" },
  company:    { text: "#fb923c", bg: "#fb923c10", border: "#fb923c30" },
  supervisor: { text: "#a78bfa", bg: "#a78bfa10", border: "#a78bfa30" },
  admin:      { text: "#34d399", bg: "#34d39910", border: "#34d39930" },
};

const Stat = ({ label, value, color, icon, sub }) => (
  <div className="bg-[#0d1322] border border-slate-800/80 rounded-2xl p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-black tracking-widest uppercase" style={{ color }}>{label}</span>
    </div>
    <div className="text-2xl font-black text-slate-100" style={{fontFamily:"'Syne',sans-serif"}}>{value}</div>
    {sub && <div className="text-[10px] text-slate-600 font-mono mt-1">{sub}</div>}
  </div>
);

export default function AdminDashboard({ onNavigate }) {
  const [users,     setUsers]     = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.allSettled([
      adminAPI.listUsers(),
      adminAPI.auditLogs(),
    ]).then(([userRes, logRes]) => {
      if (userRes.status === "fulfilled") setUsers(userRes.value || []);
      if (logRes.status  === "fulfilled") setAuditLogs(logRes.value || []);
      setLoading(false);
    });
  }, []);

  const byRole    = (role) => users.filter(u => u.role === role).length;
  const companies = users.filter(u => u.role === "company");
  // Recent = last 7 days
  const recentCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentUsers  = users.filter(u => u.created_at && new Date(u.created_at) >= recentCutoff);

  return (
    <div className="space-y-6">

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Students"    value={loading ? "…" : byRole("student")}    color="#38bdf8" icon="🎓" sub="registered" />
        <Stat label="Companies"   value={loading ? "…" : byRole("company")}    color="#fb923c" icon="🏢" sub="registered" />
        <Stat label="Supervisors" value={loading ? "…" : byRole("supervisor")} color="#a78bfa" icon="👨‍🏫" sub="registered" />
        <Stat label="Total Users" value={loading ? "…" : users.length}         color="#34d399" icon="👥"
          sub={loading ? "" : `${recentUsers.length} joined this week`} />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#0d1322] border border-slate-800/80 rounded-2xl p-5">
          <div className="text-[10px] font-black tracking-widest uppercase text-slate-600 mb-3">Audit Activity</div>
          <div className="flex items-end gap-3">
            <div className="text-2xl font-black text-slate-100" style={{fontFamily:"'Syne',sans-serif"}}>
              {loading ? "…" : auditLogs.length}
            </div>
            <div className="text-xs text-slate-600 font-mono pb-0.5">total actions logged</div>
          </div>
          <div className="mt-3 flex gap-4 text-[10px] font-mono">
            <span className="text-red-400">{auditLogs.filter(l => l.action?.startsWith("DELETE")).length} deletes</span>
            <span className="text-amber-400">{auditLogs.filter(l => l.action?.startsWith("UPDATE")).length} updates</span>
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800/80 rounded-2xl p-5">
          <div className="text-[10px] font-black tracking-widest uppercase text-slate-600 mb-3">Company Status</div>
          {loading ? (
            <div className="text-xs text-slate-600">Loading…</div>
          ) : (
            <div className="space-y-2">
              {[
                { label: "Verified",    val: companies.filter(c => c.verified_status === "Verified").length,  color: "#34d399" },
                { label: "Pending",     val: companies.filter(c => c.verified_status === "Pending").length,   color: "#fb923c" },
                { label: "Rejected",    val: companies.filter(c => c.verified_status === "Rejected").length,  color: "#f87171" },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">{s.label}</span>
                  <span className="text-sm font-black" style={{color: s.color, fontFamily:"'Syne',sans-serif"}}>{s.val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#0d1322] border border-slate-800/80 rounded-2xl p-5">
        <h2 className="text-sm font-black text-slate-300 mb-4" style={{fontFamily:"'Syne',sans-serif"}}>Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Manage Users",    page: "users",     icon: "👤", color: "#38bdf8" },
            { label: "Verify Companies", page: "companies", icon: "✅", color: "#fb923c" },
            { label: "View Audit Log",  page: "audit",     icon: "📋", color: "#34d399" },
          ].map(a => (
            <button key={a.page} onClick={() => onNavigate(a.page)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/40 hover:bg-slate-800/60 hover:border-slate-600 transition-all text-left"
              style={{fontFamily:"'Syne',sans-serif"}}>
              <span className="text-lg">{a.icon}</span>
              <span className="text-xs font-bold" style={{color: a.color}}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-[#0d1322] border border-slate-800/80 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-slate-300" style={{fontFamily:"'Syne',sans-serif"}}>Recent Users</h2>
          <button onClick={() => onNavigate("users")}
            className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono transition-colors">
            View all →
          </button>
        </div>
        {loading ? (
          <p className="text-xs text-slate-600 animate-pulse">Loading…</p>
        ) : users.length === 0 ? (
          <p className="text-xs text-slate-600">No users found.</p>
        ) : (
          <div className="space-y-2">
            {users.slice(0, 8).map(u => {
              const rc = ROLE_COLOR[u.role] || ROLE_COLOR.admin;
              return (
                <div key={u.user_id} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black"
                      style={{background: rc.bg, border: `1px solid ${rc.border}`, color: rc.text}}>
                      {(u.user_email || "?")[0].toUpperCase()}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{u.user_email}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full border font-bold capitalize"
                    style={{ color: rc.text, borderColor: rc.border, background: rc.bg }}>
                    {u.role}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
