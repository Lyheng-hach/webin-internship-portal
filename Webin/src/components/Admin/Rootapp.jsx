import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Users from "./Users";
import Companies from "./Companies";
import AuditLog from "./AuditLog";

const NAV = [
  { id: "dashboard", label: "Dashboard",  icon: "⬡" },
  { id: "users",     label: "Users",      icon: "👤" },
  { id: "companies", label: "Companies",  icon: "🏢" },
  { id: "audit",     label: "Audit Log",  icon: "📋" },
];

const PAGE_TITLES = {
  dashboard: "Admin Dashboard",
  users:     "User Management",
  companies: "Company Verification",
  audit:     "Audit Log",
};

export default function AdminRootapp() {
  const [page, setPage]           = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const { logout }                = useAuth();
  const navigate                  = useNavigate();

  function handleLogout() { logout(); navigate("/login"); }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        body{margin:0;background:#07090f;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#0a0d15;}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px;}
      `}</style>

      <div className="flex h-screen bg-[#07090f] text-slate-200 overflow-hidden"
        style={{fontFamily:"'IBM Plex Mono',monospace"}}>

        {/* ── SIDEBAR ── */}
        <aside className={`flex-shrink-0 flex flex-col bg-[#0a0d15] border-r border-slate-800/80 transition-all duration-300 ${collapsed ? "w-[60px]" : "w-56"}`}>
          {/* Logo */}
          <div className="flex items-center gap-3 px-3.5 h-16 border-b border-slate-800/80 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/25 flex items-center justify-center font-black text-emerald-400 text-xs flex-shrink-0"
              style={{fontFamily:"'Syne',sans-serif"}}>W</div>
            {!collapsed && (
              <span className="text-base font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent"
                style={{fontFamily:"'Syne',sans-serif"}}>WEBIN</span>
            )}
            <button onClick={() => setCollapsed(p => !p)}
              className="ml-auto text-slate-700 hover:text-slate-500 transition-colors text-[11px]">
              {collapsed ? "▷" : "◁"}
            </button>
          </div>

          {/* Admin Badge */}
          {!collapsed && (
            <div className="mx-2 mt-3 px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <div className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-0.5">Role</div>
              <div className="text-[10px] text-emerald-400 font-mono">Administrator</div>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
            {NAV.map(({ id, label, icon }) => {
              const active = page === id;
              return (
                <button key={id} onClick={() => setPage(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group relative border ${active ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 border-transparent"}`}
                  style={{fontFamily:"'Syne',sans-serif"}}>
                  <span className="text-base flex-shrink-0">{icon}</span>
                  {!collapsed && <span className="truncate">{label}</span>}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="flex-shrink-0 border-t border-slate-800/80 p-3">
            <button onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 ${collapsed ? "justify-center" : ""}`}
              style={{fontFamily:"'Syne',sans-serif"}}>
              <span className="text-base flex-shrink-0">🚪</span>
              {!collapsed && "Sign Out"}
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topbar */}
          <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-slate-800/80 bg-[#0a0d15]/80 backdrop-blur-xl">
            <div>
              <h1 className="text-base font-black text-slate-100" style={{fontFamily:"'Syne',sans-serif"}}>
                {PAGE_TITLES[page]}
              </h1>
              <p className="text-[10px] text-slate-700 font-mono">Admin Portal</p>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60">
              <div className="w-6 h-6 rounded-md bg-emerald-500/25 flex items-center justify-center text-[9px] font-black text-emerald-400"
                style={{fontFamily:"'Syne',sans-serif"}}>AD</div>
              <span className="text-xs text-slate-300 font-semibold hidden sm:block" style={{fontFamily:"'Syne',sans-serif"}}>Admin</span>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div key={page} className="animate-fade-up">
              {page === "dashboard" && <Dashboard onNavigate={setPage} />}
              {page === "users"     && <Users />}
              {page === "companies" && <Companies />}
              {page === "audit"     && <AuditLog />}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
