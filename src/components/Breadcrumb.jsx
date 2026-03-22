import { Link, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { breadcrumbMap } from "./breadcrumbMap";
import homeIcon from "../assets/images/icon/home.svg";
import "../css/Breadcrumb.css";

// "http://localhost:3000/api"
const API_BASE = "https://lzpower-fashion.onrender.com/api";

function Breadcrumb() {
  const { pathname } = useLocation();
  const [productName, setProductName] = useState(null);

  const rawSegments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname],
  );

  const productId = useMemo(() => {
    const idx = rawSegments.indexOf("san-pham");
    const candidate = rawSegments[idx + 1];
    if (idx !== -1 && candidate && /^[a-f0-9]{24}$/i.test(candidate))
      return candidate;
    return null;
  }, [rawSegments]);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    fetch(`${API_BASE}/san-pham/${productId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setProductName(data?.tenSanPham ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const activeProductName = productId ? productName : null;

  const pathnames = useMemo(
    () =>
      rawSegments.filter((s) => !/^[a-f0-9]{24}$/i.test(s) && !/^\d+$/.test(s)),
    [rawSegments],
  );

  if (!pathnames.length) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        <li className="breadcrumb__item">
          <Link to="/" className="breadcrumb__link">
            <img src={homeIcon} alt="Home" width={20} />
          </Link>
        </li>

        {pathnames.map((segment, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const label =
            isLast && segment === "san-pham" && activeProductName
              ? activeProductName
              : breadcrumbMap[segment] || segment;

          return (
            <li key={to} className="breadcrumb__item">
              <span style={{ color: "#ccc" }} className="mx-2">
                {">"}
              </span>
              {isLast ? (
                <span className="breadcrumb__current">{label}</span>
              ) : (
                <Link to={to} className="breadcrumb__link">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
