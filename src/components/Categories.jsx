import '../CSS/categories.css'

export default function Categories() {
  return (
    <section className="categories">

      <div className="container">

        <div className="row g-4">

          <div className="col-md-3">
            <div className="category-card">
              <h3>Quần âu</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="category-card">
              <h3>Veston</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="category-card">
              <h3>Jeans</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="category-card">
              <h3>Thể thao</h3>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
