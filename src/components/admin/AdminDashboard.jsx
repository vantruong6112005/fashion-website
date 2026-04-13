const cards = [
  {
    key: "products",
    label: "Tổng Sản Phẩm",
    icon: "bi-box-seam",
    colorClass: "admin-card-icon bg-primary-subtle text-primary",
  },
  {
    key: "collections",
    label: "Bộ Sưu Tập",
    icon: "bi-collection",
    colorClass: "admin-card-icon bg-info-subtle text-info",
  },
  {
    key: "users",
    label: "Người Dùng",
    icon: "bi-people",
    colorClass: "admin-card-icon bg-success-subtle text-success",
  },
  {
    key: "promotions",
    label: "Khuyến Mãi",
    icon: "bi-megaphone",
    colorClass: "admin-card-icon bg-warning-subtle text-warning",
  },
  {
    key: "offers",
    label: "Ưu Đãi",
    icon: "bi-gift",
    colorClass: "admin-card-icon bg-danger-subtle text-danger",
  },
];

export default function AdminDashboard({ stats, onChangeTab }) {
  return (
    <div>
      <div className="mb-4">
        <h1 className="display-6 fw-bold mb-2">Bảng Điều Khiển</h1>
        <p className="text-secondary fs-4 mb-0">
          Chào mừng đến với admin dashboard quản lý thời trang
        </p>
      </div>

      <div className="row g-3">
        {cards.map((card) => (
          <div className="col-12 col-md-6 col-xl-4" key={card.key}>
            <button
              type="button"
              className="card admin-stat-card w-100 text-start"
              onClick={() => onChangeTab(card.key)}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className={card.colorClass}>
                    <i className={`${card.icon} fs-4`} />
                  </span>
                  <i className="bi bi-arrow-up-right text-secondary" />
                </div>
                <div className="text-secondary fs-4">{card.label}</div>
                <div className="display-6 fw-bold">{stats[card.key] || 0}</div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
