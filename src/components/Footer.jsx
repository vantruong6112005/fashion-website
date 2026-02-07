import '../CSS/footer.css'
import facebookIcon from '../assets/images/icon/facebook.png'
import instargramIcon from '../assets/images/icon/instagram.png'

export default function Footer() {
  return (
    <footer className="footer-fashionShop">
      <div className="footer-overlay"></div>

      <div className="container footer-content py-5">
        <div className="row gy-4">

          <div className="col-md-4">
            <h3 className="fw-bold mb-3">FashionShop</h3>
            <p className="text-uppercase fw-semibold">
              Công ty cổ phần thời trang
            </p>

            <p>📞 Hotline: <strong>1900 8079</strong></p>
            <p>🕒 8:30 – 19:00 (Tất cả các ngày)</p>

            <p className="mt-3">
              <strong>VP phía Nam:</strong><br />
              21–23 Nguyễn Văn Trỗi, P.8, Q.Phú Nhuận, TP.HCM
            </p>

            <p>
              <strong>VP phía Nam:</strong><br />
              186A Nam Kỳ Khởi Nghĩa, TP.HCM
            </p>
          </div>

          <div className="col-md-2">
            <h6 className="footer-title">GIỚI THIỆU</h6>
            <ul className="footer-list">
              <li>Giới thiệu</li>
              <li>Blog</li>
              <li>Hệ thống cửa hàng</li>
              <li>Liên hệ</li>
              <li>Chính sách bảo mật</li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6 className="footer-title">HỖ TRỢ KHÁCH HÀNG</h6>
            <ul className="footer-list">
              <li>Hỏi đáp</li>
              <li>Khách hàng thân thiết</li>
              <li>Vận chuyển</li>
              <li>Chọn kích cỡ</li>
              <li>Thanh toán</li>
              <li>Đổi hàng</li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6 className="footer-title">KẾT NỐI</h6>

            <div className="d-flex gap-3 mb-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <img src={facebookIcon} alt="Facebook" className="social-icon" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <img src={instargramIcon} alt="Instagram" className="social-icon" />
              </a>
            </div>

            <h6 className="footer-title">THANH TOÁN</h6>
            <div className="d-flex flex-wrap gap-2">
              <div className="payment-box">VISA</div>
              <div className="payment-box">MASTER</div>
              <div className="payment-box">JCB</div>
              <div className="payment-box">ATM</div>
            </div>
          </div>

        </div>

        <hr className="footer-divider" />

        <p className="footer-copy">
          © {new Date().getFullYear()} fashionShop. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
