function PhilosophySection() {
  return (
    <section id="philosophy" className="section">
      <div className="container">
        <div className="section-tag reveal">Our Philosophy</div>
        <h2 className="section-title reveal">
          We create spaces
          <br />
          <em>that inspire</em>
        </h2>
        <p className="section-desc reveal">
          At Zentrax, we believe architecture is more than buildings - it's about creating
          experiences. Every project is a unique journey where innovation meets tradition, and where
          your vision becomes our blueprint for success.
        </p>

        <div className="philosophy-grid">
          <div className="phil-card reveal">
            <div className="phil-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M12 28l8-16 8 16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M14.5 23h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Find a Space</h3>
            <p>Residential &amp; Commercial Properties</p>
          </div>

          <div className="phil-card reveal">
            <div className="phil-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
                <rect x="12" y="12" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 20h8M20 16v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Design a Space</h3>
            <p>Architecture &amp; Interior Design</p>
          </div>

          <div className="phil-card reveal">
            <div className="phil-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M12 30V18l8-8 8 8v12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect x="17" y="22" width="6" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <h3>Build a Space</h3>
            <p>Construction &amp; Engineering</p>
          </div>

          <div className="phil-card reveal">
            <div className="phil-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M15 25l3-3 2 2 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Specialize a Space</h3>
            <p>Smart &amp; Custom Solutions</p>
          </div>

          <div className="phil-card reveal">
            <div className="phil-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M14 26c0-3.314 2.686-6 6-6s6 2.686 6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="20" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <h3>Maintain a Space</h3>
            <p>Repairs &amp; Facility Management</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PhilosophySection;
