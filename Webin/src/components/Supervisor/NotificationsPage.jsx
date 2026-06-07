import React, { useState } from 'react'
import { SectionTitle } from '../../assets/Supervisor/Share_atom_UI_supervisor';
import { fmtDateTime, NOTIF_META } from '../../assets/Supervisor/Helpers';

const NotificationsPage = ({ notifs, onMarkRead, onMarkAll }) => {
  const unread = notifs.filter(n => !n.is_read).length;
  const [filter, setFilter] = useState("All");

  const types   = ["All", ...new Set(notifs.map(n=>n.type))];
  const filtered = notifs.filter(n => filter==="All" || n.type===filter);

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <SectionTitle>Notifications</SectionTitle>
          <p className="text-xs text-slate-600 font-mono mt-0.5">{unread} unread · Internship updates</p>
        </div>
        {unread>0 && (
          <button onClick={onMarkAll} className="text-xs font-bold text-violet-400 hover:text-violet-300 border border-violet-500/25 bg-violet-500/10 px-3 py-1.5 rounded-lg transition-colors">
            Mark all read
          </button>
        )}
      </div>

      {/* Type filter */}
      <div className="flex gap-2 flex-wrap">
        {types.map(t => {
          const count = t==="All"?notifs.length:notifs.filter(n=>n.type===t).length;
          const label = t.replace(/_/g," ");
          return (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${filter===t?"bg-violet-500/15 border-violet-500/35 text-violet-400":"bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400"}`}
              style={{fontFamily:"'Syne',sans-serif"}}>
              {label} <span className="opacity-50 ml-1">{count}</span>
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map(n => {
          const m = NOTIF_META[n.type] || NOTIF_META.INTERN_ASSIGNED;
          return (
            <div key={n.notification_id} onClick={() => onMarkRead(n.notification_id)}
              className={`group relative flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${!n.is_read?`${m.bg} border`:"border-slate-800 bg-slate-900/50 hover:bg-slate-800/40"}`}>
              {!n.is_read && <span className={`absolute top-4 right-4 w-2 h-2 rounded-full ${m.dot}`} />}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0 border ${m.bg}`}>
                <span className={m.color}>{m.icon}</span>
              </div>
              <div className="flex-1 min-w-0 pr-4">
                <div className={`text-[9px] font-black tracking-[1.5px] uppercase mb-1 ${m.color}`} style={{fontFamily:"'Syne',sans-serif"}}>
                  {n.type.replace(/_/g," ")}
                </div>
                <p className={`text-sm leading-relaxed ${n.is_read?"text-slate-400":"text-slate-200"}`}>{n.message}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-[10px] text-slate-600 font-mono">{fmtDateTime(n.created_at)}</span>
                  <span className="text-slate-800">·</span>
                  <span className="text-[10px] text-slate-500 font-mono">{n.student_name}</span>
                  <span className="text-[10px] text-slate-700 bg-slate-800 px-1.5 py-0.5 rounded font-mono border border-slate-700">ref: {n.intern_id}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


export default NotificationsPage
