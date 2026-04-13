import "../../CSS/ActiveFilterTags.css";

const ActiveFilterTags = ({ activeFilters, toggleFilter }) => {
  const all = [
    ...activeFilters.boLocMauSac.map((s) => ({
      type: "boLocMauSac",
      value: s,
    })),
    ...activeFilters.boLocSize.map((s) => ({
      type: "boLocSize",
      value: s,
    })),
    ...activeFilters.boLocGia.map((s) => ({
      type: "boLocGia",
      value: s,
    })),
    ...activeFilters.boLocPhuHop.map((s) => ({
      type: "boLocPhuHop",
      value: s,
    })),
    ...activeFilters.boLocChatLieu.map((s) => ({
      type: "boLocChatLieu",
      value: s,
    })),
  ];

  if (all.length === 0) return <div />;

  return (
    <div className="d-flex flex-wrap gap-2">
      {all.map(({ type, value }) => (
        <span
          key={type + value}
          className="badge bg-dark rounded-pill d-inline-flex align-items-center gap-1 px-2 py-1 small"
        >
          {value}
          <button
            className="filter-tag__remove btn btn-sm btn-link text-white p-0"
            onClick={() => toggleFilter(type, value)}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
};

export default ActiveFilterTags;
