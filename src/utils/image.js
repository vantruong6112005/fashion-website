import { API_BASE } from "../api";

const API_HOST = API_BASE.replace(/\/api$/, "");

export const resolveImageUrl = (url = "") => {
  const raw = String(url || "").trim();
  if (!raw) return "";
  if (raw.startsWith("data:")) return raw;
  // Handle localhost:3000 URLs by replacing with proper backend URL
  if (raw.includes("localhost:3000")) {
    const relativePath = raw.replace(/^https?:\/\/[^/]+/, "");
    return `${API_HOST}${relativePath}`;
  }
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `${API_HOST}${raw.startsWith("/") ? raw : `/${raw}`}`;
};

export const toApiRelativeImage = (url = "") => {
  const raw = String(url || "").trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return raw.startsWith(API_HOST) ? raw.replace(API_HOST, "") : raw;
};

export const getProductPrimaryImage = (product) => {
  if (!product) return "/no-image.png";
  const firstVariantImage = product.mauSanPham?.[0]?.images?.[0];
  if (firstVariantImage) return firstVariantImage;
  return product.image || "/no-image.png";
};
