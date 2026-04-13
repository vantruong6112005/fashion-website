import bannerImg from "../assets/images/banner-hang-moi-ve.jpg";
import "../CSS/banner.css";

export default function ShopBanner({
  title = "Hàng Mới Về",
  description = "Thời trang nam mẫu mới, cập nhật xu hướng,\nphong cách hiện đại, chất liệu cao cấp.",
  buttonText = "Khám phá ngay",
  image = bannerImg,
}) {
  const descriptionLines = String(description).split("\n");

  return (
    <section className="shop-banner">
      <img src={image} alt={title} />

      <div className="banner-overlay"></div>

      <div className="banner-content">
        <h1>{title}</h1>
        <p>
          {descriptionLines.map((line, idx) => (
            <span key={idx}>
              {line}
              {idx < descriptionLines.length - 1 && <br />}
            </span>
          ))}
        </p>
        <button className="banner-btn">{buttonText}</button>
      </div>
    </section>
  );
}
