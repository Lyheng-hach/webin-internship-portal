export const fmtDate     = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "—";
export const fmtDateTime = (d) => d ? new Date(d).toLocaleString("en-GB", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }) : "—";
export const daysLeft    = (d) => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));

export const STATUS_CLS = {
  Active:    "bg-sky-500/10 text-sky-400 border-sky-500/25",
  Closed:    "bg-slate-500/10 text-slate-400 border-slate-500/25",
  Draft:     "bg-amber-500/10 text-amber-400 border-amber-500/25",
  Pending:   "bg-amber-500/10 text-amber-400 border-amber-500/25",
  Accepted:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  Rejected:  "bg-red-500/10 text-red-400 border-red-500/25",
  Verified:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  Completed: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25",
  Scheduled: "bg-violet-500/10 text-violet-400 border-violet-500/25",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/25",
};

export const TYPE_CLS = {
  "Full-Stack":"bg-sky-500/10 text-sky-400",
  "Mobile":    "bg-violet-500/10 text-violet-400",
  "Data":      "bg-amber-500/10 text-amber-400",
  "Backend":   "bg-orange-500/10 text-orange-400",
  "Design":    "bg-pink-500/10 text-pink-400",
  "DevOps":    "bg-teal-500/10 text-teal-400",
  "AI/ML":     "bg-emerald-500/10 text-emerald-400",
};

export const SKILL_CAT_CLS = {
  Frontend:    "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Backend:     "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Database:    "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Design:      "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Programming: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Mobile:      "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  DevOps:      "bg-teal-500/10 text-teal-400 border-teal-500/20",
  "AI/ML":     "bg-lime-500/10 text-lime-400 border-lime-500/20",
};

export const NOTIF_META = {
  "APPLICATION SUBMITTED": { icon:"◈", color:"text-sky-400",     bg:"bg-sky-500/10 border-sky-500/20",     dot:"bg-sky-400"     },
  APPLICATION_SUBMITTED:   { icon:"◈", color:"text-sky-400",     bg:"bg-sky-500/10 border-sky-500/20",     dot:"bg-sky-400"     },
  APPLICATION_REVIEWED:    { icon:"👁", color:"text-blue-400",   bg:"bg-blue-500/10 border-blue-500/20",   dot:"bg-blue-400"    },
  APPLICATION_ACCEPTED:    { icon:"✅", color:"text-emerald-400", bg:"bg-emerald-500/10 border-emerald-500/20", dot:"bg-emerald-400" },
  APPLICATION_REJECTED:    { icon:"✕",  color:"text-red-400",    bg:"bg-red-500/10 border-red-500/20",     dot:"bg-red-400"     },
  APPLICATION_WITHDRAW:    { icon:"↩",  color:"text-slate-400",  bg:"bg-slate-500/10 border-slate-500/20", dot:"bg-slate-400"   },
  APPLICATION_WITHDRAWN:   { icon:"↩",  color:"text-slate-400",  bg:"bg-slate-500/10 border-slate-500/20", dot:"bg-slate-400"   },
  APPLICATION_DEADLINE:    { icon:"⏰", color:"text-amber-400",  bg:"bg-amber-500/10 border-amber-500/20", dot:"bg-amber-400"   },
};

export const LOGO_COLORS = ["bg-sky-500/20 text-sky-400","bg-orange-500/20 text-orange-400","bg-violet-500/20 text-violet-400","bg-emerald-500/20 text-emerald-400","bg-pink-500/20 text-pink-400","bg-amber-500/20 text-amber-400"];
export const avatarColor = (s) => LOGO_COLORS[s.charCodeAt(0) % LOGO_COLORS.length];