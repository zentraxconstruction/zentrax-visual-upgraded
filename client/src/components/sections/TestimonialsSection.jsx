function TestimonialsSection() {
  return (
    <section className="testi-section dark-section">
      <div className="container">
        <div className="section-tag reveal" style={{ color: "var(--gold)" }}>
          Testimonials
        </div>
        <h2 className="section-title reveal" style={{ color: "var(--off-white)" }}>
          What Our
          <br />
          <em>Clients Say</em>
        </h2>
        <div className="testi-carousel">
          <div className="testi-track" id="testiTrack">
            <div className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <p>
                "Zentrax transformed our vision into an architectural masterpiece. Their attention to
                detail and professionalism is unmatched."
              </p>
              <div className="testi-author">- Rajesh K., Mysuru</div>
            </div>
            <div className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <p>
                "From the first consultation to the final handover, the Zentrax team exceeded every
                expectation. Truly world-class service."
              </p>
              <div className="testi-author">- Priya M., Bangalore</div>
            </div>
            <div className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <p>
                "We entrusted our commercial project to Zentrax and the results were spectacular.
                Delivered on time, on budget, and beyond our dreams."
              </p>
              <div className="testi-author">- Arun S., Mysuru</div>
            </div>
          </div>
          <div className="testi-controls">
            <button className="testi-btn" id="testPrev" type="button">
              &#8592;
            </button>
            <div className="testi-dots">
              <span className="dot active" data-i="0"></span>
              <span className="dot" data-i="1"></span>
              <span className="dot" data-i="2"></span>
            </div>
            <button className="testi-btn" id="testNext" type="button">
              &#8594;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
