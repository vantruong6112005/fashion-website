import { useEffect, useMemo, useReducer, useRef } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";
import ProductGrid from "../components/productlist/ProductGrid";
import ScrollToTop from "../components/ScrollToTop";
import {
  getCollections,
  getProducts,
  getPromos,
} from "../services/catalogService";
import useProductFilters, {
  applyDiscounts,
  filterActivePromotions,
  mapProduct,
} from "../hooks/useProductFilters";
import { resolveImageUrl } from "../utils/image";
import "../CSS/boSuuTap.css";

const getId = (value) => value?.$oid ?? value?._id?.$oid ?? value?._id ?? value;

const fetchActivePromos = async () => filterActivePromotions(await getPromos());

const FETCH_INITIAL = {
  status: "idle",
  collections: [],
  products: [],
  error: null,
};

function fetchReducer(state, action) {
  switch (action.type) {
    case "SET_COLLECTIONS":
      return { ...state, collections: action.payload };
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

const formatDescription = (value) => String(value || "").split("\n");

export default function BoSuuTapDetailPage() {
  const { slug } = useParams();
  const [fetchState, fetchDispatch] = useReducer(fetchReducer, FETCH_INITIAL);
  const { status, collections, products, error } = fetchState;
  const abortRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    getCollections()
      .then((data) => {
        if (!mounted) return;
        fetchDispatch({ type: "SET_COLLECTIONS", payload: data });
      })
      .catch((err) => {
        if (mounted) console.error("Loi tai bo suu tap:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!collections.length) return;

    const collection = collections.find((item) => item.slug === slug);
    if (!collection) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const collectionId = getId(collection._id);
    fetchDispatch({ type: "FETCH_START" });

    Promise.all([getProducts(), fetchActivePromos()])
      .then(([sanPhamList, uuDaiList]) => {
        if (controller.signal.aborted) return;

        const filtered = applyDiscounts(
          sanPhamList
            .filter((sp) => {
              if (!sp.isActive) return false;
              const ids = Array.isArray(sp.boSuuTapId)
                ? sp.boSuuTapId.map(getId)
                : [getId(sp.boSuuTapId)];
              return ids.includes(collectionId);
            })
            .map(mapProduct),
          uuDaiList,
        );

        fetchDispatch({ type: "FETCH_SUCCESS", payload: filtered });
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          fetchDispatch({ type: "FETCH_ERROR", payload: err.message });
        }
      });

    return () => controller.abort();
  }, [slug, collections]);

  const {
    activeFilters,
    sortBy,
    toggleFilter,
    clearAll,
    setSortBy,
    resetFilters,
    sortedProducts,
  } = useProductFilters(products);

  useEffect(() => {
    resetFilters();
  }, [slug, resetFilters]);

  const collection = useMemo(
    () => collections.find((item) => item.slug === slug),
    [collections, slug],
  );

  if (status === "loading") return <p>Đang tải sản phẩm...</p>;
  if (status === "error") return <p>Lỗi: {error}</p>;
  if (collections.length && !collection)
    return <p>Không tìm thấy bộ sưu tập.</p>;
  if (!collection) return <p>Đang load...</p>;

  const bannerImage = resolveImageUrl(
    collection.thumbnailImage?.[1] ||
      collection.thumbnailImage?.[0] ||
      "/no-image.png",
  );

  return (
    <>
      <div>
        <section className="collection-detail-hero">
          <div className="collection-detail-hero__copy">
            {/* <p className="collection-page__kicker">Bộ sưu tập</p> */}
            <h1 className="collection-detail-hero__title">
              {formatDescription(collection.slogan).map((line, index) => (
                <span key={index}>
                  {line}
                  {index < formatDescription(collection.slogan).length - 1 && (
                    <br />
                  )}
                </span>
              ))}
            </h1>
            {collection.gioiThieu && (
              <p className="collection-detail-hero__intro">
                {collection.gioiThieu}
              </p>
            )}
            {collection.moTa && (
              <div className="collection-detail-hero__text">
                {formatDescription(collection.moTa).map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            )}
          </div>

          <div className="collection-detail-hero__visual">
            <img src={bannerImage} alt={collection.tenBoSuuTap} />
          </div>
        </section>
      </div>
      <div className="collection-detail-page container-fluid px-5 mb-4">
        <div className="row mt-4">
          <div className="col-md-3 pe-4">
            <Sidebar
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
              clearAll={clearAll}
              totalResults={sortedProducts.length}
              products={products}
            />
          </div>
          <div className="col-md-9 mb-4">
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
