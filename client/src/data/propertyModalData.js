import vertexImg from "../assets/vertex.jpg";
import coastalImg from "../assets/cr.jpg";
import innovationImg from "../assets/ic.jpg";
import townshipImg from "../assets/jj.jpg";

const MODAL_DATA = {
  vertex: {
    title: "Vertex Tower",
    cat: "Mixed-Use Development",
    location: "Mysuru, Karnataka",
    desc: "A landmark mixed-use tower combining premium office spaces with luxury residences. Designed for the modern professional, Vertex Tower offers world-class amenities and breathtaking city views.",
    status: "Completed - 2025",
    price: "Contact for Pricing",
    badge: "Commercial & Residential",
    images: [vertexImg],
    img: vertexImg,
  },
  coastal: {
    title: "Coastal Residence",
    cat: "Luxury Living",
    location: "Mysuru, Karnataka",
    desc: "An exclusive coastal-inspired residential community featuring premium 2 & 3 BHK apartments with open-plan layouts, natural light, and high-end finishes throughout.",
    status: "Completed - 2025",
    price: "Available on Request",
    badge: "Luxury Residential",
    images: [coastalImg],
    img: coastalImg,
  },
  innovation: {
    title: "Innovation Center",
    cat: "Corporate Campus",
    location: "Mysuru, Karnataka",
    desc: "A state-of-the-art corporate campus built to inspire collaboration and creativity. Features open-plan workspaces, conference suites, and sustainable design elements.",
    status: "Completed - 2025",
    price: "Lease Enquiry Open",
    badge: "Corporate Campus",
    images: [innovationImg],
    img: innovationImg,
  },
  township: {
    title: "Residential Township",
    cat: "Planned Community",
    location: "Ilavala Hobli, Mysuru",
    desc: "A thoughtfully planned residential township with integrated green spaces, community facilities, and premium homes. Vastu-compliant layouts with modern infrastructure.",
    status: "Completed - 2024",
    price: "Units Available",
    badge: "Planned Community",
    images: [townshipImg],
    img: townshipImg,
  },
  hombelaku: {
    title: "Hombelaku Residences",
    cat: "Residential Property",
    location: "#44, Hombelaku, Ilavala Hobli, Mysuru",
    desc: "A premium multi-storey residential building offering spacious, Vastu-compliant homes with modern architecture, dedicated parking, and 24/7 security. Available for immediate lease.",
    status: "Available for Lease",
    price: "Contact for Lease Rate",
    badge: "Available Now",
    images: [
      "/images/hombelaku.jpeg",
      "/images/hombelaku2.jpeg",
      "/images/hombelaku3.jpeg",
      "/images/hombelaku4.jpeg",
    ],
    img: "/images/hombelaku.jpeg",
  },
  comingsoon: {
    title: "Coming Soon",
    cat: "Lease Opportunity",
    location: "EWS 218, Lakshmikant Nagar, Hebbal 1st Stage, Devaraj Mohalla, Mysore 570017, Karnataka",
    desc: "Property details will be updated soon.",
    status: "Coming Soon",
    price: "Lease Enquiry Open",
    badge: "Premium Lease",
    images: [
      "/images/coming-soon-1.jpeg",
    ],
    img: "/images/coming-soon-1.jpeg",
  },
};

export default MODAL_DATA;
