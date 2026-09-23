import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ProgressProvider } from './context/ProgressContext.jsx';
import { ToastProvider } from './context/ToastProvider.jsx';
import './styles/tokens.css';
import './styles/global.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <CartProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </CartProvider>
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);