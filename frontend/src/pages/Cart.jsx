import React, { useState, useContext, useEffect } from "react";
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

  // Log cartItems whenever it changes
  useEffect(() => {
    console.log("Cart Items:", cartItems);
    console.log("Total Items in Cart:", cartItems.length);
    const totalPrice = cartItems.reduce((acc, item) => acc + calculateItemTotalPrice(item), 0);
    console.log("Total Price:", totalPrice.toFixed(2));
  }, [cartItems]);

  const calculateItemTotalPrice = (item) => {
    // Only use the item's price multiplied by the quantity
    return parseFloat(item.price); 
  };

  const handleProceedToHistory = async () => {
    // Prepare the order data
    const orderData = cartItems.map((item) => ({
      menu_id: item.id, // Assuming item.id is the menu_id
      qty: item.qty,
      option_ids: item.options.map(option => option.Option_id),// Assuming each option has an id
      category_id: item.category_id, // Assuming item has a category_id property
      remark: item.remark || "", // Default to an empty string if no remark
    }));

    console.log("Order Data:", orderData);

    try {
      for (const order of orderData) {
        const response = await fetch("http://127.0.0.1:8000/Orders/orders/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order), // Send each order object individually
        });
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      }

      // If the response is successful, clear the cart and navigate
      clearCart();
      navigate("/history");

      // Optionally, you can show a success message here
      Swal.fire("Success!", "Your order has been placed.", "success");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      Swal.fire("Error!", "There was a problem placing your order.", "error");
    }
  };

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
                    src={`http://127.0.0.1:8000/${item.image}`} // Assuming image URL is stored correctly
                    alt={item.menu_name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-content">
                    <div className="cart-item-header">
                      <h2 className="cart-item-title">{item.menu_name}</h2>
                      <span className="cart-item-price">${item.price}</span> {/* Use itemTotalPrice for display */}
                      <button
                        className="remove-button"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="cart-item-details">
                      <span className="cart-item-quantity">
                        Quantity: {item.qty}
                      </span>
                      <div className="cart-item-options">
                        <h4>Selected Options:</h4>
                        <ul>
                          {item.options.map((option, index) => (
                            <li key={index} className="option-item">
                              {option.option_name} + ${parseFloat(option.price).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                        {item.remark && (
                          <p className="cart-item-note">
                            <strong>Note:</strong> {item.remark}
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
