import { useState, useEffect, useCallback } from "react";
import "../CSS/promoBanner.css";
import { getMaxDiscount } from "../utils/promoUtils";

const GRADIENTS = [
  "linear-gradient(135deg, #2F80ED 0%, #1455a8 100%)",
  "linear-gradient(135deg, #1a1a2e 0%, #2d3561 100%)",
  "linear-gradient(135deg, #c0392b 0%, #96281b 100%)",
  "linear-gradient(135deg, #1e8449 0%, #117a65 100%)",
  "linear-gradient(135deg, #7b2d8b 0%, #5c2069 100%)",
];

function formatDate(rawDate) {
  if (!rawDate) return "";
  const d = new Date(rawDate?.$date ?? rawDate);
  if (isNaN(d)) return "";
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
}

export default function PromoBanner({ promos = [] }) {
  const [idx, setIdx] = useState(0);

  // Reset to first slide whenever the promo list changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIdx(0);
  }, [promos]);

  // Auto-advance every 4 s
  useEffect(() => {
    if (promos.length <= 1) return;
    const timer = setInterval(
      () => setIdx((prev) => (prev + 1) % promos.length),
      4000,
    );
    return () => clearInterval(timer);
  }, [promos.length]);

  const goTo = useCallback((i) => setIdx(i), []);
  const prev = useCallback(
    () => setIdx((p) => (p - 1 + promos.length) % promos.length),
    [promos.length],
  );
  const next = useCallback(
    () => setIdx((p) => (p + 1) % promos.length),
    [promos.length],
  );

  if (!promos.length) return null;

  const promo = promos[idx];
  const maxDiscount = getMaxDiscount(promo.sanPhamUuDai);
  const productCount = promo.sanPhamUuDai?.length ?? 0;
  const bg = GRADIENTS[idx % GRADIENTS.length];
  const startStr = formatDate(promo.dateRange?.start);
  const endStr = formatDate(promo.dateRange?.end);

  return (
    <section className="pb-banner" style={{ background: bg }}>
      <div className="pb-banner__inner">
        {promos.length > 1 && (
          <button
            className="pb-arrow pb-arrow--prev"
            onClick={prev}
            aria-label="Trước"
          >
            ‹
          </button>
        )}

        <div className="pb-content">
          {maxDiscount > 0 && (
            <div className="pb-discount-badge">Giảm đến {maxDiscount}%</div>
          )}
          <h2 className="pb-title">{promo.tenUuDai}</h2>
          <div className="pb-meta">
            <span className="pb-meta__item">🏷 {productCount} sản phẩm</span>
            {startStr && endStr && (
              <>
                <span className="pb-meta__divider">•</span>
                <span className="pb-meta__item">
                  📅 {startStr} — {endStr}
                </span>
              </>
            )}
          </div>
          <a href="#san-pham" className="pb-cta">
            Xem ưu đãi →
          </a>
        </div>

        {promos.length > 1 && (
          <button
            className="pb-arrow pb-arrow--next"
            onClick={next}
            aria-label="Tiếp"
          >
            ›
          </button>
        )}
      </div>

      {promos.length > 1 && (
        <div className="pb-dots">
          {promos.map((_, i) => (
            <button
              key={i}
              className={`pb-dot${i === idx ? " pb-dot--active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Ưu đãi ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
