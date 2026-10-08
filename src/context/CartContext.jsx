import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { cartApi } from '../api/cartApi';
import { productApi } from '../api/productApi';
import { getProductPricing } from '../lib/pricing';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const GUEST_CART_KEY = 'hikari_guest_cart';

const readGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeGuestCart = (items) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {
    // localStorage unavailable (private mode etc.) — cart just won't persist across reloads
  }
};

// Resolves a guest cart's [{productId, quantity}] into full {items, subtotal} using live product data.
const resolveGuestCart = async (guestItems) => {
  if (guestItems.length === 0) return { items: [], subtotal: 0 };

  const products = await productApi.bulk(guestItems.map((i) => i.productId));
  const productMap = new Map(products.map((p) => [p._id, p]));

  const items = guestItems
    .map((gi) => {
      const product = productMap.get(gi.productId);
      if (!product) return null;
      return { product, quantity: Math.min(gi.quantity, Math.max(product.stock, 0)) || gi.quantity };
    })
    .filter(Boolean);

  const subtotal = items.reduce((sum, i) => sum + getProductPricing(i.product).price * i.quantity, 0);
  return { items, subtotal };
};

export function CartProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const hasMergedRef = useRef(false);

  const applyCartResponse = (cart) => {
    setItems(cart.items);
    setSubtotal(cart.subtotal);
  };

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        applyCartResponse(await cartApi.get());
      } else {
        applyCartResponse(await resolveGuestCart(readGuestCart()));
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;

    const run = async () => {
      if (isAuthenticated && !hasMergedRef.current) {
        hasMergedRef.current = true;
        const guestItems = readGuestCart();
        if (guestItems.length > 0) {
          await cartApi.merge(guestItems).catch(() => {});
          writeGuestCart([]);
        }
      }
      if (!isAuthenticated) {
        hasMergedRef.current = false;
      }
      await refetch();
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  const addItem = useCallback(
    async (productId, quantity = 1) => {
      if (isAuthenticated) {
        applyCartResponse(await cartApi.add(productId, quantity));
      } else {
        const guestItems = readGuestCart();
        const existing = guestItems.find((i) => i.productId === productId);
        if (existing) {
          existing.quantity += quantity;
        } else {
          guestItems.push({ productId, quantity });
        }
        writeGuestCart(guestItems);
        applyCartResponse(await resolveGuestCart(guestItems));
      }
    },
    [isAuthenticated]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (isAuthenticated) {
        applyCartResponse(await cartApi.updateQuantity(productId, quantity));
      } else {
        let guestItems = readGuestCart();
        if (quantity <= 0) {
          guestItems = guestItems.filter((i) => i.productId !== productId);
        } else {
          const existing = guestItems.find((i) => i.productId === productId);
          if (existing) existing.quantity = quantity;
        }
        writeGuestCart(guestItems);
        applyCartResponse(await resolveGuestCart(guestItems));
      }
    },
    [isAuthenticated]
  );

  const removeItem = useCallback(
    async (productId) => {
      if (isAuthenticated) {
        applyCartResponse(await cartApi.remove(productId));
      } else {
        const guestItems = readGuestCart().filter((i) => i.productId !== productId);
        writeGuestCart(guestItems);
        applyCartResponse(await resolveGuestCart(guestItems));
      }
    },
    [isAuthenticated]
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      applyCartResponse(await cartApi.clear());
    } else {
      writeGuestCart([]);
      setItems([]);
      setSubtotal(0);
    }
  }, [isAuthenticated]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, subtotal, itemCount, loading, addItem, updateQuantity, removeItem, clearCart, refetch }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
