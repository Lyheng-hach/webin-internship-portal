import React, { useState, useEffect } from 'react'
import { notificationAPI } from '../../services/api';
import { fmtDateTime } from '../../assets/Company/Helpers';

const NOTIF_META = {
  "APPLICATION SUBMITTED": { icon: "◈", color: "text-sky-400",     bg: "bg-sky-500/10 border-sky-500/25",         dot: "bg-sky-400"     },
  APPLICATION_SUBMITTED:   { icon: "◈", color: "text-sky-400",     bg: "bg-sky-500/10 border-sky-500/25",         dot: "bg-sky-400"     },
  APPLICATION_ACCEPTED:    { icon: "✅", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/25", dot: "bg-emerald-400" },
  APPLICATION_REJECTED:    { icon: "✕",  color: "text-red-400",     bg: "bg-red-500/10 border-red-500/25",         dot: "bg-red-400"     },
  APPLICATION_REVIEWED:    { icon: "👁", color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/25",       dot: "bg-blue-400"    },
  APPLICATION_WITHDRAW:    { icon: "↩",  color: "text-slate-400",   bg: "bg-slate-800/60 border-slate-700",        dot: "bg-slate-400"   },
  APPLICATION_DEADLINE:    { icon: "⏰", color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/25",     dot: "bg-amber-400"   },
  DEFAULT:                 { icon: "🔔", color: "text-slate-400",   bg: "bg-slate-800/60 border-slate-700",        dot: "bg-slate-400"   },
};

const Notifications = () => {
  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filter,  setFilter]  = useState("All");

  const load = () => {
    setLoading(true);
    setError(null);
    notificationAPI.myList()
      .then(data => setNotifs(data || []))
      .catch(e  => setError(e.message || "Failed to load notifications"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const unread   = notifs.filter(n => !n.is_read).length;
  const types    = ["All", ...new Set(notifs.map(n => n.type).filter(Boolean))];
  const filtered = notifs.filter(n => filter === "All" || n.type === filter);

  const markRead = (id) => {
    notificationAPI.markRead(id).catch(() => {});
    setNotifs(p => p.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
  };

  const markAll = () => {
    notifs.filter(n => !n.is_read).forEach(n => notificationAPI.markRead(n.notification_id).catch(() => {}));
    setNotifs(p => p.map(n => ({ ...n, is_read: true })));
  };

  return (
    <div className="max-w-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-300" style={{fontFamily:"'Syne',sans-serif"}}>Notifications</h2>
          <p className="text-xs text-slate-600 font-mono mt-0.5">{unread} unread · Application updates</p>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button onClick={markAll}
              className="text-xs font-bold text-orange-400 hover:text-orange-300 border border-orange-500/25 bg-orange-500/10 px-3 py-1.5 rounded-lg transition-colors">
              Mark all read
            </button>
          )}
          <button onClick={load}
            className="text-xs text-slate-500 hover:text-slate-300 border border-slate-800 bg-slate-900 px-3 py-1.5 rounded-lg transition-colors font-mono">
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="text-center py-16">
          <p className="text-slate-500 text-sm font-mono animate-pulse">Loading notifications…</p>
        </div>
      )}
      {!loading && error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono">
          {error}
        </div>
      )}

      {/* Type filter chips */}
      {!loading && !error && types.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {types.map(t => {
            const count = t === "All" ? notifs.length : notifs.filter(n => n.type === t).length;
            return (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${filter === t ? "bg-orange-500/15 border-orange-500/35 text-orange-400" : "bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400"}`}
                style={{fontFamily:"'Syne',sans-serif"}}>
                {t.replace(/_/g, " ")} <span className="opacity-50 ml-1">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* List */}
      {!loading && !error && (
        filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-3xl mb-3">🔔</div>
            <p className="text-slate-500 text-sm font-mono">
              {notifs.length === 0 ? "No notifications yet" : "No notifications match this filter"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(n => {
              const m = NOTIF_META[n.type] || NOTIF_META.DEFAULT;
              return (
                <div key={n.notification_id} onClick={() => markRead(n.notification_id)}
                  className={`group relative flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${!n.is_read ? `${m.bg}` : "border-slate-800 bg-slate-900/50 hover:bg-slate-800/40"}`}>
                  {!n.is_read && <span className={`absolute top-4 right-4 w-2 h-2 rounded-full ${m.dot}`} />}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0 border ${m.bg}`}>
                    <span className={m.color}>{m.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className={`text-[9px] font-black tracking-[1.5px] uppercase mb-1 ${m.color}`}
                      style={{fontFamily:"'Syne',sans-serif"}}>
                      {(n.type || "").replace(/_/g, " ")}
                    </div>
                    <p className={`text-sm leading-relaxed ${n.is_read ? "text-slate-400" : "text-slate-200"}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-[10px] text-slate-600 font-mono">{fmtDateTime(n.created_at)}</span>
                      {n.student_name && <><span className="text-slate-800">·</span><span className="text-[10px] text-slate-500 font-mono">{n.student_name}</span></>}
                      {n.position_title && <><span className="text-slate-800">·</span><span className="text-[10px] text-slate-600 font-mono">{n.position_title}</span></>}
                      {n.application_id && (
                        <span className="text-[10px] text-slate-700 bg-slate-800 px-1.5 py-0.5 rounded font-mono border border-slate-700">
                          app #{n.application_id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

export default Notifications;
