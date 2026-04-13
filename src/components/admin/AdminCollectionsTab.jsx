import { extractId, getCollectionThumb } from "../../utils/adminUtils";
import editIcon from "../../assets/images/icon/edit.svg";

export default function AdminCollectionsTab({
  collections,
  collectionKeyword,
  setCollectionKeyword,
  loadCollections,
  collectionForm,
  setCollectionForm,
  saveCollection,
}) {
  return (
    <div className="row g-3">
      <div className="col-12 col-xl-6">
        <div className="card h-100">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>Danh sách bộ sưu tập</span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => loadCollections(collectionKeyword)}
            >
              Tải lại
            </button>
          </div>
          <div className="card-body">
            <div className="input-group mb-3">
              <input
                className="form-control"
                value={collectionKeyword}
                onChange={(e) => setCollectionKeyword(e.target.value)}
                placeholder="Tìm theo tên/slug"
              />
              <button
                className="btn btn-dark"
                onClick={() => loadCollections(collectionKeyword)}
              >
                Tìm
              </button>
            </div>
            <div className="admin-scroll table-responsive">
              <table className="table table-hover align-middle admin-compact-table">
                <thead>
                  <tr>
                    <th>Hình ảnh</th>
                    <th>Tên</th>
                    <th>Slug</th>
                    <th className="text-end">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((item) => (
                    <tr key={extractId(item)}>
                      <td>
                        {getCollectionThumb(item) ? (
                          <img
                            className="admin-thumb"
                            src={getCollectionThumb(item)}
                            alt={item.tenBoSuuTap}
                          />
                        ) : (
                          <div className="admin-thumb admin-thumb--empty">
                            <i className="bi bi-image text-secondary" />
                          </div>
                        )}
                      </td>
                      <td className="fw-semibold">{item.tenBoSuuTap}</td>
                      <td>{item.slug}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary admin-icon-btn"
                          type="button"
                          aria-label="Sửa bộ sưu tập"
                          title="Sửa bộ sưu tập"
                          onClick={() =>
                            setCollectionForm({
                              _id: extractId(item),
                              tenBoSuuTap: item.tenBoSuuTap || "",
                              slogan: item.slogan || "",
                              gioiThieu: item.gioiThieu || "",
                              moTa: item.moTa || "",
                              slug: item.slug || "",
                              thumbnailImage: item.thumbnailImage || [],
                              isActive: item.isActive !== false,
                            })
                          }
                        >
                          <img src={editIcon} alt="" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!collections.length && (
                    <tr>
                      <td className="text-center text-secondary" colSpan={4}>
                        Chưa có bộ sưu tập
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-xl-6">
        <div className="card">
          <div className="card-header">
            {collectionForm._id ? "Cập nhật" : "Thêm"} bộ sưu tập
          </div>
          <div className="card-body">
            <form
              className="d-flex flex-column gap-2"
              onSubmit={saveCollection}
            >
              <input
                className="form-control"
                placeholder="Tên bộ sưu tập"
                value={collectionForm.tenBoSuuTap}
                onChange={(e) =>
                  setCollectionForm((prev) => ({
                    ...prev,
                    tenBoSuuTap: e.target.value,
                  }))
                }
                required
              />
              <input
                className="form-control"
                placeholder="Slogan"
                value={collectionForm.slogan}
                onChange={(e) =>
                  setCollectionForm((prev) => ({
                    ...prev,
                    slogan: e.target.value,
                  }))
                }
              />
              <input
                className="form-control"
                placeholder="Giới thiệu"
                value={collectionForm.gioiThieu}
                onChange={(e) =>
                  setCollectionForm((prev) => ({
                    ...prev,
                    gioiThieu: e.target.value,
                  }))
                }
              />
              <textarea
                className="form-control"
                rows={4}
                placeholder="Mô tả"
                value={collectionForm.moTa}
                onChange={(e) =>
                  setCollectionForm((prev) => ({
                    ...prev,
                    moTa: e.target.value,
                  }))
                }
              />
              <input
                className="form-control"
                placeholder="Slug"
                value={collectionForm.slug}
                onChange={(e) =>
                  setCollectionForm((prev) => ({
                    ...prev,
                    slug: e.target.value,
                  }))
                }
              />
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={collectionForm.isActive}
                  onChange={(e) =>
                    setCollectionForm((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  id="collectionActive"
                />
                <label className="form-check-label" htmlFor="collectionActive">
                  Kích hoạt
                </label>
              </div>
              <button type="submit" className="btn btn-dark">
                {collectionForm._id ? "Cập nhật" : "Thêm mới"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
