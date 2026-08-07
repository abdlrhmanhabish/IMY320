import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

//stylesheet imports (tokens.css then global.css) will be added in the styling step
//AuthProvider wraps <App /> when src/context/AuthContext.jsx is implemented
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);