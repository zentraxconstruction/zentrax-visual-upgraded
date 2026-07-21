import React, { useEffect, useState } from "react";
import api from "../utils/api";
import PropertyLightbox from "../components/sections/PropertyLightbox";
import propertyLease from "../assets/property-lease.jpg";
import { getPropertyCoverImage, getPropertyGalleryImages } from "../utils/propertyImages";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.get("/properties")
      .then((res) => setProperties(res.data || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  const openGallery = (property) => {
    const images = getPropertyGalleryImages(property);
    if (images.length) setLightbox({ propertyName: property.name, images, index: 0 });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060606", color: "#f4f0e6", padding: "3rem 1.25rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Properties</h1>
        <p style={{ color: "#bfb59e", marginBottom: "2rem" }}>A curated list of visible properties managed by the admin.</p>
        {loading ? <p>Loading properties...</p> : properties.length === 0 ? <p>No properties available right now.</p> : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {properties.map((property) => (
              <div key={property._id} style={{ border: "1px solid rgba(212,175,55,0.2)", borderRadius: 18, padding: "1rem", background: "rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
                    <button type="button" onClick={() => openGallery(property)} aria-label={`Open ${property.name} image gallery`} style={{ padding: 0, border: 0, background: "transparent", cursor: getPropertyGalleryImages(property).length ? "pointer" : "default" }}>
                      <img src={getPropertyCoverImage(property) || propertyLease} alt={property.name} loading="lazy" style={{ display: "block", width: 92, height: 62, objectFit: "cover", border: "1px solid rgba(212,175,55,0.2)" }} />
                    </button>
                    <div>
                      <h3 style={{ margin: "0 0 0.4rem" }}>{property.name}</h3>
                      <p style={{ margin: 0, color: "#c8b98e" }}>{property.propertyType} � {property.city}, {property.state}</p>
                    </div>
                  </div>
                  {property.isFeatured && <span style={{ color: "#d4af37", fontWeight: 700 }}>Featured</span>}
                </div>
                <p style={{ marginTop: "0.75rem", color: "#eee" }}>{property.description || "Professional property listing from Zentrax."}</p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
                  <span style={{ border: "1px solid rgba(255,255,255,0.16)", padding: "0.35rem 0.7rem", borderRadius: 999 }}>{property.availability}</span>
                  <span style={{ border: "1px solid rgba(255,255,255,0.16)", padding: "0.35rem 0.7rem", borderRadius: 999 }}>{property.suitableFor}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {lightbox && <PropertyLightbox images={lightbox.images} index={lightbox.index} propertyName={lightbox.propertyName} onClose={() => setLightbox(null)} onPrevious={() => setLightbox((current) => ({ ...current, index: (current.index - 1 + current.images.length) % current.images.length }))} onNext={() => setLightbox((current) => ({ ...current, index: (current.index + 1) % current.images.length }))} />}
    </div>
  );
}