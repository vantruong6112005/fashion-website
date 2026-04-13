import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import userIcon from "../../assets/images/icon/user.png";
import AuthModal from "../AuthModal";
import { API_BASE } from "../../api";
import { useAuth } from "../../context/AuthContext";
import UserAvatar from "./UserAvatar";
import UserMenuDropdown from "./UserMenuDropdown";

const buildInitialAddresses = (user) => {
  const existing = Array.isArray(user?.diaChiNhanHang)
    ? user.diaChiNhanHang
        .map((item) => ({
          tenNguoiNhan: item?.tenNguoiNhan || user?.username || "",
          soDienThoai: item?.soDienThoai || user?.soDienThoai || "",
          diaChi: item?.diaChi || "",
          macDinh: Boolean(item?.macDinh),
        }))
        .filter((item) => item.tenNguoiNhan || item.soDienThoai || item.diaChi)
    : [];

  if (existing.length) {
    const hasDefault = existing.some((item) => item.macDinh);
    return existing.map((item, idx) => ({
      ...item,
      macDinh: hasDefault ? item.macDinh : idx === 0,
    }));
  }

  return [
    {
      tenNguoiNhan: user?.username || "",
      soDienThoai: user?.soDienThoai || "",
      diaChi: "",
      macDinh: true,
    },
  ];
};

export default function UserMenu() {
  const navigate = useNavigate();
  const { user, isAuthenticated, avatarFallback, logout, updateProfile } =
    useAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showSecurityEditor, setShowSecurityEditor] = useState(false);

  const [profileForm, setProfileForm] = useState({
    username: "",
    diaChiNhanHang: [],
  });
  const [securityForm, setSecurityForm] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      username: user.username || "",
      diaChiNhanHang: buildInitialAddresses(user),
    });
    setSecurityForm({
      email: user.email || "",
      currentPassword: "",
      newPassword: "",
    });
  }, [user]);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const uploadRes = await fetch(`${API_BASE}/upload/anh-dai-dien`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok)
        throw new Error(uploadData.message || "Upload thất bại");

      await updateProfile({ anhDaiDien: uploadData.url });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const diaChiNhanHang = profileForm.diaChiNhanHang
        .map((item) => ({
          tenNguoiNhan: String(item.tenNguoiNhan || "").trim(),
          soDienThoai: String(item.soDienThoai || "").trim(),
          diaChi: String(item.diaChi || "").trim(),
          macDinh: Boolean(item.macDinh),
        }))
        .filter((item) => item.tenNguoiNhan || item.soDienThoai || item.diaChi);

      await updateProfile({
        username: profileForm.username.trim(),
        diaChiNhanHang,
      });
      setShowProfileEditor(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateSecurity = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        email: securityForm.email.trim(),
        currentPassword: securityForm.currentPassword,
        newPassword: securityForm.newPassword,
      });
      setShowSecurityEditor(false);
      setSecurityForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  const updateAddressField = (index, key, value) => {
    setProfileForm((prev) => ({
      ...prev,
      diaChiNhanHang: prev.diaChiNhanHang.map((item, idx) =>
        idx === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const setDefaultAddress = (index) => {
    setProfileForm((prev) => ({
      ...prev,
      diaChiNhanHang: prev.diaChiNhanHang.map((item, idx) => ({
        ...item,
        macDinh: idx === index,
      })),
    }));
  };

  const addAddress = () => {
    setProfileForm((prev) => ({
      ...prev,
      diaChiNhanHang: [
        ...prev.diaChiNhanHang,
        {
          tenNguoiNhan: prev.username,
          soDienThoai: "",
          diaChi: "",
          macDinh: prev.diaChiNhanHang.length === 0,
        },
      ],
    }));
  };

  const removeAddress = (index) => {
    setProfileForm((prev) => {
      const next = prev.diaChiNhanHang.filter((_, idx) => idx !== index);
      if (!next.length) {
        return {
          ...prev,
          diaChiNhanHang: [
            {
              tenNguoiNhan: prev.username,
              soDienThoai: "",
              diaChi: "",
              macDinh: true,
            },
          ],
        };
      }
      if (!next.some((item) => item.macDinh)) {
        next[0] = { ...next[0], macDinh: true };
      }
      return { ...prev, diaChiNhanHang: next };
    });
  };

  return (
    <>
      {!isAuthenticated ? (
        <div
          className="user-menu-wrap"
          onMouseEnter={() => setShowUserMenu(true)}
          onMouseLeave={() => setShowUserMenu(false)}
        >
          <button
            className="icon-btn"
            title="Tài khoản"
            onClick={() => {
              setShowAuthModal(true);
              setShowUserMenu(false);
            }}
          >
            <img src={userIcon} alt="user" />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <button
                className="user-dropdown__item"
                onClick={() => {
                  navigate("/don-hang");
                  setShowUserMenu(false);
                }}
              >
                <span>Tra cứu đơn hàng</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          className="user-menu-wrap"
          onMouseEnter={() => setShowUserMenu(true)}
          onMouseLeave={() => setShowUserMenu(false)}
        >
          <button
            className="icon-btn icon-btn--avatar"
            title="Tài khoản"
            onClick={() => setShowUserMenu((prev) => !prev)}
          >
            <UserAvatar
              key={user?.anhDaiDien || "fallback-avatar"}
              user={user}
              fallback={avatarFallback}
            />
          </button>

          {showUserMenu && (
            <UserMenuDropdown
              user={user}
              onLookupInvoice={() => {
                navigate("/don-hang");
                setShowUserMenu(false);
              }}
              onEditProfile={() => {
                setShowProfileEditor(true);
                setShowUserMenu(false);
              }}
              onEditSecurity={() => {
                setShowSecurityEditor(true);
                setShowUserMenu(false);
              }}
              onOrders={() => {
                navigate("/don-hang");
                setShowUserMenu(false);
              }}
              onLogout={() => {
                logout();
                setShowUserMenu(false);
              }}
            />
          )}
        </div>
      )}

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {showProfileEditor && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleUpdateProfile}>
                <div className="modal-header">
                  <h5 className="modal-title">Cập nhật thông tin cá nhân</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowProfileEditor(false)}
                  />
                </div>
                <div className="modal-body d-flex flex-column gap-2">
                  <input
                    className="form-control"
                    value={profileForm.username}
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        username: e.target.value,
                      }))
                    }
                    placeholder="Username"
                  />

                  <div className="d-flex align-items-center gap-2">
                    <span className="small text-muted">Ảnh hiện tại:</span>
                    <div className="icon-btn--avatar">
                      <UserAvatar
                        key={user?.anhDaiDien || "fallback-avatar-preview"}
                        user={user}
                        fallback={avatarFallback}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label small mb-1">
                      Ảnh đại diện
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleAvatarUpload}
                    />
                  </div>

                  <div className="mt-2">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label small mb-0">
                        Địa chỉ nhận hàng
                      </label>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark"
                        onClick={addAddress}
                      >
                        Thêm địa chỉ
                      </button>
                    </div>

                    <div className="d-flex flex-column gap-2">
                      {profileForm.diaChiNhanHang.map((addr, idx) => (
                        <div key={idx} className="border rounded p-2">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <div className="form-check mb-0">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="defaultAddress"
                                checked={addr.macDinh}
                                onChange={() => setDefaultAddress(idx)}
                              />
                              <label className="form-check-label small">
                                Mặc định
                              </label>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeAddress(idx)}
                            >
                              Xóa
                            </button>
                          </div>

                          <input
                            className="form-control form-control-sm mb-2"
                            value={addr.tenNguoiNhan}
                            onChange={(e) =>
                              updateAddressField(
                                idx,
                                "tenNguoiNhan",
                                e.target.value,
                              )
                            }
                            placeholder="Tên người nhận"
                          />
                          <input
                            className="form-control form-control-sm mb-2"
                            value={addr.soDienThoai}
                            onChange={(e) =>
                              updateAddressField(
                                idx,
                                "soDienThoai",
                                e.target.value,
                              )
                            }
                            placeholder="Số điện thoại"
                          />
                          <textarea
                            className="form-control form-control-sm"
                            rows={2}
                            value={addr.diaChi}
                            onChange={(e) =>
                              updateAddressField(idx, "diaChi", e.target.value)
                            }
                            placeholder="Địa chỉ"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={() => setShowProfileEditor(false)}
                  >
                    Đóng
                  </button>
                  <button className="btn btn-dark" type="submit">
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showSecurityEditor && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleUpdateSecurity}>
                <div className="modal-header">
                  <h5 className="modal-title">Bảo mật tài khoản</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowSecurityEditor(false)}
                  />
                </div>
                <div className="modal-body d-flex flex-column gap-2">
                  <input
                    className="form-control"
                    value={securityForm.email}
                    onChange={(e) =>
                      setSecurityForm((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="Email"
                  />
                  <input
                    className="form-control"
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={(e) =>
                      setSecurityForm((p) => ({
                        ...p,
                        currentPassword: e.target.value,
                      }))
                    }
                    placeholder="Mật khẩu hiện tại"
                  />
                  <input
                    className="form-control"
                    type="password"
                    value={securityForm.newPassword}
                    onChange={(e) =>
                      setSecurityForm((p) => ({
                        ...p,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder="Mật khẩu mới"
                  />
                  <small className="text-muted">
                    Chỉ cần nhập mật khẩu nếu bạn muốn đổi sang mật khẩu mới.
                  </small>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={() => setShowSecurityEditor(false)}
                  >
                    Đóng
                  </button>
                  <button className="btn btn-dark" type="submit">
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
