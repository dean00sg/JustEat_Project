import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/FoodDetail.css';
import foodItems from '../assets/data'; // Import food items
import { useCart } from '../contexts/Cartcontext'; // Ensure correct path
import Navbar from '../components/Navbar/Navbar';
import Swal from 'sweetalert2'; // Import SweetAlert2

function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Use the addToCart function from CartContext
  const item = foodItems.find((item) => item.id === parseInt(id));
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState(''); // State to track note

  if (!item) return <p>Item not found</p>;

  const handleOptionClick = (option) => {
    setSelectedOptions((prevSelectedOptions) => {
      if (prevSelectedOptions.includes(option)) {
        return prevSelectedOptions.filter((o) => o !== option);
      } else {
        return [...prevSelectedOptions, option];
      }
    });
  };

  const calculateTotalPrice = () => {
    const basePrice = item.price;
    const additionalPrice = selectedOptions.reduce((acc, option) => acc + (option.price || 0), 0);
    return (basePrice + additionalPrice) * quantity;
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value >= 1 ? value : 1);
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...item,
      quantity,
      options: selectedOptions,
      note, // Include the note
    };

    addToCart(cartItem); // Add the item with the note to the cart

    Swal.fire({
      title: 'Item Added to Cart',
      text: 'Your item has been added to the cart successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      navigate('/menu');
    });
  };

  return (
    <div className="food-detail">
      <Navbar />
      <div className="food-detail-container">
        <div className="food-detail-image">
          <img src={item.image} alt={item.name} />
        </div>
        <div className="food-detail-content">
          <h1>{item.name}</h1>
          <p>{item.description}</p>
          <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
          <p><strong>Available:</strong> {item.available ? "Yes" : <span style={{ color: 'red' }}>Out of Stock</span>}</p>

          {item.available ? (
            <>
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>

              <div className="options-selector">
                <label>Options:</label>
                {item.options.map((option) => (
                  <div
                    key={option.id}
                    className={`option-item ${selectedOptions.includes(option) ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option.name} + ${option.price.toFixed(2)}
                  </div>
                ))}
              </div>

              <div className="note-section">
                <label htmlFor="note">Special Instructions:</label>
                <textarea
                  id="note"
                  name="note"
                  placeholder="Write your note here..."
                  value={note} // Bind the note state to the textarea
                  onChange={(e) => setNote(e.target.value)} // Update the note state when input changes
                />
              </div>

              <div className="total-price">
                <h3>Total Price: ${calculateTotalPrice().toFixed(2)}</h3>
              </div>

              <button className="add-to-cart-button" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </>
          ) : (
            <button className="add-to-cart-button" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodDetail;
