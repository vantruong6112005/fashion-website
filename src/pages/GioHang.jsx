import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import deleteIcon from "../assets/images/icon/delete.svg";
import "../CSS/gioHang.css";
const formatPrice = (value) => {
  const num = Number(value?.$numberDecimal ?? value ?? 0) || 0;
  return num.toLocaleString("vi-VN") + "đ";
};

function GioHang() {
  const navigate = useNavigate();
  const {
    cartItems,
    selectedItems,
    selectedSubtotal,
    updateQuantity,
    toggleSelect,
    removeFromCart,
    clearCart,
  } = useCart();

  if (!cartItems.length) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-3">Giỏ hàng của bạn đang trống</h2>
        <p className="text-muted mb-4">
          Hãy chọn thêm sản phẩm để bắt đầu mua sắm.
        </p>
        <Link to="/hang-moi-ve" className="btn btn-dark px-4">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0">Giỏ hàng</h2>
        <div>
          <button className="btn btn-outline-danger" onClick={clearCart}>
            Xoa toan bo
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="list-group">
            {cartItems.map((item) => (
              <div key={item.key} className="list-group-item py-3">
                <div className="d-flex gap-3">
                  <input
                    type="checkbox"
                    className="form-check-input mt-2"
                    checked={item.isSelected !== false}
                    onChange={(e) => toggleSelect(item.key, e.target.checked)}
                  />
                  <img
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={125}
                    className="rounded object-fit-cover"
                  />

                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>

                    <div className="small text-muted mb-2 d-flex gap-3 flex-wrap">
                      {item.colorName && <span>Màu: {item.colorName}</span>}
                      {item.size && <span>Size: {item.size}</span>}
                    </div>

                    <div className="d-flex justify-content-between align-items-end flex-wrap gap-2">
                      <div>
                        <div className="fw-semibold">
                          {formatPrice(item.price)}
                        </div>
                        <div className="small text-muted">
                          Tạm tính: {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-outline-dark btn-sm"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          className="form-control form-control-sm text-center w-auto"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.key,
                              Number(e.target.value) || 1,
                            )
                          }
                        />
                        <button
                          className="btn btn-outline-dark btn-sm"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity + 1)
                          }
                        >
                          +
                        </button>

                        <button
                          className="btn btn-link text-danger btn-sm text-decoration-none p-1 cart-item-remove-btn"
                          onClick={() => removeFromCart(item.key)}
                          title="Xóa sản phẩm"
                          aria-label="Xóa sản phẩm"
                        >
                          <img
                            src={deleteIcon}
                            alt="delete"
                            width={16}
                            height={16}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Tóm tắt đơn hàng</h5>

              <div className="d-flex justify-content-between mb-2">
                <span>Tạm tính</span>
                <strong>{formatPrice(selectedSubtotal)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <span className="fw-semibold">Tổng cộng</span>
                <span className="fw-bold">{formatPrice(selectedSubtotal)}</span>
              </div>

              <button
                type="button"
                className="btn btn-dark w-100 mb-2"
                disabled={!selectedItems.length}
                onClick={() => {
                  if (!selectedItems.length) return;
                  navigate("/thanh-toan");
                }}
              >
                Thanh toan ({selectedItems.length} san pham)
              </button>
              {!selectedItems.length && (
                <div className="small text-danger mb-2">
                  Vui lòng chọn ít nhất 1 sản phẩm để thanh toán.
                </div>
              )}
              <Link to="/hang-moi-ve" className="btn btn-outline-dark w-100">
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GioHang;
