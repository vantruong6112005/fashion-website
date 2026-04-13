import editIcon from "../../assets/images/icon/edit.svg";
import deleteIcon from "../../assets/images/icon/delete.svg";

function ReviewCard({
  review,
  isOwn,
  isEditingOwnReview,
  onEdit,
  onDelete,
  reviewSubmitting,
}) {
  return (
    <div
      className={`pd-review-card ${isOwn ? "pd-review-card--own" : ""} ${isOwn && isEditingOwnReview ? "pd-review-card--editing" : ""}`}
    >
      <div className="pd-review-card__header">
        <div className="pd-review-card__meta">
          <div className="pd-review-card__name">
            {review?.nguoiDung?.username || "Khách hàng"}
          </div>
          {isOwn && <div className="pd-review-card__badge">Của bạn</div>}
          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold">Đánh giá:</span>
            <div className="d-flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`pd-review-star ${i <= Number(review?.diemDanhGia || 0) ? "is-active" : ""}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
        <span className="pd-review-card__date">
          {new Date(review.ngayTao?.$date || review.ngayTao).toLocaleDateString(
            "vi-VN",
          )}
        </span>
      </div>
      <p className="pd-review-card__content">
        <span className="fw-semibold">Nhận xét:</span> {review.noiDung}
      </p>
      {isOwn && (
        <div className="pd-review-card__actions">
          <button
            type="button"
            className="pd-review-card__action-btn"
            onClick={onEdit}
            disabled={reviewSubmitting}
            title="Sửa đánh giá"
            aria-label="Sửa đánh giá"
          >
            <img src={editIcon} alt="edit" />
          </button>
          <button
            type="button"
            className="pd-review-card__action-btn pd-review-card__action-btn--delete"
            onClick={onDelete}
            disabled={reviewSubmitting}
            title="Xóa đánh giá"
            aria-label="Xóa đánh giá"
          >
            <img src={deleteIcon} alt="delete" />
          </button>
        </div>
      )}
    </div>
  );
}

function StarSidebarItem({ stars, count, total }) {
  const width = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="pd-reviews__bar-row">
      <span className="pd-reviews__bar-label">{stars}★</span>
      <div className="pd-reviews__bar-track">
        <span className="pd-reviews__bar-fill" style={{ width: `${width}%` }} />
      </div>
      <span className="pd-reviews__bar-count">{count}</span>
    </div>
  );
}

export default function ProductReviewsSection({
  product,
  totalReviewCount,
  reviewCountsByStar,
  reviews,
  ownReviewId,
  hasOwnReview,
  isEditingOwnReview,
  hasMoreReviews,
  loadingMoreReviews,
  onLoadMoreReviews,
  isAuthenticated,
  reviewRating,
  reviewHover,
  setReviewRating,
  setReviewHover,
  reviewComment,
  setReviewComment,
  onSubmitReview,
  editingReviewId,
  onCancelEditReview,
  onEditOwnReview,
  onDeleteOwnReview,
  reviewSubmitting,
  reviewError,
  reviewMessage,
}) {
  const currentStar = reviewHover || reviewRating;
  const shouldShowReviewForm = !hasOwnReview || isEditingOwnReview;

  return (
    <section className="pd-reviews mt-5">
      <h2 className="pd-reviews__heading">Đánh giá sản phẩm</h2>

      <div className="pd-reviews__summary">
        <div className="pd-reviews__score-col">
          <div className="pd-reviews__score-num">
            {Number(product.diemSoTrungBinh || 0).toFixed(1)}/5
          </div>
          <p className="pd-reviews__score-note">
            {totalReviewCount} đánh giá và nhận xét
          </p>
        </div>
        <div className="pd-reviews__bars-col">
          {[5, 4, 3, 2, 1].map((star) => (
            <StarSidebarItem
              key={star}
              stars={star}
              count={reviewCountsByStar[star]}
              total={totalReviewCount}
            />
          ))}
        </div>
      </div>

      {shouldShowReviewForm && (
        <form className="pd-review-form" onSubmit={onSubmitReview}>
          <div className="pd-review-form__row">
            <span className="pd-review-form__label">Đánh giá</span>
            <div className="pd-review-stars-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`pd-review-stars-input__star ${star <= currentStar ? "is-active" : ""}`}
                  onMouseEnter={() => setReviewHover(star)}
                  onMouseLeave={() => setReviewHover(0)}
                  onClick={() => setReviewRating(star)}
                  aria-label={`${star} sao`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="pd-review-form__row pd-review-form__row--column">
            <label
              className="pd-review-form__label"
              htmlFor="pd-review-comment"
            >
              Nhận xét
            </label>
            <textarea
              id="pd-review-comment"
              className="pd-review-form__textarea"
              rows={3}
              placeholder="Nhập nhận xét của bạn"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
          </div>

          {!isAuthenticated && (
            <div className="pd-review-form__hint">
              Vui lòng đăng nhập để gửi đánh giá.
            </div>
          )}
          {reviewError && (
            <div className="pd-review-form__error">{reviewError}</div>
          )}
          {reviewMessage && (
            <div className="pd-review-form__success">{reviewMessage}</div>
          )}

          <button
            type="submit"
            className="pd-review-form__submit"
            disabled={!isAuthenticated || reviewSubmitting}
          >
            {reviewSubmitting
              ? "Đang gửi..."
              : editingReviewId
                ? "Cập nhật đánh giá"
                : "Gửi đánh giá"}
          </button>
          {editingReviewId && (
            <button
              type="button"
              className="pd-review-form__cancel"
              onClick={onCancelEditReview}
              disabled={reviewSubmitting}
            >
              Hủy chỉnh sửa
            </button>
          )}
        </form>
      )}

      <div className="pd-reviews__list">
        {reviews.length === 0 ? (
          <p className="pd-reviews__empty">Chưa có đánh giá nào.</p>
        ) : (
          reviews.map((r, idx) => (
            <ReviewCard
              key={r.danhGiaId?.$oid || `${r.ngayTao || "review"}-${idx}`}
              review={r}
              isOwn={
                String(
                  r.danhGiaId?.$oid ||
                    r.danhGiaId ||
                    r._id?.$oid ||
                    r._id ||
                    "",
                ) === String(ownReviewId || "")
              }
              onEdit={onEditOwnReview}
              onDelete={onDeleteOwnReview}
              isEditingOwnReview={isEditingOwnReview}
              reviewSubmitting={reviewSubmitting}
            />
          ))
        )}

        {hasMoreReviews && (
          <button
            type="button"
            className="pd-reviews__more-btn"
            onClick={onLoadMoreReviews}
            disabled={loadingMoreReviews}
          >
            {loadingMoreReviews ? "Đang tải..." : "Xem thêm đánh giá"}
          </button>
        )}
      </div>
    </section>
  );
}
