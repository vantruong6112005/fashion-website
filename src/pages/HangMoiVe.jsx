import { useEffect, useMemo, useRef, useReducer } from "react";
import { useLocation } from "react-router-dom";

import ShopBanner from "../components/ShopBanner";
import Breadcrumb from "../components/Breadcrumb";
import Sidebar from "../components/sidebar/Sidebar";
import ProductGrid from "../components/productlist/ProductGrid";
import ScrollToTop from "../components/ScrollToTop";
import useProductFilters, {
  mapProduct,
  applyDiscounts,
  filterActivePromotions,
  filterNewestProductsByDays,
  matchesRelativeSearch,
} from "../hooks/useProductFilters";
import { getProducts, getPromos } from "../services/catalogService";

import "../CSS/hangMoiVe.css";

const fetchActivePromos = async () => filterActivePromotions(await getPromos());
const RECENT_DAYS = 100;

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

export default function HangMoiVe() {
  const { search } = useLocation();
  const [fetchState, fetchDispatch] = useReducer(fetchReducer, FETCH_INITIAL);
  const { status, products, error } = fetchState;
  const abortRef = useRef(null);
  const baseProductsRef = useRef([]);

  const searchKeyword = useMemo(() => {
    const q = new URLSearchParams(search).get("q") ?? "";
    return q.trim().toLowerCase();
  }, [search]);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    fetchDispatch({ type: "FETCH_START" });

    const applyPromotionsInBackground = (mappedProducts) => {
      fetchActivePromos()
        .then((uuDaiList) => {
          if (controller.signal.aborted) return;
          const discounted = filterNewestProductsByDays(
            applyDiscounts(mappedProducts, uuDaiList),
            RECENT_DAYS,
          );
          fetchDispatch({ type: "FETCH_SUCCESS", payload: discounted });
        })
        .catch((err) => {
          console.error("Loi tai uu dai:", err);
        });
    };

    getProducts()
      .then((sanPhamList) => {
        if (controller.signal.aborted) return;
        const mapped = filterNewestProductsByDays(
          sanPhamList.filter((sp) => sp.isActive).map(mapProduct),
          RECENT_DAYS,
        );
        baseProductsRef.current = mapped;
        fetchDispatch({ type: "FETCH_SUCCESS", payload: mapped });
        applyPromotionsInBackground(mapped);
      })
      .catch((err) => {
        if (baseProductsRef.current.length) {
          console.error("Loi tai san pham, dang dung du lieu cache:", err);
          return;
        }
        fetchDispatch({
          type: "FETCH_ERROR",
          payload: err.message,
        });
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
    <div className="hang-moi-ve-page">
      <ShopBanner
        title="Hàng Mới Về"
        description={`Sản phẩm mới cập nhật trong ${RECENT_DAYS} ngày gần nhất.\nChọn nhanh item mới theo màu, size và nhu cầu sử dụng.`}
        buttonText="Xem sản phẩm mới"
      />

      <div className="container-fluid px-3 px-lg-5">
        <Breadcrumb />
      </div>

      <div className="hang-moi-ve-page__content container-fluid px-3 px-lg-5">
        <div className="row">
          <div className="col-12 col-lg-3 pe-lg-4 mb-3 mb-lg-0">
            <Sidebar
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
              clearAll={clearAll}
              totalResults={displayedProducts.length}
              products={products}
            />
          </div>
          <div className="col-12 col-lg-9">
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
    </div>
  );
}
