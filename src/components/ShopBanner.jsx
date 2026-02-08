import bannerImg from "../assets/images/banner-hang-moi-ve.jpg";
import "../CSS/banner.css";

export default function ShopBanner() {
  return (
    <section className="shop-banner">
      <img src={bannerImg} alt="Hàng mới về" />

      <div className="banner-overlay"></div>

      <div className="banner-content">
        <h1>Hàng Mới Về</h1>
        <p>
          Thời trang nam mẫu mới, cập nhật xu hướng,<br />
          phong cách hiện đại, chất liệu cao cấp.
        </p>
        <button className="banner-btn">Khám phá ngay</button>
      </div>
    </section>
  );
}
