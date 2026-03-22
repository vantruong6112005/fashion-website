import { useState, useMemo } from "react";
import "../css/ProductGrid.css";
import { Link } from "react-router-dom";
import { API_HOST } from "../utils/api";

const formatPrice = (n) => n.toLocaleString("vi-VN") + "đ";

const ProductCard2 = ({ product }) => {
  // lấy màu đầu tiên làm mặc định
  const [selectedColor, setSelectedColor] = useState(
    product.mauSanPham?.[0]?.maMau ?? null,
  );

  // tìm variant theo màu đang chọn
  const currentVariant = useMemo(() => {
    return product.mauSanPham?.find((v) => v.maMau === selectedColor);
  }, [product.mauSanPham, selectedColor]);

  // lấy ảnh theo màu
  const currentImage = currentVariant?.images?.[0] || "/no-image.png";

  const hasDiscount = product.giaUuDai != null && product.giaGoc != null;

  return (
    <div className="product-card card h-100 border-0 rounded-3">
      <div className="position-relative bg-light">
        <Link to={`/san-pham/${product._id}`}>
          <img
            className="product-card__image img-fluid object-fit-cover"
            src={`${API_HOST}${currentImage}`}
            alt={product.tenSanPham}
          />
        </Link>
        {hasDiscount && (
          <span
            className="position-absolute top-0 start-0 m-2 badge"
            style={{ background: "#f2f2f2", fontSize: "12px" }}
          >
            -{product.discountPct}%
          </span>
        )}
      </div>

      <div className="card-body p-3">
        {/* Hiển thị màu */}
        {product.mauSanPham?.length > 0 && (
          <div className="d-flex gap-2 mb-2">
            {product.mauSanPham.map((variant) => (
              <div
                key={variant.maMau}
                className={`product-card__color-dot ${
                  selectedColor === variant.maMau
                    ? "product-card__color-dot--active"
                    : ""
                }`}
                style={{ background: variant.maMau }}
                onClick={() => setSelectedColor(variant.maMau)}
              />
            ))}
          </div>
        )}

        <Link
          to={`/san-pham/${product._id}`}
          className="product-card__name mb-2 small fw-medium text-dark text-decoration-none"
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
      </div>
    </div>
  );
};

export default ProductCard2;
