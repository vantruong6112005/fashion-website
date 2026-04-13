import { API_BASE } from "../api";

const PRODUCTS_KEY = "catalog_products_v1";
const CATEGORIES_KEY = "catalog_categories_v1";
const PROMOS_KEY = "catalog_promos_v1";
const COLLECTIONS_KEY = "catalog_collections_v1";

const TTL = {
  products: 5 * 60 * 1000,
  categories: 30 * 60 * 1000,
  promos: 2 * 60 * 1000,
  collections: 10 * 60 * 1000,
};

const memory = {
  products: null,
  productsTs: 0,
  categories: null,
  categoriesTs: 0,
  promos: null,
  promosTs: 0,
  pendingProducts: null,
  pendingCategories: null,
  pendingPromos: null,
  collections: null,
  collectionsTs: 0,
  pendingCollections: null,
};

const now = () => Date.now();

const isFresh = (ts, ttl) => ts && now() - ts < ttl;

const readStorage = (key) => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.data) || !parsed.ts) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeStorage = (key, data) => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify({ ts: now(), data }));
  } catch {
    // Ignore storage quota errors.
  }
};

const fetchJson = async (path) => {
  const res = await fetch(`${API_BASE}${path}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Request failed: ${path}`);
  return data;
};

const getEntityId = (item) => item?._id?.$oid ?? item?._id;

export async function getProducts(force = false) {
  if (!force && memory.products && isFresh(memory.productsTs, TTL.products)) {
    return memory.products;
  }

  if (!force && !memory.products) {
    const cached = readStorage(PRODUCTS_KEY);
    if (cached && isFresh(cached.ts, TTL.products)) {
      memory.products = cached.data;
      memory.productsTs = cached.ts;
      return cached.data;
    }
  }

  if (!force && memory.pendingProducts) return memory.pendingProducts;

  memory.pendingProducts = fetchJson("/san-pham")
    .then((data) => {
      const list = Array.isArray(data) ? data : [];
      memory.products = list;
      memory.productsTs = now();
      writeStorage(PRODUCTS_KEY, list);
      return list;
    })
    .finally(() => {
      memory.pendingProducts = null;
    });

  return memory.pendingProducts;
}

export async function getCategories(force = false) {
  if (
    !force &&
    memory.categories &&
    isFresh(memory.categoriesTs, TTL.categories)
  ) {
    return memory.categories;
  }

  if (!force && !memory.categories) {
    const cached = readStorage(CATEGORIES_KEY);
    if (cached && isFresh(cached.ts, TTL.categories)) {
      memory.categories = cached.data;
      memory.categoriesTs = cached.ts;
      return cached.data;
    }
  }

  if (!force && memory.pendingCategories) return memory.pendingCategories;

  memory.pendingCategories = fetchJson("/danh-muc")
    .then((data) => {
      const list = Array.isArray(data) ? data : [];
      memory.categories = list;
      memory.categoriesTs = now();
      writeStorage(CATEGORIES_KEY, list);
      return list;
    })
    .finally(() => {
      memory.pendingCategories = null;
    });

  return memory.pendingCategories;
}

export async function getPromos(force = false) {
  if (!force && memory.promos && isFresh(memory.promosTs, TTL.promos)) {
    return memory.promos;
  }

  if (!force && !memory.promos) {
    const cached = readStorage(PROMOS_KEY);
    if (cached && isFresh(cached.ts, TTL.promos)) {
      memory.promos = cached.data;
      memory.promosTs = cached.ts;
      return cached.data;
    }
  }

  if (!force && memory.pendingPromos) return memory.pendingPromos;

  memory.pendingPromos = fetchJson("/uu-dai")
    .then((data) => {
      const list = Array.isArray(data) ? data : [];
      memory.promos = list;
      memory.promosTs = now();
      writeStorage(PROMOS_KEY, list);
      return list;
    })
    .finally(() => {
      memory.pendingPromos = null;
    });

  return memory.pendingPromos;
}

export async function getCollections(force = false) {
  if (
    !force &&
    memory.collections &&
    isFresh(memory.collectionsTs, TTL.collections)
  ) {
    return memory.collections;
  }

  if (!force && !memory.collections) {
    const cached = readStorage(COLLECTIONS_KEY);
    if (cached && isFresh(cached.ts, TTL.collections)) {
      memory.collections = cached.data;
      memory.collectionsTs = cached.ts;
      return cached.data;
    }
  }

  if (!force && memory.pendingCollections) return memory.pendingCollections;

  memory.pendingCollections = fetchJson("/bo-suu-tap")
    .then((data) => {
      const list = Array.isArray(data) ? data : [];
      memory.collections = list;
      memory.collectionsTs = now();
      writeStorage(COLLECTIONS_KEY, list);
      return list;
    })
    .finally(() => {
      memory.pendingCollections = null;
    });

  return memory.pendingCollections;
}

export async function getProductById(id, force = false) {
  if (!force) {
    const list = await getProducts(false);
    const found = list.find((p) => getEntityId(p) === id);
    if (found) return found;
  }

  const data = await fetchJson(`/san-pham/${id}`);
  if (Array.isArray(memory.products) && memory.products.length) {
    const targetId = getEntityId(data);
    const idx = memory.products.findIndex((p) => getEntityId(p) === targetId);
    if (idx >= 0) {
      memory.products[idx] = data;
    } else {
      memory.products = [data, ...memory.products];
    }
    memory.productsTs = now();
    writeStorage(PRODUCTS_KEY, memory.products);
  }
  return data;
}
