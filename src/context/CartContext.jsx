/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CART_STORAGE_KEY = "fashion_cart_v1";
const CartContext = createContext(null);

const toNumber = (value) => Number(value?.$numberDecimal ?? value ?? 0);

const readCartFromStorage = () => {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const buildItemKey = ({ productId, colorCode, size }) =>
  `${productId}|${colorCode ?? "-"}|${size ?? "-"}`;

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => readCartFromStorage());

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    const quantity = Math.max(1, Number(item.quantity ?? 1));
    const normalizedItem = {
      ...item,
      key: buildItemKey(item),
      quantity,
      price: toNumber(item.price),
    };

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((p) => p.key === normalizedItem.key);
      if (existingIndex === -1) return [...prev, normalizedItem];

      const next = [...prev];
      const existing = next[existingIndex];
      next[existingIndex] = {
        ...existing,
        quantity: existing.quantity + quantity,
      };
      return next;
    });
  };

  const updateQuantity = (itemKey, quantity) => {
    const safeQuantity = Number(quantity);
    if (!Number.isFinite(safeQuantity)) return;

    setCartItems((prev) => {
      if (safeQuantity <= 0) {
        return prev.filter((item) => item.key !== itemKey);
      }
      return prev.map((item) =>
        item.key === itemKey ? { ...item, quantity: safeQuantity } : item,
      );
    });
  };

  const removeFromCart = (itemKey) => {
    setCartItems((prev) => prev.filter((item) => item.key !== itemKey));
  };

  const clearCart = () => setCartItems([]);

  const totals = useMemo(() => {
    const totalItems = cartItems.reduce(
      (sum, item) => sum + Number(item.quantity ?? 0),
      0,
    );
    const subtotal = cartItems.reduce(
      (sum, item) => sum + toNumber(item.price) * Number(item.quantity ?? 0),
      0,
    );
    return { totalItems, subtotal };
  }, [cartItems]);

  const value = useMemo(
    () => ({
      cartItems,
      totalItems: totals.totalItems,
      subtotal: totals.subtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [cartItems, totals],
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
