export const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
export const daysLeft = (d) => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));

export const STATUS_STYLES = {
  Active:    "bg-sky-500/10 text-sky-400 border border-sky-500/25",
  Completed: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/25",
  Pending:   "bg-amber-500/10 text-amber-400 border border-amber-500/25",
  Accepted:  "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
  Rejected:  "bg-red-500/10 text-red-400 border border-red-500/25",
  Verified:  "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
};

export const TYPE_COLORS = {
  "Full-Stack": "bg-sky-500/10 text-sky-400",
  "Mobile":     "bg-violet-500/10 text-violet-400",
  "Data":       "bg-amber-500/10 text-amber-400",
  "Backend":    "bg-orange-500/10 text-orange-400",
  "Design":     "bg-pink-500/10 text-pink-400",
  "DevOps":     "bg-teal-500/10 text-teal-400",
  "AI/ML":      "bg-emerald-500/10 text-emerald-400",
};

export const LOGO_COLORS = ["bg-sky-500/20 text-sky-400","bg-orange-500/20 text-orange-400","bg-violet-500/20 text-violet-400","bg-emerald-500/20 text-emerald-400","bg-pink-500/20 text-pink-400","bg-amber-500/20 text-amber-400"];
export const logoColor = (str) => LOGO_COLORS[str.charCodeAt(0) % LOGO_COLORS.length];