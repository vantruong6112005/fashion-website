import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";

function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function MainLayout({ children }) {
  const { pathname } = useLocation();
  const isBannerPage =
    pathname === "/hang-moi-ve" ||
    pathname === "/uu-dai" ||
    pathname === "/admin" ||
    pathname === "/bo-suu-tap" ||
    pathname.startsWith("/bo-suu-tap/");

  return (
    <>
      <ScrollReset />
      <Header />
      {!isBannerPage && <Breadcrumb />}
      {children}
      <Footer />
    </>
  );
}
