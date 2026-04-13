import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../CSS/header.css";
import searchIcon from "../../assets/images/icon/search.svg";
import cartIcon from "../../assets/images/icon/shopping-cart.png";
import aoThun from "../../assets/images/Ao/ao.png";
import quan3 from "../../assets/images/quan/quan.png";
import hero1 from "../../assets/images/hero/hero1.png";
import hero2 from "../../assets/images/hero/hero2.png";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { matchesRelativeSearch } from "../../hooks/useProductFilters";
import { getCategories, getProducts } from "../../services/catalogService";
import { getProductPrimaryImage, resolveImageUrl } from "../../utils/image";
import UserMenu from "./UserMenu";

const FALLBACK_ROOT_CATEGORIES = [
  { _id: "fallback-nam", slug: "nam", tenDanhMuc: "Nam", parentId: null },
  { _id: "fallback-nu", slug: "nu", tenDanhMuc: "Nữ", parentId: null },
];

const getId = (obj) => obj?.$oid ?? obj;

export default function Header() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user } = useAuth();

  const [categories, setCategories] = useState(() => FALLBACK_ROOT_CATEGORIES);
  const [openMenu, setOpenMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [productList, setProductList] = useState([]);
  const [hasLoadedSearchData, setHasLoadedSearchData] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi tải danh mục:", err));
  }, []);

  const loadSearchData = () => {
    if (hasLoadedSearchData) return;
    getProducts()
      .then((data) => {
        setProductList(data.filter((sp) => sp.isActive));
        setHasLoadedSearchData(true);
      })
      .catch((err) => console.error("Lỗi tải dữ liệu search:", err));
  };

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
    if (value.trim()) loadSearchData();
  };

  const goToSearch = (keyword) => {
    navigate(
      keyword
        ? `/hang-moi-ve?q=${encodeURIComponent(keyword)}`
        : "/hang-moi-ve",
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
      <div className="header-inner">
        <div className="header-left">
          <span className="logo">
            <Link to="/">FASHION-SHOP</Link>
          </span>
        </div>

        <nav className="header-center">
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/hang-moi-ve">
                Hàng mới về&nbsp;
                <span className="nav-badge nav-badge--new">NEW</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/bo-suu-tap">Bộ sưu tập</Link>
            </li>

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

            {String(user?.role || "").toLowerCase() === "admin" && (
              <li className="nav-item">
                <Link to="/admin">Quản trị</Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="header-right">
          <form className="header-search" onSubmit={handleSearch}>
            <input
              className="header-search__input"
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                setShowSuggestions(Boolean(searchTerm.trim()));
                loadSearchData();
              }}
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
                    <img
                      className="header-search__suggestion-thumb"
                      src={resolveImageUrl(getProductPrimaryImage(sp))}
                      alt={sp.tenSanPham}
                    />
                    <span>{sp.tenSanPham}</span>
                  </button>
                ))}
              </div>
            )}
          </form>

          <Link
            to="/gio-hang"
            className="icon-btn position-relative"
            title="Giỏ hàng"
            aria-label="Giỏ hàng"
          >
            <img src={cartIcon} alt="cart" />
            {totalItems > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                {totalItems}
              </span>
            )}
          </Link>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
