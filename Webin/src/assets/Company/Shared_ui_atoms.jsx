import { avatarColor, SKILL_CAT_CLS, STATUS_CLS } from "./Helpers";

export function StatusPill({ status }) {
  return (
    <span className={`text-[10px] font-bold tracking-wide px-2.5 py-0.5 rounded-full font-mono border ${STATUS_CLS[status] || "bg-slate-500/10 text-slate-400 border-slate-500/25"}`}>
      {status?.toUpperCase()}
    </span>
  );
}

export function SkillTag({ skill }) {
  const cls = SKILL_CAT_CLS[skill?.category] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
  return (
    <span className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg border ${cls}`}>
      {skill?.name}
    </span>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900/70 ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }) {
  return (
    <h2 className="text-sm font-black text-slate-200 tracking-tight" style={{ fontFamily: "'Syne',sans-serif" }}>
      {children}
    </h2>
  );
}

export function Avatar({ name, size = "md" }) {
  const initials = name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?";
  const sz = size === "sm" ? "w-8 h-8 text-[10px]" : size === "lg" ? "w-12 h-12 text-sm" : "w-9 h-9 text-[11px]";
  return (
    <div
      className={`${sz} rounded-xl flex items-center justify-center font-black flex-shrink-0 ${avatarColor(name || "A")}`}
      style={{ fontFamily: "'Syne',sans-serif" }}
    >
      {initials}
    </div>
  );
}
