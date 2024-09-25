import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import "../styles/Cart.css";
import { useCart } from "../contexts/Cartcontext";
import { OrderHistoryContext } from "../contexts/OrderHistorycontext";
import Navbar from "../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { addOrderToHistory } = useContext(OrderHistoryContext);
  const navigate = useNavigate();

  const calculateItemTotalPrice = (item) => {
    const basePrice = item.price;
    const optionsPrice = item.options.reduce(
      (acc, option) => acc + (option.price || 0),
      0
    );
    return (basePrice + optionsPrice) * item.quantity;
  };

  const generateUniqueId = () => {
    const randomNum = Math.floor(Math.random() * 1000000); // Generate a random number between 0 and 999999
    return String(randomNum).padStart(6, '0'); // Ensure it's always 6 digits by padding with zeros
  };

  const handleProceedToHistory = () => {
    const order = {
      id: generateUniqueId(),
      items: cartItems,
      total: cartItems
        .reduce((acc, item) => acc + calculateItemTotalPrice(item), 0)
        .toFixed(2),
      date: new Date().toLocaleString(),
      status: "In Progress",
    };

    addOrderToHistory(order);
    clearCart();
    navigate("/history");
  };

  // Function to remove an item using Swal
  const handleRemoveItem = (itemId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(itemId);
        Swal.fire("Removed!", "The item has been removed from your cart.", "success");
      }
    });
  };

  return (
    <div className="cart-page">
      <Navbar />
      <div className="cart-container">
        <h1 className="cart-title">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p className="cart-empty-message">Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map((item) => {
              const itemTotalPrice = calculateItemTotalPrice(item).toFixed(2);
              return (
                <div className="cart-item" key={item.id}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-content">
                    <div className="cart-item-header">
                      <h2 className="cart-item-title">{item.name}</h2>
                      <span className="cart-item-price">${itemTotalPrice}</span>
                      <button
                        className="remove-button"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="cart-item-details">
                      <span className="cart-item-quantity">
                        Quantity: {item.quantity}
                      </span>
                      <div className="cart-item-options">
                        <h4>Selected Options:</h4>
                        <ul>
                          {item.options.map((option, index) => (
                            <li key={index} className="option-item">
                              {option.name} + ${option.price.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                        {item.note && (
                          <p className="cart-item-note">
                            <strong>Note:</strong> {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="cart-summary">
              <h2>
                Total: $
                {cartItems
                  .reduce((acc, item) => acc + calculateItemTotalPrice(item), 0)
                  .toFixed(2)}
              </h2>
              <button
                className="order-now-button" // Updated button class
                onClick={handleProceedToHistory} // Trigger order now action
              >
                Order Now!
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;