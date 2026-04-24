"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";

/* ─── Reducer ─── */

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (item) => item.product.code === action.product.code
      );
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.code === action.product.code
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { items: [...state.items, { product: action.product, quantity: 1 }] };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter((item) => item.product.code !== action.code),
      };

    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          items: state.items.filter((item) => item.product.code !== action.code),
        };
      }
      return {
        items: state.items.map((item) =>
          item.product.code === action.code
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    }

    case "CLEAR_CART":
      return { items: [] };

    case "HYDRATE":
      return { items: action.items };

    default:
      return state;
  }
}

/* ─── Storage helpers ─── */

const STORAGE_KEY = "food-explorer-cart";

function loadCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage quota exceeded — silently ignore */
  }
}

/* ─── Context ─── */

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  /* Hydrate from localStorage on mount */
  useEffect(() => {
    const saved = loadCart();
    if (saved.length > 0) {
      dispatch({ type: "HYDRATE", items: saved });
    }
  }, []);

  /* Persist to localStorage on every change */
  useEffect(() => {
    saveCart(state.items);
  }, [state.items]);

  const addItem = useCallback(
    (product) => dispatch({ type: "ADD_ITEM", product }),
    []
  );

  const removeItem = useCallback(
    (code) => dispatch({ type: "REMOVE_ITEM", code }),
    []
  );

  const updateQuantity = useCallback(
    (code, quantity) =>
      dispatch({ type: "UPDATE_QUANTITY", code, quantity }),
    []
  );

  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  const isInCart = useCallback(
    (code) => state.items.some((item) => item.product.code === code),
    [state.items]
  );

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
