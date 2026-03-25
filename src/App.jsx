import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import SieuTietKiem from "./pages/SieuTietKiem";
import HangMoiVe from "./pages/HangMoiVe";
import HangMoiVe2 from "./pages/HangMoiVe2";
import UuDai from "./pages/UuDai";
import GioHang from "./pages/GioHang";
import ProductDetail from "./components/ProductDetail";
import DanhMucPage from "./pages/DanhMuc";
import { CartProvider } from "./context/CartContext";
function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/combo-sieu-tiet-kiem" element={<SieuTietKiem />} />
            <Route path="/hang-moi-ve" element={<HangMoiVe />} />
            <Route path="/hang-moi-ve-2" element={<HangMoiVe2 />} />
            <Route path="/uu-dai" element={<UuDai />} />
            <Route path="/gio-hang" element={<GioHang />} />
            <Route path="/san-pham/:id" element={<ProductDetail />} />
            <Route path="/:slug" element={<DanhMucPage />} />
            <Route path="/:gioiTinh/:slug" element={<DanhMucPage />} />
          </Routes>
        </MainLayout>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
