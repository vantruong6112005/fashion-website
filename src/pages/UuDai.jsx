import { useEffect, useRef, useReducer, useState } from "react";

import Breadcrumb from "../components/Breadcrumb";
import Sidebar from "../components/sidebar/Sidebar";
import ProductGrid from "../components/productlist/ProductGrid";
import ScrollToTop from "../components/ScrollToTop";
import PromoBanner from "../components/PromoBanner";
import useProductFilters, {
  mapProduct,
  applyDiscounts,
  filterActivePromotions,
} from "../hooks/useProductFilters";
import { getProducts, getPromos } from "../services/catalogService";
import "../CSS/uuDai.css";

const fetchActivePromos = async () => filterActivePromotions(await getPromos());

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

export default function UuDai() {
  const [fetchState, fetchDispatch] = useReducer(fetchReducer, FETCH_INITIAL);
  const [promos, setPromos] = useState([]);
  const { status, products, error } = fetchState;
  const abortRef = useRef(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    fetchDispatch({ type: "FETCH_START" });

    Promise.all([getProducts(), fetchActivePromos()])
      .then(([sanPhamList, uuDaiList]) => {
        if (controller.signal.aborted) return;
        setPromos(uuDaiList);

        // Chi hien thi san pham nam trong chuong trinh uu dai dang chay.
        const discountIds = new Set(
          uuDaiList.flatMap(
            (ud) =>
              ud.sanPhamUuDai?.map(
                (item) => item.sanPhamId?.$oid ?? String(item.sanPhamId),
              ) ?? [],
          ),
        );
        const mapped = applyDiscounts(
          sanPhamList
            .filter(
              (sp) =>
                sp.isActive && discountIds.has(sp._id?.$oid ?? String(sp._id)),
            )
            .map(mapProduct),
          uuDaiList,
        ).map((p) => ({ ...p, gia: p.giaUuDai ?? p.gia }));

        fetchDispatch({ type: "FETCH_SUCCESS", payload: mapped });
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          fetchDispatch({
            type: "FETCH_ERROR",
            payload: err.message,
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
  } = useProductFilters(products);

  return (
    <>
      <PromoBanner promos={promos} />

      <div className="container-fluid px-3 px-md-4">
        <Breadcrumb />
      </div>

      <section id="san-pham" className="deal-page-products px-3 px-md-4 py-4">
        <div className="container-xxl">
          <h2 className="deal-page-section-title">Tất cả sản phẩm ưu đãi</h2>

          {status === "loading" && (
            <p className="deal-page-status">Đang tải sản phẩm...</p>
          )}
          {status === "error" && (
            <p className="deal-page-status deal-page-status--error">
              Lỗi: {error}
            </p>
          )}

          {status === "success" && (
            <div className="row g-4">
              <div className="col-12 col-lg-3">
                <Sidebar
                  activeFilters={activeFilters}
                  toggleFilter={toggleFilter}
                  clearAll={clearAll}
                  totalResults={sortedProducts.length}
                  products={products}
                />
              </div>
              <div className="col-12 col-lg-9">
                <ProductGrid
                  products={sortedProducts}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  activeFilters={activeFilters}
                  toggleFilter={toggleFilter}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <ScrollToTop />
    </>
  );
}
