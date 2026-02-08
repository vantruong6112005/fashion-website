import Header from '../components/Header'
import FeaturedProducts from '../components/FeaturedProducts'
import Footer from '../components/Footer'
import CategoryTabs from '../components/CategoryTabs'
import heroImg from '../assets/images/hero/hero2.png'
import '../CSS/sieuTietKiem.css'
export default function SieuTietKiem() {
  return (
    <>
    

      <main className="stk-page">
        <section className="stk-hero">
          <div className="stk-container stk-hero-inner">
            <div className="stk-hero-copy">
              <span className="stk-eyebrow">Siêu tiết kiệm</span>
              <h1 className="stk-title">Giảm sâu cho tự do, mặc đẹp mỗi ngày</h1>
              <p className="stk-subtitle">
                Bộ sưu tập tiết kiệm với chất liệu bền, form đẹp và giá
                dễ chịu. Chọn ngay, giao nhanh.
              </p>
              <div className="stk-cta">
                <button className="stk-btn">Mua ngay</button>
                <button className="stk-btn stk-btn-outline">Xem deal</button>
              </div>
              <div className="stk-hero-stats">
                <div>
                  <strong>2.000+</strong>
                  <span>Đơn hàng/ngày</span>
                </div>
                <div>
                  <strong>4.9/5</strong>
                  <span>Đánh giá khách hàng</span>
                </div>
                <div>
                  <strong>30 ngày</strong>
                  <span>Đổi trả dễ dàng</span>
                </div>
              </div>
            </div>

            <div className="stk-hero-art">
              <img src={heroImg} alt="Siêu tiết kiệm" />
            </div>
          </div>
        </section>

        <section className="stk-features">
          <div className="stk-container stk-feature-grid">
            <div className="stk-feature-card">
              <h4>Giá rõ, tiết kiệm thật</h4>
              <p>Giá niêm yết minh bạch, ưu đãi mỗi tuần.</p>
            </div>
            <div className="stk-feature-card">
              <h4>Chất liệu ổn định</h4>
              <p>Vải mặc mát, bền màu, ít nhăn.</p>
            </div>
            <div className="stk-feature-card">
              <h4>Giao nhanh 2-4 ngày</h4>
              <p>Hỗ trợ COD và đổi size trong 30 ngày.</p>
            </div>
          </div>
        </section>

        <section className="stk-promo">
          <div className="stk-container stk-promo-inner">
            <div>
              <h2>Deal độc quyền 48h</h2>
              <p>Giảm thêm 15% cho đơn hàng từ 499k.</p>
            </div>
            <button className="stk-btn stk-btn-light">Nhận mã giảm</button>
          </div>
        </section>

        <section className="stk-category">
          <div className="stk-container stk-section-head">
            <div>
              <h2>Danh mục tiết kiệm</h2>
              <p>Chọn nhanh theo phong cách và nhu cầu.</p>
            </div>
          </div>
          <CategoryTabs />
        </section>

        <section className="stk-featured">
          <FeaturedProducts />
        </section>

        <section className="stk-testimonials">
          <div className="stk-container">
            <div className="stk-section-head">
              <div>
                <h2>Khách hàng nói gì</h2>
                <p>Hàng ngàn khách hàng đã chọn tiết kiệm thông minh.</p>
              </div>
            </div>
            <div className="stk-testimonial-grid">
              <article className="stk-testimonial-card">
                <p>
                  "Form áo đẹp, chất vải đúng giá. Mình mua 3 màu đều
                  ok."
                </p>
                <span>Tú Anh - Hà Nội</span>
              </article>
              <article className="stk-testimonial-card">
                <p>
                  "Giao nhanh, đóng gói chắc chắn. Size đổi rất dễ."
                </p>
                <span>Minh Quan - Đà Nẵng</span>
              </article>
              <article className="stk-testimonial-card">
                <p>
                  "Giá ổn, màu dễ phối. Sẽ mua thêm khi có deal."
                </p>
                <span>Nhi Le - TP.HCM</span>
              </article>
            </div>
          </div>
        </section>
      </main>

    </>
  )
}
