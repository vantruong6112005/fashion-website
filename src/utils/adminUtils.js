import { getProductPrimaryImage, resolveImageUrl } from "./image";

export const defaultProductForm = {
  _id: "",
  tenSanPham: "",
  slug: "",
  gia: "",
  danhMucId: [],
  boSuuTapId: [],
  gioiTinh: "",
  chatLieu: "",
  kieuDang: "",
  tinhNang: "",
  baoQuan: "",
  moTaMarkdown: "",
  isActive: true,
  mauSanPham: [{ code: "", tenMau: "", maMau: "#000000", images: [] }],
  bienTheSanPham: [{ maSKU: "", colorCode: "", size: "", soLuongTon: 0 }],
};

export const defaultCollectionForm = {
  _id: "",
  tenBoSuuTap: "",
  slogan: "",
  gioiThieu: "",
  moTa: "",
  slug: "",
  isActive: true,
  thumbnailImage: [],
};

export const defaultPromotionForm = {
  _id: "",
  maKhuyenMai: "",
  donHangToiThieu: "0",
  loaiGiamGia: "PERCENT",
  giaTri: "",
  giamToiDa: "",
  gioiHanSoLuong: "",
  gioiHanMoiUser: "",
  ngayBatDau: "",
  ngayKetThuc: "",
  isActive: true,
};

export const defaultOfferForm = {
  _id: "",
  tenUuDai: "",
  dateStart: "",
  dateEnd: "",
  chonSanPhamNgauNhien: false,
  soLuongSanPhamNgauNhien: 5,
  phanTramGiamToiDa: 30,
  caNgay: true,
  timeStart: "00:00",
  timeEnd: "23:59",
  isActive: true,
  sanPhamUuDai: [],
};

export const adminTabs = [
  { id: "dashboard", label: "Trang Chủ", icon: "bi-house-door" },
  { id: "products", label: "Sản Phẩm", icon: "bi-box-seam" },
  { id: "collections", label: "Bộ Sưu Tập", icon: "bi-collection" },
  { id: "users", label: "Người Dùng", icon: "bi-person" },
  { id: "promotions", label: "Khuyến Mãi", icon: "bi-megaphone" },
  { id: "offers", label: "Ưu Đãi", icon: "bi-gift" },
];

export const extractId = (value) =>
  typeof value === "string" || typeof value === "number"
    ? String(value)
    : value?.$oid || value?._id?.$oid || value?._id || value?.sanPhamId || "";

export const toInputDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const toCurrency = (value) =>
  Number(value || 0).toLocaleString("vi-VN", {
    maximumFractionDigits: 0,
  });

export const getProductThumb = (product) =>
  resolveImageUrl(getProductPrimaryImage(product)) || "";

export const getCollectionThumb = (collection) => {
  const firstImage = collection?.thumbnailImage?.[0] || "";
  return resolveImageUrl(firstImage) || "";
};

export const mapProductToForm = (product) => ({
  _id: extractId(product),
  tenSanPham: product?.tenSanPham || "",
  slug: product?.slug || "",
  gia: String(product?.gia?.$numberDecimal || product?.gia || ""),
  danhMucId: Array.isArray(product?.danhMucId)
    ? product.danhMucId.map((item) => extractId(item)).filter(Boolean)
    : [],
  boSuuTapId: Array.isArray(product?.boSuuTapId)
    ? product.boSuuTapId.map((item) => extractId(item)).filter(Boolean)
    : [],
  gioiTinh: product?.gioiTinh || "",
  chatLieu: product?.chatLieu || "",
  kieuDang: product?.kieuDang || "",
  tinhNang: product?.tinhNang || "",
  baoQuan: product?.baoQuan || "",
  moTaMarkdown: product?.moTa || "",
  isActive: product?.isActive !== false,
  mauSanPham:
    Array.isArray(product?.mauSanPham) && product.mauSanPham.length
      ? product.mauSanPham.map((mau) => ({
          code: mau?.code || "",
          tenMau: mau?.tenMau || "",
          maMau: mau?.maMau || "#000000",
          images: Array.isArray(mau?.images) ? mau.images : [],
        }))
      : [{ code: "", tenMau: "", maMau: "#000000", images: [] }],
  bienTheSanPham:
    Array.isArray(product?.bienTheSanPham) && product.bienTheSanPham.length
      ? product.bienTheSanPham.map((variant) => ({
          maSKU: variant?.maSKU || "",
          colorCode: variant?.colorCode || "",
          size: variant?.size || "",
          soLuongTon: variant?.soLuongTon || 0,
        }))
      : [{ maSKU: "", colorCode: "", size: "", soLuongTon: 0 }],
});
