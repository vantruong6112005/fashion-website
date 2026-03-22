import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import "../CSS/ProductDetail.css";
import ImageGallery from "./productDetail/ImageGallery";
import ProductInfoAccordions from "./productDetail/ProductInfoAccordions";
import ProductReviewsSection from "./productDetail/ProductReviewsSection";
import SizeGuideModal from "./productDetail/SizeGuideModal";
import StarRating from "./productDetail/StarRating";
import { API_BASE } from "../utils/api";

const REVIEWS_PER_PAGE = 10;
const USP_ITEMS = [
  { icon: "01", text: "Mien phi van chuyen don tu 299.000d" },
  { icon: "02", text: "Doi tra mien phi trong 30 ngay" },
  { icon: "03", text: "Bao hanh chat luong 6 thang" },
  { icon: "04", text: "Thanh toan an toan, da dang" },
];

// Dinh dang gia tien theo dinh dang Viet Nam.
const fmt = (n) => Number(n)?.toLocaleString("vi-VN") + "đ";

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

  const [currentReviewPage, setCurrentReviewPage] = useState(1);

  // Tai du lieu san pham theo id.
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/san-pham/${id}`);
        setProduct(data);
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

  const currentVariant = product?.mauSanPham?.find(
    (v) => v.code === selectedColor,
  );
  const currentImages = currentVariant?.images?.length
    ? currentVariant.images
    : ["/no-image.png"];

  const availableSizes =
    product?.bienTheSanPham
      ?.filter((bt) => bt.colorCode === selectedColor)
      .map((bt) => bt.size) || [];

  const currentStock =
    product?.bienTheSanPham?.find(
      (bt) => bt.colorCode === selectedColor && bt.size === selectedSize,
    )?.soLuongTon ?? null;

  const gia = Number(product?.gia?.$numberDecimal || product?.gia);

  const reviews = product?.danhGiaMoiNhat ?? [];
  const totalReviewCount =
    Number.isFinite(Number(product?.soLuotDanhGia)) &&
    Number(product?.soLuotDanhGia) > 0
      ? Number(product.soLuotDanhGia)
      : reviews.length;

  const totalReviewPages = Math.max(
    1,
    Math.ceil(reviews.length / REVIEWS_PER_PAGE),
  );
  const safeReviewPage = Math.min(currentReviewPage, totalReviewPages);
  const reviewStartIndex = (safeReviewPage - 1) * REVIEWS_PER_PAGE;
  const reviewEndIndex = Math.min(
    reviewStartIndex + REVIEWS_PER_PAGE,
    reviews.length,
  );
  const pagedReviews = reviews.slice(reviewStartIndex, reviewEndIndex);

  // Dem so luong danh gia theo tung muc sao.
  const reviewCountsByStar = reviews.reduce(
    (acc, review) => {
      const star = Math.min(5, Math.max(1, Number(review?.diemDanhGia) || 0));
      acc[star] += 1;
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  );

  // Tong hop do vua cua san pham theo nhan xet nguoi dung.
  const fitStats = reviews.reduce(
    (acc, review) => {
      const fitRaw = String(
        review?.phuHopVoiCoThe ?? review?.phuHop ?? review?.doVua ?? "",
      )
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      if (fitRaw.includes("chat")) acc.tight += 1;
      else if (fitRaw.includes("rong")) acc.loose += 1;
      else if (fitRaw.includes("dung") || fitRaw.includes("vua")) acc.fit += 1;

      return acc;
    },
    { tight: 0, fit: 0, loose: 0 },
  );

  const fitTotal = fitStats.tight + fitStats.fit + fitStats.loose;
  const fitPercent = {
    tight: fitTotal ? Math.round((fitStats.tight / fitTotal) * 100) : 0,
    fit: fitTotal ? Math.round((fitStats.fit / fitTotal) * 100) : 0,
    loose: fitTotal ? Math.round((fitStats.loose / fitTotal) * 100) : 0,
  };

  // Moi lan doi san pham thi reset ve trang danh gia dau.
  useEffect(() => {
    setCurrentReviewPage(1);
  }, [id]);

  // Neu tong so trang giam thi ep trang hien tai ve muc hop le.
  useEffect(() => {
    setCurrentReviewPage((prev) => Math.min(prev, totalReviewPages));
  }, [totalReviewPages]);

  // Them vao gio va nhac nguoi dung chon size neu chua co.
  const handleAddToCart = () => {
    if (!selectedSize) {
      const sizesEl = document.querySelector(".pd-sizes");
      sizesEl?.classList.add("pd-sizes--error");
      setTimeout(() => {
        sizesEl?.classList.remove("pd-sizes--error");
      }, 1200);
      return;
    }

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-loading__spinner" />
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <p className="text-danger">Lỗi: {error}</p>
        <Link to="/quan" className="btn btn-dark mt-3">
          ← Quay lại
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container px-5 mx-auto pb-5">
        <div className="pd-layout">
          <div className="pd-layout__gallery">
            <ImageGallery
              key={selectedColor}
              images={currentImages}
              productName={product.tenSanPham}
            />
          </div>

          <div className="pd-layout__info">
            <h1 className="pd-title">{product.tenSanPham}</h1>

            {product.diemSoTrungBinh > 0 && (
              <StarRating
                score={product.diemSoTrungBinh}
                count={product.soLuotDanhGia}
              />
            )}

            <div className="pd-price-block">
              <span className="pd-price">{fmt(gia)}</span>
            </div>

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

            <div className="pd-section">
              <div className="pd-section__label d-flex justify-content-between">
                <span>
                  Kích thước: <strong>{selectedSize || "Chưa chọn"}</strong>
                </span>
                <button
                  className="pd-size-guide-btn"
                  onClick={() => setShowSizeGuide(true)}
                >
                  Hướng dẫn chọn size
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

            <div className="pd-cta-row">
              <div className="pd-qty">
                <button
                  className="pd-qty__btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  -
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

            <div className="pd-usps">
              {USP_ITEMS.map(({ icon, text }) => (
                <div key={text} className="pd-usp">
                  <span className="pd-usp__icon">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ProductInfoAccordions product={product} />

        {reviews.length > 0 && (
          <ProductReviewsSection
            product={product}
            totalReviewCount={totalReviewCount}
            reviewCountsByStar={reviewCountsByStar}
            fitPercent={fitPercent}
            reviewStartIndex={reviewStartIndex}
            reviewEndIndex={reviewEndIndex}
            pagedReviews={pagedReviews}
            totalReviewPages={totalReviewPages}
            safeReviewPage={safeReviewPage}
            setCurrentReviewPage={setCurrentReviewPage}
          />
        )}
      </div>

      {showSizeGuide && (
        <SizeGuideModal onClose={() => setShowSizeGuide(false)} />
      )}
    </>
  );
}
