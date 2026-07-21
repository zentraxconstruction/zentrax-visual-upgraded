import React, { useEffect } from "react";

export default function PropertyLightbox({ images, index, propertyName, onClose, onPrevious, onNext }) {
  const total = images.length;

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && total > 1) onPrevious();
      if (event.key === "ArrowRight" && total > 1) onNext();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, onNext, onPrevious, total]);

  if (!total) return null;
  return (
    <div
      className="property-lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${propertyName} image gallery`}
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="property-lightbox-content">
        <button className="property-lightbox-close" type="button" onClick={onClose} aria-label="Close gallery">&times;</button>
        {total > 1 && <button className="property-lightbox-nav property-lightbox-prev" type="button" onClick={onPrevious} aria-label="Previous image">&#8592;</button>}
        <img className="property-lightbox-image" src={images[index]} alt={`${propertyName} image ${index + 1}`} />
        {total > 1 && <button className="property-lightbox-nav property-lightbox-next" type="button" onClick={onNext} aria-label="Next image">&#8594;</button>}
        <span className="property-lightbox-counter">{index + 1}/{total}</span>
      </div>
    </div>
  );
}