import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../utils/api";
import Modal from "../components/ui/Modal";

const NAV = [
  { to: "/client",           label: "My Project",  icon: "⬡", end: true },
  { to: "/client/milestones", label: "Milestones", icon: "◈" },
  { to: "/client/photos",    label: "Photos",      icon: "◎" },
  { to: "/client/feedback",  label: "Feedback",    icon: "◉" },
];

// ── My Project Overview ───────────────────────────────────────────────────────
function MyProject({ openLightbox }) {
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
      <div style={{ marginBottom: "1rem", cursor: project?.images?.length ? "pointer" : "default" }}>
        {project.images && project.images.length > 0 ? (
          <img
            src={project.images[0]}
            alt={project.title}
            style={{
              width: "100%",
              height: 260,
              objectFit: "cover",
              objectPosition: "center",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.04)",
              display: "block",
            }}
            onClick={() => {
              const combined = (project.images || []).map((u, i) => ({ _id: `proj-${i}`, filename: u, caption: project.title }));
              openLightbox(0, combined);
            }}
            onError={(e) => { e.target.onerror = null; e.target.src = "/images/coming-soon-1.jpeg" }}
          />
        ) : (
          <div style={{ width: "100%", height: 220, borderRadius: 6, background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.06))", display: "flex", alignItems: "center", justifyContent: "center", color: "#666", border: "1px solid rgba(255,255,255,0.03)" }}>
            No project photo
          </div>
        )}
      </div>
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
function Photos({ openLightbox }) {
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

  // Merge project.images (stored on Project) with uploaded photos so property pics appear in Photos tab
  const projectImages = (project.images || []).map((url, i) => ({ _id: `proj-${i}`, filename: url, caption: project.title }));
  const combined = [...projectImages, ...(photos || [])];

  return (
    <div className="dash-card">
      <div className="dash-card-title">Progress Photos</div>
      {combined.length === 0 ? (
        <p style={{ color:"#666" }}>No photos uploaded yet.</p>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"1rem" }}>
          {combined.map((ph, idx) => (
            <div key={ph._id || idx} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", padding:"0.75rem", cursor: 'pointer' }} onClick={() => { openLightbox(idx, combined); }}>
              {ph.filename ? (
                <img src={ph.filename} alt={ph.caption || ''} style={{ width:"100%", height:140, objectFit:"cover", display:"block", borderRadius:4 }} onError={(e)=>{e.target.onerror=null;e.target.src='/images/coming-soon-1.jpeg'}} />
              ) : (
                <div style={{ width:"100%", height:140, background:"rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center", color:"#555" }}>
                  No preview
                </div>
              )}
              {ph.caption && <p style={{ fontSize:"0.78rem", color:"#888", marginTop:"0.5rem" }}>{ph.caption}</p>}
              <p style={{ fontSize:"0.65rem", color:"#555", marginTop:"0.25rem" }}>{ph.uploaderId?.name ? `By ${ph.uploaderId.name}` : ''}</p>
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxPhotos, setLightboxPhotos] = useState([]);

  const openLightbox = (index, photos) => {
    setLightboxPhotos(photos || []);
    setLightboxIndex(index || 0);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const showPrev = () => setLightboxIndex((i) => (i - 1 + lightboxPhotos.length) % lightboxPhotos.length);
  const showNext = () => setLightboxIndex((i) => (i + 1) % lightboxPhotos.length);
  return (
    <DashboardLayout title="Client Portal" navItems={NAV}>
      <Routes>
        <Route index             element={<MyProject openLightbox={openLightbox} />} />
        <Route path="milestones" element={<Milestones />} />
        <Route path="photos"     element={<Photos openLightbox={openLightbox} />} />
        <Route path="feedback"   element={<FeedbackSection />} />
        <Route path="*"          element={<Navigate to="/client" replace />} />
      </Routes>

      <Modal isOpen={lightboxOpen} onClose={closeLightbox}>
        <div style={{ maxWidth: 1000, width: '100%' }}>
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <button onClick={closeLightbox} style={{ position:'absolute', right:8, top:8, background:'transparent', border:'none', color:'#fff', fontSize:18 }}>✕</button>
            <button onClick={showPrev} style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.4)', border:'none', color:'#fff', padding:'8px 10px', borderRadius:4 }}>‹</button>
            <img src={lightboxPhotos[lightboxIndex]?.filename} alt={lightboxPhotos[lightboxIndex]?.caption || ''} style={{ maxHeight: '65vh', width: '100%', objectFit: 'contain', background:'#000' }} onError={(e)=>{e.target.onerror=null;e.target.src='/images/coming-soon-1.jpeg'}} />
            <button onClick={showNext} style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.4)', border:'none', color:'#fff', padding:'8px 10px', borderRadius:4 }}>›</button>
          </div>
          {lightboxPhotos.length > 1 && (
            <div style={{ display:'flex', gap:8, marginTop:12, overflowX:'auto', paddingBottom:8 }}>
              {lightboxPhotos.map((p, i) => (
                <img key={p._id || i} src={p.filename} alt={p.caption || ''} onClick={() => setLightboxIndex(i)} style={{ width:80, height:60, objectFit:'cover', borderRadius:4, border: i === lightboxIndex ? '3px solid #c9a93f' : '2px solid rgba(255,255,255,0.05)', cursor:'pointer' }} onError={(e)=>{e.target.onerror=null;e.target.src='/images/coming-soon-1.jpeg'}} />
              ))}
            </div>
          )}
        </div>
      </Modal>
    </DashboardLayout>
  );
}
