import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { matchesRelativeSearch } from "../hooks/useProductFilters";

import "../CSS/header.css";
import searchIcon from "../assets/images/icon/search-interface-symbol.png";
import cartIcon from "../assets/images/icon/shopping-cart.png";
import userIcon from "../assets/images/icon/user.png";
import aoThun from "../assets/images/Ao/ao.png";
import quan3 from "../assets/images/quan/quan.png";
import hero1 from "../assets/images/hero/hero1.png";
import hero2 from "../assets/images/hero/hero2.png";
import { API_BASE } from "../utils/api";

const CATEGORY_CACHE_KEY = "fashion_categories_cache_v1";
const FALLBACK_ROOT_CATEGORIES = [
  { _id: "fallback-nam", slug: "nam", tenDanhMuc: "Nam", parentId: null },
  { _id: "fallback-nu", slug: "nu", tenDanhMuc: "Nữ", parentId: null },
];

const getId = (obj) => obj?.$oid ?? obj;

const readCategoryCache = () => {
  try {
    const raw = window.localStorage.getItem(CATEGORY_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
};

export default function Header2() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(
    () => readCategoryCache() ?? FALLBACK_ROOT_CATEGORIES,
  );
  const [openMenu, setOpenMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [productList, setProductList] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE}/danh-muc`)
      .then(({ data }) => {
        setCategories(data);
        window.localStorage.setItem(CATEGORY_CACHE_KEY, JSON.stringify(data));
      })
      .catch((err) => console.error("Lỗi tải danh mục:", err));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${API_BASE}/san-pham`, { signal: controller.signal })
      .then(({ data }) => {
        setProductList(data.filter((sp) => sp.isActive));
      })
      .catch((err) => {
        if (!axios.isCancel(err)) console.error("Lỗi tải dữ liệu search:", err);
      });
    return () => controller.abort();
  }, []);

  const rootCategories = categories.filter((c) => {
    const parentId = getId(c.parentId);
    return parentId === null || parentId === undefined;
  });
  const getChildren = (parentId) =>
    categories.filter((c) => getId(c.parentId) === parentId);

  const suggestions =
    searchTerm.trim().length > 0
      ? productList
          .filter((sp) => matchesRelativeSearch(sp.tenSanPham, searchTerm))
          .slice(0, 6)
      : [];

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setShowSuggestions(Boolean(value.trim()));
  };

  const goToSearch = (keyword) => {
    navigate(
      keyword
        ? `/hang-moi-ve-2?q=${encodeURIComponent(keyword)}`
        : "/hang-moi-ve-2",
    );
  };

  const handlePickSuggestion = (name) => {
    setSearchTerm(name);
    setShowSuggestions(false);
    goToSearch(name);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const keyword = searchTerm.trim();
    setShowSuggestions(false);
    goToSearch(keyword);
  };

  return (
    <header className="site-header">
      {/* Announcement bar */}
      {/* <div className="header-topbar">
        <span className="header-topbar__item">Miễn phí vận chuyển từ 299K</span>
        <span className="header-topbar__sep">|</span>
        <span className="header-topbar__item">Đổi trả trong 30 ngày</span>
        <span className="header-topbar__sep">|</span>
        <span className="header-topbar__item">Thanh toán khi nhận hàng</span>
      </div> */}

      {/* Main header */}
      <div className="header-inner">
        {/* Left logo */}
        <div className="header-left">
          <span className="logo">
            <Link to="/">FASHION-SHOP</Link>
          </span>
        </div>

        {/* Center nav */}
        <nav className="header-center">
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/combo-sieu-tiet-kiem">Combo tiết kiệm</Link>
            </li>

            <li className="nav-item">
              <Link to="/hang-moi-ve-2">
                Hàng mới về&nbsp;
                <span className="nav-badge nav-badge--new">NEW</span>
              </Link>
            </li>

            {/* Dynamic root categories (Nam / Nữ / …) */}
            {rootCategories.map((root) => {
              const rootId = root._id?.$oid || root._id;
              const level1Children = getChildren(rootId);

              return (
                <li
                  key={rootId}
                  className="nav-item mega-dropdown"
                  onMouseEnter={() => setOpenMenu(rootId)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link to={`/${root.slug}`} onClick={() => setOpenMenu(null)}>
                    {root.tenDanhMuc}
                    {level1Children.length > 0 && (
                      <span className="nav-chevron">▾</span>
                    )}
                  </Link>

                  {level1Children.length > 0 && (
                    <div
                      className={`mega-menu${openMenu === rootId ? " active" : ""}`}
                    >
                      <div className="mega-inner">
                        <div className="mega-content">
                          {level1Children.map((lv1) => {
                            const lv1Id = lv1._id?.$oid || lv1._id;
                            const level2Children = getChildren(lv1Id);
                            return (
                              <div key={lv1Id} className="mega-column">
                                <h4>
                                  <Link
                                    to={`/${root.slug}/${lv1.slug}`}
                                    onClick={() => setOpenMenu(null)}
                                  >
                                    {lv1.tenDanhMuc}
                                  </Link>
                                </h4>
                                {level2Children.map((lv2) => (
                                  <div
                                    key={lv2._id?.$oid || lv2._id}
                                    className="mega-item"
                                  >
                                    <Link
                                      to={`/${root.slug}/${lv2.slug}`}
                                      onClick={() => setOpenMenu(null)}
                                    >
                                      {lv2.tenDanhMuc}
                                    </Link>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>

                        <div className="mega-banner">
                          {root.tenDanhMuc === "Nam" && (
                            <>
                              <img src={quan3} alt="Quần Nam" />
                              <img src={hero1} alt="Bộ sưu tập Nam" />
                            </>
                          )}
                          {root.tenDanhMuc === "Nữ" && (
                            <>
                              <img src={aoThun} alt="Áo Nữ" />
                              <img src={hero2} alt="Bộ sưu tập Nữ" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}

            <li className="nav-item">
              <Link to="/uu-dai">
                Ưu đãi&nbsp;
                <span className="nav-badge nav-badge--sale">SALE</span>
              </Link>
            </li>

            <li className="nav-item">
              <span>Giới thiệu</span>
            </li>
          </ul>
        </nav>

        {/* RIGHT – Search + Icons */}
        <div className="header-right">
          {/* Search input */}
          <form className="header-search" onSubmit={handleSearch}>
            <input
              className="header-search__input"
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(Boolean(searchTerm.trim()))}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 120);
              }}
            />
            <button
              type="submit"
              className="header-search__btn"
              aria-label="Tìm kiếm"
            >
              <img src={searchIcon} alt="search" />
            </button>

            {showSuggestions && suggestions.length > 0 && (
              <div className="header-search__suggestions">
                {suggestions.map((sp) => (
                  <button
                    key={sp._id?.$oid ?? sp._id}
                    type="button"
                    className="header-search__suggestion-item"
                    onClick={() => handlePickSuggestion(sp.tenSanPham)}
                  >
                    {sp.tenSanPham}
                  </button>
                ))}
              </div>
            )}
          </form>

          <button className="icon-btn" title="Giỏ hàng">
            <img src={cartIcon} alt="cart" />
          </button>
          <button className="icon-btn" title="Tài khoản">
            <img src={userIcon} alt="user" />
          </button>
        </div>
      </div>
    </header>
  );
}
