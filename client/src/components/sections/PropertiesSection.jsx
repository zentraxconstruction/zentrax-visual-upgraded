import propertyLease from "../../assets/property-lease.jpg";
import propertyImg from "../../assets/property.jpg";
import PropertyCarousel from "./PropertyCarousel";

function PropertiesSection() {
  const comingSoonPropertyImages = [
    // Use the same local image as a reliable fallback so the carousel frame shows.
    propertyLease,
  ];

  return (
    <section id="properties" className="section properties-section">
      <div className="container">
        <div className="section-tag reveal">Available Now</div>
        <h2 className="section-title reveal">
          Properties
          <br />
          <em>For Lease</em>
        </h2>
        <p className="section-desc reveal">
          Premium residential spaces built with precision and elegance - ready for immediate
          occupancy.
        </p>

        <div className="prop-feature-card open-modal" data-modal="hombelaku" style={{ cursor: "pointer" }}>
          <div className="prop-img-col">
            <div className="prop-img-wrap">
              <img
                src={propertyLease}
                alt="Properties for lease"
                onError={(e) => { e.target.src = "property.jpg"; }}
              />
            </div>
          </div>
          <div className="prop-details-col">
            <div className="prop-tag">Residential Property</div>
            <h3 className="prop-name">Hombelaku Residences</h3>
            <p className="prop-location">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              #44, Hombelaku, Ilavala Hobli, Mysuru, Karnataka
            </p>

            <div className="prop-divider"></div>

            <div className="prop-features-grid">
              <div className="prop-feat">
                <div className="prop-feat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div>
                  <span className="prop-feat-label">Type</span>
                  <span className="prop-feat-val">Multi-Storey Residential</span>
                </div>
              </div>
              <div className="prop-feat">
                <div className="prop-feat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <div>
                  <span className="prop-feat-label">Floors</span>
                  <span className="prop-feat-val">Ground + 4 Floors</span>
                </div>
              </div>
              <div className="prop-feat">
                <div className="prop-feat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                </div>
                <div>
                  <span className="prop-feat-label">Availability</span>
                  <span className="prop-feat-val">Contact for details</span>
                </div>
              </div>
              <div className="prop-feat">
                <div className="prop-feat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87" />
                    <path d="M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <div>
                  <span className="prop-feat-label">Suitable For</span>
                  <span className="prop-feat-val">Families &amp; Professionals</span>
                </div>
              </div>
            </div>

            <div className="prop-divider"></div>

            <div className="prop-highlights">
              <div className="prop-highlight-item">✦ Modern architecture &amp; premium finishes</div>
              <div className="prop-highlight-item">✦ Dedicated parking &amp; secure entry</div>
              <div className="prop-highlight-item">✦ Prime location in Ilavala Hobli, Mysuru</div>
              <div className="prop-highlight-item">✦ Vastu-compliant design</div>
              <div className="prop-highlight-item">✦ 24/7 building security</div>
            </div>

            <div className="prop-divider"></div>

            <div className="prop-address-box">
              <div className="prop-address-label">Full Address</div>
              <div className="prop-address-val">
                #44, Hombelaku, Ilavala Hobli,
                <br />
                Mysuru, Karnataka - India
              </div>
            </div>

            <div className="prop-ctas">
              <a href="tel:7019436720" className="btn-gold">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ marginRight: "6px" }}>
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                Enquire Now
              </a>
              <a
                href="https://wa.me/917019436720?text=Hi%2C%20I%20am%20interested%20in%20the%20property%20at%20%2344%20Hombelaku%2C%20Ilavala%20Hobli%2C%20Mysuru"
                className="btn-outline-dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ marginRight: "6px" }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.535 5.856L.057 23.215a.75.75 0 00.916.927l5.487-1.44A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.735 9.735 0 01-4.964-1.36l-.356-.212-3.685.967.984-3.594-.232-.37A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        <div className="prop-feature-card coming-soon-card open-modal" data-modal="comingsoon" style={{ cursor: "pointer" }}>
          <div className="prop-img-col">
            <div className="prop-img-wrap">
              <img src="/images/coming-soon-1.jpeg" alt="Coming Soon property" />
            </div>
          </div>
          <div className="prop-details-col">
            <div className="prop-tag">Lease Opportunity</div>
            <h3 className="prop-name">Lease Opportunity</h3>
            <p className="prop-location">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              EWS 218, Lakshmikant Nagar, Hebbal 1st Stage, Devaraj Mohalla, Mysore 570017, Karnataka
            </p>

            <div className="prop-divider"></div>

            <p className="prop-description">Property details will be updated soon.</p>

            <div className="prop-features-grid">
              <div className="prop-feat">
                <div className="prop-feat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div>
                  <span className="prop-feat-label">Status</span>
                  <span className="prop-feat-val">Details Soon</span>
                </div>
              </div>
              <div className="prop-feat">
                <div className="prop-feat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <div>
                  <span className="prop-feat-label">Type</span>
                  <span className="prop-feat-val">Premium Lease Listing</span>
                </div>
              </div>
              <div className="prop-feat">
                <div className="prop-feat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                </div>
                <div>
                  <span className="prop-feat-label">Availability</span>
                  <span className="prop-feat-val">Contact for details</span>
                </div>
              </div>
              <div className="prop-feat">
                <div className="prop-feat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87" />
                    <path d="M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <div>
                  <span className="prop-feat-label">Suitable For</span>
                  <span className="prop-feat-val">Investors &amp; Premium Tenants</span>
                </div>
              </div>
            </div>

            <div className="prop-divider"></div>

            <div className="prop-ctas">
              <a href="tel:7019436720" className="btn-gold">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ marginRight: "6px" }}>
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                Enquire Now
              </a>
              <a
                href="https://wa.me/917019436720?text=Hi%2C%20I%20am%20interested%20in%20the%20new%20Coming%20Soon%20lease%20property"
                className="btn-outline-dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ marginRight: "6px" }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.535 5.856L.057 23.215a.75.75 0 00.916.927l5.487-1.44A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.735 9.735 0 01-4.964-1.36l-.356-.212-3.685.967.984-3.594-.232-.37A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PropertiesSection;
