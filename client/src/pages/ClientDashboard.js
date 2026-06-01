import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../utils/api";

const NAV = [
  { to: "/client",           label: "My Project",  icon: "⬡", end: true },
  { to: "/client/milestones", label: "Milestones", icon: "◈" },
  { to: "/client/photos",    label: "Photos",      icon: "◎" },
  { to: "/client/feedback",  label: "Feedback",    icon: "◉" },
];

// ── My Project Overview ───────────────────────────────────────────────────────
function MyProject() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/client/project")
      .then((res) => setProject(res.data || res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color:"#888" }}>Loading…</p>;
  if (!project) return <div className="dash-card"><p style={{ color:"#888" }}>No project assigned yet.</p></div>;

  return (
    <>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Project</div><div className="stat-value" style={{ fontSize:"1.2rem" }}>{project.title}</div></div>
        <div className="stat-card"><div className="stat-label">Progress</div><div className="stat-value">{project.completion}%</div></div>
        <div className="stat-card"><div className="stat-label">Status</div><div className="stat-value" style={{ fontSize:"1rem" }}>{project.status}</div></div>
        <div className="stat-card"><div className="stat-label">Manager</div><div className="stat-value" style={{ fontSize:"1rem" }}>{project.managerId?.name || "—"}</div></div>
      </div>

      <div className="dash-card">
        <div className="dash-card-title">Construction Progress</div>
        <div style={{ marginBottom:"0.5rem", color:"#888", fontSize:"0.85rem" }}>{project.location}</div>
        <div className="progress-bar-wrap" style={{ height: 8, marginBottom:"0.5rem" }}>
          <div className="progress-bar-fill" style={{ width:`${project.completion}%` }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.75rem", color:"#666" }}>
          <span>Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : "—"}</span>
          <span>{project.completion}% complete</span>
          <span>End: {project.endDate ? new Date(project.endDate).toLocaleDateString() : "TBD"}</span>
        </div>
        <div style={{ marginTop:"1rem", fontSize:"0.85rem", color:"#aaa" }}>{project.description}</div>
      </div>
    </>
  );
}

// ── Milestones (read-only) ────────────────────────────────────────────────────
function Milestones() {
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/client/project")
      .then((res) => setProject(res.data || res))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!project?._id) return;
    api.get(`/client/projects/${project._id}/milestones`)
      .then((res) => setMilestones(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [project?._id]);

  if (loading || !project) return <p style={{ color:"#888" }}>Loading…</p>;

  return (
    <div className="dash-card">
      <div className="dash-card-title">Project Milestones</div>
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead><tr><th>Milestone</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {(milestones || []).map((m) => (
              <tr key={m._id}>
                <td style={{ textDecoration: m.completed ? "line-through" : "none", opacity: m.completed ? 0.6 : 1 }}>{m.title}</td>
                <td>{m.date ? new Date(m.date).toLocaleDateString() : "—"}</td>
                <td><span className={`badge ${m.completed ? "badge-completed" : "badge-pending"}`}>{m.completed ? "✓ Done" : "Pending"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Photos ────────────────────────────────────────────────────────────────────
function Photos() {
  const [project, setProject] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/client/project")
      .then((res) => setProject(res.data || res))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!project?._id) return;
    api.get(`/client/projects/${project._id}/photos`)
      .then((res) => setPhotos(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [project?._id]);

  if (loading || !project) return <p style={{ color:"#888" }}>Loading…</p>;

  return (
    <div className="dash-card">
      <div className="dash-card-title">Progress Photos</div>
      {(photos || []).length === 0 ? (
        <p style={{ color:"#666" }}>No photos uploaded yet.</p>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"1rem" }}>
          {photos.map((ph) => (
            <div key={ph._id} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", padding:"0.75rem" }}>
              {ph.filename?.startsWith("data:") ? (
                <img src={ph.filename} alt={ph.caption} style={{ width:"100%", height:140, objectFit:"cover", display:"block" }} />
              ) : (
                <div style={{ width:"100%", height:140, background:"rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center", color:"#555" }}>
                  No preview
                </div>
              )}
              {ph.caption && <p style={{ fontSize:"0.78rem", color:"#888", marginTop:"0.5rem" }}>{ph.caption}</p>}
              <p style={{ fontSize:"0.65rem", color:"#555", marginTop:"0.25rem" }}>By {ph.uploaderId?.name || "—"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Feedback ──────────────────────────────────────────────────────────────────
function FeedbackSection() {
  const [project, setProject] = useState(null);
  const [myFeedback, setMyFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ message: "", rating: 5 });

  const loadProject = async () => {
    try {
      const res = await api.get("/client/project");
      setProject(res.data || res);
    } catch (err) {
      console.error(err);
    }
  };

  const loadFeedback = async () => {
    try {
      const res = await api.get("/client/feedback");
      setMyFeedback(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
    loadFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project) { alert("No project found"); return; }
    try {
      await api.post("/client/feedback", { ...form, project_id: project._id });
      setForm({ message: "", rating: 5 });
      loadFeedback();
    } catch (err) { alert(err.message); }
  };

  return (
    <>
      <div className="dash-card">
        <div className="dash-card-title">Submit Feedback</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom:"0.75rem" }}>
            <label>Rating</label>
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
              {[5,4,3,2,1].map((r) => <option key={r} value={r}>{"★".repeat(r)} ({r}/5)</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom:"0.75rem" }}>
            <label>Your Feedback</label>
            <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          </div>
          <button className="btn-gold" type="submit">Submit</button>
        </form>
      </div>

      <div className="dash-card">
        <div className="dash-card-title">My Feedback History</div>
        {loading ? <p style={{ color:"#888" }}>Loading…</p> : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>Project</th><th>Rating</th><th>Message</th><th>Date</th></tr></thead>
              <tbody>
                {(myFeedback || []).map((f) => (
                  <tr key={f._id}>
                    <td>{f.projectId?.title || "—"}</td>
                    <td>{"★".repeat(f.rating)}</td>
                    <td>{f.message}</td>
                    <td>{new Date(f.createdAt).toLocaleDateString()}</td>
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

export default function ClientDashboard() {
  return (
    <DashboardLayout title="Client Portal" navItems={NAV}>
      <Routes>
        <Route index             element={<MyProject />} />
        <Route path="milestones" element={<Milestones />} />
        <Route path="photos"     element={<Photos />} />
        <Route path="feedback"   element={<FeedbackSection />} />
        <Route path="*"          element={<Navigate to="/client" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
