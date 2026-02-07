import "../CSS/header.css";
import searchIcon from "../assets/images/icon/search-interface-symbol.png";
import cartIcon from "../assets/images/icon/shopping-cart.png";
import userIcon from "../assets/images/icon/user.png";
import aoThun from '../assets/images/Ao/ao.png';
import pk1 from"../assets/images/phuKien/pk1.png";
import quan3 from"../assets/images/quan/quan.png";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">

        {/* LEFT */}
        <div className="header-left">
          <span className="logo">FASHION-SHOP</span>
        </div>

        {/* CENTER */}
        <nav className="header-center">
          <ul className="nav-menu">

            <li className="nav-item">
               <Link to="/combo-sieu-tiet-kiem" className="nav-link">
    Combo siêu tiết kiệm
       </Link>
  </li>
            <li className="nav-item">Hàng mới về</li>
<li className="nav-item mega-dropdown">
  Áo
  <div className="mega-menu">
    <div className="mega-inner mega-has-banner">

      <div className="mega-content">
        <div className="mega-column">
          <h4>Áo</h4>
          <div className="mega-item">Áo sơ mi</div>
          <div className="mega-item">Áo polo</div>
          <div className="mega-item">Áo T-Shirt</div>
        </div>

        <div className="mega-column">
          <h4>Khoác</h4>
          <div className="mega-item">Áo jacket</div>
          <div className="mega-item">Áo blazer</div>
          <div className="mega-item">Áo len</div>
          <div className="mega-item">Áo nỉ</div>
        </div>
      </div>

      <div className="mega-banner">
        <img src={aoThun} alt="Áo nam" />
        <div className="mega-banner-text">
        </div>
      </div>

    </div>
  </div>
</li>
<li className="nav-item mega-dropdown">
  Quần
  <div className="mega-menu">
    <div className="mega-inner mega-has-banner">

      <div className="mega-content">
        <div className="mega-column">
          {/* <h4>Quần</h4> */}
          <div className="mega-item"></div>
          <div className="mega-item"></div>
          <div className="mega-item"></div>
          <div className="mega-item"></div>
        </div>
        <div className="mega-column">
          <h4>Quần</h4>
          <div className="mega-item">Quần jean</div>
          <div className="mega-item">Quần tây</div>
          <div className="mega-item">Quần kaki</div>
          <div className="mega-item">Quần short</div>
        </div>
      </div>

      <div className="mega-banner">
        <img src={quan3} alt="Quần nam" />
        <div className="mega-banner-text">
         
        </div>
      </div>

    </div>
  </div>
</li>
<li className="nav-item mega-dropdown">
  Phụ kiện
  <div className="mega-menu">
    <div className="mega-inner mega-has-banner">

      {/* TEXT */}
      <div className="mega-content">
        <div className="mega-column">
          <h4>Phụ kiện</h4>
          <div className="mega-item">Dây lưng</div>
          <div className="mega-item">Ví da</div>
          <div className="mega-item">Giày</div>
  
        </div> 
        <div className="mega-column">
           <h4>Phụ kiện</h4>
           <div className="mega-item">Tất</div>
          <div className="mega-item">Cà vạt</div>
          <div className="mega-item">Balo</div>
          <div className="mega-item">Nón</div>
        </div>
      </div>

      {/* IMAGE */}
      <div className="mega-banner">
        <img src={pk1} alt="Phụ kiện nam" />
        <div className="mega-banner-text">
        </div>
      </div>

    </div>
  </div>
</li>


            <li className="nav-item">Ưu đãi</li>
            <li className="nav-item">Giới thiệu cửa hàng</li>
          </ul>
        </nav>

        {/* RIGHT */}
        <div className="header-right">
          <button className="icon-btn">
            <img src={searchIcon} alt="search" />
          </button>
          <button className="icon-btn">
            <img src={cartIcon} alt="cart" />
          </button>
          <button className="icon-btn">
            <img src={userIcon} alt="user" />
          </button>
        </div>

      </div>
    </header>
  );
}
