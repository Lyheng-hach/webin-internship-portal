// ─── API Service Layer ────────────────────────────────────────────────────────
// Connects the React frontend to the FastAPI backend.
// Base URL points to Vite dev proxy or direct FastAPI server.

// Relative path — Vite dev proxy forwards /api/* to http://localhost:8000
const BASE_URL = "/api";

// ── Helper ─────────────────────────────────────────────────────────────────────
function getToken() {
  return localStorage.getItem("access_token");
}

async function request(method, path, body = null) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot connect to server. Make sure the backend is running (uvicorn main:app --reload).");
  }

  // Token expired or invalid — clear session and redirect to login
  if (res.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_id");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || "Request failed");
  }

  return res.status === 204 ? null : res.json();
}

// ── Auth ───────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:    (email, password) => request("POST", "/auth/login",    { user_email: email, user_password: password }),
  register: (email, password, role) => request("POST", "/auth/register", { user_email: email, user_password: password, role }),
};

// ── Students ──────────────────────────────────────────────────────────────────
export const studentAPI = {
  getProfile:    ()       => request("GET",  "/students/profile"),
  createProfile: (data)   => request("POST", "/students/profile", data),
  updateProfile: (data)   => request("PUT",  "/students/profile", data),
  list:          ()       => request("GET",  "/students/"),
  getById:       (id)     => request("GET",  `/students/${id}`),
};

// ── Companies ─────────────────────────────────────────────────────────────────
export const companyAPI = {
  getProfile:    ()     => request("GET",  "/companies/profile"),
  createProfile: (data) => request("POST", "/companies/profile", data),
  updateProfile: (data) => request("PUT",  "/companies/profile", data),
  list:          ()     => request("GET",  "/companies/"),
  getById:       (id)   => request("GET",  `/companies/${id}`),
};

// ── Supervisors ───────────────────────────────────────────────────────────────
export const supervisorAPI = {
  getProfile:    ()     => request("GET",  "/supervisors/profile"),
  createProfile: (data) => request("POST", "/supervisors/profile", data),
  updateProfile: (data) => request("PUT",  "/supervisors/profile", data),
  list:          ()     => request("GET",  "/supervisors/"),
};

// ── Intern Positions ──────────────────────────────────────────────────────────
export const positionAPI = {
  list:      ()       => request("GET",  "/positions/"),
  myList:    ()       => request("GET",  "/positions/my"),
  getById:   (id)     => request("GET",  `/positions/${id}`),
  create:    (data)   => request("POST", "/positions/",  data),
  update:    (id, d)  => request("PUT",  `/positions/${id}`, d),
};

// ── Applications ──────────────────────────────────────────────────────────────
export const applicationAPI = {
  apply:           (posId, documentIds, coverLetter) => request("POST", "/applications/", { intern_position_id: posId, document_ids: documentIds || [], cover_letter: coverLetter || undefined }),
  myApplications:  ()                   => request("GET",  "/applications/my"),
  companyApps:     ()                   => request("GET",  "/applications/company"),
  updateStatus:    (id, status, remarks) => request("PATCH", `/applications/${id}/status`, { status, remarks }),
};

// ── Interviews ────────────────────────────────────────────────────────────────
export const interviewAPI = {
  schedule:     (data)         => request("POST",  "/interviews/",               data),
  myList:       ()             => request("GET",   "/interviews/my"),
  updateStatus: (id, status)   => request("PATCH", `/interviews/${id}/status`,   { status }),
};

// ── Evaluations ───────────────────────────────────────────────────────────────
export const evaluationAPI = {
  submit:      (data)     => request("POST", "/evaluations/",              data),
  forIntern:   (internId) => request("GET",  `/evaluations/intern/${internId}`),
};

// ── Notifications ─────────────────────────────────────────────────────────────
export const notificationAPI = {
  myList:   ()   => request("GET",   "/notifications/my"),
  markRead: (id) => request("PATCH", `/notifications/${id}/read`),
};

// ── Interns ───────────────────────────────────────────────────────────────────
export const internAPI = {
  start:          (data)       => request("POST",  "/interns/",                data),
  myList:         ()           => request("GET",   "/interns/my"),
  studentHistory: ()           => request("GET",   "/interns/student-history"),
  available:      ()           => request("GET",   "/interns/available"),
  supervised:     ()           => request("GET",   "/interns/supervised"),
  claim:          (id)         => request("PATCH", `/interns/${id}/claim`),
  updateStatus:   (id, status) => request("PATCH", `/interns/${id}/status`,  { status }),
};

// ── Universities ──────────────────────────────────────────────────────────────
export const universityAPI = {
  list: () => request("GET", "/universities/"),
};

// ── Skills ────────────────────────────────────────────────────────────────────
export const skillAPI = {
  list: () => request("GET", "/skills/"),
};

// ── Documents ─────────────────────────────────────────────────────────────────
export const documentAPI = {
  myList: ()           => request("GET",    "/documents/my"),
  add:    (data)       => request("POST",   "/documents/",        data),
  update: (id, data)   => request("PUT",    `/documents/${id}`,   data),
  remove: (id)         => request("DELETE", `/documents/${id}`),
};

// ── Supervision Requests ──────────────────────────────────────────────────────
export const supervisionRequestAPI = {
  request:  (supervisor_id, message) => request("POST",   "/supervision-requests/",              { supervisor_id, message }),
  myList:   ()                        => request("GET",    "/supervision-requests/my"),
  cancel:   (id)                      => request("DELETE", `/supervision-requests/${id}`),
  incoming: ()                        => request("GET",    "/supervision-requests/incoming"),
  respond:  (id, status)              => request("PATCH",  `/supervision-requests/${id}/respond`, { status }),
};

// ── Supervisor Notifications ──────────────────────────────────────────────────
export const supervisorNotifAPI = {
  myList:   () =>  request("GET",   "/supervisor-notifications/my"),
  markRead: (id) => request("PATCH", `/supervisor-notifications/${id}/read`),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  listUsers:     ()              => request("GET",    "/admin/users"),
  verifyCompany: (id, status)    => request("PATCH",  `/admin/companies/${id}/verify?verified_status=${status}`),
  auditLogs:     ()              => request("GET",    "/admin/audit-logs"),
  deleteUser:    (id)            => request("DELETE", `/admin/users/${id}`),
};
