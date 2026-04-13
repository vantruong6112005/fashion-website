import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "../../CSS/ProductDetail.css";
import ImageGallery from "./ImageGallery";
import ProductInfoAccordions from "./ProductInfoAccordions";
import ProductReviewsSection from "./ProductReviewsSection";
import SizeGuideModal from "./SizeGuideModal";
import StarRating from "./StarRating";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { API_BASE } from "../../api";
import { getProductById } from "../../services/catalogService";
import { resolveImageUrl } from "../../utils/image";

const getEntityId = (value) =>
  value?.$oid || value?._id?.$oid || value?._id || value || "";
const getReviewId = (review) =>
  review?.danhGiaId?.$oid ||
  review?.danhGiaId ||
  review?._id?.$oid ||
  review?._id ||
  "";
const getReviewUserId = (review) =>
  review?.nguoiDung?.nguoiDungId?.$oid || review?.nguoiDung?.nguoiDungId || "";
const toTime = (value) => {
  const source = value?.$date || value;
  const t = new Date(source).getTime();
  return Number.isFinite(t) ? t : 0;
};

const USP_ITEMS = [
  { icon: "01", text: "Mien phi van chuyen don tu 299.000d" },
  { icon: "02", text: "Doi tra mien phi trong 30 ngay" },
  { icon: "03", text: "Bao hanh chat luong 6 thang" },
  { icon: "04", text: "Thanh toan an toan, da dang" },
];

const fmt = (n) => Number(n)?.toLocaleString("vi-VN") + "đ";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, isAuthenticated, authFetch } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [collectionReviews, setCollectionReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [myReviewEndpointAvailable, setMyReviewEndpointAvailable] =
    useState(true);
  const [loadingMoreReviews, setLoadingMoreReviews] = useState(false);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState("");

  useEffect(() => {
    let mounted = true;
    const getData = async () => {
      try {
        const data = await getProductById(id);
        if (!mounted) return;
        setProduct(data);
        if (data?.mauSanPham?.length) {
          setSelectedColor(data.mauSanPham[0].code);
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getData();

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    setCollectionReviews([]);
    setMyReview(null);
    setMyReviewEndpointAvailable(true);
    setEditingReviewId("");
    setHasMoreReviews(false);
  }, [id]);

  useEffect(() => {
    const fetchMyReview = async () => {
      if (!isAuthenticated || !product || !myReviewEndpointAvailable) {
        setMyReview(null);
        return;
      }

      const productId = getEntityId(product);
      if (!productId) return;

      try {
        const data = await authFetch(
          `${API_BASE}/danh-gia/san-pham/${productId}/cua-toi`,
        );
        setMyReview(data || null);
      } catch (err) {
        if (Number(err?.status) === 404) {
          setMyReviewEndpointAvailable(false);
        }
        setMyReview(null);
      }
    };

    fetchMyReview();
  }, [authFetch, isAuthenticated, myReviewEndpointAvailable, product]);

  const currentVariant = product?.mauSanPham?.find(
    (v) => v.code === selectedColor,
  );
  const currentImages = currentVariant?.images?.length
    ? currentVariant.images
    : ["/no-image.png"];

  const availableVariants = useMemo(
    () =>
      Array.isArray(product?.bienTheSanPham) ? product.bienTheSanPham : [],
    [product?.bienTheSanPham],
  );

  const hasStockForColor = (colorCode) =>
    availableVariants.some(
      (variant) =>
        variant.colorCode === colorCode && Number(variant.soLuongTon) > 0,
    );

  const hasStockForColorAndSize = (colorCode, size) =>
    availableVariants.some(
      (variant) =>
        variant.colorCode === colorCode &&
        variant.size === size &&
        Number(variant.soLuongTon) > 0,
    );

  const allSizesForColor = useMemo(() => {
    return [
      ...new Set(
        availableVariants
          .filter((variant) => variant.colorCode === selectedColor)
          .map((variant) => variant.size),
      ),
    ];
  }, [availableVariants, selectedColor]);

  const currentStock =
    availableVariants.find(
      (bt) => bt.colorCode === selectedColor && bt.size === selectedSize,
    )?.soLuongTon ?? null;

  const selectedSku =
    product?.bienTheSanPham?.find(
      (bt) => bt.colorCode === selectedColor && bt.size === selectedSize,
    )?.maSKU ?? null;

  const gia = Number(product?.gia?.$numberDecimal || product?.gia);
  const embeddedReviews = useMemo(
    () =>
      Array.isArray(product?.danhGiaMoiNhat)
        ? product.danhGiaMoiNhat.slice(0, 5)
        : [],
    [product?.danhGiaMoiNhat],
  );

  const reviews = useMemo(() => {
    const merged = [myReview, ...embeddedReviews, ...collectionReviews].filter(
      Boolean,
    );
    const seen = new Set();
    const deduped = merged.filter((item) => {
      const key =
        getReviewId(item) ||
        `${item?.nguoiDung?.nguoiDungId || "guest"}-${item?.ngayTao || ""}-${item?.noiDung || ""}`;
      if (seen.has(String(key))) return false;
      seen.add(String(key));
      return true;
    });

    return deduped.sort((a, b) => toTime(b?.ngayTao) - toTime(a?.ngayTao));
  }, [embeddedReviews, collectionReviews, myReview]);

  const currentUserId = getEntityId(user);
  const ownReview = useMemo(
    () =>
      reviews.find(
        (review) =>
          String(getReviewUserId(review) || "") === String(currentUserId || ""),
      ) || null,
    [reviews, currentUserId],
  );

  const displayedReviews = useMemo(() => {
    const others = reviews.filter(
      (review) =>
        String(getReviewUserId(review) || "") !== String(currentUserId || ""),
    );
    return ownReview ? [ownReview, ...others] : others;
  }, [reviews, ownReview, currentUserId]);

  const totalReviewCount =
    Number.isFinite(Number(product?.soLuotDanhGia)) &&
    Number(product?.soLuotDanhGia) > 0
      ? Number(product.soLuotDanhGia)
      : reviews.length;

  useEffect(() => {
    setHasMoreReviews(reviews.length < totalReviewCount);
  }, [reviews.length, totalReviewCount]);

  const reviewCountsByStar = reviews.reduce(
    (acc, review) => {
      const star = Math.min(5, Math.max(1, Number(review?.diemDanhGia) || 0));
      acc[star] += 1;
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  );

  const handleLoadMoreReviews = async () => {
    if (!product || loadingMoreReviews || !hasMoreReviews) return;

    try {
      setLoadingMoreReviews(true);
      const productId = product?._id?.$oid || product?._id || id;
      const skip = Math.max(5, reviews.length);
      const res = await fetch(
        `${API_BASE}/danh-gia/san-pham/${productId}?skip=${skip}&limit=5`,
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Không thể tải thêm đánh giá");
      }

      const items = Array.isArray(data) ? data : data.items || [];
      setCollectionReviews((prev) => [...prev, ...items]);

      const total = Number(data?.total);
      if (Number.isFinite(total)) {
        setHasMoreReviews(reviews.length + items.length < total);
      } else {
        setHasMoreReviews(Boolean(data?.hasMore));
      }
    } catch (err) {
      setReviewError(err.message || "Không thể tải thêm đánh giá");
    } finally {
      setLoadingMoreReviews(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setReviewError("Vui lòng đăng nhập để đánh giá sản phẩm.");
      return;
    }
    if (!reviewRating || !reviewComment.trim()) {
      setReviewError("Vui lòng chọn sao và nhập nhận xét.");
      return;
    }

    setReviewError("");
    setReviewMessage("");
    try {
      setReviewSubmitting(true);
      const isEditing = Boolean(editingReviewId);
      await authFetch(
        isEditing
          ? `${API_BASE}/danh-gia/${editingReviewId}`
          : `${API_BASE}/danh-gia`,
        {
          method: isEditing ? "PUT" : "POST",
          body: JSON.stringify({
            sanPhamId: product?._id?.$oid || product?._id || id,
            diemDanhGia: reviewRating,
            noiDung: reviewComment.trim(),
          }),
        },
      );

      setCollectionReviews([]);

      const refreshed = await getProductById(id, true);
      setProduct(refreshed);
      if (myReviewEndpointAvailable) {
        try {
          const mine = await authFetch(
            `${API_BASE}/danh-gia/san-pham/${getEntityId(refreshed)}/cua-toi`,
          );
          setMyReview(mine || null);
        } catch (err) {
          if (Number(err?.status) === 404) {
            setMyReviewEndpointAvailable(false);
          }
          setMyReview(null);
        }
      } else {
        setMyReview(null);
      }
      setReviewMessage(
        isEditing
          ? "Đánh giá của bạn đã được cập nhật."
          : "Đánh giá của bạn đã được ghi nhận.",
      );
      setEditingReviewId("");
      setReviewRating(0);
      setReviewHover(0);
      setReviewComment("");
    } catch (err) {
      setReviewError(err.message || "Không thể gửi đánh giá.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleEditOwnReview = () => {
    if (!ownReview) return;
    setEditingReviewId(getReviewId(ownReview));
    setReviewRating(Number(ownReview?.diemDanhGia || 0));
    setReviewComment(String(ownReview?.noiDung || ""));
    setReviewMessage("");
    setReviewError("");
  };

  const handleDeleteOwnReview = async () => {
    if (!ownReview) return;
    const reviewId = getReviewId(ownReview);
    if (!reviewId) return;

    try {
      setReviewSubmitting(true);
      setReviewError("");
      await authFetch(`${API_BASE}/danh-gia/${reviewId}`, { method: "DELETE" });
      setCollectionReviews([]);
      setMyReview(null);
      setEditingReviewId("");
      setReviewRating(0);
      setReviewHover(0);
      setReviewComment("");
      const refreshed = await getProductById(id, true);
      setProduct(refreshed);
      setReviewMessage("Đã xóa đánh giá của bạn.");
    } catch (err) {
      setReviewError(err.message || "Không thể xóa đánh giá.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      const sizesEl = document.querySelector(".pd-sizes");
      sizesEl?.classList.add("pd-sizes--error");
      setTimeout(() => {
        sizesEl?.classList.remove("pd-sizes--error");
      }, 1200);
      return;
    }

    addToCart({
      productId: product._id?.$oid ?? product._id ?? id,
      name: product.tenSanPham,
      image: resolveImageUrl(currentImages[0]),
      price: gia,
      quantity: qty,
      colorCode: selectedColor,
      colorName: currentVariant?.tenMau,
      size: selectedSize,
      maSKU: selectedSku,
    });

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
                {product.mauSanPham?.map((v) => {
                  const selectable = selectedSize
                    ? hasStockForColorAndSize(v.code, selectedSize)
                    : hasStockForColor(v.code);

                  return (
                    <button
                      key={v.code}
                      className={`pd-color-btn ${selectedColor === v.code ? "pd-color-btn--active" : ""} ${!selectable ? "pd-color-btn--out" : ""}`}
                      onClick={() => {
                        if (!selectable) return;
                        setSelectedColor(v.code);
                        setSelectedSize((current) =>
                          current && hasStockForColorAndSize(v.code, current)
                            ? current
                            : null,
                        );
                      }}
                      title={selectable ? v.tenMau : `${v.tenMau} - Hết hàng`}
                      disabled={!selectable}
                    >
                      <span
                        className="pd-color-btn__dot"
                        style={{ background: v.maMau }}
                      />
                      <span className="pd-color-btn__name">{v.tenMau}</span>
                    </button>
                  );
                })}
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
                {allSizesForColor.map((sz) => {
                  const inStock = hasStockForColorAndSize(selectedColor, sz);

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

        <ProductReviewsSection
          product={product}
          totalReviewCount={totalReviewCount}
          reviewCountsByStar={reviewCountsByStar}
          reviews={displayedReviews}
          ownReviewId={getReviewId(ownReview)}
          hasOwnReview={Boolean(ownReview)}
          isEditingOwnReview={Boolean(editingReviewId)}
          hasMoreReviews={hasMoreReviews}
          loadingMoreReviews={loadingMoreReviews}
          onLoadMoreReviews={handleLoadMoreReviews}
          isAuthenticated={isAuthenticated}
          reviewRating={reviewRating}
          reviewHover={reviewHover}
          setReviewRating={setReviewRating}
          setReviewHover={setReviewHover}
          reviewComment={reviewComment}
          setReviewComment={setReviewComment}
          onSubmitReview={handleSubmitReview}
          editingReviewId={editingReviewId}
          onCancelEditReview={() => {
            setEditingReviewId("");
            setReviewRating(0);
            setReviewHover(0);
            setReviewComment("");
          }}
          onEditOwnReview={handleEditOwnReview}
          onDeleteOwnReview={handleDeleteOwnReview}
          reviewSubmitting={reviewSubmitting}
          reviewError={reviewError}
          reviewMessage={reviewMessage}
        />
      </div>

      {showSizeGuide && (
        <SizeGuideModal onClose={() => setShowSizeGuide(false)} />
      )}
    </>
  );
}
