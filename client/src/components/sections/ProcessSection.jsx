function ProcessSection() {
  return (
    <section className="process-section section">
      <div className="container">
        <div className="section-tag reveal">Our Process</div>
        <h2 className="section-title reveal">
          How We
          <br />
          <em>Work</em>
        </h2>
        <div className="timeline">
          <div className="tl-item reveal">
            <div className="tl-num">01</div>
            <div className="tl-line"></div>
            <div className="tl-content">
              <h3>Discovery &amp; Consultation</h3>
              <p>
                We begin with a thorough understanding of your vision, goals, and budget
                requirements.
              </p>
            </div>
          </div>
          <div className="tl-item reveal">
            <div className="tl-num">02</div>
            <div className="tl-line"></div>
            <div className="tl-content">
              <h3>Design &amp; Planning</h3>
              <p>
                Our expert team crafts detailed blueprints and 3D models tailored to your exact
                specifications.
              </p>
            </div>
          </div>
          <div className="tl-item reveal">
            <div className="tl-num">03</div>
            <div className="tl-line"></div>
            <div className="tl-content">
              <h3>Construction &amp; Execution</h3>
              <p>
                With precision engineering and premium materials, we bring your vision to life on
                schedule.
              </p>
            </div>
          </div>
          <div className="tl-item reveal">
            <div className="tl-num">04</div>
            <div className="tl-line"></div>
            <div className="tl-content">
              <h3>Handover &amp; Support</h3>
              <p>
                We deliver your completed project and remain available for ongoing maintenance and
                care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
