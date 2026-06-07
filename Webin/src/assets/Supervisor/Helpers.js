export const fmtDate     = (d) => d ? new Date(d).toLocaleDateString("en-GB",{ day:"2-digit",month:"short",year:"numeric" }) : "—";
export const fmtDateTime = (d) => d ? new Date(d).toLocaleString("en-GB",{ day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit" }) : "—";
export const daysLeft    = (d) => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));
export const daysElapsed = (s,e) => { const t=Math.ceil((new Date(e)-new Date(s))/86400000); const el=Math.ceil((new Date()-new Date(s))/86400000); return Math.min(100,Math.max(0,Math.round((el/t)*100))); };

export const STATUS_CLS = {
  Active:    "bg-violet-500/10 text-violet-400 border-violet-500/25",
  Completed: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25",
  Pending:   "bg-amber-500/10 text-amber-400 border-amber-500/25",
  Submitted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
};

export const FIELD_CLS = {
  "Full-Stack": "bg-sky-500/10 text-sky-400",
  "Backend":    "bg-orange-500/10 text-orange-400",
  "Data":       "bg-amber-500/10 text-amber-400",
  "Mobile":     "bg-indigo-500/10 text-indigo-400",
  "Design":     "bg-pink-500/10 text-pink-400",
  "DevOps":     "bg-teal-500/10 text-teal-400",
  "AI/ML":      "bg-emerald-500/10 text-emerald-400",
};

export const NOTIF_META = {
  EVALUATION_DUE:       { icon:"⏰", color:"text-amber-400",   bg:"bg-amber-500/10 border-amber-500/20",   dot:"bg-amber-400" },
  REPORT_SUBMITTED:     { icon:"📋", color:"text-sky-400",     bg:"bg-sky-500/10 border-sky-500/20",       dot:"bg-sky-400" },
  INTERN_ASSIGNED:      { icon:"◉", color:"text-violet-400",  bg:"bg-violet-500/10 border-violet-500/20", dot:"bg-violet-400" },
  INTERNSHIP_COMPLETED: { icon:"✓", color:"text-emerald-400", bg:"bg-emerald-500/10 border-emerald-500/20",dot:"bg-emerald-400" },
};

export const AVATAR_COLORS = [
  "bg-violet-500/20 text-violet-400","bg-sky-500/20 text-sky-400",
  "bg-emerald-500/20 text-emerald-400","bg-pink-500/20 text-pink-400",
  "bg-amber-500/20 text-amber-400","bg-indigo-500/20 text-indigo-400",
];
export const avatarCls = (s) => AVATAR_COLORS[s.charCodeAt(0) % AVATAR_COLORS.length];