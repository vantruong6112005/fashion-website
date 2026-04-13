import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import aoThunNamImg from "../assets/images/nam/ao-thun.avif";
import aoKhoacNamImg from "../assets/images/nam/ao-khoac.avif";
import quanDaiNamImg from "../assets/images/nam/quan-dai.avif";
import quanShortNamImg from "../assets/images/nam/quan-short.avif";
import aoSominamImg from "../assets/images/nam/ao-somi.avif";
import tuiNamImg from "../assets/images/nam/tui.avif";
import aoTheThaoNuImg from "../assets/images/nu/ao-the-thao.avif";
import aoCroptopNuImg from "../assets/images/nu/ao-croptop.avif";
import leggingNuImg from "../assets/images/nu/legging.avif";
import vayTheThaoNuImg from "../assets/images/nu/vay-the-thao.avif";
import quanTheThaoNuImg from "../assets/images/nu/quan-the-thao.avif";
import phuKienNuImg from "../assets/images/nu/phu-kien.avif";
import pickleballBanner from "../assets/images/pickleball.avif";
import runBanner from "../assets/images/do_chay_bo.avif";
import { getProducts, getPromos } from "../services/catalogService";
import {
  applyDiscounts,
  filterActivePromotions,
  mapProduct,
  normalizeSearchText,
} from "../hooks/useProductFilters";
import { resolveImageUrl } from "../utils/image";
import "../CSS/homeShowcase.css";

const CATEGORY_BLOCKS_BY_GENDER = {
  NAM: [
    { label: "Áo thun", image: aoThunNamImg, keyword: "ao thun" },
    // Chua co anh ao-so-mi trong thu muc nam, tam dung anh ao-thun.
    { label: "Áo sơ mi", image: aoSominamImg, keyword: "ao so mi" },
    { label: "Áo khoác", image: aoKhoacNamImg, keyword: "ao khoac" },
    { label: "Quần dài", image: quanDaiNamImg, keyword: "quan dai" },
    { label: "Quần short", image: quanShortNamImg, keyword: "quan short" },
    { label: "Túi", image: tuiNamImg, keyword: "tui" },
  ],
  NỮ: [
    { label: "Áo thể thao", image: aoTheThaoNuImg, keyword: "ao the thao" },
    { label: "Áo croptop", image: aoCroptopNuImg, keyword: "ao croptop" },
    { label: "Legging", image: leggingNuImg, keyword: "legging" },
    { label: "Váy thể thao", image: vayTheThaoNuImg, keyword: "vay the thao" },
    {
      label: "Quần thể thao",
      image: quanTheThaoNuImg,
      keyword: "quan the thao",
    },
    { label: "Phụ kiện", image: phuKienNuImg, keyword: "phu kien" },
  ],
};

const formatPrice = (value) =>
  `${Number(value?.$numberDecimal ?? value ?? 0).toLocaleString("vi-VN")}đ`;

function getDisplayImage(product) {
  return resolveImageUrl(
    product?.mauSanPham?.[0]?.images?.[0] || "/no-image.png",
  );
}

function HorizontalProductSection({ title, anchor, bannerSrc, products = [] }) {
  const listRef = useRef(null);

  const scrollByDirection = (direction) => {
    if (!listRef.current) return;
    const amount = Math.max(
      320,
      Math.floor(listRef.current.clientWidth * 0.78),
    );
    listRef.current.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="home-sport-block" id={anchor}>
      <div className="home-sport-banner">
        <img src={bannerSrc} alt={title} className="home-sport-banner__image" />
        <div className="home-sport-banner__overlay">
          <h2 className="home-sport-banner__title">{title}</h2>
          <a href={`#${anchor}-list`} className="home-sport-banner__cta">
            Mua ngay
          </a>
        </div>
      </div>

      <div className="home-sport-products" id={`${anchor}-list`}>
        <div className="home-sport-products__head">
          <h3 className="home-sport-products__title">
            Sản phẩm {title.toLowerCase()}
          </h3>
          <Link to="/hang-moi-ve" className="home-sport-products__more">
            Xem thêm
          </Link>
        </div>

        <button
          className="home-sport-products__arrow home-sport-products__arrow--left"
          onClick={() => scrollByDirection("prev")}
          aria-label="Xem sản phẩm trước"
        >
          {`<`}
        </button>

        <div className="home-sport-products__list" ref={listRef}>
          {products.map((product) => (
            <Link
              to={`/san-pham/${product._id}`}
              className="home-sport-card"
              key={`${anchor}-${product._id}`}
            >
              <div className="home-sport-card__image-wrap">
                <img
                  src={getDisplayImage(product)}
                  alt={product.tenSanPham}
                  className="home-sport-card__image"
                />
              </div>
              <div className="home-sport-card__name">{product.tenSanPham}</div>
              <div className="home-sport-card__price">
                {formatPrice(product.giaUuDai ?? product.gia)}
              </div>
            </Link>
          ))}
        </div>

        <button
          className="home-sport-products__arrow home-sport-products__arrow--right"
          onClick={() => scrollByDirection("next")}
          aria-label="Xem sản phẩm kế tiếp"
        >
          {`>`}
        </button>
      </div>
    </section>
  );
}

export default function HomeShowcase() {
  const [products, setProducts] = useState([]);
  const [activeGender, setActiveGender] = useState("NỮ");

  useEffect(() => {
    Promise.all([getProducts(), getPromos()])
      .then(([sanPhamList, uuDaiList]) => {
        const activePromos = filterActivePromotions(uuDaiList);
        const mapped = applyDiscounts(
          sanPhamList.filter((sp) => sp.isActive).map(mapProduct),
          activePromos,
        );
        setProducts(mapped);
      })
      .catch(() => setProducts([]));
  }, []);

  const normalizedGender = normalizeSearchText(activeGender);

  const categoryCards = useMemo(() => {
    const genderFiltered = products.filter((product) => {
      const gioiTinh = normalizeSearchText(product.gioiTinh);
      return gioiTinh.includes(normalizedGender);
    });

    const blocks = CATEGORY_BLOCKS_BY_GENDER[activeGender] || [];

    return blocks
      .map((block) => {
        const matched = genderFiltered.find((product) =>
          normalizeSearchText(product.tenSanPham).includes(
            normalizeSearchText(block.keyword),
          ),
        );
        return {
          label: block.label,
          image: block.image,
          product: matched || genderFiltered[0] || null,
        };
      })
      .filter((item) => item.image || item.product);
  }, [products, normalizedGender, activeGender]);

  const pickleballProducts = useMemo(
    () =>
      products
        .filter((product) =>
          normalizeSearchText(product.tenSanPham).includes("pickleball"),
        )
        .slice(0, 10),
    [products],
  );

  const runningProducts = useMemo(
    () =>
      products
        .filter((product) => {
          const normalized = normalizeSearchText(product.tenSanPham);
          return (
            normalized.includes("chay bo") || normalized.includes("running")
          );
        })
        .slice(0, 10),
    [products],
  );

  return (
    <div className="home-showcase px-5 px-md-5 py-3 py-md-4">
      <section className="home-category-block">
        <div className="home-category-tabs">
          {["NAM", "NỮ"].map((gender) => (
            <button
              key={gender}
              className={`home-category-tabs__button ${activeGender === gender ? "is-active" : ""}`}
              onClick={() => setActiveGender(gender)}
            >
              {gender}
            </button>
          ))}
        </div>

        <div className="home-category-grid">
          {categoryCards.map(({ label, product, image }) => (
            <Link
              to={product ? `/san-pham/${product._id}` : "/hang-moi-ve"}
              className="home-category-card"
              key={label}
            >
              <img
                src={image || getDisplayImage(product)}
                alt={label}
                className="home-category-card__image"
              />
              <span className="home-category-card__label">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <HorizontalProductSection
        title="Pickleball"
        anchor="pickleball"
        bannerSrc={pickleballBanner}
        products={pickleballProducts}
      />

      <HorizontalProductSection
        title="Đồ chạy bộ"
        anchor="do-chay-bo"
        bannerSrc={runBanner}
        products={runningProducts}
      />
    </div>
  );
}
