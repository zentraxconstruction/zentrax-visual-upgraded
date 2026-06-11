import { useEffect, useRef, useState } from "react";
import fallbackImg from "../../assets/property.jpg";

function PropertyCarousel({ images = [], alt = "Property slide" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const timerRef = useRef(null);

  const totalSlides = Array.isArray(images) ? images.length : 0;

  const goToSlide = (index) => {
    const normalized = index >= 0 ? index % totalSlides : (totalSlides + (index % totalSlides)) % totalSlides;
    setActiveIndex(normalized);
  };

  const goNext = () => {
    if (totalSlides > 0) goToSlide(activeIndex + 1);
  };

  const goPrev = () => {
    if (totalSlides > 0) goToSlide(activeIndex - 1);
  };

  useEffect(() => {
    if (isPaused || totalSlides <= 1) {
      return undefined;
    }

    timerRef.current = window.setInterval(() => {
      setActiveIndex((current) => (current === totalSlides - 1 ? 0 : current + 1));
    }, 5000);

    return () => {
      window.clearInterval(timerRef.current);
    };
  }, [isPaused, totalSlides]);

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX;
  };

  const handleTouchMove = (event) => {
    touchEndX.current = event.touches[0]?.clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const delta = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (delta > swipeThreshold) {
      goNext();
    } else if (delta < -swipeThreshold) {
      goPrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (totalSlides === 0) {
    return null;
  }

  return (
    <div
      className="prop-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="prop-carousel-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {images.map((src, idx) => (
          <div className="prop-carousel-slide" key={idx}>
            <img src={src} alt={`${alt} ${idx + 1}`} onError={(e)=>{ e.currentTarget.src = fallbackImg; }} />
          </div>
        ))}
      </div>

      {totalSlides > 1 && (
        <>
          <button className="prop-carousel-control prev" onClick={goPrev} type="button" aria-label="Previous slide">
            &#10094;
          </button>
          <button className="prop-carousel-control next" onClick={goNext} type="button" aria-label="Next slide">
            &#10095;
          </button>
          <div className="prop-carousel-dots" aria-label="Image pagination">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`prop-carousel-dot${idx === activeIndex ? " active" : ""}`}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default PropertyCarousel;
