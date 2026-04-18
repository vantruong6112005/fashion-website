import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/auth.css";

const USERS_STORAGE_KEY = "fashion_users";
const AUTH_USER_KEY = "fashion_auth_user";

const readUsers = () => {
  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const readCurrentUser = () => {
  try {
    const raw = window.localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export default function HoSo() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(() => readCurrentUser());

  const profile = useMemo(() => {
    if (!authUser) return null;
    const users = readUsers();
    const matchedUser = users.find((u) => u.id === authUser.id || u.email === authUser.email);

    if (!matchedUser) {
      return {
        fullName: authUser.fullName,
        email: authUser.email,
        phone: "",
        gender: "",
        birthDate: "",
        address: "",
        createdAt: null,
      };
    }

    return {
      fullName: matchedUser.fullName,
      email: matchedUser.email,
      phone: matchedUser.phone,
      gender: matchedUser.gender,
      birthDate: matchedUser.birthDate,
      address: matchedUser.address,
      createdAt: matchedUser.createdAt,
    };
  }, [authUser]);

  const handleLogout = () => {
    window.localStorage.removeItem(AUTH_USER_KEY);
    setAuthUser(null);
    navigate("/trang-chu");
  };

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("vi-VN")
    : "Chưa cập nhật";
  const lastLogin = authUser?.loggedInAt
    ? new Date(authUser.loggedInAt).toLocaleString("vi-VN")
    : "Vừa đăng nhập";
  const userInitials = (profile.fullName || "U")
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const birthDateText = profile.birthDate
    ? new Date(profile.birthDate).toLocaleDateString("vi-VN")
    : "Chưa cập nhật";
  const completionFields = [
    profile.fullName,
    profile.email,
    profile.phone,
    profile.gender,
    profile.birthDate,
    profile.address,
  ];
  const completedCount = completionFields.filter((field) => Boolean(field)).length;
  const profileCompletion = Math.round((completedCount / completionFields.length) * 100);

  if (!authUser || !profile) {
    return (
      <section className="auth-page auth-page--profile">
        <div className="auth-container">
          <div className="profile-shell">
            <div className="auth-card profile-hero-card">
              <p className="profile-eyebrow">Tài khoản</p>
              <h1 className="auth-title profile-title">Chưa có thông tin đăng nhập</h1>
              <p className="auth-subtitle profile-subtitle">
                Trang đăng nhập và đăng ký đã được gỡ bỏ. Bạn vẫn có thể tiếp tục mua sắm và xem giỏ hàng.
              </p>
            </div>

            <div className="profile-grid">
              <div className="auth-card profile-card-main">
                <h2 className="profile-section-title">Truy cập nhanh</h2>
                <div className="profile-list">
                  <div className="profile-item">
                    <span>Trang chủ</span>
                    <strong>Xem bộ sưu tập mới nhất</strong>
                  </div>
                  <div className="profile-item">
                    <span>Giỏ hàng</span>
                    <strong>Kiểm tra sản phẩm đã chọn</strong>
                  </div>
                </div>
              </div>

              <div className="auth-card profile-card-side">
                <h2 className="profile-section-title">Điều hướng</h2>
                <p className="profile-side-text">
                  Chọn khu vực bạn muốn truy cập tiếp theo.
                </p>

                <div className="profile-actions profile-actions--stack">
                  <Link to="/trang-chu" className="profile-link-btn profile-link-btn--primary">
                    Đi tới trang web
                  </Link>
                  <Link to="/gio-hang" className="profile-link-btn">
                    Xem giỏ hàng
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page auth-page--profile">
      <div className="auth-container">
        <div className="profile-shell">
          <div className="auth-card profile-hero-card">
            <div className="profile-hero-top">
              <div className="profile-avatar" aria-hidden="true">
                {userInitials || "U"}
              </div>
              <div>
                <p className="profile-eyebrow">Tài khoản thành viên</p>
                <h1 className="auth-title profile-title">{profile.fullName || "Khách hàng"}</h1>
                <p className="auth-subtitle profile-subtitle">{profile.email}</p>
              </div>
            </div>

            <div className="profile-badges">
              <span className="profile-badge">Đăng nhập gần nhất: {lastLogin}</span>
              <span className="profile-badge">Thành viên từ: {memberSince}</span>
              <span className="profile-badge profile-badge--active">Tài khoản đang hoạt động</span>
            </div>

            <div className="profile-completion">
              <div className="profile-completion__label">
                <span>Độ hoàn thiện hồ sơ</span>
                <strong>{profileCompletion}%</strong>
              </div>
              <div className="profile-completion__bar">
                <span style={{ width: `${profileCompletion}%` }} />
              </div>
            </div>
          </div>

          <div className="profile-grid">
            <div className="auth-card profile-card-main">
              <h2 className="profile-section-title">Thông tin cá nhân</h2>
              <div className="profile-list">
                <div className="profile-item">
                  <span>Họ và tên</span>
                  <strong>{profile.fullName || "Chưa cập nhật"}</strong>
                </div>
                <div className="profile-item">
                  <span>Email</span>
                  <strong>{profile.email}</strong>
                </div>
                <div className="profile-item">
                  <span>Số điện thoại</span>
                  <strong>{profile.phone || "Chưa cập nhật"}</strong>
                </div>
                <div className="profile-item">
                  <span>Giới tính</span>
                  <strong>{profile.gender || "Chưa cập nhật"}</strong>
                </div>
                <div className="profile-item">
                  <span>Ngày sinh</span>
                  <strong>{birthDateText}</strong>
                </div>
                <div className="profile-item">
                  <span>Địa chỉ</span>
                  <strong>{profile.address || "Chưa cập nhật"}</strong>
                </div>
                <div className="profile-item">
                  <span>Ngày tham gia</span>
                  <strong>{memberSince}</strong>
                </div>
              </div>
            </div>

            <div className="auth-card profile-card-side">
              <h2 className="profile-section-title">Tác vụ nhanh</h2>
              <p className="profile-side-text">
                Quản lý phiên đăng nhập và truy cập nhanh các khu vực mua sắm.
              </p>

              <div className="profile-actions profile-actions--stack">
                <Link to="/trang-chu" className="profile-link-btn profile-link-btn--primary">
                  Đi tới trang web
                </Link>
                <Link to="/gio-hang" className="profile-link-btn">
                  Xem giỏ hàng
                </Link>
                <button
                  type="button"
                  className="auth-btn profile-logout"
                  onClick={handleLogout}
                >
                  Xóa phiên hiện tại
                </button>
              </div>

              <div className="profile-security-note">
                Mẹo bảo mật: Không chia sẻ mật khẩu và luôn đăng xuất khi dùng thiết bị công cộng.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
