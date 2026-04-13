import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { resolveImageUrl } from "../../utils/image";
import "../../CSS/ProductGrid.css";

const toPriceNumber = (value) =>
  Number(value?.$numberDecimal ?? value ?? 0) || 0;
const formatPrice = (value) =>
  toPriceNumber(value).toLocaleString("vi-VN") + "đ";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(
    product.mauSanPham?.[0]?.code ?? null,
  );
  const currentVariant = useMemo(
    () => product.mauSanPham?.find((v) => v.code === selectedColor),
    [product.mauSanPham, selectedColor],
  );
  const currentImage = currentVariant?.images?.[0] || "/no-image.png";
  const displayImage = resolveImageUrl(currentImage);
  const hasDiscount = product.giaUuDai != null && product.giaGoc != null;
  const [showQuickSize, setShowQuickSize] = useState(false);

  const availableSizesByColor = useMemo(() => {
    return (
      product.bienTheSanPham
        ?.filter(
          (variant) =>
            variant.colorCode === selectedColor &&
            Number(variant.soLuongTon) > 0,
        )
        .map((variant) => ({ size: variant.size, maSKU: variant.maSKU })) || []
    );
  }, [product.bienTheSanPham, selectedColor]);

  const handleQuickAddSize = async ({ size, maSKU }) => {
    try {
      await addToCart({
        productId: product._id,
        name: product.tenSanPham,
        image: displayImage,
        price: hasDiscount ? product.giaUuDai : product.gia,
        quantity: 1,
        colorCode: selectedColor,
        colorName: currentVariant?.tenMau,
        size,
        maSKU,
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="product-card card h-100 border-0 rounded-3">
      <div
        className="position-relative bg-light"
        onMouseEnter={() => setShowQuickSize(true)}
        onMouseLeave={() => setShowQuickSize(false)}
      >
        <Link to={`/san-pham/${product._id}`}>
          <img
            className="product-card__image img-fluid object-fit-cover"
            src={displayImage}
            alt={product.tenSanPham}
          />
        </Link>
        {hasDiscount && (
          <span
            className="position-absolute top-0 start-0 m-2 badge"
            style={{ background: "#00168d", fontSize: "12px" }}
          >
            -{product.discountPct}%
          </span>
        )}

        {showQuickSize && (
          <div className="product-card__size-overlay">
            <div className="product-card__size-title">
              Them nhanh vao gio hang +
            </div>
            <div className="product-card__size-options">
              {availableSizesByColor.length ? (
                availableSizesByColor.map((variant) => (
                  <button
                    key={variant.maSKU}
                    type="button"
                    className="product-card__size-option"
                    onClick={() => handleQuickAddSize(variant)}
                  >
                    {variant.size}
                  </button>
                ))
              ) : (
                <span className="small text-light">Mau nay tam het size</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="card-body p-3">
        {product.mauSanPham?.length > 0 && (
          <div className="d-flex gap-2 mb-2">
            {product.mauSanPham.map((variant) => (
              <div
                key={variant.maMau}
                className={`product-card__color-dot ${
                  selectedColor === variant.code
                    ? "product-card__color-dot--active"
                    : ""
                }`}
                style={{ background: variant.maMau }}
                onClick={() => setSelectedColor(variant.code)}
              />
            ))}
          </div>
        )}

        <Link
          to={`/san-pham/${product._id}`}
          className="product-card__name mb-2 small fw-medium text-dark text-decoration-none"
          onMouseEnter={() => setShowQuickSize(true)}
          onMouseLeave={() => setShowQuickSize(false)}
        >
          {product.tenSanPham}
        </Link>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          {hasDiscount ? (
            <>
              <span className="fw-bold small" style={{ color: "#00168d" }}>
                {formatPrice(product.giaUuDai)}
              </span>
              <span
                className="small text-muted text-decoration-line-through"
                style={{ fontSize: "12px" }}
              >
                {formatPrice(product.giaGoc)}
              </span>
            </>
          ) : (
            <span className="fw-bold small text-dark">
              {formatPrice(product.gia)}
            </span>
          )}
        </div>

        <div className="small text-muted mt-2">
          Re chuot vao anh/ten de chon size nhanh
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
