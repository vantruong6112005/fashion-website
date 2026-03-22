// Hien thi sao danh gia tong quan cua san pham.
export default function StarRating({ score, count }) {
  return (
    <div className="pd-stars d-flex align-items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20">
          <polygon
            points="10,1 12.9,7 19.5,7.6 14.8,11.8 16.5,18.5 10,14.8 3.5,18.5 5.2,11.8 0.5,7.6 7.1,7"
            fill={i <= Math.round(score) ? "#f59e0b" : "#e5e7eb"}
          />
        </svg>
      ))}
      <span className="pd-stars__text">
        {score} ({count} đánh giá)
      </span>
    </div>
  );
}
