// src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { CartProvider } from './contexts/Cartcontext'; // Adjust the import path as necessary
import { OrderHistoryProvider } from './contexts/OrderHistorycontext'; // Import OrderHistoryProvider
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <OrderHistoryProvider> {/* Wrap App with OrderHistoryProvider */}
        <App />
      </OrderHistoryProvider>
    </CartProvider>
  </StrictMode>,
);
