import { extractId } from "../../utils/adminUtils";

export default function AdminUsersTab({
  users,
  userKeyword,
  setUserKeyword,
  loadUsers,
}) {
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>Quản lý người dùng</span>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => loadUsers(userKeyword)}
        >
          Tải lại
        </button>
      </div>
      <div className="card-body">
        <div className="input-group mb-3">
          <input
            className="form-control"
            value={userKeyword}
            onChange={(e) => setUserKeyword(e.target.value)}
            placeholder="Tìm theo username/email"
          />
          <button
            className="btn btn-dark"
            onClick={() => loadUsers(userKeyword)}
          >
            Tìm
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={extractId(item)}>
                  <td>{item.username}</td>
                  <td>{item.email}</td>
                  <td>
                    <span
                      className={`badge ${item.role === "admin" ? "text-bg-danger" : "text-bg-secondary"}`}
                    >
                      {item.role}
                    </span>
                  </td>
                  <td>{item.isActive === false ? "Khóa" : "Hoạt động"}</td>
                </tr>
              ))}
              {!users.length && (
                <tr>
                  <td className="text-center text-secondary" colSpan={4}>
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
