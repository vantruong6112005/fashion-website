import { Link, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { breadcrumbMap } from "../data/breadcrumbMap";
import homeIcon from "../assets/images/icon/home.svg";
import { API_BASE } from "../api";
import "../CSS/Breadcrumb.css";

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
    <nav aria-label="breadcrumb" className="app-breadcrumb py-2">
      <ol className="breadcrumb mb-0 align-items-center">
        <li className="breadcrumb-item">
          <Link
            to="/"
            className="text-decoration-none text-secondary d-inline-flex align-items-center"
          >
            <img src={homeIcon} alt="Home" width={20} className="d-block" />
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
            <li
              key={to}
              className={`breadcrumb-item ${isLast ? "active" : ""}`}
              {...(isLast ? { "aria-current": "page" } : {})}
            >
              {isLast ? (
                <span className="fw-semibold text-dark">{label}</span>
              ) : (
                <Link to={to} className="text-decoration-none text-secondary">
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
