import { useState } from "react";

// Khoi accordion don gian cho tung nhom thong tin.
function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="pd-accordion">
      <button
        className="pd-accordion__toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
      </button>
      {open && <div className="pd-accordion__body">{children}</div>}
    </div>
  );
}

export default function ProductInfoAccordions({ product }) {
  // Dieu khien trang thai xem them/thu gon cua mo ta chi tiet.
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <div className="pd-accordions pd-accordions--below mt-4">
      <AccordionItem title="Thông tin sản phẩm" defaultOpen>
        <ul className="pd-info-list">
          {product.chatLieu && (
            <li>
              <strong>Chất liệu:</strong> {product.chatLieu}
            </li>
          )}
          {product.kieuDang && (
            <li>
              <strong>Kiểu dáng:</strong> {product.kieuDang}
            </li>
          )}
          {product.gioiTinh && (
            <li>
              <strong>Giới tính:</strong> {product.gioiTinh}
            </li>
          )}
          {product.tinhNang && (
            <li>
              <strong>Tính năng:</strong> {product.tinhNang}
            </li>
          )}
          {product.phuHopVoi?.length > 0 && (
            <li>
              <strong>Phù hợp:</strong> {product.phuHopVoi.join(", ")}
            </li>
          )}
        </ul>
      </AccordionItem>

      <AccordionItem title="Hướng dẫn bảo quản">
        <p className="pd-care">
          {product.baoQuan ||
            "Giặt máy ở nhiệt độ thường, không dùng chất tẩy mạnh."}
        </p>
      </AccordionItem>

      <div className="pd-description-section">
        <h3 className="pd-description-title">Mô tả chi tiết</h3>
        <div className="pd-description-wrap">
          <div
            className={`pd-description ${isDescriptionExpanded ? "" : "pd-description--collapsed"}`}
            dangerouslySetInnerHTML={{ __html: product.moTa }}
          />

          <button
            type="button"
            className="pd-description__toggle"
            onClick={() => setIsDescriptionExpanded((prev) => !prev)}
          >
            {isDescriptionExpanded ? "Thu gọn" : "Xem thêm"}
          </button>
        </div>
      </div>
    </div>
  );
}
