import { useContext } from 'react';
import { ToastContext } from '../context/toastContext.js';

export default function useToast() {
  const context = useContext(ToastContext);

  if (context === null) {
    throw new Error('useToast must be used inside a ToastProvider');
  }
  return context;
}