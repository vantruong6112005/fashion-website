// Modal huong dan chon size va bang so do co ban.
export default function SizeGuideModal({ onClose }) {
  return (
    <div className="pd-modal-overlay" onClick={onClose}>
      <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pd-modal__header">
          <h3>Hướng dẫn chọn size</h3>
          <button className="pd-modal__close" onClick={onClose}>
            x
          </button>
        </div>
        <div className="pd-modal__body">
          <table className="pd-size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Vòng eo (cm)</th>
                <th>Chiều dài (cm)</th>
                <th>Cân nặng (kg)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["S", "68-72", "96", "50-60"],
                ["M", "72-76", "98", "60-70"],
                ["L", "76-82", "100", "70-80"],
                ["XL", "82-88", "102", "80-90"],
                ["2XL", "88-96", "104", "90-100"],
              ].map(([sz, ...vals]) => (
                <tr key={sz}>
                  <td>
                    <strong>{sz}</strong>
                  </td>
                  {vals.map((v, i) => (
                    <td key={i}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
