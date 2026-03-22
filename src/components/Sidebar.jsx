import { useMemo, useState } from "react";
import { extractPrimaryMaterial } from "../hooks/useProductFilters";
import "../css/Sidebar.css";

// Collapse Section =====
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="filter-section">
      <button
        className="filter-section__toggle"
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        <span className="filter-section__icon">{open ? "−" : "+"}</span>
      </button>

      {open && <div className="filter-section__body">{children}</div>}
    </div>
  );
}

export default function Sidebar({
  products,
  activeFilters,
  toggleFilter,
  clearAll,
  totalResults,
}) {
  const filterOptions = useMemo(() => {
    const sizes = new Set();
    const sports = new Set();
    const colors = new Map();
    const materials = new Set();

    products.forEach((p) => {
      p.sizes?.forEach((s) => sizes.add(s));
      p.phuHopVoi?.forEach((sp) => sports.add(sp));
      const material = p.chatLieuChinh ?? extractPrimaryMaterial(p.chatLieu);
      if (material) materials.add(material);

      p.mauSac?.forEach((c) => {
        colors.set(c.code, c.hex);
      });
    });

    return {
      sizes: [...sizes],
      sports: [...sports],
      colors: [...colors.entries()].map(([code, hex]) => ({
        code,
        hex,
      })),
      materials: [...materials].sort((a, b) => a.localeCompare(b, "vi")),
    };
  }, [products]);

  const hasFilters = Object.values(activeFilters).some((arr) => arr.length > 0);

  return (
    <aside className="sidebar">
      <div className="d-flex justify-content-between align-items-center py-2 mb-2 border-bottom border-secondary">
        <span className="sidebar__title">Bộ lọc</span>
        <span className="sidebar__count">{totalResults} kết quả</span>
      </div>

      {hasFilters && (
        <button onClick={clearAll} className="sidebar__clear-btn">
          Xóa tất cả bộ lọc
        </button>
      )}

      {/* giá */}
      <FilterSection title="Giá" defaultOpen={false}>
        {[
          { label: "Dưới 300.000đ", value: "under_300" },
          { label: "300.000đ - 500.000đ", value: "300_500" },
          { label: "Trên 500.000đ", value: "over_500" },
        ].map((r) => (
          <label key={r.value} className="check-row">
            <input
              type="radio"
              name="price-filter"
              checked={activeFilters.boLocGia[0] === r.value}
              onChange={() => toggleFilter("boLocGia", r.value)}
            />
            {r.label}
          </label>
        ))}
      </FilterSection>

      {/* size */}
      <FilterSection title="Kích thước" defaultOpen={false}>
        <div className="size-grid">
          {filterOptions.sizes.map((sz) => (
            <button
              key={sz}
              className={`size-btn ${
                activeFilters.boLocSize.includes(sz) ? "size-btn--active" : ""
              }`}
              onClick={() => toggleFilter("boLocSize", sz)}
            >
              {sz}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* màu */}
      <FilterSection title="Màu sắc" defaultOpen={false}>
        <div className="color-grid">
          {filterOptions.colors.map((c) => (
            <div
              key={c.code}
              className={`color-dot ${
                activeFilters.boLocMauSac.includes(c.code) ? "active" : ""
              }`}
              style={{ background: c.hex }}
              onClick={() => toggleFilter("boLocMauSac", c.code)}
            />
          ))}
        </div>
      </FilterSection>

      {/* chất liệu */}
      <FilterSection title="Chất liệu" defaultOpen={false}>
        {filterOptions.materials.map((m) => (
          <label key={m} className="check-row">
            <input
              type="checkbox"
              checked={activeFilters.boLocChatLieu.includes(m)}
              onChange={() => toggleFilter("boLocChatLieu", m)}
            />
            {m}
          </label>
        ))}
        {!filterOptions.materials.length && (
          <span className="text-muted small">Chưa có dữ liệu chất liệu</span>
        )}
      </FilterSection>
      {/* phù hợp*/}
      <FilterSection title="Phù hợp" defaultOpen={false}>
        {filterOptions.sports.map((s) => (
          <label key={s} className="check-row">
            <input
              type="checkbox"
              checked={activeFilters.boLocPhuHop.includes(s)}
              onChange={() => toggleFilter("boLocPhuHop", s)}
            />
            {s}
          </label>
        ))}
      </FilterSection>
    </aside>
  );
}
