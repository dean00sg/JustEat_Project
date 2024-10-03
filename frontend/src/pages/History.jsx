import React, { useEffect, useState, useContext } from 'react';
import { OrderHistoryContext } from '../contexts/OrderHistorycontext'; // Ensure this import path is correct
import '../styles/History.css';
import Navbar from '../components/Navbar/Navbar';

const History = () => {
  const { orderHistory } = useContext(OrderHistoryContext); // Access order history from context
  const [orders, setOrders] = useState([]); // State to hold fetched orders

  // Fetch order history from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/Orders/orders/");
        const data = await response.json();
        console.log("Fetched orders data:", data);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="history-page">
      <Navbar />
      <div className="history-container">
        <h1 className="history-title">Order History</h1>
        {orders.length === 0 ? (
          <p className="history-empty-message">No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div className="history-order" key={order.orders_id}>
              <div className="history-order-header">
                <h2 className="history-order-id">Order ID: {order.orders_id}</h2>
                <span className="history-order-date">{order.date}</span>
                <span className={`history-order-status status-${order.status_working.toLowerCase().replace(' ', '-')}`}>
                  {order.status_working || 'Unknown'}
                </span>
                <span className="history-order-total">Total: ${order.total_price.toFixed(2)}</span>
              </div>
              <div className="history-order-items">
                <div className="history-order-item">
                  <img src={`http://127.0.0.1:8000/${order.image}`} alt={order.name_menu} className="history-order-item-image" />
                  <div className="history-order-item-details">
                    <h3 className="history-order-item-title">{order.name_menu}</h3>
                    <p className="history-order-item-quantity">Quantity: {order.qty}</p>
                    <p className="history-order-item-price">Price: ${order.price.toFixed(2)}</p>
                    <div className="history-order-item-options">
                      <h4>Selected Options:</h4>
                      <ul>
                        {order.option_name.length > 0 ? (
                          order.option_name.map((option, index) => (
                            <li key={index} className="option-item">
                              {option} {/* Assuming `option` does not have a price in this case */}
                            </li>
                          ))
                        ) : (
                          <li>No options selected</li>
                        )}
                      </ul>
                    </div>
                    {order.remark && (
                      <div className="history-order-item-note">
                        <h4>Note:</h4>
                        <p>{order.remark}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;