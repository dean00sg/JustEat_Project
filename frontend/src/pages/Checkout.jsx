import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OrderHistoryContext } from '../contexts/OrderHistorycontext'; // Ensure correct path
import { CartContext } from '../contexts/Cartcontext'; // Ensure correct path
import '../styles/Checkout.css';
import Navbar from '../components/Navbar/Navbar';
import Swal from 'sweetalert2'; // Import SweetAlert2

const Checkout = () => {
  const [receiptFile, setReceiptFile] = useState(null); // State to track uploaded receipt
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = location.state || { cartItems: [] };

  // Access the order history context and cart context
  const { addOrderToHistory } = useContext(OrderHistoryContext);
  const { clearCart } = useContext(CartContext);

  // Function to calculate the total price for a single item
  const calculateItemTotalPrice = (item) => {
    const basePrice = item.price * item.quantity;
    const optionsPrice = (item.options || []).reduce((acc, option) => acc + (option.price || 0) * item.quantity, 0);
    return basePrice + optionsPrice;
  };

  // Function to calculate the total price for all items in the cart
  const calculateTotalPrice = () => {
    return cartItems
      .reduce((acc, item) => acc + calculateItemTotalPrice(item), 0)
      .toFixed(2);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setReceiptFile(e.target.files[0]); // Update receiptFile state with the selected file
  };

  // Handle order confirmation
  const handleConfirmOrder = () => {
    if (!receiptFile) {
      // Show SweetAlert2 error message if no receipt is uploaded
      Swal.fire({
        title: 'Receipt Required',
        text: 'Please upload the payment receipt to proceed with the checkout.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    const newOrder = {
      id: Date.now(), // Unique ID for the order
      items: cartItems, // Ensure items are correctly passed
      total: calculateTotalPrice(),
      status: 'In Progress', // Initial status
      date: new Date().toLocaleString(), // Order date and time
    };

    console.log('Confirming order:', newOrder); // Log the new order data

    addOrderToHistory(newOrder);
    clearCart();

    // Show SweetAlert2 confirmation dialog
    Swal.fire({
      title: 'Order Success!',
      text: 'Your order has been placed successfully. Thank you for your purchase!',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      navigate('/history'); // Navigate to the order history page after confirmation
    });
  };

  return (
    <div className="checkout-page">
      <Navbar />

      <div className="checkout-container">
        <div className="order-summary-section">
          <h1 className="checkout-title">Order Summary</h1>

          {cartItems.map((item) => {
            const itemTotalPrice = calculateItemTotalPrice(item).toFixed(2);

            return (
              <div className="checkout-item" key={item.id}>
                <img src={item.image} alt={item.name} className="checkout-item-image" />
                <div className="checkout-item-details">
                  <h2 className="checkout-item-title">{item.name}</h2>
                  <p className="checkout-item-price">Price: ${itemTotalPrice}</p>
                  <p className="checkout-item-quantity">Quantity: {item.quantity}</p>
                  <div className="checkout-item-options">
                    <h4>Selected Options:</h4>
                    <ul>
                      {(item.options || []).map((option, index) => (
                        <li key={index} className="option-item">
                          {option.name} + ${(option.price * item.quantity).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {item.note && (
                    <div className="checkout-item-note">
                      <h4>Note:</h4>
                      <p>{item.note}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="checkout-total">
            <h2>Total: ${calculateTotalPrice()}</h2>
          </div>
        </div>

        <div className="payment-details-section">
          <div className="checkout-payment-details">
            <h3>Payment Details</h3>
            <p>Please make the payment to the following account:</p>
            <p>
              <strong>Siam Commercial Bank (SCB):</strong> <span className="account-number">609-256-843-4</span>
            </p>
          </div>

          <div className="checkout-upload">
            <label htmlFor="receipt">Upload Payment Receipt:</label>
            <input type="file" id="receipt" name="receipt" onChange={handleFileChange} />
          </div>

          <button className="checkout-confirm-button" onClick={handleConfirmOrder}>
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;