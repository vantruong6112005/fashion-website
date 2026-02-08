import ShopBanner from "../components/ShopBanner";
import ShopFilter from "../components/ShopFilter";
import ProductGrid from "../components/ProductGird";

import "../CSS/hangMoiVe.css";

export default function HangMoiVe() {
  return (
    <>
      <ShopBanner />

      <div className="shop-container">
        {/* LEFT FILTER */}
        <aside className="shop-sidebar">
          <ShopFilter />
        </aside>

        {/* RIGHT PRODUCTS */}
        <main className="shop-main">
          <div className="shop-toolbar">
            <span>76 sản phẩm</span>
            <div className="view-mode">⬛ ⬜</div>
          </div>

          <ProductGrid />
        </main>
      </div>
    </>
  );
}
