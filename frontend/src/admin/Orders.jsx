import React, { useState } from 'react';
import Swal from 'sweetalert2';
import NavbarAdmin from '../components/Navbar/NavbarAdmin';
import '../styles/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      status: 'Inprogress',
      date: '2024-09-21',
      items: [
        {
          name: 'Pizza',
          quantity: 2,
          price: 12.99,
          image: 'https://cdn.shopify.com/s/files/1/0274/9503/9079/files/20220211142754-margherita-9920_5a73220e-4a1a-4d33-b38f-26e98e3cd986.jpg?v=1723650067',
          note: 'Please add extra cheese.',
          options: [
            { name: 'Extra Cheese', price: 2.0 },
            { name: 'Olives', price: 1.5 },
          ],
        },
      ],
      cancelNote: '',
    },
    {
      id: 2,
      status: 'Complete',
      date: '2024-09-20',
      items: [
        {
          name: 'Burger',
          quantity: 1,
          price: 9.99,
          image: 'https://www.sargento.com/assets/Uploads/Recipe/Image/burger_0.jpg',
          note: 'No onions, please.',
          options: [],
        },
      ],
      cancelNote: '',
    },
  ]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleCancelNoteChange = (orderId, newNote) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, cancelNote: newNote } : order
      )
    );
  };

  const handleSendCancelNote = (orderId) => {
    Swal.fire({
      title: 'Cancellation Note Sent',
      text: `Cancellation reason for Order ID: ${orderId} has been sent.`,
      icon: 'info',
      confirmButtonText: 'Ok',
    });
  };

  const calculateTotalPrice = (items) => {
    return items.reduce((acc, item) => {
      const basePrice = item.price * item.quantity;
      const optionsPrice = item.options.reduce((optAcc, option) => optAcc + option.price, 0);
      return acc + basePrice + optionsPrice;
    }, 0);
  };

  const handlePaymentClick = (totalAmount) => {
    Swal.fire({
      title: 'Payment QR Code',
      html: `<img src="https://promptpay.io/0638313471/${totalAmount}.png" alt="QR Code" />`,
      showCloseButton: true,
    });
  };

  return (
    <div className="orders-page">
      <NavbarAdmin />
      <div className="orders-container">
        <h1 className="orders-title">Manage Orders</h1>

        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-header">
              <h2 className="order-id">Order ID: {order.id}</h2>
              <span className={`order-status status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
              <span className="order-date">{order.date}</span>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div className="order-item" key={index}>
                  <img src={item.image} alt={item.name} className="order-item-image" />
                  <div className="order-item-details">
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price.toFixed(2)}</p>

                    {/* Options section */}
                    {item.options.length > 0 ? (
                      <div className="order-options">
                        <h4>Options:</h4>
                        <ul>
                          {item.options.map((option, idx) => (
                            <li key={idx}>
                              {option.name} +${option.price.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p>No options selected</p>
                    )}

                    {/* Display customer note */}
                    {item.note && (
                      <div className="order-note">
                        <h4>Note from customer:</h4>
                        <p>{item.note}</p>
                      </div>
                    )}

                    {/* Total price calculation */}
                    <p>Total Price: ${calculateTotalPrice(order.items).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order status change section */}
            <div className="order-status-control">
              <label htmlFor={`status-${order.id}`}>Change Status:</label>
              <select
                id={`status-${order.id}`}
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
              >
                <option value="Inprogress">Inprogress</option>
                <option value="Complete">Complete</option>
                <option value="Cancel">Cancel</option>
              </select>

              {/* Show note input when Cancel is selected */}
              {order.status === 'Cancel' && (
                <div className="order-cancel-note">
                  <textarea
                    value={order.cancelNote}
                    onChange={(e) => handleCancelNoteChange(order.id, e.target.value)}
                    placeholder="Add a reason for cancellation"
                  />
                  <button
                    className="send-cancel-note-button"
                    onClick={() => handleSendCancelNote(order.id)}
                  >
                    Send
                  </button>
                </div>
              )}

              {/* QR Code button for payment */}
              {order.status === 'Complete' && (
                <button
                  className="qr-code-button"
                  onClick={() => handlePaymentClick(calculateTotalPrice(order.items).toFixed(2))}
                >
                  Show QR Code
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;