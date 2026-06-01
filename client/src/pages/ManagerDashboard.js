import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../utils/api";

const NAV = [
  { to: "/manager",             label: "My Projects", icon: "⬡", end: true },
  { to: "/manager/milestones",  label: "Milestones",  icon: "◈" },
  { to: "/manager/uploads",     label: "Photo Uploads", icon: "◎" },
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

export default function ManagerDashboard() {
  return (
    <DashboardLayout title="Manager Dashboard" navItems={NAV}>
      <Routes>
        <Route index             element={<MyProjects />} />
        <Route path="milestones" element={<Milestones />} />
        <Route path="*"          element={<Navigate to="/manager" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
