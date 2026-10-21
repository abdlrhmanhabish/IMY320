import { useCallback, useEffect, useMemo, useState } from 'react';
import { CartContext } from './cartContext.js';
import { sumPrices, sumListPrices } from '../utils/money.js';
import useAuth from '../hooks/useAuth.js';
import useProgress from '../hooks/useProgress.js';
import { GUEST, moveSharedData, ownerOf, readSaved, removeSaved, writeSaved } from '../utils/storage.js';
import courses from '../data/courses.json';

function readIds(owner) {
  const saved = readSaved('cart', owner, []);
  return Array.isArray(saved) ? saved : [];
}

// a guest cart is carried over when somebody signs in
function load(owner) {
  if (owner === GUEST){
    return readIds(GUEST);
  }
  return [...new Set([...readIds(owner), ...readIds(GUEST)])];
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { isEnrolled } = useProgress();
  const owner = ownerOf(user);

  // only ids are stored. The course itself is looked up again on read so an edited price never goes stale in someone saved cart
  const [cart, setCart] = useState(() => {
    moveSharedData('cart');
    return { owner, ids: load(owner) };
  });
  const [lastAdded, setLastAdded] = useState(null);

  if (cart.owner !== owner) {
    const carried = cart.owner === GUEST ? cart.ids : [];
    const ids = owner === GUEST ? load(GUEST) : [...new Set([...load(owner), ...carried])];
    setCart({ owner, ids: ids.filter((id) => !isEnrolled(id)) });
  }

  useEffect(() => {
    writeSaved('cart', cart.owner, cart.ids);
    if (cart.owner !== GUEST){ 
      removeSaved('cart', GUEST);
    }
  }, [cart]);

  const items = useMemo(
    () =>
      cart.ids
        .map((id) => courses.find((course) => course.id === id))
        .filter((course) => course && !isEnrolled(course.id)),
    [cart.ids, isEnrolled],
  );

  const has = useCallback((id) => cart.ids.includes(id), [cart.ids]);

  const add = useCallback(
    (course) => {
      if (isEnrolled(course.id)){ 
        return false;
      }

      let added = false;

      setCart((current) => {
        if (current.ids.includes(course.id)) return current;
        added = true;
        return { ...current, ids: [...current.ids, course.id] };
      });

      setLastAdded({ id: course.id, at: Date.now() });
      return added;
    },
    [isEnrolled],
  );

  const remove = useCallback((id) => {
    setCart((current) => ({ ...current, ids: current.ids.filter((item) => item !== id) }));
  }, []);

  const clear = useCallback(() => setCart((current) => ({ ...current, ids: [] })), []);

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