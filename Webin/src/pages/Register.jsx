import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { value: "student",    label: "Student",    icon: "🎓", desc: "Find & apply for internships", color: "#38bdf8" },
  { value: "company",    label: "Company",    icon: "🏢", desc: "Post positions & hire interns",  color: "#fb923c" },
  { value: "supervisor", label: "Supervisor", icon: "👨‍🏫", desc: "Monitor & evaluate interns",    color: "#a78bfa" },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [role, setRole]           = useState("student");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const selectedRole = ROLES.find(r => r.value === role);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 8)  { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const assignedRole = await register(email, password, role);
      navigate(`/${assignedRole}`);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        body{margin:0;background:#07090f;}
      `}</style>

      <div className="min-h-screen bg-[#07090f] flex items-center justify-center p-4"
        style={{fontFamily:"'IBM Plex Mono',monospace"}}>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl"
            style={{background: `${selectedRole.color}08`}} />
        </div>

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center font-black text-sm transition-all"
                style={{background:`${selectedRole.color}20`, borderColor:`${selectedRole.color}40`, color: selectedRole.color, fontFamily:"'Syne',sans-serif"}}>W</div>
              <span className="text-xl font-black text-slate-200" style={{fontFamily:"'Syne',sans-serif"}}>WEBIN</span>
            </div>
          </div>

          <div className="bg-[#0a0d15] border border-slate-800 rounded-2xl p-8">
            <h2 className="text-lg font-black text-slate-100 mb-1" style={{fontFamily:"'Syne',sans-serif"}}>Create Account</h2>
            <p className="text-xs text-slate-600 mb-6">Join the internship platform</p>

            {/* Role Selector */}
            <div className="mb-5">
              <label className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-2 block">I am a…</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(r => (
                  <button key={r.value} type="button" onClick={() => setRole(r.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-left ${role === r.value ? "border-opacity-50" : "border-slate-800 bg-slate-900/40 text-slate-500 hover:border-slate-700"}`}
                    style={role === r.value ? {background:`${r.color}15`, borderColor:`${r.color}40`, color: r.color} : {}}>
                    <span className="text-base">{r.icon}</span>
                    <div>
                      <div className="text-xs font-black" style={{fontFamily:"'Syne',sans-serif"}}>{r.label}</div>
                      <div className="text-[9px] text-slate-600 leading-tight">{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1.5 block">Email</label>
                <input type="email" value={email} required onChange={e => setEmail(e.target.value)}
                  placeholder="your@gmail.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition-colors" />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1.5 block">Password</label>
                <input type="password" value={password} required onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition-colors" />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1.5 block">Confirm Password</label>
                <input type="password" value={confirm} required onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition-colors" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-xl border font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{background:`${selectedRole.color}20`, borderColor:`${selectedRole.color}40`, color: selectedRole.color, fontFamily:"'Syne',sans-serif"}}>
                {loading ? "Creating account…" : `Register as ${selectedRole.label} →`}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="text-sky-400 hover:text-sky-300 transition-colors font-bold">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
