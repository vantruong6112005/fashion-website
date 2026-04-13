import { API_BASE } from "../api";

export const getOrderCode = (order) => order?._id?.$oid || order?._id || "";

const fetchJson = async (path, options) => {
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || "Khong the xu ly yeu cau");
  }
  return data;
};

export const getOrdersByUserId = async (userId) => {
  if (!userId) return [];
  const data = await fetchJson(
    `/don-hang/nguoi-dung/${encodeURIComponent(userId)}`,
  );
  return Array.isArray(data) ? data : [];
};

export const getOrderById = async (orderId) => {
  if (!orderId) return null;
  return fetchJson(`/don-hang/${encodeURIComponent(orderId)}`);
};

export const lookupGuestOrder = async ({ maDonHang, soDienThoai }) => {
  const params = new URLSearchParams({
    maDonHang: String(maDonHang || "").trim(),
    soDienThoai: String(soDienThoai || "").trim(),
  });
  return fetchJson(`/don-hang/tra-cuu?${params.toString()}`);
};

export const refreshMomoPaymentQr = async (orderId) => {
  if (!orderId) {
    throw new Error("Khong tim thay ma don hang de lam moi QR");
  }
  return fetchJson(`/thanh-toan/${encodeURIComponent(orderId)}/momo-refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
};
