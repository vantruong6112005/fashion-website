import { useState } from 'react'
import { products } from '../data/products'
import ProductCard from './ProductCard'

export default function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter(p => p.category === activeCategory)

  const bestSellers = products.filter(p => p.isBestSeller)

  return (
    <div className="container mt-5 mb-0">

      {/* ===== SẢN PHẨM NỔI BẬT ===== */}
      <h3 className="mb-3">Sản phẩm nổi bật</h3>

      <div className="mb-3 d-flex gap-2 flex-wrap">
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

      <div className="row g-4 mb-5">
  {filteredProducts.length > 0 ? (
    filteredProducts.map(p => (
      <div className="col-12 col-sm-6 col-md-4" key={p.id}>
        <ProductCard product={p} />
      </div>
    ))
  ) : (
    <div className="col-12 text-center py-5">
      <p className="text-muted mb-0">
        Không có sản phẩm trong danh mục này
      </p>
    </div>
  )}
</div>


      {/* ===== SẢN PHẨM BÁN CHẠY ===== */}
      <h3 className="mt-4 mb-3">Sản phẩm bán chạy</h3>

      <div className="row g-4 mb-4">
        {bestSellers.map(p => (
          <div className="col-md-4" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>

    </div>
  )
}
