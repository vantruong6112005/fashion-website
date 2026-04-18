import { Link } from "react-router-dom";
import "../CSS/gioiThieu.css";

const milestones = [
  { year: "2018", title: "Khởi đầu", desc: "Bắt đầu từ một studio nhỏ với 2 dòng sản phẩm cơ bản." },
  { year: "2021", title: "Mở rộng", desc: "Phát triển hệ sinh thái bán lẻ online và phục vụ trên toàn quốc." },
  { year: "2024", title: "Tăng tốc", desc: "Nâng cấp trải nghiệm số với giao hàng nhanh và cá nhân hóa ưu đãi." },
];

const values = [
  {
    title: "Thiết kế tinh gọn",
    desc: "Form dễ mặc, linh hoạt từ công sở đến dạo phố.",
  },
  {
    title: "Chất liệu bền vững",
    desc: "Ưu tiên vải bền, thoáng và quy trình sản xuất có trách nhiệm.",
  },
  {
    title: "Dịch vụ tận tâm",
    desc: "Đổi trả linh hoạt, tư vấn nhanh, hỗ trợ sát nhu cầu khách hàng.",
  },
];

export default function GioiThieu() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-wrap about-hero__grid">
          <div>
            <p className="about-kicker">FASHION SHOP</p>
            <h1 className="about-title">Thời trang hiện đại cho nhịp sống đô thị</h1>
            <p className="about-lead">
              Chúng tôi xây dựng thương hiệu dựa trên sự cân bằng giữa thẩm mỹ, chất lượng
              và giá trị dài hạn. Mỗi bộ sưu tập được thiết kế để bạn mặc đẹp hằng ngày,
              tự tin trong mọi khoảnh khắc.
            </p>
            <div className="about-actions">
              <Link to="/trang-chu" className="about-btn about-btn--solid">
                Khám phá bộ sưu tập
              </Link>
              <Link to="/uu-dai" className="about-btn about-btn--ghost">
                Xem ưu đãi hôm nay
              </Link>
            </div>
          </div>

          <div className="about-hero__card">
            <h2>Con số nổi bật</h2>
            <div className="about-stats">
              <article>
                <strong>120K+</strong>
                <span>Khách hàng tin dùng</span>
              </article>
              <article>
                <strong>4.9/5</strong>
                <span>Đánh giá dịch vụ</span>
              </article>
              <article>
                <strong>48H</strong>
                <span>Giao hàng toàn quốc</span>
              </article>
              <article>
                <strong>30 ngày</strong>
                <span>Đổi trả linh hoạt</span>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-wrap">
          <div className="about-heading">
            <p>Giá trị cốt lõi</p>
            <h2>Tập trung vào trải nghiệm mặc thực tế</h2>
          </div>
          <div className="about-values">
            {values.map((item) => (
              <article key={item.title} className="about-value-card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section about-section--timeline">
        <div className="about-wrap">
          <div className="about-heading">
            <p>Hành trình phát triển</p>
            <h2>Đi từng bước chắc chắn để đi xa</h2>
          </div>

          <div className="about-timeline">
            {milestones.map((item) => (
              <article key={item.year} className="about-milestone">
                <span className="about-milestone__year">{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-wrap about-cta__box">
          <div>
            <p className="about-kicker">BẮT ĐẦU NGAY</p>
            <h2>Nâng tủ đồ của bạn với những lựa chọn tinh tế hơn</h2>
            <p>
              Chọn sản phẩm phù hợp vóc dáng, phong cách và ngân sách chỉ trong vài phút.
            </p>
          </div>
          <Link to="/hang-moi-ve-2" className="about-btn about-btn--solid">
            Mua sắm ngay
          </Link>
        </div>
      </section>
    </main>
  );
}
