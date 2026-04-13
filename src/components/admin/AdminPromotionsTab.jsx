import { extractId, toCurrency, toInputDate } from "../../utils/adminUtils";
import deleteIcon from "../../assets/images/icon/delete.svg";
import editIcon from "../../assets/images/icon/edit.svg";

export default function AdminPromotionsTab({
  promotions,
  promotionKeyword,
  setPromotionKeyword,
  loadPromotions,
  promotionForm,
  setPromotionForm,
  savePromotion,
  deletePromotion,
}) {
  return (
    <div className="row g-3">
      <div className="col-12 col-xl-6">
        <div className="card h-100">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>Danh sách khuyến mãi</span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => loadPromotions(promotionKeyword)}
            >
              Tải lại
            </button>
          </div>
          <div className="card-body">
            <div className="input-group mb-3">
              <input
                className="form-control"
                value={promotionKeyword}
                onChange={(e) => setPromotionKeyword(e.target.value)}
                placeholder="Tìm theo mã"
              />
              <button
                className="btn btn-dark"
                onClick={() => loadPromotions(promotionKeyword)}
              >
                Tìm
              </button>
            </div>
            <div className="admin-scroll">
              <table className="table table-sm table-hover align-middle">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Loại</th>
                    <th>Giá trị</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((item) => (
                    <tr key={extractId(item)}>
                      <td>{item.maKhuyenMai}</td>
                      <td>{item.loaiGiamGia}</td>
                      <td>
                        {toCurrency(
                          item?.giaTri?.$numberDecimal || item.giaTri || 0,
                        )}
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary admin-icon-btn"
                            type="button"
                            aria-label="Sửa khuyến mãi"
                            title="Sửa khuyến mãi"
                            onClick={() =>
                              setPromotionForm({
                                _id: extractId(item),
                                maKhuyenMai: item.maKhuyenMai || "",
                                donHangToiThieu: String(
                                  item?.donHangToiThieu?.$numberDecimal ||
                                    item?.donHangToiThieu ||
                                    0,
                                ),
                                loaiGiamGia: item.loaiGiamGia || "PERCENT",
                                giaTri: String(
                                  item?.giaTri?.$numberDecimal ||
                                    item?.giaTri ||
                                    "",
                                ),
                                giamToiDa: String(
                                  item?.giamToiDa?.$numberDecimal ||
                                    item?.giamToiDa ||
                                    "",
                                ),
                                gioiHanSoLuong: String(
                                  item?.gioiHanSoLuong || "",
                                ),
                                gioiHanMoiUser: String(
                                  item?.gioiHanMoiUser || "",
                                ),
                                ngayBatDau: toInputDate(item.ngayBatDau),
                                ngayKetThuc: toInputDate(item.ngayKetThuc),
                                isActive: item.isActive !== false,
                              })
                            }
                          >
                            <img src={editIcon} alt="" aria-hidden="true" />
                          </button>
                          <button
                            className="btn btn-outline-danger admin-icon-btn"
                            type="button"
                            aria-label="Xóa khuyến mãi"
                            title="Xóa khuyến mãi"
                            onClick={() => deletePromotion(extractId(item))}
                          >
                            <img src={deleteIcon} alt="" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!promotions.length && (
                    <tr>
                      <td className="text-center text-secondary" colSpan={4}>
                        Chưa có chương trình khuyến mãi
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
            {promotionForm._id ? "Cập nhật" : "Thêm"} khuyến mãi
          </div>
          <div className="card-body">
            <form className="d-flex flex-column gap-2" onSubmit={savePromotion}>
              <input
                className="form-control"
                placeholder="Mã khuyến mãi"
                value={promotionForm.maKhuyenMai}
                onChange={(e) =>
                  setPromotionForm((prev) => ({
                    ...prev,
                    maKhuyenMai: e.target.value,
                  }))
                }
                required
              />
              <div className="row g-2">
                <div className="col-6">
                  <select
                    className="form-select"
                    value={promotionForm.loaiGiamGia}
                    onChange={(e) =>
                      setPromotionForm((prev) => ({
                        ...prev,
                        loaiGiamGia: e.target.value,
                      }))
                    }
                  >
                    <option value="PERCENT">PERCENT</option>
                    <option value="AMOUNT">AMOUNT</option>
                  </select>
                </div>
                <div className="col-6">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Giá trị"
                    value={promotionForm.giaTri}
                    onChange={(e) =>
                      setPromotionForm((prev) => ({
                        ...prev,
                        giaTri: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
              <input
                className="form-control"
                type="number"
                placeholder="Đơn hàng tối thiểu"
                value={promotionForm.donHangToiThieu}
                onChange={(e) =>
                  setPromotionForm((prev) => ({
                    ...prev,
                    donHangToiThieu: e.target.value,
                  }))
                }
              />
              <input
                className="form-control"
                type="number"
                placeholder="Giảm tối đa"
                value={promotionForm.giamToiDa}
                onChange={(e) =>
                  setPromotionForm((prev) => ({
                    ...prev,
                    giamToiDa: e.target.value,
                  }))
                }
              />
              <div className="row g-2">
                <div className="col-6">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Giới hạn số lượng"
                    value={promotionForm.gioiHanSoLuong}
                    onChange={(e) =>
                      setPromotionForm((prev) => ({
                        ...prev,
                        gioiHanSoLuong: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-6">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Giới hạn mỗi user"
                    value={promotionForm.gioiHanMoiUser}
                    onChange={(e) =>
                      setPromotionForm((prev) => ({
                        ...prev,
                        gioiHanMoiUser: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <input
                    className="form-control"
                    type="date"
                    value={promotionForm.ngayBatDau}
                    onChange={(e) =>
                      setPromotionForm((prev) => ({
                        ...prev,
                        ngayBatDau: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-6">
                  <input
                    className="form-control"
                    type="date"
                    value={promotionForm.ngayKetThuc}
                    onChange={(e) =>
                      setPromotionForm((prev) => ({
                        ...prev,
                        ngayKetThuc: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={promotionForm.isActive}
                  onChange={(e) =>
                    setPromotionForm((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  id="promotionActive"
                />
                <label className="form-check-label" htmlFor="promotionActive">
                  Kích hoạt
                </label>
              </div>
              <button className="btn btn-dark" type="submit">
                {promotionForm._id ? "Cập nhật" : "Thêm mới"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
