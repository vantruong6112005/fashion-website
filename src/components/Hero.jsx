import hero1 from '../assets/images/hero/hero1.png'
import hero2 from '../assets/images/hero/hero2.png'
import hero3 from '../assets/images/hero/hero3.png'

export default function Hero() {
  return (
    <div
      id="heroCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
    >

      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide-to="0"
          className="active"
        ></button>
        <button
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide-to="1"
        ></button>
        <button
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide-to="2"
        ></button>
      </div>

      {/* slides */}
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={hero1} className="d-block w-100" alt="Hero 1" />
          <div className="carousel-caption d-none d-md-block">
            <h2></h2>
            <button className="btn btn-light">Xem thêm</button>
          </div>
        </div>

        <div className="carousel-item">
          <img src={hero2} className="d-block w-100" alt="Hero 2" />
          <div className="carousel-caption d-none d-md-block">
            <h2>VESTON LỊCH LÃM</h2>
            <button className="btn btn-light">Xem thêm</button>
          </div>
        </div>

        <div className="carousel-item">
          <img src={hero3} className="d-block w-100" alt="Hero 3" />
          <div className="carousel-caption d-none d-md-block">
            <h2>PHONG CÁCH DOANH NHÂN</h2>
            <button className="btn btn-light">Xem thêm</button>
          </div>
        </div>
      </div>

      {/* controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  )
}
