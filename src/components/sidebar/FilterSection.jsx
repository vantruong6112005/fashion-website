import { useState } from "react";

export default function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="filter-group">
      <button
        type="button"
        className="btn btn-link text-dark w-100 d-flex justify-content-between align-items-center p-0 py-2 text-decoration-none filter-group__toggle"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{title}</span>
        <span className="filter-group__icon">{open ? "−" : "+"}</span>
      </button>

      {open && <div className="pt-1">{children}</div>}
    </div>
  );
}
