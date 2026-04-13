import MDEditor from "@uiw/react-md-editor";
import editIcon from "../../assets/images/icon/edit.svg";
import {
  extractId,
  getProductThumb,
  mapProductToForm,
  toCurrency,
} from "../../utils/adminUtils";

export default function AdminProductsTab({
  products,
  productKeyword,
  setProductKeyword,
  loadProducts,
  categories,
  collections,
  productForm,
  setProductForm,
  saveProduct,
  resetProductForm,
  selectedProduct,
  setSelectedProduct,
  handleUploadColorImages,
}) {
  const getAncestorCategoryIds = (categoryId) => {
    const byId = new Map(
      (categories || []).map((item) => [extractId(item), item]),
    );
    const ancestors = [];
    let current = byId.get(categoryId);
    let guard = 0;

    while (current && guard < 20) {
      const parentId = extractId(current?.parentId);
      if (!parentId || !byId.has(parentId)) break;
      ancestors.push(parentId);
      current = byId.get(parentId);
      guard += 1;
    }

    return ancestors;
  };

  const toggleCategory = (categoryId, isChecked) => {
    setProductForm((prev) => {
      if (!isChecked) {
        return {
          ...prev,
          danhMucId: (prev.danhMucId || []).filter((id) => id !== categoryId),
        };
      }

      const next = new Set(prev.danhMucId || []);
      next.add(categoryId);
      getAncestorCategoryIds(categoryId).forEach((id) => next.add(id));
      return { ...prev, danhMucId: Array.from(next) };
    });
  };

  const toggleCollection = (collectionId, isChecked) => {
    setProductForm((prev) => ({
      ...prev,
      boSuuTapId: isChecked
        ? Array.from(new Set([...(prev.boSuuTapId || []), collectionId]))
        : (prev.boSuuTapId || []).filter((id) => id !== collectionId),
    }));
  };

  return (
    <div className="row g-3">
      <div className="col-12 col-xl-6">
        <div className="card h-100">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>Danh sách sản phẩm</span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => loadProducts(productKeyword)}
            >
              Tải lại
            </button>
          </div>
          <div className="card-body">
            <div className="input-group mb-3">
              <input
                className="form-control"
                value={productKeyword}
                onChange={(e) => setProductKeyword(e.target.value)}
                placeholder="Tìm theo tên/slug"
              />
              <button
                className="btn btn-dark"
                onClick={() => loadProducts(productKeyword)}
              >
                Tìm
              </button>
            </div>

            <div className="admin-scroll table-responsive">
              <table className="table table-hover align-middle admin-compact-table">
                <thead>
                  <tr>
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>SKU</th>
                    <th>Giá</th>
                    <th className="text-end">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={extractId(item)}>
                      <td>
                        {getProductThumb(item) ? (
                          <img
                            className="admin-thumb"
                            src={getProductThumb(item)}
                            alt={item.tenSanPham}
                          />
                        ) : (
                          <div className="admin-thumb admin-thumb--empty">
                            <i className="bi bi-image text-secondary" />
                          </div>
                        )}
                      </td>
                      <td className="fw-semibold">{item.tenSanPham}</td>
                      <td>{item?.bienTheSanPham?.[0]?.maSKU || "-"}</td>
                      <td>
                        {toCurrency(item?.gia?.$numberDecimal || item.gia || 0)}
                        đ
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary admin-icon-btn"
                          type="button"
                          aria-label="Sửa sản phẩm"
                          title="Sửa sản phẩm"
                          onClick={() => {
                            setSelectedProduct(item);
                            setProductForm(mapProductToForm(item));
                          }}
                        >
                          <img src={editIcon} alt="" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!products.length && (
                    <tr>
                      <td colSpan={5} className="text-center text-secondary">
                        Chưa có sản phẩm
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
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>
              {productForm._id ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
            </span>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={resetProductForm}
            >
              Mới
            </button>
          </div>
          <div className="card-body">
            <form className="d-flex flex-column gap-2" onSubmit={saveProduct}>
              <input
                className="form-control"
                placeholder="Tên sản phẩm"
                value={productForm.tenSanPham}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    tenSanPham: e.target.value,
                  }))
                }
                required
              />
              <div className="row g-2">
                <div className="col-6">
                  <input
                    className="form-control"
                    placeholder="Slug"
                    value={productForm.slug}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-6">
                  <input
                    className="form-control"
                    placeholder="Giá"
                    type="number"
                    value={productForm.gia}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        gia: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="row g-2">
                <div className="col-6">
                  <input
                    className="form-control"
                    placeholder="Giới tính"
                    value={productForm.gioiTinh}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        gioiTinh: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-6">
                  <input
                    className="form-control"
                    placeholder="Chất liệu"
                    value={productForm.chatLieu}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        chatLieu: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <input
                className="form-control"
                placeholder="Kiểu dáng"
                value={productForm.kieuDang}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    kieuDang: e.target.value,
                  }))
                }
              />

              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label mb-1">Danh mục</label>
                  <div className="admin-checkbox-list">
                    {(categories || []).map((item) => {
                      const id = extractId(item);
                      if (!id) return null;
                      const checked = (productForm.danhMucId || []).includes(
                        id,
                      );
                      return (
                        <label className="admin-checkbox-item" key={id}>
                          <input
                            className="admin-checkbox-input"
                            type="checkbox"
                            checked={checked}
                            onChange={(e) =>
                              toggleCategory(id, e.target.checked)
                            }
                          />
                          <span>{item.tenDanhMuc || item.slug || id}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label mb-1">Bộ sưu tập</label>
                  <div className="admin-checkbox-list">
                    {(collections || []).map((item) => {
                      const id = extractId(item);
                      if (!id) return null;
                      const checked = (productForm.boSuuTapId || []).includes(
                        id,
                      );
                      return (
                        <label className="admin-checkbox-item" key={id}>
                          <input
                            className="admin-checkbox-input"
                            type="checkbox"
                            checked={checked}
                            onChange={(e) =>
                              toggleCollection(id, e.target.checked)
                            }
                          />
                          <span>{item.tenBoSuuTap || item.slug || id}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <input
                className="form-control"
                placeholder="Tính năng"
                value={productForm.tinhNang}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    tinhNang: e.target.value,
                  }))
                }
              />

              <label className="form-label mt-2 mb-1">
                Mô tả (Markdown -&gt; HTML)
              </label>
              <MDEditor
                value={productForm.moTaMarkdown}
                onChange={(value) =>
                  setProductForm((prev) => ({
                    ...prev,
                    moTaMarkdown: value || "",
                  }))
                }
                preview="edit"
                height={220}
              />

              <div className="preview-box" data-color-mode="light">
                <MDEditor.Markdown source={productForm.moTaMarkdown || ""} />
              </div>

              <div className="d-flex justify-content-between align-items-center mt-2">
                <strong>Màu sản phẩm</strong>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark"
                  onClick={() =>
                    setProductForm((prev) => ({
                      ...prev,
                      mauSanPham: [
                        ...prev.mauSanPham,
                        {
                          code: "",
                          tenMau: "",
                          maMau: "#000000",
                          images: [],
                        },
                      ],
                    }))
                  }
                >
                  Thêm màu
                </button>
              </div>

              {productForm.mauSanPham.map((mau, idx) => (
                <div className="product-color-card" key={`${mau.code}-${idx}`}>
                  <div className="row g-2">
                    <div className="col-4">
                      <input
                        className="form-control"
                        placeholder="Code"
                        value={mau.code}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            mauSanPham: prev.mauSanPham.map((item, i) =>
                              i === idx
                                ? { ...item, code: e.target.value }
                                : item,
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="col-5">
                      <input
                        className="form-control"
                        placeholder="Tên màu"
                        value={mau.tenMau}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            mauSanPham: prev.mauSanPham.map((item, i) =>
                              i === idx
                                ? { ...item, tenMau: e.target.value }
                                : item,
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="col-3">
                      <input
                        className="form-control form-control-color w-100"
                        type="color"
                        value={mau.maMau || "#000000"}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            mauSanPham: prev.mauSanPham.map((item, i) =>
                              i === idx
                                ? { ...item, maMau: e.target.value }
                                : item,
                            ),
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <input
                      className="form-control"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        handleUploadColorImages(idx, e.target.files)
                      }
                    />
                    {!!mau.images?.length && (
                      <div className="small mt-2 text-muted">
                        Đã upload: {mau.images.length} ảnh
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="d-flex justify-content-between align-items-center mt-2">
                <strong>Biến thể sản phẩm</strong>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark"
                  onClick={() =>
                    setProductForm((prev) => ({
                      ...prev,
                      bienTheSanPham: [
                        ...prev.bienTheSanPham,
                        {
                          maSKU: "",
                          colorCode: "",
                          size: "",
                          soLuongTon: 0,
                        },
                      ],
                    }))
                  }
                >
                  Thêm biến thể
                </button>
              </div>

              {productForm.bienTheSanPham.map((variant, idx) => (
                <div className="row g-2" key={`${variant.maSKU}-${idx}`}>
                  <div className="col-3">
                    <input
                      className="form-control"
                      placeholder="SKU"
                      value={variant.maSKU}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          bienTheSanPham: prev.bienTheSanPham.map((item, i) =>
                            i === idx
                              ? { ...item, maSKU: e.target.value }
                              : item,
                          ),
                        }))
                      }
                    />
                  </div>
                  <div className="col-3">
                    <input
                      className="form-control"
                      placeholder="Color code"
                      value={variant.colorCode}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          bienTheSanPham: prev.bienTheSanPham.map((item, i) =>
                            i === idx
                              ? { ...item, colorCode: e.target.value }
                              : item,
                          ),
                        }))
                      }
                    />
                  </div>
                  <div className="col-3">
                    <input
                      className="form-control"
                      placeholder="Size"
                      value={variant.size}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          bienTheSanPham: prev.bienTheSanPham.map((item, i) =>
                            i === idx
                              ? { ...item, size: e.target.value }
                              : item,
                          ),
                        }))
                      }
                    />
                  </div>
                  <div className="col-3">
                    <input
                      className="form-control"
                      type="number"
                      placeholder="Tồn kho"
                      value={variant.soLuongTon}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          bienTheSanPham: prev.bienTheSanPham.map((item, i) =>
                            i === idx
                              ? { ...item, soLuongTon: e.target.value }
                              : item,
                          ),
                        }))
                      }
                    />
                  </div>
                </div>
              ))}

              <div className="form-check mt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={productForm.isActive}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  id="productActive"
                />
                <label className="form-check-label" htmlFor="productActive">
                  Kích hoạt sản phẩm
                </label>
              </div>

              <button className="btn btn-dark mt-2" type="submit">
                {productForm._id ? "Cập nhật" : "Thêm mới"}
              </button>
            </form>
          </div>

          {selectedProduct && (
            <div className="card-footer">
              <div className="small text-muted">Chi tiết nhanh:</div>
              <div>
                <strong>{selectedProduct.tenSanPham}</strong>
              </div>
              <div>Slug: {selectedProduct.slug || "-"}</div>
              <div>Màu: {selectedProduct?.mauSanPham?.length || 0}</div>
              <div>
                Biến thể: {selectedProduct?.bienTheSanPham?.length || 0}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
