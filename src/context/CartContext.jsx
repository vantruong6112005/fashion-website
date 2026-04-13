/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { API_BASE } from "../api";
import { resolveImageUrl, toApiRelativeImage } from "../utils/image";

const CartContext = createContext(null);
const GUEST_CART_STORAGE_KEY = "fashion_guest_cart_v1";

const readGuestCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeGuestCart = (items) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      GUEST_CART_STORAGE_KEY,
      JSON.stringify(Array.isArray(items) ? items : []),
    );
  } catch {
    // Bo qua loi luu localStorage cua gio khach.
  }
};

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = user?._id?.$oid || user?._id || "";

  const refreshCarts = useCallback(async () => {
    if (!userId) {
      const guestItems = readGuestCart();
      setCart({ _id: null, isGuest: true, sanPhamTrongGio: guestItems });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/gio-hang/nguoi-dung/${userId}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];

      if (!list.length) {
        const createdRes = await fetch(
          `${API_BASE}/gio-hang/nguoi-dung/${userId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tenGioHang: "Gio hang mac dinh" }),
          },
        );
        const created = await createdRes.json();
        setCart(created?._id ? created : null);
      } else {
        setCart(list.find((x) => x.isDangSuDung) || list[0] || null);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshCarts().catch(() => setCart(null));
  }, [refreshCarts]);

  const activeCart = cart;

  const subtotal = useMemo(
    () =>
      (activeCart?.sanPhamTrongGio || []).reduce(
        (sum, item) =>
          sum +
          Number(item.gia?.$numberDecimal ?? item.gia ?? 0) *
            Number(item.soLuong || 0),
        0,
      ),
    [activeCart],
  );

  const totalItems = useMemo(
    () =>
      (activeCart?.sanPhamTrongGio || []).reduce(
        (sum, item) => sum + Number(item.soLuong || 0),
        0,
      ),
    [activeCart],
  );

  const ensureActiveCart = useCallback(async () => {
    if (!userId) {
      const guestItems = readGuestCart();
      return { _id: null, isGuest: true, sanPhamTrongGio: guestItems };
    }

    if (activeCart?._id) return activeCart;

    const createdRes = await fetch(
      `${API_BASE}/gio-hang/nguoi-dung/${userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenGioHang: "Gio hang mac dinh" }),
      },
    );
    const created = await createdRes.json();
    await refreshCarts();
    return created;
  }, [activeCart, refreshCarts, userId]);

  const addToCart = useCallback(
    async (item) => {
      if (!userId) {
        const guestItems = readGuestCart();
        const maSKU =
          item.maSKU ||
          `${item.productId}_${item.colorCode || "NONE"}_${item.size || "NONE"}`;
        const nextItems = guestItems.some((current) => current.maSKU === maSKU)
          ? guestItems.map((current) =>
              current.maSKU === maSKU
                ? {
                    ...current,
                    soLuong:
                      Number(current.soLuong || 0) + Number(item.quantity || 1),
                    isSelected: true,
                  }
                : current,
            )
          : [
              ...guestItems,
              {
                productId: item.productId,
                tenSanPham: item.name,
                image: resolveImageUrl(item.image),
                gia: Number(item.price || 0),
                soLuong: Number(item.quantity || 1),
                mausac: item.colorName || item.colorCode || "",
                size: item.size || "",
                maSKU,
                isSelected: true,
              },
            ];

        writeGuestCart(nextItems);
        setCart({ _id: null, isGuest: true, sanPhamTrongGio: nextItems });
        return true;
      }

      const cart = await ensureActiveCart();
      const maSKU =
        item.maSKU ||
        `${item.productId}_${item.colorCode || "NONE"}_${item.size || "NONE"}`;

      await fetch(`${API_BASE}/gio-hang/${cart._id}/them`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sanPhamId: item.productId,
          tenSanPham: item.name,
          maSKU,
          image: toApiRelativeImage(item.image),
          mausac: item.colorName || item.colorCode,
          size: item.size,
          soLuong: Number(item.quantity || 1),
          gia: Number(item.price || 0),
          isSelected: true,
        }),
      });

      await refreshCarts();
      return true;
    },
    [ensureActiveCart, refreshCarts, userId],
  );

  const updateGuestItems = useCallback((updater) => {
    const currentItems = readGuestCart();
    const nextItems = updater(currentItems);
    writeGuestCart(nextItems);
    setCart({ _id: null, isGuest: true, sanPhamTrongGio: nextItems });
  }, []);

  const updateQuantity = useCallback(
    async (maSKU, soLuong) => {
      if (!userId) {
        updateGuestItems((items) =>
          items
            .map((item) =>
              item.maSKU === maSKU
                ? { ...item, soLuong: Math.max(1, Number(soLuong) || 1) }
                : item,
            )
            .filter((item) => Number(item.soLuong) > 0),
        );
        return;
      }

      if (!activeCart?._id) return;
      await fetch(
        `${API_BASE}/gio-hang/${activeCart._id}/san-pham/${encodeURIComponent(maSKU)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ soLuong }),
        },
      );
      await refreshCarts();
    },
    [activeCart?._id, refreshCarts, updateGuestItems, userId],
  );

  const toggleSelect = useCallback(
    async (maSKU, isSelected) => {
      if (!userId) {
        updateGuestItems((items) =>
          items.map((item) =>
            item.maSKU === maSKU ? { ...item, isSelected } : item,
          ),
        );
        return;
      }

      if (!activeCart?._id) return;
      await fetch(
        `${API_BASE}/gio-hang/${activeCart._id}/san-pham/${encodeURIComponent(maSKU)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isSelected }),
        },
      );
      await refreshCarts();
    },
    [activeCart?._id, refreshCarts, updateGuestItems, userId],
  );

  const removeFromCart = useCallback(
    async (maSKU) => {
      if (!userId) {
        updateGuestItems((items) =>
          items.filter((item) => item.maSKU !== maSKU),
        );
        return;
      }

      if (!activeCart?._id) return;
      await fetch(
        `${API_BASE}/gio-hang/${activeCart._id}/san-pham/${encodeURIComponent(maSKU)}`,
        {
          method: "DELETE",
        },
      );
      await refreshCarts();
    },
    [activeCart?._id, refreshCarts, updateGuestItems, userId],
  );

  const clearCart = useCallback(async () => {
    if (!userId) {
      writeGuestCart([]);
      setCart({ _id: null, isGuest: true, sanPhamTrongGio: [] });
      return;
    }

    if (!activeCart?._id) return;
    await fetch(`${API_BASE}/gio-hang/${activeCart._id}`, {
      method: "DELETE",
    });
    await refreshCarts();
  }, [activeCart, refreshCarts, userId]);

  const normalizedActiveItems = useMemo(
    () =>
      (activeCart?.sanPhamTrongGio || []).map((item) => ({
        ...item,
        key: item.maSKU,
        tenSanPham: item.tenSanPham ?? item.name,
        name: item.tenSanPham ?? item.name,
        image: resolveImageUrl(item.image),
        gia: Number(item.gia?.$numberDecimal ?? item.gia ?? item.price ?? 0),
        price: Number(item.gia?.$numberDecimal ?? item.gia ?? item.price ?? 0),
        quantity: Number(item.soLuong ?? item.quantity ?? 0),
        soLuong: Number(item.soLuong ?? item.quantity ?? 0),
        colorName: item.mausac ?? item.colorName,
        colorCode: item.colorCode,
        size: item.size,
        isSelected: item.isSelected,
      })),
    [activeCart],
  );

  const selectedItems = useMemo(
    () => normalizedActiveItems.filter((x) => x.isSelected !== false),
    [normalizedActiveItems],
  );

  const selectedSubtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + Number(item.gia || 0) * Number(item.soLuong || 0),
        0,
      ),
    [selectedItems],
  );

  const value = useMemo(
    () => ({
      loading,
      activeCart,
      cartItems: normalizedActiveItems,
      selectedItems,
      totalItems,
      subtotal,
      selectedSubtotal,
      refreshCarts,
      addToCart,
      updateQuantity,
      toggleSelect,
      removeFromCart,
      clearCart,
    }),
    [
      loading,
      activeCart,
      normalizedActiveItems,
      selectedItems,
      totalItems,
      subtotal,
      selectedSubtotal,
      refreshCarts,
      addToCart,
      updateQuantity,
      toggleSelect,
      removeFromCart,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
