import { API_BASE } from "../api";

let productCache = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getFeaturedProducts() {
  const now = Date.now();
  if (productCache && now - cacheTime < CACHE_DURATION) {
    return productCache;
  }

  try {
    const res = await fetch(`${API_BASE}/san-pham?limit=100`);
    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();
    const products = Array.isArray(data) ? data : data.data || [];

    productCache = products;
    cacheTime = now;

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
