import { STATUS_STYLES } from "../../assets/Student/Helpers";


export function StatusPill({ status }) {
  return (
    <span
      className={`text-[10px] font-bold tracking-wide px-2.5 py-0.5
        rounded-full font-mono ${
          STATUS_STYLES[status] ||
          "bg-slate-500/10 text-slate-400 border border-slate-500/25"
        }`}
    >
      {status.toUpperCase()}
    </span>
  );
}
