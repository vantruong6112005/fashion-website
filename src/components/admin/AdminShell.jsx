import { adminTabs } from "../../utils/adminUtils";

function AdminSidebar({ activeTab, onChangeTab }) {
  return (
    <aside className="admin-sidebar border-end bg-light">
      <div className="admin-brand px-3 py-4 border-bottom">
        <h3 className="h2 fw-bold text-primary mb-1">FashionAdmin</h3>
        <p className="text-secondary mb-0">Quản lý thời trang</p>
      </div>

      <ul className="list-unstyled px-2 py-3 mb-0 d-flex flex-column gap-1">
        {adminTabs.map((tab) => (
          <li key={tab.id}>
            <button
              type="button"
              className={`btn w-100 text-start admin-nav-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => onChangeTab(tab.id)}
            >
              <i className={`${tab.icon} me-2`} />
              <span>{tab.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function AdminTopbar({ searchValue, onSearchValueChange, onSearchSubmit }) {
  return (
    <div className="admin-topbar border-bottom bg-white px-3 py-3">
      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
        <form className="admin-search" onSubmit={onSearchSubmit}>
          <i className="bi bi-search text-secondary" />
          <input
            className="form-control border-0"
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChange={(e) => onSearchValueChange(e.target.value)}
          />
        </form>

        <div className="d-flex align-items-center gap-3 fs-5">
          <i className="bi bi-bell" />
          <i className="bi bi-person" />
        </div>
      </div>
    </div>
  );
}

export default function AdminShell({
  activeTab,
  onChangeTab,
  searchValue,
  onSearchValueChange,
  onSearchSubmit,
  children,
}) {
  return (
    <section className="admin-panel-shell border rounded overflow-hidden">
      <div className="admin-layout d-flex">
        <AdminSidebar activeTab={activeTab} onChangeTab={onChangeTab} />

        <div className="admin-content-wrap flex-grow-1">
          <AdminTopbar
            searchValue={searchValue}
            onSearchValueChange={onSearchValueChange}
            onSearchSubmit={onSearchSubmit}
          />
          <main className="admin-content p-3 p-lg-4">{children}</main>
        </div>
      </div>
    </section>
  );
}
