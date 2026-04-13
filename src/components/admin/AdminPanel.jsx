import { useCallback, useEffect, useMemo, useState } from "react";
import { marked } from "marked";
import { API_BASE } from "../../api";
import { useAuth } from "../../context/AuthContext";
import AdminShell from "./AdminShell";
import AdminDashboard from "./AdminDashboard";
import AdminProductsTab from "./AdminProductsTab";
import AdminCollectionsTab from "./AdminCollectionsTab";
import AdminUsersTab from "./AdminUsersTab";
import AdminPromotionsTab from "./AdminPromotionsTab";
import AdminOffersTab from "./AdminOffersTab";
import {
  defaultCollectionForm,
  defaultOfferForm,
  defaultProductForm,
  defaultPromotionForm,
  extractId,
  toInputDate,
  toNumber,
} from "../../utils/adminUtils";
import "../../CSS/AdminPanel.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

export default function AdminPanel() {
  const { user, authFetch } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [globalSearch, setGlobalSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [productKeyword, setProductKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForm, setProductForm] = useState(defaultProductForm);

  const [userKeyword, setUserKeyword] = useState("");
  const [users, setUsers] = useState([]);

  const [collectionKeyword, setCollectionKeyword] = useState("");
  const [collections, setCollections] = useState([]);
  const [collectionForm, setCollectionForm] = useState(defaultCollectionForm);

  const [promotionKeyword, setPromotionKeyword] = useState("");
  const [promotions, setPromotions] = useState([]);
  const [promotionForm, setPromotionForm] = useState(defaultPromotionForm);

  const [offerKeyword, setOfferKeyword] = useState("");
  const [offers, setOffers] = useState([]);
  const [offerForm, setOfferForm] = useState(defaultOfferForm);
  const [offerCandidates, setOfferCandidates] = useState([]);

  const isAdmin = String(user?.role || "").toLowerCase() === "admin";

  const requestAdmin = useCallback(
    async (path, options = {}) =>
      authFetch(`${API_BASE}/admin${path}`, options),
    [authFetch],
  );

  const loadProducts = useCallback(
    async (keyword = "") => {
      const q = keyword.trim();
      const query = q ? `?q=${encodeURIComponent(q)}` : "";
      const data = await requestAdmin(`/products${query}`);
      setProducts(Array.isArray(data) ? data : []);
    },
    [requestAdmin],
  );

  const loadCategories = useCallback(async () => {
    const data = await authFetch(`${API_BASE}/danh-muc`);
    setCategories(Array.isArray(data) ? data : []);
  }, [authFetch]);

  const loadUsers = useCallback(
    async (keyword = "") => {
      const q = keyword.trim();
      const query = q ? `?q=${encodeURIComponent(q)}` : "";
      const data = await requestAdmin(`/users${query}`);
      setUsers(Array.isArray(data) ? data : []);
    },
    [requestAdmin],
  );

  const loadCollections = useCallback(
    async (keyword = "") => {
      const q = keyword.trim();
      const query = q ? `?q=${encodeURIComponent(q)}` : "";
      const data = await requestAdmin(`/collections${query}`);
      setCollections(Array.isArray(data) ? data : []);
    },
    [requestAdmin],
  );

  const loadPromotions = useCallback(
    async (keyword = "") => {
      const q = keyword.trim();
      const query = q ? `?q=${encodeURIComponent(q)}` : "";
      const data = await requestAdmin(`/promotions${query}`);
      setPromotions(Array.isArray(data) ? data : []);
    },
    [requestAdmin],
  );

  const loadOffers = useCallback(
    async (keyword = "") => {
      const q = keyword.trim();
      const query = q ? `?q=${encodeURIComponent(q)}` : "";
      const data = await requestAdmin(`/offers${query}`);
      setOffers(Array.isArray(data) ? data : []);
    },
    [requestAdmin],
  );

  const loadOfferCandidates = useCallback(
    async ({ excludeOfferId = "", q = "" }) => {
      const params = new URLSearchParams();
      if (excludeOfferId) params.set("excludeOfferId", excludeOfferId);
      if (q.trim()) params.set("q", q.trim());
      const data = await requestAdmin(
        `/offers/available-products?${params.toString()}`,
      );
      setOfferCandidates(Array.isArray(data) ? data : []);
    },
    [requestAdmin],
  );

  useEffect(() => {
    if (!isAdmin) return;

    const bootstrap = async () => {
      setLoading(true);
      setError("");
      try {
        await Promise.all([
          loadProducts(),
          loadCategories(),
          loadUsers(),
          loadCollections(),
          loadPromotions(),
          loadOffers(),
        ]);
      } catch (err) {
        setError(err.message || "Không thể tải dữ liệu quản trị");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [
    isAdmin,
    loadCollections,
    loadCategories,
    loadOffers,
    loadProducts,
    loadPromotions,
    loadUsers,
  ]);

  useEffect(() => {
    if (!isAdmin) return;
    loadOfferCandidates({
      excludeOfferId: offerForm._id,
      q: offerKeyword,
    }).catch(() => {
      setOfferCandidates([]);
    });
  }, [isAdmin, loadOfferCandidates, offerForm._id, offerKeyword]);

  const resetProductForm = () => {
    setSelectedProduct(null);
    setProductForm(defaultProductForm);
  };

  const handleUploadColorImages = async (colorIndex, files) => {
    if (!files || !files.length) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));
    formData.append("folder", productForm.slug || "san-pham-admin");

    try {
      const uploaded = await authFetch(`${API_BASE}/upload/san-pham`, {
        method: "POST",
        headers: {},
        body: formData,
      });

      const urls = Array.isArray(uploaded?.urls) ? uploaded.urls : [];
      if (!urls.length) return;

      setProductForm((prev) => ({
        ...prev,
        mauSanPham: prev.mauSanPham.map((mau, idx) =>
          idx === colorIndex
            ? { ...mau, images: [...(mau.images || []), ...urls] }
            : mau,
        ),
      }));
    } catch (err) {
      setError(err.message || "Upload ảnh thất bại");
    }
  };

  const productPayload = useMemo(() => {
    const htmlDescription = marked.parse(productForm.moTaMarkdown || "", {
      breaks: true,
    });
    return {
      tenSanPham: productForm.tenSanPham,
      slug: productForm.slug,
      gia: toNumber(productForm.gia, 0),
      danhMucId: Array.isArray(productForm.danhMucId)
        ? productForm.danhMucId
        : [],
      boSuuTapId: Array.isArray(productForm.boSuuTapId)
        ? productForm.boSuuTapId
        : [],
      gioiTinh: productForm.gioiTinh,
      chatLieu: productForm.chatLieu,
      kieuDang: productForm.kieuDang,
      tinhNang: productForm.tinhNang,
      baoQuan: productForm.baoQuan,
      moTa: String(htmlDescription || ""),
      isActive: Boolean(productForm.isActive),
      mauSanPham: productForm.mauSanPham,
      bienTheSanPham: productForm.bienTheSanPham.map((item) => ({
        ...item,
        soLuongTon: toNumber(item.soLuongTon, 0),
      })),
    };
  }, [productForm]);

  const saveProduct = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (productForm._id) {
        await requestAdmin(`/products/${productForm._id}`, {
          method: "PUT",
          body: JSON.stringify(productPayload),
        });
      } else {
        await requestAdmin("/products", {
          method: "POST",
          body: JSON.stringify(productPayload),
        });
      }
      await loadProducts(productKeyword);
      resetProductForm();
    } catch (err) {
      setError(err.message || "Không lưu được sản phẩm");
    }
  };

  const saveCollection = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        tenBoSuuTap: collectionForm.tenBoSuuTap,
        slogan: collectionForm.slogan,
        gioiThieu: collectionForm.gioiThieu,
        moTa: collectionForm.moTa,
        slug: collectionForm.slug,
        thumbnailImage: collectionForm.thumbnailImage,
        isActive: collectionForm.isActive,
      };
      if (collectionForm._id) {
        await requestAdmin(`/collections/${collectionForm._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await requestAdmin("/collections", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      await loadCollections(collectionKeyword);
      setCollectionForm(defaultCollectionForm);
    } catch (err) {
      setError(err.message || "Không lưu được bộ sưu tập");
    }
  };

  const savePromotion = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        maKhuyenMai: promotionForm.maKhuyenMai,
        donHangToiThieu: toNumber(promotionForm.donHangToiThieu, 0),
        loaiGiamGia: promotionForm.loaiGiamGia,
        giaTri: toNumber(promotionForm.giaTri, 0),
        giamToiDa: promotionForm.giamToiDa
          ? toNumber(promotionForm.giamToiDa, 0)
          : undefined,
        gioiHanSoLuong: promotionForm.gioiHanSoLuong
          ? toNumber(promotionForm.gioiHanSoLuong, 0)
          : undefined,
        gioiHanMoiUser: promotionForm.gioiHanMoiUser
          ? toNumber(promotionForm.gioiHanMoiUser, 0)
          : undefined,
        ngayBatDau: promotionForm.ngayBatDau || undefined,
        ngayKetThuc: promotionForm.ngayKetThuc || undefined,
        isActive: promotionForm.isActive,
      };
      if (promotionForm._id) {
        await requestAdmin(`/promotions/${promotionForm._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await requestAdmin("/promotions", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      await loadPromotions(promotionKeyword);
      setPromotionForm(defaultPromotionForm);
    } catch (err) {
      setError(err.message || "Không lưu được khuyến mãi");
    }
  };

  const deletePromotion = async (id) => {
    setError("");
    try {
      await requestAdmin(`/promotions/${id}`, { method: "DELETE" });
      await loadPromotions(promotionKeyword);
    } catch (err) {
      setError(err.message || "Không xóa được khuyến mãi");
    }
  };

  const saveOffer = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        tenUuDai: offerForm.tenUuDai,
        dateRange: {
          start: offerForm.dateStart,
          end: offerForm.dateEnd,
        },
        chonSanPhamNgauNhien: offerForm.chonSanPhamNgauNhien,
        soLuongSanPhamNgauNhien: toNumber(offerForm.soLuongSanPhamNgauNhien, 1),
        phanTramGiamToiDa: toNumber(offerForm.phanTramGiamToiDa, 0),
        caNgay: offerForm.caNgay,
        timeRange: {
          start: offerForm.timeStart,
          end: offerForm.timeEnd,
        },
        isActive: offerForm.isActive,
        sanPhamUuDai: offerForm.sanPhamUuDai.map((item) => ({
          sanPhamId: item.sanPhamId,
          giaUuDai: toNumber(item.giaUuDai, 0),
          soLuongToiDa: toNumber(item.soLuongToiDa, 9999),
        })),
      };
      if (offerForm._id) {
        await requestAdmin(`/offers/${offerForm._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await requestAdmin("/offers", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      await loadOffers(offerKeyword);
      setOfferForm(defaultOfferForm);
    } catch (err) {
      setError(err.message || "Không lưu được ưu đãi");
    }
  };

  const deleteOffer = async (id) => {
    setError("");
    try {
      await requestAdmin(`/offers/${id}`, { method: "DELETE" });
      await loadOffers(offerKeyword);
    } catch (err) {
      setError(err.message || "Không xóa được ưu đãi");
    }
  };

  const fillOfferForEdit = (offer) => {
    setOfferForm({
      _id: extractId(offer),
      tenUuDai: offer?.tenUuDai || "",
      dateStart: toInputDate(offer?.dateRange?.start),
      dateEnd: toInputDate(offer?.dateRange?.end),
      chonSanPhamNgauNhien: false,
      soLuongSanPhamNgauNhien: 5,
      phanTramGiamToiDa: 30,
      caNgay: offer?.caNgay !== false,
      timeStart: offer?.timeRange?.start || "00:00",
      timeEnd: offer?.timeRange?.end || "23:59",
      isActive: offer?.isActive !== false,
      sanPhamUuDai: Array.isArray(offer?.sanPhamUuDai)
        ? offer.sanPhamUuDai.map((item) => ({
            sanPhamId: extractId(item?.sanPhamId),
            giaGoc: item?.giaGoc?.$numberDecimal || item?.giaGoc || 0,
            giaUuDai: item?.giaUuDai?.$numberDecimal || item?.giaUuDai || 0,
            soLuongToiDa: item?.soLuongToiDa || 9999,
          }))
        : [],
    });
    setActiveTab("offers");
  };

  const stats = {
    products: products.length,
    collections: collections.length,
    users: users.length,
    promotions: promotions.length,
    offers: offers.length,
  };

  const handleGlobalSearch = async (e) => {
    e.preventDefault();
    const q = globalSearch.trim();
    if (activeTab === "products") {
      setProductKeyword(q);
      await loadProducts(q);
    }
    if (activeTab === "collections") {
      setCollectionKeyword(q);
      await loadCollections(q);
    }
    if (activeTab === "users") {
      setUserKeyword(q);
      await loadUsers(q);
    }
    if (activeTab === "promotions") {
      setPromotionKeyword(q);
      await loadPromotions(q);
    }
    if (activeTab === "offers") {
      setOfferKeyword(q);
      await loadOffers(q);
    }
  };

  if (!isAdmin) {
    return (
      <section className="container py-5">
        <div className="alert alert-warning mb-0">
          Bạn không có quyền truy cập khu vực quản trị.
        </div>
      </section>
    );
  }

  return (
    <section className="admin-panel">
      {error && <div className="alert alert-danger mb-3">{error}</div>}
      {loading && (
        <div className="alert alert-secondary mb-3">Đang tải dữ liệu...</div>
      )}

      <AdminShell
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        searchValue={globalSearch}
        onSearchValueChange={setGlobalSearch}
        onSearchSubmit={handleGlobalSearch}
      >
        {activeTab === "dashboard" && (
          <AdminDashboard stats={stats} onChangeTab={setActiveTab} />
        )}

        {activeTab === "products" && (
          <AdminProductsTab
            products={products}
            productKeyword={productKeyword}
            setProductKeyword={setProductKeyword}
            loadProducts={loadProducts}
            categories={categories}
            collections={collections}
            productForm={productForm}
            setProductForm={setProductForm}
            saveProduct={saveProduct}
            resetProductForm={resetProductForm}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            handleUploadColorImages={handleUploadColorImages}
          />
        )}

        {activeTab === "collections" && (
          <AdminCollectionsTab
            collections={collections}
            collectionKeyword={collectionKeyword}
            setCollectionKeyword={setCollectionKeyword}
            loadCollections={loadCollections}
            collectionForm={collectionForm}
            setCollectionForm={setCollectionForm}
            saveCollection={saveCollection}
          />
        )}

        {activeTab === "users" && (
          <AdminUsersTab
            users={users}
            userKeyword={userKeyword}
            setUserKeyword={setUserKeyword}
            loadUsers={loadUsers}
          />
        )}

        {activeTab === "promotions" && (
          <AdminPromotionsTab
            promotions={promotions}
            promotionKeyword={promotionKeyword}
            setPromotionKeyword={setPromotionKeyword}
            loadPromotions={loadPromotions}
            promotionForm={promotionForm}
            setPromotionForm={setPromotionForm}
            savePromotion={savePromotion}
            deletePromotion={deletePromotion}
          />
        )}

        {activeTab === "offers" && (
          <AdminOffersTab
            offers={offers}
            offerKeyword={offerKeyword}
            setOfferKeyword={setOfferKeyword}
            loadOffers={loadOffers}
            offerForm={offerForm}
            setOfferForm={setOfferForm}
            saveOffer={saveOffer}
            deleteOffer={deleteOffer}
            fillOfferForEdit={fillOfferForEdit}
            offerCandidates={offerCandidates}
          />
        )}
      </AdminShell>
    </section>
  );
}
