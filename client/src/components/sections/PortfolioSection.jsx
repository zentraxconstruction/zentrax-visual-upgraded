import vertexImg from "../../assets/vertex.jpg";
import coastalImg from "../../assets/cr.jpg";
import innovationImg from "../../assets/ic.jpg";
import townshipImg from "../../assets/jj.jpg";

function PortfolioSection() {
  return (
    <section id="portfolio" className="section dark-section">
      <div className="container">
        <div className="section-tag reveal" style={{ color: "var(--gold)" }}>
          Our Portfolio
        </div>
        <h2 className="section-title reveal" style={{ color: "var(--off-white)" }}>
          Crafting Excellence Across
          <br />
          <em>Diverse Projects</em>
        </h2>
        <p className="section-desc reveal" style={{ color: "var(--gray-mid)" }}>
          Each project represents our commitment to innovation, quality, and timeless design.
        </p>

        <div className="portfolio-grid">
          <div className="port-card" data-modal="vertex">
            <div className="port-img-wrap">
              <img
                src={vertexImg}
                alt="Vertex Tower"
              />
              <div className="port-overlay">
                <button type="button" className="port-view open-modal" data-modal="vertex" aria-label="View Vertex Tower details">View Details</button>
              </div>
            </div>
            <div className="port-info">
              <span className="port-cat">Mixed-Use Development</span>
              <h3>Vertex Tower</h3>
              <span className="port-year">2025</span>
            </div>
          </div>

          <div className="port-card" data-modal="coastal">
            <div className="port-img-wrap">
              <img
                src={coastalImg}
                alt="Coastal Residence"
              />
              <div className="port-overlay">
                <button type="button" className="port-view open-modal" data-modal="coastal" aria-label="View Coastal Residence details">View Details</button>
              </div>
            </div>
            <div className="port-info">
              <span className="port-cat">Luxury Living</span>
              <h3>Coastal Residence</h3>
              <span className="port-year">2025</span>
            </div>
          </div>

          <div className="port-card" data-modal="innovation">
            <div className="port-img-wrap">
              <img
                src={innovationImg}
                alt="Innovation Center"
              />
              <div className="port-overlay">
                <button type="button" className="port-view open-modal" data-modal="innovation" aria-label="View Innovation Center details">View Details</button>
              </div>
            </div>
            <div className="port-info">
              <span className="port-cat">Corporate Campus</span>
              <h3>Innovation Center</h3>
              <span className="port-year">2025</span>
            </div>
          </div>

          <div className="port-card" data-modal="township">
            <div className="port-img-wrap">
              <img
                src={townshipImg}
                alt="Residential Township"
              />
              <div className="port-overlay">
                <button type="button" className="port-view open-modal" data-modal="township" aria-label="View Residential Township details">View Details</button>
              </div>
            </div>
            <div className="port-info">
              <span className="port-cat">Planned Community</span>
              <h3>Residential Township</h3>
              <span className="port-year">2024</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PortfolioSection;
