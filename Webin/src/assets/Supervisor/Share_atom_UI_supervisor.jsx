import { avatarCls, STATUS_CLS } from "./Helpers";

export function StatusPill({ status }) {
  return (
    <span className={`text-[10px] font-bold tracking-wide px-2.5 py-0.5 rounded-full font-mono border ${STATUS_CLS[status] || "bg-slate-500/10 text-slate-400 border-slate-500/25"}`}>
      {status?.toUpperCase()}
    </span>
  );
}

export function Avatar({ name, size = "md" }) {
  const initials = name?.split(" ").map(n => n[0]).join("").slice(0,2) || "?";
  const sz = size==="sm"?"w-8 h-8 text-[10px]":size==="lg"?"w-14 h-14 text-base":"w-10 h-10 text-xs";
  return (
    <div className={`${sz} rounded-xl flex items-center justify-center font-black flex-shrink-0 ${avatarCls(name||"A")}`}
      style={{fontFamily:"'Syne',sans-serif"}}>{initials}</div>
  );
}

export function Card({ children, className="" }) {
  return <div className={`rounded-2xl border border-slate-800 bg-slate-900/70 ${className}`}>{children}</div>;
}

export function SectionTitle({ children }) {
  return <h2 className="text-sm font-black text-slate-200 tracking-tight" style={{fontFamily:"'Syne',sans-serif"}}>{children}</h2>;
}

export function ProgressBar({ value, color="bg-violet-500", label="" }) {
  return (
    <div>
      {label && (
        <div className="flex justify-between text-[10px] mb-1.5">
          <span className="text-slate-500">{label}</span>
          <span className="text-slate-400 font-mono font-semibold">{value}%</span>
        </div>
      )}
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div className={`h-1.5 rounded-full ${color} transition-all duration-700`} style={{width:`${value}%`}} />
      </div>
    </div>
  );
}

export function ScoreRing({ score, size=96 }) {
  const r = 15.9;
  const color = score >= 85 ? "#34d399" : score >= 70 ? "#818cf8" : "#fbbf24";
  return (
    <div className="relative flex-shrink-0" style={{width:size,height:size}}>
      <svg width={size} height={size} viewBox="0 0 36 36" className="-rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#1e293b" strokeWidth="2.5"/>
        {score && (
          <circle cx="18" cy="18" r={r} fill="none" stroke={color}
            strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={`${score} 100`}/>
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {score
          ? <><span className="font-black text-white leading-none" style={{fontSize:size*0.22,fontFamily:"'Syne',sans-serif"}}>{score}</span><span className="text-slate-600" style={{fontSize:size*0.09}}>/100</span></>
          : <span className="text-slate-600 text-center" style={{fontSize:size*0.1}}>Pending</span>
        }
      </div>
    </div>
  );
}