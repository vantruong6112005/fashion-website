import { useEffect, useMemo, useRef, useReducer } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import ShopBanner from "../components/ShopBanner";
import Sidebar from "../components/Sidebar";
import ProductGrid from "../components/ProductGrid2";
import ScrollToTop from "../components/ScrollToTop";
import useProductFilters, {
  mapProduct,
  applyDiscounts,
  filterActivePromotions,
  matchesRelativeSearch,
} from "../hooks/useProductFilters";
import { API_BASE } from "../utils/api";

import "../CSS/hangMoiVe.css";

const fetchActivePromos = async (signal) => {
  const { data } = await axios.get(`${API_BASE}/uu-dai`, { signal });
  return filterActivePromotions(data);
};

const FETCH_INITIAL = { status: "idle", products: [], error: null };

function fetchReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { status: "loading", products: [], error: null };
    case "FETCH_SUCCESS":
      return { status: "success", products: action.payload, error: null };
    case "FETCH_ERROR":
      return { status: "error", products: [], error: action.payload };
    default:
      return state;
  }
}

export default function HangMoiVe2() {
  const { search } = useLocation();
  const [fetchState, fetchDispatch] = useReducer(fetchReducer, FETCH_INITIAL);
  const { status, products, error } = fetchState;
  const abortRef = useRef(null);

  const searchKeyword = useMemo(() => {
    const q = new URLSearchParams(search).get("q") ?? "";
    return q.trim().toLowerCase();
  }, [search]);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    fetchDispatch({ type: "FETCH_START" });
    Promise.all([
      axios.get(`${API_BASE}/san-pham`, { signal: controller.signal }),
      fetchActivePromos(controller.signal),
    ])
      .then(([{ data: sanPhamList }, uuDaiList]) => {
        const mapped = applyDiscounts(
          sanPhamList.filter((sp) => sp.isActive).map(mapProduct),
          uuDaiList,
        );
        fetchDispatch({ type: "FETCH_SUCCESS", payload: mapped });
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
  }, []);

  const {
    activeFilters,
    sortBy,
    toggleFilter,
    clearAll,
    setSortBy,
    sortedProducts,
  } = useProductFilters(products, { initialSortBy: "newest" });

  const displayedProducts = useMemo(() => {
    if (!searchKeyword) return sortedProducts;
    return sortedProducts.filter((p) =>
      matchesRelativeSearch(p.tenSanPham, searchKeyword),
    );
  }, [sortedProducts, searchKeyword]);

  if (status === "loading") return <p className="p-5">Đang tải sản phẩm...</p>;
  if (status === "error")
    return <p className="p-5 text-danger">Lỗi: {error}</p>;

  return (
    <>
      <ShopBanner />

      <div className="container-fluid px-5">
        <div className="row">
          <div className="col-md-3 pe-4">
            <Sidebar
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
              clearAll={clearAll}
              totalResults={displayedProducts.length}
              products={products}
            />
          </div>
          <div className="col-md-9">
            <ProductGrid
              products={displayedProducts}
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
