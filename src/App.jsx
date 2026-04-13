import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import HangMoiVe from "./pages/HangMoiVe";
import UuDai from "./pages/UuDai";
import GioHang from "./pages/GioHang";
import Checkout from "./pages/Checkout";
import DonHangCuaToi from "./pages/DonHangCuaToi";
import ProductDetail from "./components/productDetail/ProductDetail";
import DanhMucPage from "./pages/DanhMuc";
import BoSuuTapPage from "./pages/BoSuuTap";
import BoSuuTapDetailPage from "./pages/BoSuuTapDetail";
import AdminPanel from "./components/admin/AdminPanel";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hang-moi-ve" element={<HangMoiVe />} />
              <Route path="/uu-dai" element={<UuDai />} />
              <Route path="/gio-hang" element={<GioHang />} />
              <Route path="/thanh-toan" element={<Checkout />} />
              <Route path="/thanh-toan/momo/return" element={<Checkout />} />
              <Route path="/don-hang" element={<DonHangCuaToi />} />
              <Route path="/bo-suu-tap" element={<BoSuuTapPage />} />
              <Route
                path="/bo-suu-tap/:slug"
                element={<BoSuuTapDetailPage />}
              />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/san-pham/:id" element={<ProductDetail />} />
              <Route path="/:slug" element={<DanhMucPage />} />
              <Route path="/:gioiTinh/:slug" element={<DanhMucPage />} />
            </Routes>
          </MainLayout>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
