import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import SieuTietKiem from "./pages/SieuTietKiem";
import HangMoiVe from "./pages/HangMoiVe";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/combo-sieu-tiet-kiem" element={<SieuTietKiem />} />
          <Route path="/hang-moi-ve" element={<HangMoiVe />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
