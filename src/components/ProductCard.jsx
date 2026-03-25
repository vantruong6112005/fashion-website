import "../CSS/productcart.css";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
    });
  };

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
        <button className="btn btn-dark w-100" onClick={handleAddToCart}>
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
