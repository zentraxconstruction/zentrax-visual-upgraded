import { useState } from "react";

const SERVICES = [
  {
    title: "2D & 3D Plans",
    icon: "M6 22V12l9-8 9 8v10l-9 6-9-6zm9-6l7-7-7-6-7 6 7 7z",
    description: "Detailed architectural drawings, elevations, and realistic 3D visualizations that help clients understand the layout before execution.",
    highlights: ["Floor plans", "Elevations", "3D walkthroughs"],
  },
  {
    title: "Material Support",
    icon: "M6 8h12v4H6V8zm0 6h12v6H6v-6zm0 14h12v-4H6v4z",
    description: "Reliable sourcing and delivery of construction materials with quality assurance for smooth project execution.",
    highlights: ["Bricks and steel", "Cement and fittings", "On-time procurement"],
  },
  {
    title: "Construction & Lease",
    icon: "M8 22h8v-4H8v4zm-2-2V8h12v12h-2v4H8v-4H6z",
    description: "End-to-end construction support with leasing options designed to match business and residential requirements.",
    highlights: ["Project execution", "Lease guidance", "Flexible options"],
  },
  {
    title: "Plans & Plots",
    icon: "M10 6h12v12H10V6zm2 2v8h8V8h-8zM6 22h12v2H6v-2z",
    description: "Assistance in selecting approved plans and suitable plots for residential, commercial, or investment use.",
    highlights: ["Approved layouts", "Plot evaluation", "Site selection support"],
  },
  {
    title: "Labour Support",
    icon: "M12 4a4 4 0 014 4c0 2-2 4-4 4s-4-2-4-4a4 4 0 014-4zm0 10c4 0 8 2 8 4v2H4v-2c0-2 4-4 8-4z",
    description: "Skilled and semi-skilled manpower support for site work, finishing, and day-to-day construction needs.",
    highlights: ["Skilled workers", "Site coordination", "Reliable staffing"],
  },
  {
    title: "Staff Support",
    icon: "M8 10h8v2H8v-2zm0 6h8v2H8v-2zm0 6h8v2H8v-2z",
    description: "Professional support for administrative, operational, and site-based staffing requirements across projects.",
    highlights: ["Management support", "Operational staffing", "Project coordination"],
  },
  {
    title: "Sale & Resale",
    icon: "M6 8h12v12H6V8zm2 2v8h8V10H8zM16 4h4v4h-4V4z",
    description: "Guidance for buying, selling, and reselling property with transparent pricing and market insights.",
    highlights: ["Property resale", "Market advice", "Transaction support"],
  },
];

function ServicesSection() {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <>
      <section id="services" className="section services-section">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-tag">OUR SERVICES</div>
            <h2 className="section-title">
              Complete Construction &amp; Manpower Solutions
            </h2>
          </div>

          <div className="services-grid">
            {SERVICES.map((service) => (
              <button
                key={service.title}
                type="button"
                className="service-card reveal"
                onClick={() => setSelectedService(service)}
              >
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d={service.icon} />
                  </svg>
                </div>
                <h3>{service.title}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedService && (
        <div className="service-modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="service-modal-box" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="service-modal-close" onClick={() => setSelectedService(null)} aria-label="Close details">
              ×
            </button>
            <div className="service-modal-header">
              <div className="service-icon service-modal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d={selectedService.icon} />
                </svg>
              </div>
              <div>
                <p className="service-modal-tag">Service Details</p>
                <h3>{selectedService.title}</h3>
              </div>
            </div>
            <p className="service-modal-desc">{selectedService.description}</p>
            <ul className="service-modal-highlights">
              {selectedService.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default ServicesSection;
