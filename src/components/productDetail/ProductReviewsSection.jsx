import starIcon from "../../assets/images/icon/star.svg";

// Render tung the danh gia cua khach hang.
function ReviewCard({ review }) {
  return (
    <div className="pd-review-card">
      <div className="pd-review-card__header">
        <img
          src={review.nguoiDung.anhDaiDien || "/no-avatar.png"}
          alt={review.nguoiDung.username}
          className="pd-review-card__avatar"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.nguoiDung.username)}&background=111&color=fff&size=40`;
          }}
        />
        <div>
          <div className="pd-review-card__name">
            {review.nguoiDung.username}
          </div>
          <div className="d-flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} width="12" height="12" viewBox="0 0 20 20">
                <polygon
                  points="10,1 12.9,7 19.5,7.6 14.8,11.8 16.5,18.5 10,14.8 3.5,18.5 5.2,11.8 0.5,7.6 7.1,7"
                  fill={i <= review.diemDanhGia ? "#f59e0b" : "#e5e7eb"}
                />
              </svg>
            ))}
          </div>
        </div>
        <span className="pd-review-card__date ms-auto">
          {new Date(review.ngayTao?.$date || review.ngayTao).toLocaleDateString(
            "vi-VN",
          )}
        </span>
      </div>
      <p className="pd-review-card__content">{review.noiDung}</p>
    </div>
  );
}

// Render thong ke so luong danh gia theo tung muc sao.
function StarSidebarItem({ stars, count }) {
  return (
    <div className="pd-reviews__sidebar-row">
      <span className="pd-reviews__sidebar-stars-num">{stars}</span>
      <div className="pd-reviews__sidebar-stars-icons" aria-hidden="true">
        {Array.from({ length: stars }, (_, i) => (
          <img key={`${stars}-${i}`} src={starIcon} alt="" />
        ))}
      </div>
      <span className="pd-reviews__sidebar-count">({count})</span>
    </div>
  );
}

// Hien thi khu vuc tong hop va danh sach danh gia co phan trang.
export default function ProductReviewsSection({
  product,
  totalReviewCount,
  reviewCountsByStar,
  fitPercent,
  reviewStartIndex,
  reviewEndIndex,
  pagedReviews,
  totalReviewPages,
  safeReviewPage,
  setCurrentReviewPage,
}) {
  return (
    <section className="pd-reviews mt-5">
      <div className="pd-reviews__body">
        <aside className="pd-reviews__sidebar">
          <h3 className="pd-reviews__sidebar-title">Phân loại đánh giá</h3>
          {[5, 4, 3, 2, 1].map((star) => (
            <StarSidebarItem
              key={star}
              stars={star}
              count={reviewCountsByStar[star]}
            />
          ))}
        </aside>

        <div className="pd-reviews__main">
          <div className="pd-reviews__overview">
            <h2 className="pd-reviews__heading">Đánh giá sản phẩm</h2>

            <div className="pd-reviews__score-wrap">
              <span className="pd-reviews__score-num">
                {Number(product.diemSoTrungBinh || 0).toFixed(1)}
              </span>
              <div>
                <div className="pd-reviews__score-stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} width="32" height="32" viewBox="0 0 20 20">
                      <polygon
                        points="10,1 12.9,7 19.5,7.6 14.8,11.8 16.5,18.5 10,14.8 3.5,18.5 5.2,11.8 0.5,7.6 7.1,7"
                        fill={
                          i <= Math.round(Number(product.diemSoTrungBinh || 0))
                            ? "#f5b301"
                            : "#e5e7eb"
                        }
                      />
                    </svg>
                  ))}
                </div>
                <p className="pd-reviews__score-note">
                  Dựa trên {totalReviewCount} đánh giá từ khách hàng
                </p>
              </div>
            </div>

            <div className="pd-reviews__fit">
              <h3 className="pd-reviews__fit-title">Phù hợp với cơ thể</h3>
              {[
                { key: "tight", label: "Chật" },
                { key: "fit", label: "Đúng kích thước" },
                { key: "loose", label: "Rộng" },
              ].map((item) => (
                <div key={item.key} className="pd-reviews__fit-row">
                  <span className="pd-reviews__fit-label">{item.label}</span>
                  <div className="pd-reviews__fit-bar">
                    <span
                      className="pd-reviews__fit-fill"
                      style={{ width: `${fitPercent[item.key]}%` }}
                    />
                  </div>
                  <span className="pd-reviews__fit-value">
                    {fitPercent[item.key]}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pd-reviews__toolbar">
            <span className="pd-reviews__showing">
              Hiển thị đánh giá {reviewStartIndex + 1}-{reviewEndIndex}
            </span>
          </div>

          <div className="pd-reviews__list">
            {pagedReviews.map((r, idx) => (
              <ReviewCard
                key={r.danhGiaId?.$oid || `${r.ngayTao || "review"}-${idx}`}
                review={r}
              />
            ))}
          </div>

          {totalReviewPages > 1 && (
            <div className="pd-reviews__pagination">
              <button
                className="pd-reviews__page-btn"
                onClick={() => setCurrentReviewPage((p) => Math.max(1, p - 1))}
                disabled={safeReviewPage === 1}
              >
                Trước
              </button>

              {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`pd-reviews__page-btn ${page === safeReviewPage ? "pd-reviews__page-btn--active" : ""}`}
                    onClick={() => setCurrentReviewPage(page)}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                className="pd-reviews__page-btn"
                onClick={() =>
                  setCurrentReviewPage((p) => Math.min(totalReviewPages, p + 1))
                }
                disabled={safeReviewPage === totalReviewPages}
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
