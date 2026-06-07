import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Home        from "./pages/Home";
import Login       from "./pages/Login";
import Register    from "./pages/Register";

import StudentApp    from "./components/Student/Rootapp";
import CompanyApp    from "./components/Company/Rootapp";
import SupervisorApp from "./components/Supervisor/Rootapp";
import AdminApp      from "./components/Admin/Rootapp";

// ── Guard: redirect to /login if not authenticated ────────────────────────────
function PrivateRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();
  if (loading) return null; // or a spinner
  if (!user)   return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to={`/${user.role}`} replace />;
  return children;
}

// ── Guard: redirect to dashboard if already logged in ─────────────────────────
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user)    return <Navigate to={`/${user.role}`} replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Role dashboards */}
      <Route path="/student"    element={<PrivateRoute allowedRole="student"><StudentApp /></PrivateRoute>} />
      <Route path="/company"    element={<PrivateRoute allowedRole="company"><CompanyApp /></PrivateRoute>} />
      <Route path="/supervisor" element={<PrivateRoute allowedRole="supervisor"><SupervisorApp /></PrivateRoute>} />
      <Route path="/admin"      element={<PrivateRoute allowedRole="admin"><AdminApp /></PrivateRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
