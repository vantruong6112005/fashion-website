export default function ProductCard({ product }) {
  return (
    <div className="card h-100 p-3">
      <div className="text-center mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="img-fluid"
        />
      </div>

      <h6 className="fw-semibold">{product.name}</h6>
      <p className="mb-2">
        {product.price.toLocaleString()}đ
      </p>

      <button className="btn btn-outline-dark btn-sm">
        Xem chi tiết
      </button>
    </div>
  )
}
