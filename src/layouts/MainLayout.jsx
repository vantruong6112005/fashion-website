import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import Header2 from "../components/Header2";

function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function MainLayout({ children }) {
  return (
    <>
      <ScrollReset />
      {/* <Header /> */}
      <Header2 />
      <Breadcrumb />
      {children}
      <Footer />
    </>
  );
}
