// src/pages/History.jsx
import React, { useContext } from 'react';
import { OrderHistoryContext } from '../contexts/OrderHistorycontext'; // Ensure this import path is correct
import '../styles/History.css';
import Navbar from '../components/Navbar/Navbar';

const History = () => {
  const { orderHistory } = useContext(OrderHistoryContext); // Access order history from context

  // Function to calculate the total price for a single order
  const calculateTotalPrice = (item) => {
    const basePrice = (item.price || 0) * (item.quantity || 1);
    const optionsPrice = (item.options || []).reduce((acc, option) => acc + (option.price || 0) * (item.quantity || 1), 0);
    return basePrice + optionsPrice;
  };

  return (
    <div className="history-page">
      <Navbar />
      <div className="history-container">
        <h1 className="history-title">Order History</h1>
        {orderHistory.length === 0 ? (
          <p className="history-empty-message">No orders yet.</p>
        ) : (
          orderHistory.map((order) => (
            <div className="history-order" key={order.id}>
              <div className="history-order-header">
                <h2 className="history-order-id">Order ID: {order.id}</h2>
                <span className="history-order-date">{order.date}</span>
                <span className={`history-order-status status-${order.status.toLowerCase().replace(' ', '-')}`}>
                  {order.status || 'Unknown'}
                </span>
                <span className="history-order-total">Total: ${order.total}</span>
              </div>
              <div className="history-order-items">
                {order.items.map((item, index) => {
                  const itemTotalPrice = calculateTotalPrice(item);

                  return (
                    <div className="history-order-item" key={index}>
                      <img src={item.image} alt={item.name} className="history-order-item-image" />
                      <div className="history-order-item-details">
                        <h3 className="history-order-item-title">{item.name}</h3>
                        <p className="history-order-item-quantity">Quantity: {item.quantity}</p>
                        <p className="history-order-item-price">Price: ${itemTotalPrice.toFixed(2)}</p>
                        <div className="history-order-item-options">
                          <h4>Selected Options:</h4>
                          <ul>
                            {(item.options || []).map((option, index) => (
                              <li key={index} className="option-item">
                                {option.name} + ${option.price.toFixed(2)}
                              </li>
                            ))}
                            {item.options.length === 0 && <li>No options selected</li>}
                          </ul>
                        </div>
                        {item.note && (
                          <div className="history-order-item-note">
                            <h4>Note:</h4>
                            <p>{item.note}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;