import { products } from '../data/products'
import ProductCard from './ProductCard'

export default function FeaturedProducts() {
  return (
    <div className="container my-5">
      <h3 className="mb-4">Sản phẩm nổi bật</h3>

      <div className="row g-4">
        {products.map(p => (
          <div className="col-md-4" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
