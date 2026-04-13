import { useMemo } from "react";
import { extractPrimaryMaterial } from "../../hooks/useProductFilters";
import FilterSection from "./FilterSection";
import "../../CSS/Sidebar.css";

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
      colors: [...colors.entries()].map(([code, hex]) => ({ code, hex })),
      materials: [...materials].sort((a, b) => a.localeCompare(b, "vi")),
    };
  }, [products]);

  const hasFilters = Object.values(activeFilters).some((arr) => arr.length > 0);

  return (
    <aside className="filter-sidebar">
      <div className="d-flex justify-content-between align-items-center py-2 mb-2 border-bottom border-secondary">
        <span className="fw-semibold fs-6 text-dark">Bộ lọc</span>
        <span className="small text-secondary">{totalResults} kết quả</span>
      </div>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="btn btn-link p-0 pb-2 text-decoration-none filter-sidebar__clear"
        >
          Xóa tất cả bộ lọc
        </button>
      )}

      <FilterSection title="Giá" defaultOpen={false}>
        {[
          { label: "Dưới 300.000đ", value: "under_300" },
          { label: "300.000đ - 500.000đ", value: "300_500" },
          { label: "Trên 500.000đ", value: "over_500" },
        ].map((r) => (
          <label
            key={r.value}
            className="form-check d-flex align-items-center gap-2 py-1 ps-0 mb-0"
          >
            <input
              type="checkbox"
              className="form-check-input mt-0 ms-0"
              checked={activeFilters.boLocGia.includes(r.value)}
              onChange={() => toggleFilter("boLocGia", r.value)}
            />
            <span className="form-check-label small text-body">{r.label}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Kích thước" defaultOpen={false}>
        <div className="d-flex flex-wrap gap-2 pt-1">
          {filterOptions.sizes.map((sz) => (
            <button
              key={sz}
              className={`btn btn-sm filter-size-btn ${
                activeFilters.boLocSize.includes(sz)
                  ? "btn-dark border-dark text-white"
                  : "btn-outline-secondary"
              }`}
              onClick={() => toggleFilter("boLocSize", sz)}
            >
              {sz}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Màu sắc" defaultOpen={false}>
        <div className="d-flex flex-wrap gap-2 pt-1">
          {filterOptions.colors.map((c) => (
            <div
              key={c.code}
              className={`filter-color-chip ${
                activeFilters.boLocMauSac.includes(c.code)
                  ? "filter-color-chip--active"
                  : ""
              }`}
              style={{ background: c.hex }}
              onClick={() => toggleFilter("boLocMauSac", c.code)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Chất liệu" defaultOpen={false}>
        {filterOptions.materials.map((m) => (
          <label
            key={m}
            className="form-check d-flex align-items-center gap-2 py-1 ps-0 mb-0"
          >
            <input
              type="checkbox"
              className="form-check-input mt-0 ms-0"
              checked={activeFilters.boLocChatLieu.includes(m)}
              onChange={() => toggleFilter("boLocChatLieu", m)}
            />
            <span className="form-check-label small text-body">{m}</span>
          </label>
        ))}
        {!filterOptions.materials.length && (
          <span className="text-muted small">Chưa có dữ liệu chất liệu</span>
        )}
      </FilterSection>

      <FilterSection title="Phù hợp" defaultOpen={false}>
        {filterOptions.sports.map((s) => (
          <label
            key={s}
            className="form-check d-flex align-items-center gap-2 py-1 ps-0 mb-0"
          >
            <input
              type="checkbox"
              className="form-check-input mt-0 ms-0"
              checked={activeFilters.boLocPhuHop.includes(s)}
              onChange={() => toggleFilter("boLocPhuHop", s)}
            />
            <span className="form-check-label small text-body">{s}</span>
          </label>
        ))}
      </FilterSection>
    </aside>
  );
}
