import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../api";
import { PAYMENT_METHODS } from "../data/paymentMethods";
import {
  getOrderById,
  getOrderCode,
  refreshMomoPaymentQr,
} from "../services/orderService";
import "../CSS/checkout.css";

const fmt = (v) => Number(v || 0).toLocaleString("vi-VN") + "đ";
const MOMO_STORAGE_KEY = "fashion_pending_momo_payment_v1";

const isQrExpired = (expiresAt) => {
  if (!expiresAt) return true;
  const expiresMs = new Date(expiresAt).getTime();
  return Number.isNaN(expiresMs) ? true : Date.now() >= expiresMs;
};

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const {
    activeCart,
    cartItems,
    selectedItems,
    refreshCarts,
    updateQuantity,
    toggleSelect,
    removeFromCart,
  } = useCart();

  const [shipping, setShipping] = useState({
    tenNguoiNhan: "",
    soDienThoai: "",
    email: "",
    diaChi: "",
  });
  const [shippingErrors, setShippingErrors] = useState({});
  const [vouchers, setVouchers] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [preview, setPreview] = useState({
    subtotal: 0,
    discount: 0,
    total: 0,
  });
  const [momoData, setMomoData] = useState(null);
  const [message, setMessage] = useState("");
  const [momoFinalized, setMomoFinalized] = useState(false);
  const [refreshingQr, setRefreshingQr] = useState(false);
  const shippingNameRef = useRef(null);
  const shippingPhoneRef = useRef(null);
  const shippingEmailRef = useRef(null);
  const shippingAddressRef = useRef(null);

  const userId = user ? user._id?.$oid || user._id : null;

  const guestCheckoutItems = useMemo(
    () =>
      selectedItems.map((item) => ({
        sanPhamId: item.productId,
        tenSanPham: item.tenSanPham,
        maSKU: item.maSKU,
        image: item.image,
        mausac: item.mausac || item.colorName,
        size: item.size,
        soLuong: Number(item.soLuong || 0),
        gia: Number(item.gia || item.price || 0),
      })),
    [selectedItems],
  );

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(MOMO_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.orderId) {
          if (
            parsed.paymentStatus !== "DA_THANH_TOAN" &&
            isQrExpired(parsed.expiresAt)
          ) {
            setMomoData({ ...parsed, qrUrl: "" });
          } else {
            setMomoData(parsed);
          }
        }
      }
    } catch {
      // Bo qua loi phuc hoi session thanh toan.
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const orderId =
      searchParams.get("orderId") || searchParams.get("requestId");
    const resultCode = searchParams.get("resultCode");
    if (!orderId) return;

    setMomoData((prev) => ({
      ...(prev || {}),
      orderId,
      paymentStatus:
        resultCode === "0"
          ? "DA_THANH_TOAN"
          : prev?.paymentStatus || "CHO_THANH_TOAN",
    }));
  }, [location.search]);

  useEffect(() => {
    if (!momoData?.orderId) return;
    try {
      window.sessionStorage.setItem(MOMO_STORAGE_KEY, JSON.stringify(momoData));
    } catch {
      // Bo qua loi luu session thanh toan.
    }
  }, [momoData]);

  useEffect(() => {
    if (!momoData?.paymentStatus) return;
    if (
      momoData.paymentStatus === "DA_THANH_TOAN" ||
      momoData.paymentStatus === "THAT_BAI" ||
      momoData.paymentStatus === "DA_HUY"
    ) {
      try {
        window.sessionStorage.removeItem(MOMO_STORAGE_KEY);
      } catch {
        // Bo qua loi xoa session thanh toan.
      }
    }
  }, [momoData?.paymentStatus]);

  const refreshExpiredQr = useCallback(
    async (orderId) => {
      if (!orderId || refreshingQr) return false;
      try {
        setRefreshingQr(true);
        const data = await refreshMomoPaymentQr(orderId);
        setMomoData((prev) =>
          prev
            ? {
                ...prev,
                payUrl: data.payUrl,
                qrUrl: data.qrUrl,
                expiresAt: data.expiresAt,
                paymentStatus: data.paymentStatus || "CHO_THANH_TOAN",
              }
            : prev,
        );
        setMessage("QR MoMo đã hết hạn, hệ thống đã cấp mã mới.");
        return true;
      } catch {
        setMomoData((prev) =>
          prev
            ? {
                ...prev,
                qrUrl: "",
                paymentStatus: "HET_HAN",
              }
            : prev,
        );
        setMessage("QR MoMo đã hết hạn. Vui lòng đặt đơn mới.");
        return false;
      } finally {
        setRefreshingQr(false);
      }
    },
    [refreshingQr],
  );

  const syncMomoPaymentStatus = useCallback(
    async (orderId) => {
      if (!orderId) return false;
      try {
        const order = await getOrderById(orderId);
        if (!order?._id) return false;
        const orderCode = getOrderCode(order);

        if (order.trangThaiThanhToan === "DA_THANH_TOAN") {
          setMomoData((prev) =>
            prev
              ? {
                  ...prev,
                  orderCode,
                  paymentStatus: "DA_THANH_TOAN",
                }
              : prev,
          );
          setMessage(`Thanh toán MoMo thành công cho đơn #${orderCode}.`);
          setMomoFinalized(true);
          return true;
        }

        if (
          order.trangThaiThanhToan === "THAT_BAI" ||
          order.trangThaiThanhToan === "HET_HAN" ||
          order.trangThaiThanhToan === "DA_HUY"
        ) {
          if (order.trangThaiThanhToan === "HET_HAN") {
            return refreshExpiredQr(orderId);
          }
          setMomoData((prev) =>
            prev
              ? {
                  ...prev,
                  paymentStatus: order.trangThaiThanhToan,
                }
              : prev,
          );
          setMessage("Thanh toán MoMo không thành công.");
          return true;
        }

        return false;
      } catch {
        return false;
      }
    },
    [refreshExpiredQr],
  );

  useEffect(() => {
    if (!user) return;
    const firstAddress = user.diaChiNhanHang?.[0] || {};
    setShipping({
      tenNguoiNhan: firstAddress.tenNguoiNhan || user.username || "",
      soDienThoai: firstAddress.soDienThoai || user.soDienThoai || "",
      email: user.email || "",
      diaChi: firstAddress.diaChi || "",
    });
  }, [user]);

  useEffect(() => {
    shippingNameRef.current?.focus();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/khuyen-mai`)
      .then((r) => r.json())
      .then((data) =>
        setVouchers(Array.isArray(data) ? data.filter((x) => x.isActive) : []),
      )
      .catch(() => setVouchers([]));
  }, []);

  useEffect(() => {
    if (!selectedItems.length) {
      setPreview({ subtotal: 0, discount: 0, total: 0 });
      return;
    }

    const payload = activeCart?._id
      ? {
          gioHangId: activeCart._id,
          itemKeys: selectedItems.map((x) => x.maSKU),
          voucherCode: voucherCode || undefined,
        }
      : {
          items: guestCheckoutItems,
          voucherCode: voucherCode || undefined,
        };

    setLoading(true);
    fetch(`${API_BASE}/thanh-toan/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.message) throw new Error(data.message);
        setPreview({
          subtotal: data.subtotal || 0,
          discount: data.discount || 0,
          total: data.total || 0,
        });
      })
      .catch(() => {
        setPreview({ subtotal: 0, discount: 0, total: 0 });
      })
      .finally(() => setLoading(false));
  }, [activeCart?._id, selectedItems, voucherCode, guestCheckoutItems]);

  useEffect(() => {
    if (!momoData?.orderId || momoData.paymentStatus === "DA_THANH_TOAN") {
      return undefined;
    }

    const poll = setInterval(async () => {
      await syncMomoPaymentStatus(momoData.orderId);
    }, 5000);

    return () => clearInterval(poll);
  }, [momoData?.orderId, momoData?.paymentStatus, syncMomoPaymentStatus]);

  const allItemsSelected = useMemo(
    () =>
      cartItems.length > 0 &&
      cartItems.every((item) => item.isSelected !== false),
    [cartItems],
  );

  const toggleSelectAll = (checked) => {
    cartItems.forEach((item) => {
      toggleSelect(item.maSKU, checked);
    });
  };

  const paymentConfig = useMemo(
    () => PAYMENT_METHODS.find((item) => item.value === paymentMethod),
    [paymentMethod],
  );

  const canPlaceOrder = useMemo(() => {
    return Boolean(selectedItems.length && paymentConfig?.enabled);
  }, [selectedItems.length, paymentConfig?.enabled]);

  const validateShippingField = (field, value) => {
    const trimmed = String(value || "").trim();

    if (field === "tenNguoiNhan") {
      if (!trimmed) return "Vui lòng nhập họ tên người nhận";
      if (trimmed.length < 2) return "Họ tên phải có ít nhất 2 ký tự";
      return "";
    }

    if (field === "soDienThoai") {
      if (!trimmed) return "Vui lòng nhập số điện thoại";
      if (!/^(0|\+84)\d{9,10}$/.test(trimmed)) {
        return "Số điện thoại không hợp lệ (ví dụ: 0912345678)";
      }
      return "";
    }

    if (field === "email") {
      if (!trimmed) return "Vui lòng nhập email";
      if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
        return "Email không đúng định dạng (ví dụ: ten@email.com)";
      }
      return "";
    }

    if (field === "diaChi") {
      if (!trimmed) return "Vui lòng nhập địa chỉ giao hàng";
      if (trimmed.length < 8) {
        return "Địa chỉ quá ngắn, vui lòng nhập chi tiết hơn";
      }
      return "";
    }

    return "";
  };

  const validateShipping = () => {
    const nextErrors = {
      tenNguoiNhan: validateShippingField(
        "tenNguoiNhan",
        shipping.tenNguoiNhan,
      ),
      soDienThoai: validateShippingField("soDienThoai", shipping.soDienThoai),
      email: validateShippingField("email", shipping.email),
      diaChi: validateShippingField("diaChi", shipping.diaChi),
    };
    setShippingErrors(nextErrors);

    const firstInvalidKey = Object.keys(nextErrors).find((key) =>
      Boolean(nextErrors[key]),
    );

    if (!firstInvalidKey) return true;

    const focusMap = {
      tenNguoiNhan: shippingNameRef,
      soDienThoai: shippingPhoneRef,
      email: shippingEmailRef,
      diaChi: shippingAddressRef,
    };

    focusMap[firstInvalidKey]?.current?.focus();
    setMessage("Vui lòng kiểm tra lại thông tin giao hàng");
    return false;
  };

  const placeOrder = async () => {
    if (!selectedItems.length || !paymentConfig?.enabled) return;
    if (!validateShipping()) return;

    setPlacing(true);
    setMomoFinalized(false);
    setMessage("");
    try {
      const payload = {
        nguoiDungId: userId,
        gioHangId: activeCart?._id || undefined,
        itemKeys: activeCart?._id
          ? selectedItems.map((x) => x.maSKU)
          : undefined,
        items: activeCart?._id ? undefined : guestCheckoutItems,
        nguoiDungVangLai: userId
          ? undefined
          : {
              tenNguoiNhan: shipping.tenNguoiNhan,
              soDienThoai: shipping.soDienThoai,
              email: shipping.email,
            },
        shippingInfo: shipping,
        paymentMethod,
        voucherCode: voucherCode || undefined,
      };

      const res = await fetch(`${API_BASE}/thanh-toan/dat-hang`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đặt hàng thất bại");

      if (paymentMethod === "MOMO") {
        const orderId = getOrderCode(data.order);
        setMomoData({
          orderId,
          orderCode: orderId,
          lookupPhone: shipping.soDienThoai,
          payUrl: data.momo?.payUrl,
          qrUrl: data.momo?.qrUrl,
          expiresAt: data.momo?.expiresAt,
          paymentStatus: data.order?.trangThaiThanhToan || "CHO_THANH_TOAN",
        });
        setMessage(
          "Đơn hàng ở trạng thái chờ thanh toán. Hãy thanh toán MoMo để hoàn tất.",
        );
        if (data.momo?.payUrl) {
          window.open(data.momo.payUrl, "_blank", "noopener,noreferrer");
        }
        await syncMomoPaymentStatus(orderId);
      } else {
        if (userId) {
          await refreshCarts();
        } else {
          await Promise.all(
            selectedItems.map((item) => removeFromCart(item.maSKU)),
          );
          await refreshCarts();
        }
        setMessage("Đặt hàng thành công");
        if (userId) {
          navigate("/don-hang", { replace: true });
        } else {
          const orderId = getOrderCode(data.order);
          navigate(
            `/don-hang?maDonHang=${encodeURIComponent(orderId || "")}&soDienThoai=${encodeURIComponent(shipping.soDienThoai)}`,
            { replace: true },
          );
        }
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setPlacing(false);
    }
  };

  useEffect(() => {
    if (!momoFinalized || momoData?.paymentStatus !== "DA_THANH_TOAN") return;
    if (userId) {
      refreshCarts().catch(() => undefined);
      return;
    }

    Promise.all(selectedItems.map((item) => removeFromCart(item.maSKU)))
      .then(() => refreshCarts())
      .catch(() => undefined);
  }, [
    momoFinalized,
    momoData?.paymentStatus,
    userId,
    selectedItems,
    removeFromCart,
    refreshCarts,
  ]);

  return (
    <div className="checkout-page container-fluid py-4">
      <div className="row g-4 px-lg-3">
        <div className="col-xl-6 col-lg-6">
          <div className="checkout-card mb-3">
            <h3 className="checkout-card__title">Thông tin vận chuyển</h3>
            <div className="row g-2">
              <div className="col-md-6">
                <label
                  htmlFor="checkout-recipient-name"
                  className="form-label mb-1"
                >
                  Họ tên người nhận
                </label>
                <input
                  id="checkout-recipient-name"
                  ref={shippingNameRef}
                  className={`form-control rounded-pill ${shippingErrors.tenNguoiNhan ? "is-invalid" : ""}`}
                  placeholder="Họ tên"
                  value={shipping.tenNguoiNhan}
                  onChange={(e) => {
                    const value = e.target.value;
                    setShipping((p) => ({
                      ...p,
                      tenNguoiNhan: value,
                    }));
                    setShippingErrors((prev) => ({
                      ...prev,
                      tenNguoiNhan: validateShippingField(
                        "tenNguoiNhan",
                        value,
                      ),
                    }));
                  }}
                />
                {shippingErrors.tenNguoiNhan && (
                  <span className="checkout-field-error">
                    {shippingErrors.tenNguoiNhan}
                  </span>
                )}
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="checkout-recipient-phone"
                  className="form-label mb-1"
                >
                  Số điện thoại
                </label>
                <input
                  id="checkout-recipient-phone"
                  type="tel"
                  ref={shippingPhoneRef}
                  className={`form-control rounded-pill ${shippingErrors.soDienThoai ? "is-invalid" : ""}`}
                  placeholder="Số điện thoại"
                  value={shipping.soDienThoai}
                  onChange={(e) => {
                    const value = e.target.value;
                    setShipping((p) => ({
                      ...p,
                      soDienThoai: value,
                    }));
                    setShippingErrors((prev) => ({
                      ...prev,
                      soDienThoai: validateShippingField("soDienThoai", value),
                    }));
                  }}
                />
                {shippingErrors.soDienThoai && (
                  <span className="checkout-field-error">
                    {shippingErrors.soDienThoai}
                  </span>
                )}
              </div>
              <div className="col-12">
                <label
                  htmlFor="checkout-recipient-email"
                  className="form-label mb-1"
                >
                  Email
                </label>
                <input
                  id="checkout-recipient-email"
                  type="email"
                  ref={shippingEmailRef}
                  className={`form-control rounded-pill ${shippingErrors.email ? "is-invalid" : ""}`}
                  placeholder="Email"
                  value={shipping.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setShipping((p) => ({ ...p, email: value }));
                    setShippingErrors((prev) => ({
                      ...prev,
                      email: validateShippingField("email", value),
                    }));
                  }}
                />
                {shippingErrors.email && (
                  <span className="checkout-field-error">
                    {shippingErrors.email}
                  </span>
                )}
              </div>
              <div className="col-12">
                <label
                  htmlFor="checkout-recipient-address"
                  className="form-label mb-1"
                >
                  Địa chỉ giao hàng
                </label>
                <textarea
                  id="checkout-recipient-address"
                  ref={shippingAddressRef}
                  className={`form-control rounded-pill ${shippingErrors.diaChi ? "is-invalid" : ""}`}
                  rows={2}
                  placeholder="Địa chỉ giao hàng"
                  value={shipping.diaChi}
                  onChange={(e) => {
                    const value = e.target.value;
                    setShipping((p) => ({ ...p, diaChi: value }));
                    setShippingErrors((prev) => ({
                      ...prev,
                      diaChi: validateShippingField("diaChi", value),
                    }));
                  }}
                />
                {shippingErrors.diaChi && (
                  <span className="checkout-field-error">
                    {shippingErrors.diaChi}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="checkout-card">
            <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
              <h3 className="checkout-card__title mb-0">
                Hình thức thanh toán
              </h3>
              {!paymentConfig?.enabled && (
                <span className="badge text-bg-warning">
                  Tạm thời chỉ hỗ trợ COD và MoMo
                </span>
              )}
            </div>

            <div className="checkout-payment-options mt-3">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.value}
                  className={`checkout-payment-option ${paymentMethod === method.value ? "is-active" : ""}`}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === method.value}
                    onChange={() => setPaymentMethod(method.value)}
                  />
                  <img
                    src={method.icon}
                    alt={method.label}
                    className="checkout-payment-option__icon"
                  />
                  <div className="checkout-payment-option__content">
                    <div className="checkout-payment-option__label">
                      {method.label}
                    </div>
                    <div className="checkout-payment-option__desc">
                      {method.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="col-xl-6 col-lg-6">
          <div className="checkout-card mb-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="checkout-card__title mb-0">Giỏ hàng</h3>
              <label className="d-flex align-items-center gap-2 mb-0 checkout-select-all">
                <input
                  type="checkbox"
                  checked={allItemsSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="form-check-input m-0"
                />
                <span>Tất cả ({cartItems.length})</span>
              </label>
            </div>
            {!cartItems.length ? (
              <p className="text-muted mb-0">
                Giỏ hàng trống. Hãy thêm sản phẩm để thanh toán.
              </p>
            ) : (
              <div className="checkout-items">
                {cartItems.map((item) => (
                  <div key={item.maSKU} className="checkout-item-row">
                    <input
                      type="checkbox"
                      checked={item.isSelected !== false}
                      onChange={(e) =>
                        toggleSelect(item.maSKU, e.target.checked)
                      }
                    />
                    <img
                      src={item.image}
                      alt={item.tenSanPham}
                      width={100}
                      height={125}
                      className="rounded object-fit-cover checkout-item-image"
                    />
                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-semibold lh-sm">{item.tenSanPham}</div>
                      <div className="text-secondary small mt-1">
                        {item.mausac} / {item.size}
                      </div>
                      <div className="fw-bold mt-1">{fmt(item.price)}</div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() =>
                          updateQuantity(item.maSKU, Number(item.soLuong) - 1)
                        }
                      >
                        -
                      </button>
                      <span>{item.soLuong}</span>
                      <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() =>
                          updateQuantity(item.maSKU, Number(item.soLuong) + 1)
                        }
                      >
                        +
                      </button>
                      <button
                        className="btn btn-link text-danger text-decoration-none px-1"
                        onClick={() => removeFromCart(item.maSKU)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="checkout-card">
            <h3 className="checkout-card__title">Chi tiết thanh toán</h3>

            <label className="form-label mt-2">Voucher</label>
            <select
              className="form-select mb-3"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
            >
              <option value="">Không dùng voucher</option>
              {vouchers.map((v) => (
                <option key={v._id?.$oid || v._id} value={v.maKhuyenMai}>
                  {v.maKhuyenMai}
                </option>
              ))}
            </select>

            <div className="d-flex justify-content-between">
              <span>Tạm tính</span>
              <strong>{fmt(preview.subtotal)}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Voucher giảm giá</span>
              <strong>- {fmt(preview.discount)}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Phí giao hàng</span>
              <strong>Miễn phí</strong>
            </div>
            <hr />
            <div className="d-flex justify-content-between fs-5">
              <span>Thành tiền</span>
              <strong style={{ color: "#00168d" }}>{fmt(preview.total)}</strong>
            </div>

            <button
              className="btn btn-outline-dark w-100 mt-3"
              disabled={!canPlaceOrder || placing || loading}
              onClick={placeOrder}
            >
              {placing ? "Đang đặt hàng..." : "Đặt hàng"}
            </button>

            {message && (
              <div className="small mt-2 text-primary">{message}</div>
            )}
          </div>

          {momoData?.paymentStatus !== "DA_THANH_TOAN" && momoData?.qrUrl && (
            <div className="checkout-card mt-3 text-center">
              <h6 className="mb-2">MoMo - Chờ thanh toán</h6>
              <img
                src={momoData.qrUrl}
                alt="MoMo QR"
                width={220}
                height={220}
                className="object-fit-cover"
              />
              <div className="small text-muted mt-2">
                Hệ thống tự động kiểm tra thanh toán sau khi quét mã QR.
              </div>
              {momoData?.expiresAt && (
                <div className="small text-secondary mt-1">
                  Hạn QR:{" "}
                  {new Date(momoData.expiresAt).toLocaleTimeString("vi-VN")}
                </div>
              )}
            </div>
          )}

          {momoData?.paymentStatus !== "DA_THANH_TOAN" &&
            momoData?.orderId &&
            !momoData?.qrUrl && (
              <div className="checkout-card mt-3 text-center">
                <h6 className="mb-2">MoMo - Chờ thanh toán</h6>
                <div className="small text-muted">
                  QR đã hết hạn, vui lòng tiếp tục trên phiên hiện tại để hệ
                  thống cấp mã mới.
                </div>
              </div>
            )}

          {momoData?.paymentStatus === "DA_THANH_TOAN" && (
            <div className="checkout-card mt-3">
              <div className="alert alert-success mb-2">
                Thanh toán thành công. Mã đơn hàng #
                {momoData.orderCode || momoData.orderId}. Đơn hàng của bạn đã
                chuyển sang trạng thái chờ giao hàng.
              </div>
              {userId ? (
                <div className="d-flex gap-2 flex-wrap">
                  <Link to="/don-hang" className="btn btn-outline-dark btn-sm">
                    Xem đơn hàng
                  </Link>
                  <Link to="/" className="btn btn-dark btn-sm">
                    Về trang chủ
                  </Link>
                </div>
              ) : (
                <div className="d-flex gap-2 flex-wrap">
                  <Link
                    to={`/don-hang?maDonHang=${encodeURIComponent(momoData.orderCode || momoData.orderId || "")}&soDienThoai=${encodeURIComponent(momoData.lookupPhone || shipping.soDienThoai || "")}`}
                    className="btn btn-outline-dark btn-sm"
                  >
                    Tra cứu đơn hàng
                  </Link>
                  <Link to="/" className="btn btn-dark btn-sm">
                    Về trang chủ
                  </Link>
                </div>
              )}
            </div>
          )}

          {["THAT_BAI", "HET_HAN", "DA_HUY"].includes(
            momoData?.paymentStatus,
          ) && (
            <div className="checkout-card mt-3">
              <div className="alert alert-danger mb-2">
                Thanh toán MoMo không thành công hoặc đã hết hạn. Đơn hàng đã bị
                hủy, vui lòng đặt lại đơn mới.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="checkout-fixed-bar">
        <div className="checkout-fixed-bar__summary">
          <div>
            <div className="checkout-fixed-bar__label">Thanh toán</div>
            <div className="checkout-fixed-bar__value">
              {paymentConfig?.label || "COD"}
            </div>
          </div>
          <div>
            <div className="checkout-fixed-bar__label">Voucher</div>
            <div className="checkout-fixed-bar__value">
              {voucherCode || "Chưa áp dụng"}
            </div>
          </div>
          <div>
            <div className="checkout-fixed-bar__label">Thành tiền</div>
            <div className="checkout-fixed-bar__price">
              {fmt(preview.total)}
            </div>
          </div>
        </div>

        <button
          className="btn btn-outline-dark checkout-fixed-bar__button"
          disabled={!canPlaceOrder || placing || loading}
          onClick={placeOrder}
        >
          {placing ? "Đang đặt hàng..." : "Đặt hàng"}
        </button>
      </div>
    </div>
  );
}
