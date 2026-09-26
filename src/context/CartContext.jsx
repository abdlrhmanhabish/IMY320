import { useCallback, useEffect, useMemo, useState } from 'react';
import { CartContext } from './cartContext.js';
import { sumPrices, sumListPrices } from '../utils/money.js';
import courses from '../data/courses.json';

const CART_KEY = 'skillup:cart';

function readCart() {
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  // only ids are stored. The course itself is looked up again on read so an edited price never goes stale in someone saved cart
  const [ids, setIds] = useState(readCart);
  const [lastAdded, setLastAdded] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(ids));
    } catch {
      // private browsing blocks writes. the cart just will not survive a reload
    }
  }, [ids]);

  const items = useMemo(
    () => ids.map((id) => courses.find((course) => course.id === id)).filter(Boolean),
    [ids],
  );

  const has = useCallback((id) => ids.includes(id), [ids]);

  const add = useCallback((course) => {
    let added = false;

    setIds((current) => {
      if (current.includes(course.id)) return current;
      added = true;
      return [...current, course.id];
    });

    setLastAdded({ id: course.id, at: Date.now() });
    return added;
  }, []);

  const remove = useCallback((id) => {
    setIds((current) => current.filter((item) => item !== id));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const value = useMemo(() => {
    const subtotal = sumListPrices(items);
    const total = sumPrices(items);

    return {
      items,
      count: items.length,
      subtotal,
      total,
      saving: subtotal - total,
      lastAdded,
      has,
      add,
      remove,
      clear,
    };
  }, [items, lastAdded, has, add, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}