import '../CSS/header.css'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">

        {/* LEFT: LOGO */}
        <div className="header-left">
          <span className="logo">NGUYỄN VĂN TRƯỜNG</span>
        </div>

        {/* CENTER: MENU */}
        <nav className="header-center">
          <ul className="nav-menu">
            <li>Hàng mới</li>
            <li>Áo</li>
            <li>Quần</li>
            <li>Phụ kiện</li>
            <li>Ưu đãi</li>
          </ul>
        </nav>

        {/* RIGHT: ICONS */}
        <div className="header-right">
          <i className="bi bi-search"></i>
          <i className="bi bi-person"></i>
          <i className="bi bi-bag"></i>
        </div>

      </div>
    </header>
  )
}
