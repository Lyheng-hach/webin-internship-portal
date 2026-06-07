import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_COLORS = {
  student:    { accent: "#38bdf8", bg: "from-sky-500/20 to-indigo-500/10",   border: "border-sky-500/30",   label: "Student"    },
  company:    { accent: "#fb923c", bg: "from-orange-500/20 to-amber-500/10", border: "border-orange-500/30", label: "Company"    },
  supervisor: { accent: "#a78bfa", bg: "from-violet-500/20 to-indigo-500/10",border: "border-violet-500/30", label: "Supervisor" },
  admin:      { accent: "#34d399", bg: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-500/30",label: "Admin"      },
};

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const role = await login(email, password);
      navigate(`/${role}`);
    } catch (err) {
      setError(err.message || "Login failed");
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

        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-sm">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/30 to-indigo-500/30 border border-sky-500/30 flex items-center justify-center font-black text-sky-400 text-sm"
                style={{fontFamily:"'Syne',sans-serif"}}>W</div>
              <span className="text-xl font-black bg-gradient-to-r from-sky-400 to-slate-300 bg-clip-text text-transparent"
                style={{fontFamily:"'Syne',sans-serif"}}>WEBIN</span>
            </div>
          </div>

          {/* Card */}
          <div className="bg-[#0a0d15] border border-slate-800 rounded-2xl p-8">
            <h2 className="text-lg font-black text-slate-100 mb-1" style={{fontFamily:"'Syne',sans-serif"}}>
              Sign In
            </h2>
            <p className="text-xs text-slate-600 mb-6">Access your internship portal</p>

            {error && (
              <div className="mb-4 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1.5 block">Email</label>
                <input
                  type="email" value={email} required
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@gmail.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:bg-slate-900 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1.5 block">Password</label>
                <input
                  type="password" value={password} required
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:bg-slate-900 transition-colors"
                />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400 text-sm font-bold hover:bg-sky-500/30 hover:border-sky-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{fontFamily:"'Syne',sans-serif"}}>
                {loading ? "Signing in…" : "Sign In →"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-600">
                No account?{" "}
                <Link to="/register" className="text-sky-400 hover:text-sky-300 transition-colors font-bold">
                  Register here
                </Link>
              </p>
            </div>
          </div>

          {/* Role hint */}
          <div className="mt-6 grid grid-cols-4 gap-2">
            {Object.entries(ROLE_COLORS).map(([role, c]) => (
              <div key={role} className={`px-2 py-1.5 rounded-lg bg-gradient-to-br ${c.bg} border ${c.border} text-center`}>
                <div className="text-[9px] font-black tracking-wide" style={{color: c.accent, fontFamily:"'Syne',sans-serif"}}>
                  {c.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
