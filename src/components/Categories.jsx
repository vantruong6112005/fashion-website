export default function Categories() {
  return (
    <div className="container my-5">
      <div className="row g-4">
        {['Quần âu', 'Veston', 'Jeans', 'Thể thao'].map((c) => (
          <div className="col-md-3" key={c}>
            <div className="card text-center p-4">
              <h5>{c}</h5>
              <button className="btn btn-outline-dark btn-sm mt-2">
                Xem thêm
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
