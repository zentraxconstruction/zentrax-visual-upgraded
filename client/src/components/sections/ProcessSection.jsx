const steps = [
  { icon: "📝", title: "Client Brief", subtitle: "Understanding requirements and project ambitions." },
  { icon: "📍", title: "Site Analysis", subtitle: "Feasibility, terrain study, and context evaluation." },
  { icon: "🧭", title: "Concept Design", subtitle: "Early layouts and premium vision planning." },
  { icon: "📐", title: "Detailed Design", subtitle: "Technical drawings, specifications, and refinement." },
  { icon: "🏗️", title: "Structural Planning", subtitle: "Engineering strategy and build sequencing." },
  { icon: "✅", title: "Approval", subtitle: "Regulatory checks and stakeholder sign-off." },
  { icon: "🚧", title: "Execution", subtitle: "Construction begins with precision and care." },
  { icon: "🔎", title: "Inspection", subtitle: "Quality reviews and performance assurance." },
  { icon: "🎯", title: "Completion", subtitle: "Project handover with premium client experience." },
];

function ProcessSection() {
  return (
    <section className="process-section section">
      <div className="container">
        <div className="section-tag reveal">Our Process</div>
        <h2 className="section-title reveal">
          How We <br />
          <em>Work</em>
        </h2>
        <p className="section-copy reveal">
          A refined, premium workflow designed to showcase every phase of the Zentrax experience.
        </p>
        <div className="process-grid reveal">
          {steps.map((step, idx) => (
            <div className={`process-card reveal ${idx < steps.length - 1 ? "with-connector" : ""}`} key={step.title}>
              <div className="process-card-head">
                <span className="process-icon">{step.icon}</span>
                <span className="process-step-number">0{idx + 1}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.subtitle}</p>
              {idx < steps.length - 1 && <span className="process-connector" aria-hidden="true"></span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
