import { useCallback, useMemo, useReducer } from "react";

const MATERIAL_KEYWORDS = [
  "polyester",
  "cotton",
  "nylon",
  "spandex",
  "linen",
  "rayon",
  "viscose",
  "wool",
  "silk",
  "acrylic",
  "modal",
  "tencel",
  "denim",
];

const getId = (obj) => (obj?.$oid ? obj.$oid : String(obj ?? ""));

const toNumber = (value) => Number(value?.$numberDecimal ?? value ?? 0);

const toTimestamp = (value) => {
  if (!value) return 0;
  const parsed = new Date(value?.$date ?? value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getEffectivePrice = (product) => {
  const salePrice = toNumber(product?.giaUuDai);
  if (salePrice > 0) return salePrice;
  return toNumber(product?.gia);
};

const toTitleCase = (text) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";

export function parseDateValue(raw) {
  const time = new Date(raw?.$date ?? raw).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function isPromotionActive(promo, nowTs = Date.now()) {
  if (!promo?.isActive) return false;
  const startTs = parseDateValue(promo?.dateRange?.start);
  const endTs = parseDateValue(promo?.dateRange?.end);
  if (!startTs || !endTs) return true;
  return startTs <= nowTs && nowTs <= endTs;
}

export function filterActivePromotions(promos = [], nowTs = Date.now()) {
  return promos.filter((promo) => isPromotionActive(promo, nowTs));
}

export function normalizeSearchText(text) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchesRelativeSearch(text, keyword) {
  const normalizedText = normalizeSearchText(text);
  const tokens = normalizeSearchText(keyword).split(" ").filter(Boolean);

  if (!tokens.length) return true;
  return tokens.every((token) => normalizedText.includes(token));
}

export function extractPrimaryMaterial(chatLieuRaw) {
  if (!chatLieuRaw) return null;

  const normalized = String(chatLieuRaw)
    .replace(/\([^)]*\)/g, " ")
    .replace(/\d+(?:[.,]\d+)?\s*%/g, " ")
    .replace(/[^\p{L}\s/,+&-]/gu, " ")
    .replace(/\b(recycled|tai\s*che|cong\s*nghe|exdry|blend)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  for (const keyword of MATERIAL_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return toTitleCase(keyword);
    }
  }

  const firstWord = normalized.split(/[\s/,+&-]+/).find((w) => w.length > 2);
  return firstWord ? toTitleCase(firstWord) : null;
}

// map dl
export function mapProduct(sp) {
  const chatLieuChinh = extractPrimaryMaterial(sp.chatLieu);

  return {
    _id: getId(sp._id),
    tenSanPham: sp.tenSanPham,
    gia: toNumber(sp.gia),
    chatLieu: sp.chatLieu,
    chatLieuChinh,
    phuHopVoi: sp.phuHopVoi,
    mauSanPham: sp.mauSanPham,
    mauSac: sp.mauSanPham?.map((m) => ({ code: m.code, hex: m.maMau })),
    sizes: [...new Set(sp.bienTheSanPham?.map((b) => b.size))],
    bienTheSanPham: sp.bienTheSanPham,
    gioiTinh: sp.gioiTinh,
    ngayThem: sp.ngayThem ?? sp.createdAt ?? null,
    ngayThemTs: toTimestamp(sp.ngayThem ?? sp.createdAt),
    giaGoc: null,
    giaUuDai: null,
    discountPct: null,
    daBan: sp.daBan ?? 0,
    diemSoTrungBinh: sp.diemSoTrungBinh ?? 0,
  };
}

export function applyDiscounts(mappedProducts, uuDaiList) {
  const discountMap = {};
  uuDaiList.forEach((ud) => {
    ud.sanPhamUuDai?.forEach((item) => {
      const id = getId(item.sanPhamId);
      const giaGoc = toNumber(item.giaGoc);
      const giaUuDai = toNumber(
        item.giaUuDai ?? item.giaFlashSale ?? item.giaKhuyenMai,
      );

      if (!(giaGoc > 0) || !(giaUuDai > 0) || giaUuDai >= giaGoc) return;

      if (!discountMap[id] || giaUuDai < discountMap[id].giaUuDai) {
        discountMap[id] = { giaGoc, giaUuDai };
      }
    });
  });

  return mappedProducts.map((p) => {
    const disc = discountMap[getId(p._id)];
    if (!disc) return p;

    const discountPct = Math.max(
      1,
      Math.min(99, Math.round((1 - disc.giaUuDai / disc.giaGoc) * 100)),
    );

    return { ...p, giaGoc: disc.giaGoc, giaUuDai: disc.giaUuDai, discountPct };
  });
}

// filter cho sidebar
export function applyFilters(products, filters) {
  return products.filter((p) => {
    if (
      filters.boLocMauSac.length &&
      !p.mauSac?.some((c) => filters.boLocMauSac.includes(c.code))
    )
      return false;
    if (
      filters.boLocSize.length &&
      !p.sizes?.some((s) => filters.boLocSize.includes(s))
    )
      return false;
    if (
      filters.boLocPhuHop.length &&
      !p.phuHopVoi?.some((v) => filters.boLocPhuHop.includes(v))
    )
      return false;
    if (filters.boLocChatLieu.length) {
      const mat = p.chatLieuChinh?.toLowerCase() ?? "";
      if (!filters.boLocChatLieu.some((k) => mat === k.toLowerCase()))
        return false;
    }
    if (filters.boLocGia.length) {
      const match = filters.boLocGia.some((range) => {
        const effectivePrice = getEffectivePrice(p);
        if (range === "under_300") return effectivePrice < 300000;
        if (range === "300_500")
          return effectivePrice >= 300000 && effectivePrice <= 500000;
        if (range === "over_500") return effectivePrice > 500000;
        return false;
      });
      if (!match) return false;
    }
    return true;
  });
}

// các initial
export const INITIAL_FILTERS = {
  boLocMauSac: [],
  boLocSize: [],
  boLocGia: [],
  boLocPhuHop: [],
  boLocChatLieu: [],
};

const createInitialState = (initialSortBy = "default") => ({
  activeFilters: INITIAL_FILTERS,
  sortBy: initialSortBy,
});

//reducer
function reducer(state, action) {
  switch (action.type) {
    case "RESET_FILTERS":
      return { ...state, activeFilters: INITIAL_FILTERS };

    case "TOGGLE_FILTER": {
      const { filterType, value } = action.payload;
      const current = state.activeFilters[filterType];

      if (filterType === "boLocGia") {
        return {
          ...state,
          activeFilters: {
            ...state.activeFilters,
            [filterType]: current.includes(value) ? [] : [value],
          },
        };
      }

      return {
        ...state,
        activeFilters: {
          ...state.activeFilters,
          [filterType]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        },
      };
    }

    case "SET_SORT":
      return { ...state, sortBy: action.payload };

    default:
      return state;
  }
}

export default function useProductFilters(products, options = {}) {
  const [state, dispatch] = useReducer(
    reducer,
    options.initialSortBy ?? "default",
    createInitialState,
  );
  const { activeFilters, sortBy } = state;

  const toggleFilter = useCallback((filterType, value) => {
    dispatch({ type: "TOGGLE_FILTER", payload: { filterType, value } });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, []);

  const setSortBy = useCallback((value) => {
    dispatch({ type: "SET_SORT", payload: value });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, []);

  const sortedProducts = useMemo(() => {
    const filtered = applyFilters(products, activeFilters);
    if (sortBy === "price_asc")
      return [...filtered].sort(
        (a, b) => getEffectivePrice(a) - getEffectivePrice(b),
      );
    if (sortBy === "price_desc")
      return [...filtered].sort(
        (a, b) => getEffectivePrice(b) - getEffectivePrice(a),
      );
    if (sortBy === "discount")
      return [...filtered].sort(
        (a, b) => (b.discountPct ?? 0) - (a.discountPct ?? 0),
      );
    if (sortBy === "ban_chay")
      return [...filtered].sort((a, b) => (b.daBan ?? 0) - (a.daBan ?? 0));
    if (sortBy === "danh_gia")
      return [...filtered].sort(
        (a, b) => (b.diemSoTrungBinh ?? 0) - (a.diemSoTrungBinh ?? 0),
      );
    if (sortBy === "newest")
      return [...filtered].sort(
        (a, b) => (b.ngayThemTs ?? 0) - (a.ngayThemTs ?? 0),
      );
    return filtered;
  }, [products, activeFilters, sortBy]);

  return {
    activeFilters,
    sortBy,
    toggleFilter,
    clearAll,
    setSortBy,
    resetFilters,
    sortedProducts,
  };
}
