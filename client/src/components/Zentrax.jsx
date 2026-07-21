import "../assets/style.css";
import LoaderSection from "./sections/LoaderSection";
import NavbarSection from "./sections/NavbarSection";
import HeroSection from "./sections/HeroSection";
import ServicesSection from "./sections/ServicesSection";
import PhilosophySection from "./sections/PhilosophySection";
import StatsSection from "./sections/StatsSection";
import PortfolioSection from "./sections/PortfolioSection";
import PropertiesSection from "./sections/PropertiesSection";
import CapabilitiesSection from "./sections/CapabilitiesSection";
import WhyChooseSection from "./sections/WhyChooseSection";
import ProcessSection from "./sections/ProcessSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import ContactSection from "./sections/ContactSection";
import FooterSection from "./sections/FooterSection";
import PropertyModalSection from "./sections/PropertyModalSection";
import useZentraxEffects from "../hooks/useZentraxEffects";
import RightPopup from "./ui/RightPopup";

function Zentrax() {
  useZentraxEffects();

  return (
    <div>
      <LoaderSection />
      <NavbarSection />
      <HeroSection />
      <ServicesSection />
      <PhilosophySection />
      <StatsSection />
      <PortfolioSection />
      <PropertiesSection />
      <CapabilitiesSection />
      <WhyChooseSection />
      <ProcessSection />
      <RightPopup>
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 12, letterSpacing: '0.28em', color: '#d4af37', fontWeight: 700 }}>HIRE TODAY</div>
          </div>
          <h3 style={{ margin: '10px 0 6px', fontSize: 22, color: '#fff' }}>3000+ Workers Available</h3>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.5 }}>Get instant workforce support for construction projects, site supervision, and manual labor.</p>
          <ul style={{ marginTop: 12, paddingLeft: 18, color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>
            <li>2D 3D Plan</li>
            <li>Construction & Lease</li>
            <li>Labour Support</li>
          </ul>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <a href="#contact" style={{ background: '#d4af37', color: '#081015', padding: '8px 12px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>Hire Workers</a>
            <a href="#contact" style={{ background: 'transparent', color: '#d4af37', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(212,175,55,0.18)', textDecoration: 'none' }}>Contact</a>
          </div>
        </div>
      </RightPopup>
      <TestimonialsSection />
      <ContactSection />
      <FooterSection />
      <PropertyModalSection />
    </div>
  );
}

export default Zentrax;
