function StatsSection() {
  return (
    <section className="stats-section">
      <div className="stats-overlay"></div>
      <div className="container stats-grid">
        <div className="stat-item reveal">
          <span className="stat-num" data-target="50">
            0
          </span>
          <span className="stat-suffix">+</span>
          <p>Projects Completed</p>
        </div>
        <div className="stat-sep"></div>
        <div className="stat-item reveal">
          <span className="stat-num" data-target="15">
            0
          </span>
          <span className="stat-suffix">+</span>
          <p>Years Experience</p>
        </div>
        <div className="stat-sep"></div>
        <div className="stat-item reveal">
          <span className="stat-num" data-target="100">
            0
          </span>
          <span className="stat-suffix">%</span>
          <p>Client Satisfaction</p>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
