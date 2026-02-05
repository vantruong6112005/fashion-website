import { useState } from 'react'
import { products } from '../data/products'
import ProductCard from './ProductCard'

export default function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter(p => p.category === activeCategory)

  return (
    <div className="container my-5">
      <h3 className="mb-4">Sản phẩm nổi bật</h3>

      {/* Tabs lọc */}
      <div className="mb-4 d-flex gap-2 flex-wrap">
        <button
          className={`btn btn-outline-dark ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          Tất cả
        </button>

        <button
          className={`btn btn-outline-dark ${activeCategory === 'ao' ? 'active' : ''}`}
          onClick={() => setActiveCategory('ao')}
        >
          Áo
        </button>

        <button
          className={`btn btn-outline-dark ${activeCategory === 'quan' ? 'active' : ''}`}
          onClick={() => setActiveCategory('quan')}
        >
          Quần
        </button>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="row g-4">
        {filteredProducts.map(p => (
          <div className="col-md-4" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
