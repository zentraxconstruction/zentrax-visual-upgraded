function WhyChooseSection() {
  return (
    <section className="why-section dark-section">
      <div className="container">
        <div className="section-tag reveal" style={{ color: "var(--gold)" }}>
          Why Choose Us
        </div>
        <h2 className="section-title reveal" style={{ color: "var(--off-white)" }}>
          The Zentrax
          <br />
          <em>Difference</em>
        </h2>
        <div className="why-grid">
          <div className="why-card reveal">
            <div className="why-icon">✦</div>
            <h3>Unmatched Quality</h3>
            <p>
              Every detail is executed with meticulous precision. We use only the finest materials and
              construction techniques.
            </p>
          </div>
          <div className="why-card reveal">
            <div className="why-icon">✦</div>
            <h3>End-to-End Service</h3>
            <p>
              From initial concept to final handover, we manage every phase of your project
              seamlessly.
            </p>
          </div>
          <div className="why-card reveal">
            <div className="why-icon">✦</div>
            <h3>Timely Delivery</h3>
            <p>
              We respect your time. Our rigorous project management ensures on-time, on-budget
              delivery every time.
            </p>
          </div>
          <div className="why-card reveal">
            <div className="why-icon">✦</div>
            <h3>24/7 Support</h3>
            <p>
              Our dedicated team is always available to address your needs and ensure complete peace
              of mind.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseSection;
