import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../css/ProductDetail.css";

// "http://localhost:3000/api"
const API_BASE = "https://lzpower-fashion.onrender.com/api";

/* ─── helpers ──────────────────────────────────────────────────── */
const fmt = (n) => Number(n)?.toLocaleString("vi-VN") + "đ";

/* ─── StarRating ────────────────────────────────────────────────── */
function StarRating({ score, count }) {
  return (
    <div className="pd-stars d-flex align-items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20">
          <defs>
            <linearGradient id={`star-${i}-${score}`}>
              <stop
                offset={`${Math.min(100, Math.max(0, (score - i + 1) * 100))}%`}
                stopColor="#f59e0b"
              />
              <stop
                offset={`${Math.min(100, Math.max(0, (score - i + 1) * 100))}%`}
                stopColor="#e5e7eb"
              />
            </linearGradient>
          </defs>
          <polygon
            points="10,1 12.9,7 19.5,7.6 14.8,11.8 16.5,18.5 10,14.8 3.5,18.5 5.2,11.8 0.5,7.6 7.1,7"
            fill={i <= Math.round(score) ? "#f59e0b" : "#e5e7eb"}
          />
        </svg>
      ))}
      <span className="pd-stars__text">
        {score} ({count} đánh giá)
      </span>
    </div>
  );
}

/* ─── ImageGallery ──────────────────────────────────────────────── */
function ImageGallery({ images, productName }) {
  const [mainIdx, setMainIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, []);

  return (
    <div className="pd-gallery">
      {/* Thumbnails dọc */}
      <div className="pd-gallery__thumbs">
        {images.map((img, i) => (
          <button
            key={i}
            className={`pd-gallery__thumb ${i === mainIdx ? "pd-gallery__thumb--active" : ""}`}
            onClick={() => setMainIdx(i)}
          >
            <img
              src={`https://lzpower-fashion.onrender.com${img}`}
              alt={`${productName} ${i + 1}`}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Ảnh chính */}
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
          src={`https://lzpower-fashion.onrender.com${images[mainIdx]}`}
          alt={productName}
          className="pd-gallery__main-img"
        />
        {/* Điều hướng mũi tên */}
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
        {/* Dots */}
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

/* ─── SizeGuide modal ───────────────────────────────────────────── */
function SizeGuideModal({ onClose }) {
  return (
    <div className="pd-modal-overlay" onClick={onClose}>
      <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pd-modal__header">
          <h3>Hướng dẫn chọn size</h3>
          <button className="pd-modal__close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="pd-modal__body">
          <table className="pd-size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Vòng eo (cm)</th>
                <th>Chiều dài (cm)</th>
                <th>Cân nặng (kg)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["S", "68–72", "96", "50–60"],
                ["M", "72–76", "98", "60–70"],
                ["L", "76–82", "100", "70–80"],
                ["XL", "82–88", "102", "80–90"],
                ["2XL", "88–96", "104", "90–100"],
              ].map(([sz, ...vals]) => (
                <tr key={sz}>
                  <td>
                    <strong>{sz}</strong>
                  </td>
                  {vals.map((v, i) => (
                    <td key={i}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── ReviewCard ────────────────────────────────────────────────── */
function ReviewCard({ review }) {
  return (
    <div className="pd-review-card">
      <div className="pd-review-card__header">
        <img
          src={review.nguoiDung.anhDaiDien || "/no-avatar.png"}
          alt={review.nguoiDung.username}
          className="pd-review-card__avatar"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.nguoiDung.username)}&background=111&color=fff&size=40`;
          }}
        />
        <div>
          <div className="pd-review-card__name">
            {review.nguoiDung.username}
          </div>
          <div className="d-flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} width="12" height="12" viewBox="0 0 20 20">
                <polygon
                  points="10,1 12.9,7 19.5,7.6 14.8,11.8 16.5,18.5 10,14.8 3.5,18.5 5.2,11.8 0.5,7.6 7.1,7"
                  fill={i <= review.diemDanhGia ? "#f59e0b" : "#e5e7eb"}
                />
              </svg>
            ))}
          </div>
        </div>
        <span className="pd-review-card__date ms-auto">
          {new Date(review.ngayTao?.$date || review.ngayTao).toLocaleDateString(
            "vi-VN",
          )}
        </span>
      </div>
      <p className="pd-review-card__content">{review.noiDung}</p>
    </div>
  );
}

/* ─── AccordionItem ─────────────────────────────────────────────── */
function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="pd-accordion">
      <button
        className="pd-accordion__toggle"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{title}</span>
        <svg
          className={`pd-accordion__icon ${open ? "pd-accordion__icon--open" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="pd-accordion__body">{children}</div>}
    </div>
  );
}

/* ─── Main ProductDetail ────────────────────────────────────────── */
export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/san-pham/${id}`);
        setProduct(data);
        // Chọn màu đầu tiên mặc định
        if (data.mauSanPham?.length) {
          setSelectedColor(data.mauSanPham[0].code);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  /* ─── Derived state ───────────────────────────────────────────── */
  const currentVariant = product?.mauSanPham?.find(
    (v) => v.code === selectedColor,
  );
  const currentImages = currentVariant?.images?.length
    ? currentVariant.images
    : ["/no-image.png"];

  // Sizes khả dụng theo màu đang chọn
  const availableSizes =
    product?.bienTheSanPham
      ?.filter((bt) => bt.colorCode === selectedColor)
      .map((bt) => bt.size) || [];

  // Tồn kho của variant đang chọn
  const currentStock =
    product?.bienTheSanPham?.find(
      (bt) => bt.colorCode === selectedColor && bt.size === selectedSize,
    )?.soLuongTon ?? null;

  const gia = Number(product?.gia?.$numberDecimal || product?.gia);

  /* ─── Actions ─────────────────────────────────────────────────── */
  const handleAddToCart = () => {
    if (!selectedSize) {
      // highlight size section
      document.querySelector(".pd-sizes")?.classList.add("pd-sizes--error");
      setTimeout(
        () =>
          document
            .querySelector(".pd-sizes")
            ?.classList.remove("pd-sizes--error"),
        1200,
      );
      return;
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  /* ─── Render guards ───────────────────────────────────────────── */
  if (loading)
    return (
      <div className="pd-loading">
        <div className="pd-loading__spinner" />
        <p>Đang tải sản phẩm...</p>
      </div>
    );

  if (error)
    return (
      <div className="container py-5 text-center">
        <p className="text-danger">Lỗi: {error}</p>
        <Link to="/quan" className="btn btn-dark mt-3">
          ← Quay lại
        </Link>
      </div>
    );

  return (
    <>
      {/* ── Main layout ────────────────────────────────────────────── */}
      <div className="container px-5 mx-auto pb-5">
        <div className="pd-layout">
          {/* LEFT – Gallery */}
          <div className="pd-layout__gallery">
            <ImageGallery
              key={selectedColor}
              images={currentImages}
              productName={product.tenSanPham}
            />
          </div>

          {/* RIGHT – Info */}
          <div className="pd-layout__info">
            {/* Tên & rating */}
            <h1 className="pd-title">{product.tenSanPham}</h1>

            {product.diemSoTrungBinh > 0 && (
              <StarRating
                score={product.diemSoTrungBinh}
                count={product.soLuotDanhGia}
              />
            )}

            {/* Giá */}
            <div className="pd-price-block">
              <span className="pd-price">{fmt(gia)}</span>
              {/* Nếu có giá gốc: <span className="pd-price-old">{fmt(oldGia)}</span> */}
            </div>

            {/* Màu sắc */}
            <div className="pd-section">
              <div className="pd-section__label">
                Màu sắc: <strong>{currentVariant?.tenMau}</strong>
              </div>
              <div className="pd-colors">
                {product.mauSanPham?.map((v) => (
                  <button
                    key={v.code}
                    className={`pd-color-btn ${selectedColor === v.code ? "pd-color-btn--active" : ""}`}
                    onClick={() => {
                      setSelectedColor(v.code);
                      setSelectedSize(null);
                    }}
                    title={v.tenMau}
                  >
                    <span
                      className="pd-color-btn__dot"
                      style={{ background: v.maMau }}
                    />
                    <span className="pd-color-btn__name">{v.tenMau}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="pd-section">
              <div className="pd-section__label d-flex justify-content-between">
                <span>
                  Kích thước: <strong>{selectedSize || "Chưa chọn"}</strong>
                </span>
                <button
                  className="pd-size-guide-btn"
                  onClick={() => setShowSizeGuide(true)}
                >
                  📏 Hướng dẫn chọn size
                </button>
              </div>
              <div className="pd-sizes">
                {availableSizes.map((sz) => {
                  const inStock =
                    product.bienTheSanPham.find(
                      (bt) => bt.colorCode === selectedColor && bt.size === sz,
                    )?.soLuongTon > 0;
                  return (
                    <button
                      key={sz}
                      className={`pd-size-btn ${selectedSize === sz ? "pd-size-btn--active" : ""} ${!inStock ? "pd-size-btn--out" : ""}`}
                      onClick={() => inStock && setSelectedSize(sz)}
                      disabled={!inStock}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
              {selectedSize && currentStock !== null && (
                <p className="pd-stock-info">
                  {currentStock > 10
                    ? `✓ Còn hàng (${currentStock} sp)`
                    : currentStock > 0
                      ? `⚠ Chỉ còn ${currentStock} sản phẩm`
                      : "✗ Hết hàng"}
                </p>
              )}
            </div>

            {/* Số lượng + CTA */}
            <div className="pd-cta-row">
              <div className="pd-qty">
                <button
                  className="pd-qty__btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="pd-qty__value">{qty}</span>
                <button
                  className="pd-qty__btn"
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>

              <button className="pd-btn-add" onClick={handleAddToCart}>
                {addedToCart ? "✓ Đã thêm vào giỏ" : "Thêm vào giỏ hàng"}
              </button>
            </div>

            <button className="pd-btn-buy">Mua ngay</button>

            {/* USPs */}
            <div className="pd-usps">
              {[
                { icon: "🚚", text: "Miễn phí vận chuyển đơn từ 299.000đ" },
                { icon: "↩️", text: "Đổi trả miễn phí trong 30 ngày" },
                { icon: "🛡️", text: "Bảo hành chất lượng 6 tháng" },
                { icon: "💳", text: "Thanh toán an toàn, đa dạng" },
              ].map(({ icon, text }) => (
                <div key={text} className="pd-usp">
                  <span className="pd-usp__icon">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="pd-accordions mt-3">
              <AccordionItem title="Thông tin sản phẩm" defaultOpen>
                <ul className="pd-info-list">
                  {product.chatLieu && (
                    <li>
                      <strong>Chất liệu:</strong> {product.chatLieu}
                    </li>
                  )}
                  {product.kieuDang && (
                    <li>
                      <strong>Kiểu dáng:</strong> {product.kieuDang}
                    </li>
                  )}
                  {product.gioiTinh && (
                    <li>
                      <strong>Giới tính:</strong> {product.gioiTinh}
                    </li>
                  )}
                  {product.tinhNang && (
                    <li>
                      <strong>Tính năng:</strong> {product.tinhNang}
                    </li>
                  )}
                  {product.phuHopVoi?.length > 0 && (
                    <li>
                      <strong>Phù hợp:</strong> {product.phuHopVoi.join(", ")}
                    </li>
                  )}
                </ul>
              </AccordionItem>

              <AccordionItem title="Hướng dẫn bảo quản">
                <p className="pd-care">
                  {product.baoQuan ||
                    "Giặt máy ở nhiệt độ thường, không dùng chất tẩy mạnh."}
                </p>
              </AccordionItem>

              <AccordionItem title="Mô tả chi tiết">
                <div
                  className="pd-description"
                  dangerouslySetInnerHTML={{ __html: product.moTa }}
                />
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* ── Reviews section ──────────────────────────────────────── */}
        {product.danhGiaMoiNhat?.length > 0 && (
          <section className="pd-reviews mt-5">
            <h2 className="pd-reviews__title">
              Đánh giá từ khách hàng
              <span className="pd-reviews__badge">{product.soLuotDanhGia}</span>
            </h2>

            <div className="pd-reviews__summary">
              <div className="pd-reviews__score">
                <span className="pd-reviews__score-num">
                  {product.diemSoTrungBinh}
                </span>
                <StarRating
                  score={product.diemSoTrungBinh}
                  count={product.soLuotDanhGia}
                />
              </div>
            </div>

            <div className="pd-reviews__list">
              {product.danhGiaMoiNhat.map((r) => (
                <ReviewCard
                  key={r.danhGiaId?.$oid || Math.random()}
                  review={r}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Size guide modal */}
      {showSizeGuide && (
        <SizeGuideModal onClose={() => setShowSizeGuide(false)} />
      )}
    </>
  );
}
