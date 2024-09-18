// src/contexts/OrderHistoryContext.js
import React, { createContext, useState } from 'react';

// Create a context for order history
export const OrderHistoryContext = createContext();

export const OrderHistoryProvider = ({ children }) => {
  const [orderHistory, setOrderHistory] = useState([]);

  // Function to add a new order to history
  const addOrderToHistory = (order) => {
    setOrderHistory((prevHistory) => [...prevHistory, order]);
  };

  return (
    <OrderHistoryContext.Provider value={{ orderHistory, addOrderToHistory }}>
      {children}
    </OrderHistoryContext.Provider>
  );
};
