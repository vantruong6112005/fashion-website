import '../CSS/newsletter.css'
import modelImg from '../assets/images/letters.png'
import { useNavigate } from "react-router-dom";

export default function Newsletter() {
  const navigate = useNavigate();

  return (
    <section className="newsletter-section">
      <div className="newsletter-overlay"></div>

      <div className="container newsletter-content">
        <div className="row align-items-center">

          {/* BOX ĐĂNG KÝ */}
          <div className="col-md-6">
            <div className="newsletter-box">
              <h3>ĐĂNG KÝ NHẬN KHUYẾN MÃI</h3>
              <p>Đừng bỏ lỡ hàng ngàn sản phẩm và chương trình siêu hấp dẫn</p>

              <input
                type="email"
                placeholder="Nhập email của bạn"
              />

              <button type="button" onClick={() => navigate("/dang-ky")}>Đăng ký</button>
            </div>
          </div>

          {/* ẢNH NGƯỜI MẪU */}
          <div className="col-md-6 text-center">
            <img src={modelImg} alt="model" className="newsletter-img" />
          </div>

        </div>
      </div>
    </section>
  )
}
