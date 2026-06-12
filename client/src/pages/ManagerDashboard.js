import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import ConfirmModal from "../components/ui/ConfirmModal";
import { useToast } from "../components/ui/ToastContext";
import api from "../utils/api";

const NAV = [
  { to: "/manager",             label: "Dashboard", icon: "⬡", end: true },
  { to: "/manager/projects",    label: "My Projects", icon: "◈" },
  { to: "/manager/add-project", label: "Add Project", icon: "+" },
  { to: "/manager/clients",     label: "Clients",    icon: "◇" },
  { to: "/manager/milestones",  label: "Milestones",  icon: "◎" },
];

// ── My Projects ───────────────────────────────────────────────────────────────
function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // { id, completion, status }

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get("/manager/projects");
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/manager/projects/${editing.id}/progress`, {
        completion: Number(editing.completion),
        status: editing.status,
      });
      setEditing(null);
      loadProjects();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <p style={{ color: "#888" }}>Loading…</p>;

  return (
    <div className="dash-card">
      <div className="dash-card-title">Assigned Projects</div>
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead><tr><th>Project</th><th>Client</th><th>Status</th><th>Progress</th><th>Action</th></tr></thead>
          <tbody>
            {(projects || []).map((p) => (
              <tr key={p._id}>
                <td>{p.title}<br /><small style={{ color:"#666" }}>{p.location}</small></td>
                <td>{p.clientId?.name || "—"}</td>
                <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                <td style={{ width: 140 }}>
                  <div className="progress-bar-wrap"><div className="progress-bar-fill" style={{ width: `${p.completion}%` }} /></div>
                  <small style={{ color:"#888" }}>{p.completion}%</small>
                </td>
                <td>
                  <button className="btn-outline" onClick={() => setEditing({ id: p._id, completion: p.completion, status: p.status })}>
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color:"var(--gold)", marginBottom:"1rem", fontFamily:"var(--font-head)", fontSize:"0.7rem", letterSpacing:"0.2em", textTransform:"uppercase" }}>Update Progress</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group" style={{ marginBottom:"1rem" }}>
                <label>Completion %</label>
                <input type="number" min={0} max={100} value={editing.completion}
                  onChange={(e) => setEditing({ ...editing, completion: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom:"1.5rem" }}>
                <label>Status</label>
                <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                  <option value="pending">Pending</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div style={{ display:"flex", gap:"0.5rem" }}>
                <button className="btn-gold" type="submit">Save</button>
                <button className="btn-outline" type="button" onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Milestones ────────────────────────────────────────────────────────────────
function Milestones() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", date: "" });

  useEffect(() => {
    api.get("/manager/projects")
      .then((res) => setProjects(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedProject) {
      setMilestones([]);
      return;
    }
    setLoading(true);
    api.get(`/manager/projects/${selectedProject}/milestones`)
      .then((res) => setMilestones(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedProject]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedProject) { alert("Select a project first"); return; }
    try {
      await api.post(`/manager/projects/${selectedProject}/milestones`, form);
      setForm({ title: "", description: "", date: "" });
      // Reload milestones
      const res = await api.get(`/manager/projects/${selectedProject}/milestones`);
      setMilestones(res.data || []);
    } catch (err) { alert(err.message); }
  };

  const handleToggle = async (id) => {
    try { 
      await api.put(`/manager/milestones/${id}/toggle`);
      // Reload milestones
      const res = await api.get(`/manager/projects/${selectedProject}/milestones`);
      setMilestones(res.data || []);
    }
    catch (err) { alert(err.message); }
  };

  return (
    <>
      <div className="dash-card">
        <div className="dash-card-title">Project Milestones</div>
        <div className="form-group" style={{ marginBottom:"1rem" }}>
          <label>Select Project</label>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
            <option value="">— Choose a project —</option>
            {(projects || []).map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
          </select>
        </div>

        {selectedProject && (
          <form onSubmit={handleAdd}>
            <div className="form-row">
              <div className="form-group"><label>Milestone Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            </div>
            <button className="btn-gold" type="submit">Add Milestone</button>
          </form>
        )}
      </div>

      {selectedProject && (
        <div className="dash-card">
          <div className="dash-card-title">Milestones</div>
          {loading ? <p style={{ color:"#888" }}>Loading…</p> : (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead><tr><th>Title</th><th>Date</th><th>Status</th><th>Toggle</th></tr></thead>
                <tbody>
                  {(milestones || []).map((m) => (
                    <tr key={m._id}>
                      <td style={{ textDecoration: m.completed ? "line-through" : "none", opacity: m.completed ? 0.6 : 1 }}>{m.title}</td>
                      <td>{m.date ? new Date(m.date).toLocaleDateString() : "—"}</td>
                      <td><span className={`badge ${m.completed ? "badge-completed" : "badge-pending"}`}>{m.completed ? "Done" : "Pending"}</span></td>
                      <td><button className="btn-outline" onClick={() => handleToggle(m._id)}>Toggle</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}

import DashboardHome from "../components/dashboard/DashboardHome";
const ProjectsPage = React.lazy(() => import("../components/projects/ProjectsPage"));
const AddProject = React.lazy(() => import("./AddProject"));

function ClientManager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [confirm, setConfirm] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { addToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/manager/clients");
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await api.post("/manager/clients", form);
      setForm({ name: "", email: "", password: "" });
      addToast('Client added', { type: 'success' });
      loadData();
    } catch (err) {
      const message = err.message || 'Add client failed';
      setErrorMessage(message);
      addToast(message, { type: 'error' });
    }
  };

  const handleRemove = (id) => {
    setConfirm({ id, title: 'Remove this client?' });
  };

  const confirmRemove = async () => {
    if (!confirm) return;
    try {
      await api.delete(`/manager/clients/${confirm.id}`);
      addToast('Client removed', { type: 'success' });
      setConfirm(null);
      await loadData();
    } catch (err) { addToast(err.message || 'Remove failed', { type: 'error' }); }
  };

  return (
    <>
      <div className="dash-card">
        <div className="dash-card-title">Add Client</div>
        <form onSubmit={handleAdd}>
          <div className="form-row">
            <div className="form-group"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label>Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#f3e8c7',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {errorMessage && <div style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{errorMessage}</div>}
          <button className="btn-gold" type="submit">Add Client</button>
        </form>
      </div>

      <div className="dash-card">
        <div className="dash-card-title">All Clients</div>
        {loading ? <p style={{ color: "#888" }}>Loading…</p> : (
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

      <ConfirmModal
        isOpen={!!confirm}
        title={confirm?.title || 'Confirm'}
        message={confirm?.title || ''}
        onCancel={() => setConfirm(null)}
        onConfirm={confirmRemove}
      />
    </>
  );
}

export default function ManagerDashboard() {
  return (
    <DashboardLayout title="Manager Dashboard" navItems={NAV}>
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="projects" element={<React.Suspense fallback={<div>Loading…</div>}><ProjectsPage /></React.Suspense>} />
          <Route path="add-project" element={<React.Suspense fallback={<div>Loading…</div>}><AddProject /></React.Suspense>} />
          <Route path="clients" element={<ClientManager />} />
          <Route path="milestones" element={<Milestones />} />
          <Route path="*" element={<Navigate to="/manager" replace />} />
        </Routes>
    </DashboardLayout>
  );
}
