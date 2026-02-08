import { useState } from "react";
import "../CSS/shopFilter.css";

function FilterSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="filter-section">
      <div
        className="filter-header"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        <span className={`arrow ${open ? "open" : ""}`}></span>
      </div>

      {open && <div className="filter-body">{children}</div>}
    </div>
  );
}

export default function ShopFilter() {
  return (
    <div className="shop-filter">
      <h3 className="filter-title">BỘ LỌC</h3>

      <FilterSection title="Kiểu cổ áo">
        <label><input type="checkbox" /> Cổ tròn</label>
        <label><input type="checkbox" /> Cổ bẻ</label>
        <label><input type="checkbox" /> Cổ tim</label>
      </FilterSection>

      <FilterSection title="Màu sắc">
        <label><input type="checkbox" /> Đen</label>
        <label><input type="checkbox" /> Trắng</label>
        <label><input type="checkbox" /> Xanh</label>
        <label><input type="checkbox" /> Xám</label>
      </FilterSection>

      <FilterSection title="Chất liệu">
        <label><input type="checkbox" /> Cotton</label>
        <label><input type="checkbox" /> Linen</label>
        <label><input type="checkbox" /> Thun</label>
      </FilterSection>

      <FilterSection title="Form dáng">
        <label><input type="checkbox" /> Slim fit</label>
        <label><input type="checkbox" /> Regular</label>
        <label><input type="checkbox" /> Oversize</label>
      </FilterSection>

      <FilterSection title="Kích cỡ" defaultOpen>
        <div className="size-grid">
          {["XS","S","M","L","XL","XXL","29","30","31","32","33"].map(s => (
            <button key={s} className="size-btn">{s}</button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
