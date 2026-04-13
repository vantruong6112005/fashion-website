import { useCallback, useRef, useState } from "react";
import { resolveImageUrl } from "../../utils/image";

// Hien thi bo suu tap anh va ho tro zoom theo vi tri chuot.
export default function ImageGallery({ images, productName }) {
  const [mainIdx, setMainIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgRef = useRef(null);

  // Tinh vi tri zoom dua tren toa do chuot trong anh.
  const handleMouseMove = useCallback((e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, []);

  return (
    <div className="pd-gallery">
      <div className="pd-gallery__thumbs">
        {images.map((img, i) => (
          <button
            key={i}
            className={`pd-gallery__thumb ${i === mainIdx ? "pd-gallery__thumb--active" : ""}`}
            onClick={() => setMainIdx(i)}
          >
            <img
              src={resolveImageUrl(img)}
              alt={`${productName} ${i + 1}`}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      <div
        className={`pd-gallery__main ${zoomed ? "pd-gallery__main--zoomed" : ""}`}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
        ref={imgRef}
        style={
          zoomed ? { "--zx": `${zoomPos.x}%`, "--zy": `${zoomPos.y}%` } : {}
        }
      >
        <img
          src={resolveImageUrl(images[mainIdx])}
          alt={productName}
          className="pd-gallery__main-img"
        />

        {images.length > 1 && (
          <>
            <button
              className="pd-gallery__arrow pd-gallery__arrow--prev"
              onClick={() =>
                setMainIdx((i) => (i - 1 + images.length) % images.length)
              }
              aria-label="Ảnh trước"
            >
              ‹
            </button>
            <button
              className="pd-gallery__arrow pd-gallery__arrow--next"
              onClick={() => setMainIdx((i) => (i + 1) % images.length)}
              aria-label="Ảnh sau"
            >
              ›
            </button>
          </>
        )}

        <div className="pd-gallery__dots">
          {images.map((_, i) => (
            <span
              key={i}
              className={`pd-gallery__dot ${i === mainIdx ? "pd-gallery__dot--active" : ""}`}
              onClick={() => setMainIdx(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
