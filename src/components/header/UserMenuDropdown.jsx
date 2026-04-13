import userMenuIcon from "../../assets/images/icon/user.svg";
import orderIcon from "../../assets/images/icon/order.svg";
import privacyIcon from "../../assets/images/icon/privacy.svg";
import logoutIcon from "../../assets/images/icon/logout.svg";

export default function UserMenuDropdown({
  user,
  onEditProfile,
  onEditSecurity,
  onOrders,
  onLogout,
}) {
  return (
    <div className="user-dropdown">
      <div className="user-dropdown__header">
        <div className="user-dropdown__name">{user?.username}</div>
        <div className="user-dropdown__email">{user?.email}</div>
      </div>

      <button className="user-dropdown__item" onClick={onEditProfile}>
        <img
          src={userMenuIcon}
          alt="user"
          className="user-dropdown__item-icon"
        />
        <span>Thông tin cá nhân</span>
      </button>
      <button className="user-dropdown__item" onClick={onEditSecurity}>
        <img
          src={privacyIcon}
          alt="privacy"
          className="user-dropdown__item-icon"
        />
        <span>Bảo mật</span>
      </button>
      <button className="user-dropdown__item" onClick={onOrders}>
        <img src={orderIcon} alt="order" className="user-dropdown__item-icon" />
        <span>Đơn hàng của tôi</span>
      </button>
      <button
        className="user-dropdown__item user-dropdown__item--logout"
        aria-label="Đăng xuất"
        title="Đăng xuất"
        onClick={onLogout}
      >
        <img
          src={logoutIcon}
          alt="logout"
          className="user-dropdown__item-icon"
        />
        <span>Logout</span>
      </button>
    </div>
  );
}
