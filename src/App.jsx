import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SieuTietKiem from "./pages/SieuTietKiem"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/combo-sieu-tiet-kiem" element={<SieuTietKiem />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
