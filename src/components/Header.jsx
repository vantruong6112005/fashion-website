export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark header">
      <div className="container">

        {/* LOGO */}
        <a className="navbar-brand header-logo" href="#">
          FASHION WEBSITE
        </a>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENU */}
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav mx-auto gap-3">
            <li className="nav-item">
              <a className="nav-link active" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Men</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Women</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Sale</a>
            </li>
          </ul>

          {/* ICON */}
          <div className="header-icons">
            <i className="bi bi-search"></i>
            <i className="bi bi-person"></i>
            <i className="bi bi-bag"></i>
          </div>
        </div>

      </div>
    </nav>
  )
}
