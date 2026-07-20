import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const cartKey = (userId) => `ae_cart_${userId || 'guest'}`;

export function CartProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id || null;
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(cartKey(userId))) || []; } catch { return []; }
  });
  const loadedFor = useRef(userId);

  // Reload the correct cart whenever the logged-in user changes (login/logout/switch account)
  useEffect(() => {
    if (loadedFor.current === userId) return;
    loadedFor.current = userId;
    try { setItems(JSON.parse(localStorage.getItem(cartKey(userId))) || []); } catch { setItems([]); }
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(cartKey(userId), JSON.stringify(items));
  }, [items, userId]);

  const addItem = (product, qty = 1) => {
    setItems(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
  };

  const removeItem = (id) => setItems(prev => prev.filter(i => i._id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return removeItem(id);
    setItems(prev => prev.map(i => i._id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
