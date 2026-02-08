import { useState } from "react";
import products from "../data/products";

const PAGE_SIZE = 9;

export default function ProductGrid() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);

  const start = (page - 1) * PAGE_SIZE;
  const currentProducts = products.slice(start, start + PAGE_SIZE);

  return (
    <>
      <div className="product-grid">
        {currentProducts.map(p => (
          <div key={p.id} className="product-card">
            <img src={p.image} />
            <h4>{p.name}</h4>
            <p>{p.price}đ</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={page === i + 1 ? "active" : ""}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );
}
