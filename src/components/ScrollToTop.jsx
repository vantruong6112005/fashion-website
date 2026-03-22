import { useState, useEffect } from "react";
import "../css/ScrollToTop.css";

export default function ScrollToTop({ threshold = 300 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  // setState true false và định dạng trong css
  return (
    <button
      className={`scroll-to-top${visible ? " scroll-to-top--visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Lên đầu trang"
    >
      ^
    </button>
  );
}
