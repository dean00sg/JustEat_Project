import React from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import "../styles/Cart.css"; // For your CSS
import { useCart } from "../contexts/Cartcontext"; // Import useCart hook
import { useNavigate } from "react-router-dom"; // For navigation
import Navbar from "../components/Navbar/Navbar";

const Cart = () => {
  const navigate = useNavigate(); // Create instance of useNavigate
  const { cartItems, removeFromCart } = useCart(); // Access cart items and remove function from context

  const calculateItemTotalPrice = (item) => {
    const basePrice = item.price;
    const optionsPrice = item.options.reduce(
      (acc, option) => acc + (option.price || 0),
      0
    ); // Total options price
    return (basePrice + optionsPrice) * item.quantity; // Total price
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } }); // Navigate to checkout with cart items
  };

  const handleRemoveItem = (id) => {
    // Show SweetAlert2 confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: "This item will be removed from your cart.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(id); // Remove item from cart if confirmed
        Swal.fire(
          'Removed!',
          'The item has been removed from your cart.',
          'success'
        );
      }
    });
  };

  return (
    <div className="cart-page">
      <Navbar/>
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
                      <span className="cart-item-price">
                        ${itemTotalPrice}
                      </span>
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
                          <div className="checkout-item-note">
                            <h4>Note:</h4>
                            <p>{item.note}</p>
                          </div>
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
              <button className="checkout-button" onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;