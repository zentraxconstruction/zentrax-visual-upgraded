import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../utils/api";

// ── Nav config ────────────────────────────────────────────────────────────────
const NAV = [
  { to: "/admin",          label: "Overview",  icon: "◈", end: true },
  { to: "/admin/projects", label: "Projects",  icon: "⬡" },
  { to: "/admin/managers", label: "Managers",  icon: "◎" },
  { to: "/admin/clients",  label: "Clients",   icon: "◇" },
  { to: "/admin/feedback", label: "Feedback",  icon: "◉" },
];

// ── Sub-views ─────────────────────────────────────────────────────────────────
function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats")
      .then((data) => setStats(data.data || data.stats || data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: "#888" }}>Loading…</p>;
  if (!stats)  return null;
  const cards = [
    { label: "Total Projects",    value: stats.total     },
    { label: "Ongoing",           value: stats.ongoing   },
    { label: "Completed",         value: stats.completed },
    { label: "Pending",           value: stats.pending   },
    { label: "Managers",          value: stats.managers  },
    { label: "Clients",           value: stats.clients   },
  ];
  return (
    <div className="stat-grid">
      {cards.map((c) => (
        <div className="stat-card" key={c.label}>
          <div className="stat-label">{c.label}</div>
          <div className="stat-value">{c.value ?? 0}</div>
        </div>
      ))}
    </div>
  );
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", description: "", location: "", clientId: "", managerId: "", startDate: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      const [projRes, mgrRes, cliRes] = await Promise.all([
        api.get("/admin/projects"),
        api.get("/admin/managers"),
        api.get("/admin/clients"),
      ]);
      setProjects(projRes.data || []);
      setManagers(mgrRes.data || []);
      setClients(cliRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/projects", {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
      });
      setFormData({ title: "", description: "", location: "", clientId: "", managerId: "", startDate: "" });
      loadData();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try { 
      await api.delete(`/admin/projects/${id}`);
      loadData();
    }
    catch (err) { alert(err.message); }
  };

  return (
    <>
      <div className="dash-card">
        <div className="dash-card-title">Add New Project</div>
        <form onSubmit={handleAdd}>
          <div className="form-row">
            <div className="form-group"><label>Title *</label><input name="title" value={formData.title} onChange={handleChange} required /></div>
            <div className="form-group"><label>Location</label><input name="location" value={formData.location} onChange={handleChange} /></div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Client</label>
              <select name="clientId" value={formData.clientId} onChange={handleChange}>
                <option value="">— Select Client —</option>
                {(clients || []).map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Manager</label>
              <select name="managerId" value={formData.managerId} onChange={handleChange}>
                <option value="">— Select Manager —</option>
                {(managers || []).map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="project-startDate">Start Date</label>
              <input
                id="project-startDate"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <button className="btn-gold" type="submit">Add Project</button>
        </form>
      </div>

      <div className="dash-card">
        <div className="dash-card-title">All Projects</div>
        {loading ? <p style={{ color:"#888" }}>Loading…</p> : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>Title</th><th>Client</th><th>Manager</th><th>Status</th><th>Progress</th><th>Action</th></tr></thead>
              <tbody>
                {(projects || []).map((p) => (
                  <tr key={p._id}>
                    <td>{p.title}</td>
                    <td>{p.clientId?.name || "—"}</td>
                    <td>{p.managerId?.name || "—"}</td>
                    <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                    <td>
                      <div className="progress-bar-wrap"><div className="progress-bar-fill" style={{ width: `${p.completion}%` }} /></div>
                      <span style={{ fontSize:"0.72rem", color:"#888" }}>{p.completion}%</span>
                    </td>
                    <td><button className="btn-danger" onClick={() => handleDelete(p._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function UserManager({ role, apiPath, roleLabel }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/${apiPath}`);
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [apiPath]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/${apiPath}`, form);
      setForm({ name: "", email: "", password: "" });
      loadData();
    } catch (err) { alert(err.message); }
  };

  const handleRemove = async (id) => {
    if (!window.confirm(`Remove this ${roleLabel}?`)) return;
    try { 
      await api.delete(`/admin/${apiPath}/${id}`);
      loadData();
    }
    catch (err) { alert(err.message); }
  };

  return (
    <>
      <div className="dash-card">
        <div className="dash-card-title">Add {roleLabel}</div>
        <form onSubmit={handleAdd}>
          <div className="form-row">
            <div className="form-group"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
          </div>
          <button className="btn-gold" type="submit">Add {roleLabel}</button>
        </form>
      </div>
      <div className="dash-card">
        <div className="dash-card-title">All {roleLabel}s</div>
        {loading ? <p style={{ color:"#888" }}>Loading…</p> : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Action</th></tr></thead>
              <tbody>
                {(data || []).map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td><button className="btn-danger" onClick={() => handleRemove(u._id)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function Feedback() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/feedback")
      .then((res) => setData(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-card">
      <div className="dash-card-title">Client Feedback</div>
      {loading ? <p style={{ color:"#888" }}>Loading…</p> : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead><tr><th>Client</th><th>Project</th><th>Rating</th><th>Message</th><th>Date</th></tr></thead>
            <tbody>
              {(data || []).map((f) => (
                <tr key={f._id}>
                  <td>{f.clientId?.name || "—"}</td>
                  <td>{f.projectId?.title || "—"}</td>
                  <td>{"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}</td>
                  <td>{f.message}</td>
                  <td>{new Date(f.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Page assembly ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard" navItems={NAV}>
      <Routes>
        <Route index                element={<Overview />} />
        <Route path="projects"      element={<Projects />} />
        <Route path="managers"      element={<UserManager role="manager" apiPath="managers" roleLabel="Manager" />} />
        <Route path="clients"       element={<UserManager role="client"  apiPath="clients"  roleLabel="Client"  />} />
        <Route path="feedback"      element={<Feedback />} />
        <Route path="*"             element={<Navigate to="/admin" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
