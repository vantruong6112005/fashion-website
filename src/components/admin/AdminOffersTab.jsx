import { extractId, toCurrency } from "../../utils/adminUtils";
import deleteIcon from "../../assets/images/icon/delete.svg";
import editIcon from "../../assets/images/icon/edit.svg";

export default function AdminOffersTab({
  offers,
  offerKeyword,
  setOfferKeyword,
  loadOffers,
  offerForm,
  setOfferForm,
  saveOffer,
  deleteOffer,
  fillOfferForEdit,
  offerCandidates,
}) {
  return (
    <div className="row g-3">
      <div className="col-12 col-xl-6">
        <div className="card h-100">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>Danh sách ưu đãi</span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => loadOffers(offerKeyword)}
            >
              Tải lại
            </button>
          </div>
          <div className="card-body">
            <div className="input-group mb-3">
              <input
                className="form-control"
                value={offerKeyword}
                onChange={(e) => setOfferKeyword(e.target.value)}
                placeholder="Tìm theo tên ưu đãi"
              />
              <button
                className="btn btn-dark"
                onClick={() => loadOffers(offerKeyword)}
              >
                Tìm
              </button>
            </div>
            <div className="admin-scroll">
              <table className="table table-sm table-hover align-middle">
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Sản phẩm</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {offers.map((item) => (
                    <tr key={extractId(item)}>
                      <td>{item.tenUuDai}</td>
                      <td>{item?.sanPhamUuDai?.length || 0}</td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary admin-icon-btn"
                            type="button"
                            aria-label="Sửa ưu đãi"
                            title="Sửa ưu đãi"
                            onClick={() => fillOfferForEdit(item)}
                          >
                            <img src={editIcon} alt="" aria-hidden="true" />
                          </button>
                          <button
                            className="btn btn-outline-danger admin-icon-btn"
                            type="button"
                            aria-label="Xóa ưu đãi"
                            title="Xóa ưu đãi"
                            onClick={() => deleteOffer(extractId(item))}
                          >
                            <img src={deleteIcon} alt="" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!offers.length && (
                    <tr>
                      <td className="text-center text-secondary" colSpan={3}>
                        Chưa có ưu đãi
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
            {offerForm._id ? "Cập nhật" : "Thêm"} ưu đãi
          </div>
          <div className="card-body">
            <form className="d-flex flex-column gap-2" onSubmit={saveOffer}>
              <input
                className="form-control"
                placeholder="Tên ưu đãi"
                value={offerForm.tenUuDai}
                onChange={(e) =>
                  setOfferForm((prev) => ({
                    ...prev,
                    tenUuDai: e.target.value,
                  }))
                }
                required
              />
              <div className="row g-2">
                <div className="col-6">
                  <input
                    className="form-control"
                    type="date"
                    value={offerForm.dateStart}
                    onChange={(e) =>
                      setOfferForm((prev) => ({
                        ...prev,
                        dateStart: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="col-6">
                  <input
                    className="form-control"
                    type="date"
                    value={offerForm.dateEnd}
                    onChange={(e) =>
                      setOfferForm((prev) => ({
                        ...prev,
                        dateEnd: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-check">
                <input
                  id="offerRandom"
                  className="form-check-input"
                  type="checkbox"
                  checked={offerForm.chonSanPhamNgauNhien}
                  onChange={(e) =>
                    setOfferForm((prev) => ({
                      ...prev,
                      chonSanPhamNgauNhien: e.target.checked,
                    }))
                  }
                />
                <label className="form-check-label" htmlFor="offerRandom">
                  Chọn ngẫu nhiên sản phẩm
                </label>
              </div>

              <div className="row g-2">
                <div className="col-6">
                  <input
                    className="form-control"
                    type="number"
                    min={1}
                    placeholder="Số lượng random"
                    value={offerForm.soLuongSanPhamNgauNhien}
                    onChange={(e) =>
                      setOfferForm((prev) => ({
                        ...prev,
                        soLuongSanPhamNgauNhien: e.target.value,
                      }))
                    }
                    disabled={!offerForm.chonSanPhamNgauNhien}
                  />
                </div>
                <div className="col-6">
                  <input
                    className="form-control"
                    type="number"
                    min={0}
                    max={100}
                    placeholder="% giảm tối đa"
                    value={offerForm.phanTramGiamToiDa}
                    onChange={(e) =>
                      setOfferForm((prev) => ({
                        ...prev,
                        phanTramGiamToiDa: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="admin-scroll border rounded p-2">
                <div className="small mb-2 text-muted">
                  Chỉ hiển thị sản phẩm chưa có trong bất kỳ chương trình ưu đãi
                  nào.
                </div>
                {!offerCandidates.length && (
                  <div className="text-secondary small">
                    Không có sản phẩm khả dụng.
                  </div>
                )}

                {offerCandidates.map((item) => {
                  const id = extractId(item);
                  const checked = offerForm.sanPhamUuDai.some(
                    (sp) => sp.sanPhamId === id,
                  );
                  const selected = offerForm.sanPhamUuDai.find(
                    (sp) => sp.sanPhamId === id,
                  );

                  return (
                    <div className="border rounded p-2 mb-2" key={id}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`offer-product-${id}`}
                          checked={checked}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setOfferForm((prev) => {
                              if (isChecked) {
                                return {
                                  ...prev,
                                  sanPhamUuDai: [
                                    ...prev.sanPhamUuDai,
                                    {
                                      sanPhamId: id,
                                      giaGoc: item.gia || 0,
                                      giaUuDai: item.gia || 0,
                                      soLuongToiDa: 9999,
                                    },
                                  ],
                                };
                              }

                              return {
                                ...prev,
                                sanPhamUuDai: prev.sanPhamUuDai.filter(
                                  (sp) => sp.sanPhamId !== id,
                                ),
                              };
                            });
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`offer-product-${id}`}
                        >
                          {item.tenSanPham} - {toCurrency(item.gia || 0)} VND
                        </label>
                      </div>

                      {checked && (
                        <div className="row g-2 mt-1">
                          <div className="col-6">
                            <input
                              className="form-control form-control-sm"
                              type="number"
                              value={selected?.giaUuDai || ""}
                              onChange={(e) =>
                                setOfferForm((prev) => ({
                                  ...prev,
                                  sanPhamUuDai: prev.sanPhamUuDai.map((sp) =>
                                    sp.sanPhamId === id
                                      ? {
                                          ...sp,
                                          giaUuDai: e.target.value,
                                        }
                                      : sp,
                                  ),
                                }))
                              }
                              placeholder="Giá ưu đãi"
                            />
                          </div>
                          <div className="col-6">
                            <input
                              className="form-control form-control-sm"
                              type="number"
                              value={selected?.soLuongToiDa || ""}
                              onChange={(e) =>
                                setOfferForm((prev) => ({
                                  ...prev,
                                  sanPhamUuDai: prev.sanPhamUuDai.map((sp) =>
                                    sp.sanPhamId === id
                                      ? {
                                          ...sp,
                                          soLuongToiDa: e.target.value,
                                        }
                                      : sp,
                                  ),
                                }))
                              }
                              placeholder="Số lượng tối đa"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={offerForm.isActive}
                  onChange={(e) =>
                    setOfferForm((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  id="offerActive"
                />
                <label className="form-check-label" htmlFor="offerActive">
                  Kích hoạt ưu đãi
                </label>
              </div>

              <button className="btn btn-dark" type="submit">
                {offerForm._id ? "Cập nhật" : "Thêm mới"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
