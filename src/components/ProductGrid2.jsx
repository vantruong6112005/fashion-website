import { useMemo, useState } from "react";
import "../css/ProductGrid.css";
import ActiveFilterTags from "./ActiveFilterTags";
import ProductCard from "./ProductCard2";

const ITEMS_PER_PAGE = 18;

const ProductGrid2 = ({
  products,
  sortBy,
  setSortBy,
  activeFilters,
  toggleFilter,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil((products?.length ?? 0) / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return products?.slice(start, start + ITEMS_PER_PAGE) ?? [];
  }, [products, safeCurrentPage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages],
  );

  return (
    <div className="product-grid d-flex flex-column flex-fill">
      <div className="d-flex justify-content-between align-items-center pb-3">
        {/* <span className="small text-muted">{products.length} sản phẩm</span> */}
        <ActiveFilterTags
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
        />
        <div className="d-flex align-items-center gap-2">
          <span>Sắp xếp:</span>
          <select
            className="form-select form-select-sm w-auto"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Mặc định</option>
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá thấp → cao</option>
            <option value="price_desc">Giá cao → thấp</option>
            <option value="discount">Khuyến mãi nhiều nhất</option>
            <option value="ban_chay">Bán chạy nhất</option>
            <option value="danh_gia">Được đánh giá cao</option>
          </select>
        </div>
      </div>

      <div className="row g-3">
        {paginatedProducts.map((p) => (
          <div key={p._id} className="col-sm-6 col-lg-4">
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="d-flex align-items-center justify-content-center gap-2 mt-4 flex-wrap">
          <button
            className="btn btn-outline-dark"
            disabled={safeCurrentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Trước
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              className={`btn ${page === safeCurrentPage ? "btn-dark" : "btn-outline-dark"}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="btn btn-outline-dark"
            disabled={safeCurrentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};
export default ProductGrid2;
