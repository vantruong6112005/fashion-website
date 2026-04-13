import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import {
  getOrderCode,
  getOrdersByUserId,
  lookupGuestOrder,
} from "../services/orderService";

const fmt = (v) =>
  Number(v?.$numberDecimal ?? v ?? 0).toLocaleString("vi-VN") + "đ";

const PAYMENT_STATUS_LABEL = {
  CHUA_THANH_TOAN: "Chưa thanh toán",
  CHO_THANH_TOAN: "Chờ thanh toán",
  DA_THANH_TOAN: "Đã thanh toán",
};

const SHIPPING_STATUS_LABEL = {
  DANG_XU_LY: "Đang xử lý",
  CHO_GIAO_HANG: "Chờ giao hàng",
  DANG_GIAO: "Đang giao",
  DA_GIAO: "Đã giao",
  DA_HUY: "Đã hủy",
};

export default function DonHangCuaToi() {
  const location = useLocation();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lookupForm, setLookupForm] = useState({
    maDonHang: "",
    soDienThoai: "",
  });
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [orderSearch, setOrderSearch] = useState("");

  const loadOrders = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    setError("");
    try {
      const userId = user._id.$oid || user._id;
      const data = await getOrdersByUserId(userId);
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (user) return;
    const params = new URLSearchParams(location.search);
    const maDonHang = params.get("maDonHang") || "";
    const soDienThoai = params.get("soDienThoai") || "";
    if (!maDonHang || !soDienThoai) return;
    setLookupForm({ maDonHang, soDienThoai });
  }, [location.search, user]);

  const lookupGuestInvoice = async (e) => {
    e.preventDefault();
    setLookupError("");
    setLookupResult(null);

    try {
      const data = await lookupGuestOrder(lookupForm);
      setLookupResult(data);
    } catch (err) {
      setLookupError(err.message);
    }
  };

  const filteredOrders = useMemo(() => {
    const keyword = orderSearch.trim().toLowerCase();
    if (!keyword) return orders;
    return orders.filter((order) =>
      String(getOrderCode(order)).toLowerCase().includes(keyword),
    );
  }, [orders, orderSearch]);

  const LookupForm = () => (
    <form className="card p-3" onSubmit={lookupGuestInvoice}>
      <div className="row g-2">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Mã đơn hàng"
            value={lookupForm.maDonHang}
            onChange={(e) =>
              setLookupForm((prev) => ({
                ...prev,
                maDonHang: e.target.value,
              }))
            }
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Số điện thoại"
            value={lookupForm.soDienThoai}
            onChange={(e) =>
              setLookupForm((prev) => ({
                ...prev,
                soDienThoai: e.target.value,
              }))
            }
          />
        </div>
      </div>
      <button type="submit" className="btn btn-dark mt-3">
        Tra cứu
      </button>
    </form>
  );

  if (!user) {
    return (
      <div className="container py-4">
        <h2 className="mb-3">Tra cứu hóa đơn vãng lai</h2>
        <p className="text-muted">
          Nhập mã đơn hàng và số điện thoại để tra cứu.
        </p>
        <button
          type="button"
          className="btn btn-outline-dark mb-3"
          onClick={() => setShowAuthModal(true)}
        >
          Đăng nhập / Đăng ký
        </button>
        <LookupForm />

        {lookupError && <p className="text-danger mt-3 mb-0">{lookupError}</p>}

        {lookupResult && (
          <div className="card mt-3">
            <div className="card-body">
              <div className="fw-semibold mb-2">
                Đơn #{lookupResult._id?.$oid || lookupResult._id}
              </div>
              <div className="small text-muted mb-1">
                Trạng thái thanh toán:{" "}
                {PAYMENT_STATUS_LABEL[lookupResult.trangThaiThanhToan] ||
                  lookupResult.trangThaiThanhToan}
              </div>
              <div className="small text-muted mb-2">
                Trạng thái giao:{" "}
                {SHIPPING_STATUS_LABEL[lookupResult.trangThaiGiao] ||
                  lookupResult.trangThaiGiao}
              </div>
              <div className="fw-bold">
                Tổng tiền: {fmt(lookupResult.tongThanhToan)}
              </div>
            </div>
          </div>
        )}

        <AuthModal
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }
  if (loading)
    return <div className="container py-5">Đang tải đơn hàng...</div>;
  if (error) return <div className="container py-5 text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Đơn hàng của tôi</h2>
      <div className="mb-4">
        <h5 className="mb-2">Tìm theo mã đơn hàng</h5>
        <input
          className="form-control"
          placeholder="Nhập mã đơn hàng"
          value={orderSearch}
          onChange={(e) => setOrderSearch(e.target.value)}
        />
      </div>
      {!orders.length ? (
        <p className="text-muted">Bạn chưa có đơn hàng nào.</p>
      ) : !filteredOrders.length ? (
        <p className="text-muted">Không tìm thấy đơn hàng phù hợp.</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredOrders.map((order) => {
            const orderId = getOrderCode(order);

            return (
              <div key={orderId} className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                    <strong>Đơn #{orderId}</strong>
                    <span className="badge text-bg-secondary">
                      {SHIPPING_STATUS_LABEL[order.trangThaiGiao] ||
                        order.trangThaiGiao}
                    </span>
                  </div>

                  <div className="small text-muted mb-1">
                    Phương thức: {order.phuongThucThanhToan}
                  </div>
                  <div className="small text-muted mb-2">
                    Thanh toán:{" "}
                    {PAYMENT_STATUS_LABEL[order.trangThaiThanhToan] ||
                      order.trangThaiThanhToan}
                  </div>

                  <div className="fw-semibold mb-3">
                    Tổng tiền: {fmt(order.tongThanhToan)}
                  </div>

                  <ul className="mb-3 ps-3">
                    {(order.sanPhamMua || []).map((item) => (
                      <li key={item.maSKU}>
                        {item.tenSanPham} - {item.size} x {item.soLuong}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
