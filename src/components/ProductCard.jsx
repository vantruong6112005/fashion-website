import '../CSS/productcart.css'
export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />

        <div className="product-overlay">
          <button className="btn btn-dark">Xem chi tiết</button>
        </div>
      </div>

      <div className="product-info">
        <h5>{product.name}</h5>
        <p>{product.price.toLocaleString()}đ</p>
      </div>
    </div>
  )
}
