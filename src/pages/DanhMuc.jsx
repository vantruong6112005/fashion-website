import { useEffect, useMemo, useReducer, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import ProductGrid from "../components/ProductGrid2";
import ScrollToTop from "../components/ScrollToTop";
import useProductFilters, {
  mapProduct,
  applyDiscounts,
  filterActivePromotions,
} from "../hooks/useProductFilters";
import { API_BASE } from "../utils/api";

const fetchActivePromos = async (signal) => {
  const { data } = await axios.get(`${API_BASE}/uu-dai`, { signal });
  return filterActivePromotions(data);
};

// lấy ra id từ objId của mongo
const getId = (obj) => obj?.$oid ?? obj;

function buildDescendantIds(allCategories, targetId) {
  const ids = new Set([targetId]);
  const queue = [targetId];
  while (queue.length) {
    const current = queue.shift();
    for (const c of allCategories) {
      const pid = getId(c.parentId);
      const cid = getId(c._id);
      if (pid === current && !ids.has(cid)) {
        ids.add(cid);
        queue.push(cid);
      }
    }
  }
  return ids;
}

// initial + reducer
const FETCH_INITIAL = {
  status: "idle",
  categories: [],
  products: [],
  error: null,
};

function fetchReducer(state, action) {
  switch (action.type) {
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "FETCH_START":
      return { ...state, status: "loading", products: [], error: null };
    case "FETCH_SUCCESS":
      return { ...state, status: "success", products: action.payload };
    case "FETCH_ERROR":
      return { ...state, status: "error", error: action.payload };
    default:
      return state;
  }
}

export default function DanhMucPage() {
  const { slug } = useParams();
  const [fetchState, fetchDispatch] = useReducer(fetchReducer, FETCH_INITIAL);
  const { status, categories, products, error } = fetchState;

  // mục đích cuối cùng là hủy req cũ đang chạy trước khi tạo req mới
  const abortRef = useRef(null);

  // Fetch danh mục
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${API_BASE}/danh-muc`, { signal: controller.signal })
      .then(({ data }) =>
        fetchDispatch({ type: "SET_CATEGORIES", payload: data }),
      )
      .catch((err) => {
        if (!axios.isCancel(err)) console.error("Lỗi tải danh mục:", err);
      });
    return () => controller.abort();
  }, []);

  // Fetch sản phẩm theo slug
  useEffect(() => {
    if (!categories.length) return;

    const category = categories.find((c) => c.slug === slug);
    if (!category) return;

    abortRef.current?.abort(); // hủy req cũ
    const controller = new AbortController();
    abortRef.current = controller;

    const descendantIds = buildDescendantIds(categories, getId(category._id));

    fetchDispatch({ type: "FETCH_START" });

    Promise.all([
      axios.get(`${API_BASE}/san-pham`, { signal: controller.signal }),
      fetchActivePromos(controller.signal),
    ])
      .then(([{ data: sanPhamList }, uuDaiList]) => {
        const filtered = applyDiscounts(
          sanPhamList
            .filter((sp) => {
              if (!sp.isActive) return false;
              const ids = Array.isArray(sp.danhMucId)
                ? sp.danhMucId.map(getId)
                : [getId(sp.danhMucId)];
              return ids.some((id) => descendantIds.has(id));
            })
            .map(mapProduct),
          uuDaiList,
        );
        fetchDispatch({ type: "FETCH_SUCCESS", payload: filtered });
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          fetchDispatch({
            type: "FETCH_ERROR",
            payload: err.response?.data?.message ?? err.message,
          });
        }
      });

    return () => controller.abort();
  }, [slug, categories]);

  const {
    activeFilters,
    sortBy,
    toggleFilter,
    clearAll,
    setSortBy,
    resetFilters,
    sortedProducts,
  } = useProductFilters(products);

  // Reset filter khi đổi slug
  // thêm resetFilters vào deps vì dùng useCallback,
  // nếu reference function thay đổi thì effect có thể dùng giá trị cũ
  // nếu không thêm thì esLint báo lỗi missing deps
  useEffect(() => {
    resetFilters();
  }, [slug, resetFilters]);

  const category = useMemo(
    () => categories.find((c) => c.slug === slug),
    [categories, slug],
  );

  if (status === "loading") return <p>Đang tải sản phẩm...</p>;
  if (status === "error") return <p>Lỗi: {error}</p>;
  if (!category) return <p>Đang load...</p>;

  return (
    <>
      <div className="container-fluid px-5">
        <h1 className="fs-4 fw-bold text-dark mb-1">{category.tenDanhMuc}</h1>
        <div className="row">
          <div className="col-md-3 pe-4">
            <Sidebar
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
              clearAll={clearAll}
              totalResults={sortedProducts.length}
              products={products}
            />
          </div>
          <div className="col-md-9">
            <ProductGrid
              products={sortedProducts}
              sortBy={sortBy}
              setSortBy={setSortBy}
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
            />
          </div>
        </div>
      </div>
      <ScrollToTop />
    </>
  );
}
