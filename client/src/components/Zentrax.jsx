import "../assets/style.css";
import LoaderSection from "./sections/LoaderSection";
import NavbarSection from "./sections/NavbarSection";
import HeroSection from "./sections/HeroSection";
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

function Zentrax() {
  useZentraxEffects();

  return (
    <div>
      <LoaderSection />
      <NavbarSection />
      <HeroSection />
      <PhilosophySection />
      <StatsSection />
      <PortfolioSection />
      <PropertiesSection />
      <CapabilitiesSection />
      <WhyChooseSection />
      <ProcessSection />
      <TestimonialsSection />
      <ContactSection />
      <FooterSection />
      <PropertyModalSection />
    </div>
  );
}

export default Zentrax;
