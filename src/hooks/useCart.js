import { useContext } from 'react';
import { CartContext } from '../context/cartContext.js';

export default function useCart() {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error('useCart must be used inside a CartProvider');
  }
  return context;
}