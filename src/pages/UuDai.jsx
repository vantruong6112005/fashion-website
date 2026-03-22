import { useEffect, useRef, useReducer, useState, useMemo } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import ProductGrid from "../components/ProductGrid2";
import ScrollToTop from "../components/ScrollToTop";
import PromoBanner from "../components/PromoBanner";
import { getMaxDiscount } from "../utils/promoUtils";
import useProductFilters, {
  mapProduct,
  applyDiscounts,
  filterActivePromotions,
} from "../hooks/useProductFilters";

import hero3 from "../assets/images/hero/hero3.png";
import "../CSS/uuDai.css";

// "http://localhost:3000/api"
const API_BASE = "https://lzpower-fashion.onrender.com/api";

const fetchActivePromos = async (signal) => {
  const { data } = await axios.get(`${API_BASE}/uu-dai`, { signal });
  return filterActivePromotions(data);
};

// ─── Countdown ───────────────────────────────────────────────────────────────

function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, target - Date.now()),
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(Math.max(0, target - Date.now()));
    const id = setInterval(() => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft(diff);
      if (diff === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const h = String(Math.floor(timeLeft / 3_600_000)).padStart(2, "0");
  const m = String(Math.floor((timeLeft % 3_600_000) / 60_000)).padStart(
    2,
    "0",
  );
  const s = String(Math.floor((timeLeft % 60_000) / 1000)).padStart(2, "0");
  return { h, m, s };
}

// ─── Fetch Reducer ───────────────────────────────────────────────────────────

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

// ─── Deal card variants ───────────────────────────────────────────────────────
const CARD_VARIANTS = [
  "ud-deal-card--red",
  "ud-deal-card--dark",
  "ud-deal-card--light",
];

const FALLBACK_DEALS = [
  {
    badge: "-30%",
    title: "Áo Nam",
    desc: "Áo thun, polo, sơ mi — giảm thêm 30% cho đơn từ 399k",
    cta: "Mua ngay →",
  },
  {
    badge: "-25%",
    title: "Quần Nam & Nữ",
    desc: "Jean, kaki, jogger — phối gì cũng đẹp, giá sinh viên",
    cta: "Mua ngay →",
  },
  {
    badge: "-40%",
    title: "Combo tiết kiệm",
    desc: "Mua 2 sản phẩm bất kỳ — giảm ngay 40% sản phẩm thứ hai",
    cta: "Chọn combo →",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function UuDai() {
  const [fetchState, fetchDispatch] = useReducer(fetchReducer, FETCH_INITIAL);
  const [promos, setPromos] = useState([]);
  const { status, products, error } = fetchState;
  const abortRef = useRef(null);

  // Earliest active promo end date → drives the countdown
  const dealEnd = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    if (!promos.length) return Date.now() + 48 * 3_600_000;
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const ends = promos
      .map((ud) => {
        const d = ud.dateRange?.end;
        return new Date(d?.$date ?? d).getTime();
      })
      .filter((t) => !isNaN(t) && t > now);
    // eslint-disable-next-line react-hooks/purity
    return ends.length ? Math.min(...ends) : Date.now() + 48 * 3_600_000;
  }, [promos]);

  const { h, m, s } = useCountdown(dealEnd);

  // Max discount % across all running promos (for hero headline)
  const maxOverallDiscount = useMemo(() => {
    if (!promos.length) return 40;
    return Math.max(...promos.map((ud) => getMaxDiscount(ud.sanPhamUuDai)));
  }, [promos]);

  // Top 3 promos by discount % → deal cards
  const topDeals = useMemo(
    () =>
      [...promos]
        .map((ud) => ({ ...ud, maxDiscount: getMaxDiscount(ud.sanPhamUuDai) }))
        .sort((a, b) => b.maxDiscount - a.maxDiscount)
        .slice(0, 3),
    [promos],
  );

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
        setPromos(uuDaiList);

        // Only show products that are part of an active promotion
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
  } = useProductFilters(products);

  return (
    <>
      {/* ── HERO ── */}
      <section className="ud-hero">
        <div className="ud-container ud-hero__inner">
          <div className="ud-hero__copy">
            <span className="ud-eyebrow">Ưu đãi có thời hạn</span>
            <h1 className="ud-hero__title">
              Sale lớn — <br />
              Giảm đến <span className="ud-accent">{maxOverallDiscount}%</span>
            </h1>
            <p className="ud-hero__sub">
              Hàng nghìn sản phẩm thời trang chất lượng cao, giá tốt nhất trong
              năm. Đừng để lỡ.
            </p>

            {/* Countdown */}
            <div className="ud-countdown">
              <span className="ud-countdown__label">Kết thúc sau</span>
              <div className="ud-countdown__blocks">
                <div className="ud-countdown__block">
                  <span className="ud-countdown__num">{h}</span>
                  <span className="ud-countdown__unit">giờ</span>
                </div>
                <span className="ud-countdown__sep">:</span>
                <div className="ud-countdown__block">
                  <span className="ud-countdown__num">{m}</span>
                  <span className="ud-countdown__unit">phút</span>
                </div>
                <span className="ud-countdown__sep">:</span>
                <div className="ud-countdown__block">
                  <span className="ud-countdown__num">{s}</span>
                  <span className="ud-countdown__unit">giây</span>
                </div>
              </div>
            </div>

            <a href="#san-pham" className="ud-btn">
              Xem tất cả ưu đãi
            </a>
          </div>

          <div className="ud-hero__art">
            <img src={hero3} alt="Ưu đãi" />
          </div>
        </div>
      </section>

      {/* ── SLIDING PROMO BANNER ── */}
      <PromoBanner promos={promos} />

      {/* ── DEAL CARDS ── */}
      <section className="ud-deals">
        <div className="ud-container">
          <h2 className="ud-section-title">Ưu đãi nổi bật</h2>
          <div className="ud-deals__grid">
            {topDeals.length > 0
              ? topDeals.map((ud, i) => (
                  <div
                    key={ud._id?.$oid ?? ud._id ?? i}
                    className={`ud-deal-card ${CARD_VARIANTS[i % CARD_VARIANTS.length]}`}
                  >
                    <div className="ud-deal-card__badge">
                      -{ud.maxDiscount}%
                    </div>
                    <h3>{ud.tenUuDai}</h3>
                    <p>
                      {ud.sanPhamUuDai?.length ?? 0} sản phẩm đang được giảm giá
                    </p>
                    <a href="#san-pham" className="ud-deal-card__cta">
                      Mua ngay →
                    </a>
                  </div>
                ))
              : FALLBACK_DEALS.map((d, i) => (
                  <div key={i} className={`ud-deal-card ${CARD_VARIANTS[i]}`}>
                    <div className="ud-deal-card__badge">{d.badge}</div>
                    <h3>{d.title}</h3>
                    <p>{d.desc}</p>
                    <a href="#san-pham" className="ud-deal-card__cta">
                      {d.cta}
                    </a>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ── PROMO STRIP ── */}
      <section className="ud-strip">
        <div className="ud-container ud-strip__inner">
          <p>
            🔥 Miễn phí vận chuyển cho đơn từ 299k &nbsp;|&nbsp; Đổi trả 30 ngày
            &nbsp;|&nbsp; Thanh toán khi nhận hàng
          </p>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section id="san-pham" className="ud-products">
        <div className="ud-container">
          <h2 className="ud-section-title">Tất cả sản phẩm ưu đãi</h2>

          {status === "loading" && (
            <p className="ud-status">Đang tải sản phẩm...</p>
          )}
          {status === "error" && (
            <p className="ud-status ud-status--error">Lỗi: {error}</p>
          )}

          {status === "success" && (
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
          )}
        </div>
      </section>

      <ScrollToTop />
    </>
  );
}
