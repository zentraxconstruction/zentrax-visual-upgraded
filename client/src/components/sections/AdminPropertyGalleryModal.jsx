import React, { useEffect, useState } from "react";
import api from "../../utils/api";

const galleryOf = (property) => property?.galleryImages || [];

export default function AdminPropertyGalleryModal({ property, onClose, onSaved, addToast }) {
  const [images, setImages] = useState(() => galleryOf(property));
  const [coverImage, setCoverImage] = useState(property?.coverImage || galleryOf(property)[0] || "");
  const [index, setIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const nextImages = galleryOf(property);
    setImages(nextImages);
    setCoverImage(property?.coverImage || nextImages[0] || "");
    setIndex(0);
  }, [property]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && images.length > 1) setIndex((current) => (current - 1 + images.length) % images.length);
      if (event.key === "ArrowRight" && images.length > 1) setIndex((current) => (current + 1) % images.length);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [images.length, onClose]);

  const persist = async ({ nextImages = images, nextCover = coverImage, newFiles = [], replacement } = {}) => {
    setSaving(true);
    try {
      const form = new FormData();
      form.append("galleryImages", JSON.stringify(nextImages));
      form.append("coverImage", nextCover || nextImages[0] || "");
      newFiles.forEach((file) => form.append("images", file));
      if (replacement?.file) {
        form.append("replacementImages", replacement.file);
        form.append("replacementIndexes", JSON.stringify([replacement.index]));
      }
      const response = await api.put(`/admin/properties/${property._id}`, form);
      const updated = response.data;
      const updatedImages = galleryOf(updated);
      setImages(updatedImages);
      setCoverImage(updated.coverImage || updatedImages[0] || "");
      setIndex((current) => Math.min(current, Math.max(updatedImages.length - 1, 0)));
      onSaved(updated);
      return updated;
    } catch (error) {
      addToast(error.message || "Gallery update failed", { type: "error" });
      return null;
    } finally {
      setSaving(false);
    }
  };

  const setCover = async () => {
    const selected = images[index];
    if (!selected) return;
    await persist({ nextImages: images, nextCover: selected });
  };
  const removeImage = async () => {
    const nextImages = images.filter((_, imageIndex) => imageIndex !== index);
    const nextCover = images[index] === coverImage ? nextImages[0] || "" : coverImage;
    await persist({ nextImages, nextCover });
  };
  const moveImage = async (direction) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const nextImages = [...images];
    [nextImages[index], nextImages[target]] = [nextImages[target], nextImages[index]];
    const updated = await persist({ nextImages, nextCover: coverImage });
    if (updated) setIndex(target);
  };

  const currentImage = images[index];
  return (
    <div className="admin-gallery-overlay" role="dialog" aria-modal="true" aria-label="Property Gallery" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="admin-gallery-modal">
        <button className="admin-gallery-close" type="button" onClick={onClose} aria-label="Close gallery">&times;</button>
        <div className="admin-gallery-title">Property Gallery — {property.name}</div>
        <div className="admin-gallery-stage">
          {images.length > 1 && <button type="button" className="admin-gallery-nav admin-gallery-prev" onClick={() => setIndex((current) => (current - 1 + images.length) % images.length)} aria-label="Previous image">Previous</button>}
          {currentImage ? <img src={currentImage} alt={`${property.name} gallery ${index + 1}`} /> : <div className="admin-gallery-empty">No images uploaded yet.</div>}
          {images.length > 1 && <button type="button" className="admin-gallery-nav admin-gallery-next" onClick={() => setIndex((current) => (current + 1) % images.length)} aria-label="Next image">Next</button>}
          {images.length > 0 && <span className="admin-gallery-counter">{index + 1} / {images.length}</span>}
        </div>
        <div className="admin-gallery-actions">
          <label className="btn-gold">Add Images<input type="file" accept="image/*" multiple disabled={saving} onChange={(event) => { const files = Array.from(event.target.files || []); if (files.length) persist({ newFiles: files }); event.target.value = ""; }} /></label>
          {currentImage && <>
            <button type="button" className="btn-gold" disabled={saving || currentImage === coverImage} onClick={setCover}>{currentImage === coverImage ? "Cover Image" : "Set as Cover"}</button>
            <button type="button" className="btn-gold" disabled={saving || index === 0} onClick={() => moveImage(-1)}>Move Previous</button>
            <button type="button" className="btn-gold" disabled={saving || index === images.length - 1} onClick={() => moveImage(1)}>Move Next</button>
            <label className="btn-gold">Replace Image<input type="file" accept="image/*" disabled={saving} onChange={(event) => { const file = event.target.files?.[0]; if (file) persist({ replacement: { index, file } }); event.target.value = ""; }} /></label>
            <button type="button" className="btn-danger" disabled={saving} onClick={removeImage}>Delete Image</button>
          </>}
        </div>
        {images.length > 0 && <div className="admin-gallery-thumbs" aria-label="Gallery thumbnails">{images.map((image, imageIndex) => <button type="button" key={`${image}-${imageIndex}`} className={imageIndex === index ? "active" : ""} onClick={() => setIndex(imageIndex)} aria-label={`View image ${imageIndex + 1}`} aria-pressed={imageIndex === index}><img src={image} alt={`Gallery thumbnail ${imageIndex + 1}`} loading="lazy" /></button>)}</div>}
      </div>
    </div>
  );
}