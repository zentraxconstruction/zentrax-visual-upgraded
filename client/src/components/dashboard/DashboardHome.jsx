// Jahnavi test
import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import ChartPlaceholder from "./ChartPlaceholder";
import ActivityTimeline from "./ActivityTimeline";
import ProjectsTable from "./ProjectsTable";
import QuickActions from "./QuickActions";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function DashboardHome() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get("/manager/projects").then((res) => {
      if (!mounted) return;
      setProjects(res.data || []);
    }).catch((e) => console.error(e)).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const total = projects.length;
  const ongoing = projects.filter(p => p.status === 'ongoing').length;
  const completed = projects.filter(p => p.status === 'completed').length;
  const revenue = "—";

  const activity = projects.slice(0,5).map(p => ({ title: `Updated ${p.title}`, time: p.updatedAt ? new Date(p.updatedAt).toLocaleString() : 'Recently' }));
  const navigate = useNavigate();

  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(12,1fr)',gap:16}}>
      <div style={{gridColumn:'span 8',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        <StatCard title="Total Projects" value={total} />
        <StatCard title="Ongoing" value={ongoing} />
        <StatCard title="Completed" value={completed} />

        <div style={{gridColumn:'1 / span 2'}}>
          <ChartPlaceholder title="Monthly Progress" />
        </div>

        <div style={{gridColumn:'3 / span 1'}}>
          <ChartPlaceholder title="Status Distribution" height={220} />
        </div>

        <div style={{gridColumn:'1 / span 3'}}>
          <ProjectsTable projects={projects.slice(0,8)} />
        </div>
      </div>

      <aside style={{gridColumn:'span 4',display:'flex',flexDirection:'column',gap:12}}>
        <div className="zentrax-card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{fontSize:12,color:'var(--zentrax-muted)',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase'}}>Revenue</div>
            <div style={{fontSize:20,fontWeight:700}}>{revenue}</div>
          </div>
        </div>

        <ActivityTimeline items={activity} />

        <div className="zentrax-card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{fontSize:12,color:'var(--zentrax-muted)',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase'}}>Quick Actions</div>
            <div style={{opacity:0.6,fontSize:12}}>v1</div>
          </div>
          <div style={{marginTop:12}}>
            <QuickActions onAddProject={() => navigate('/manager/add-project')} onAddClient={() => navigate('/manager/clients')} onCreateUpdate={() => navigate('/manager/services')} />
          </div>
        </div>
      </aside>
    </div>
  );
}
