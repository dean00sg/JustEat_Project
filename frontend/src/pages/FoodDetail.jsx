import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/FoodDetail.css";
import { useCart } from "../contexts/Cartcontext";
import Navbar from "../components/Navbar/Navbar";
import Swal from "sweetalert2";
import axios from "axios";

function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [item, setItem] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(new Set());
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuResponse, categoryResponse] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/menu/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/category/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const fetchedItem = menuResponse.data;
        const fetchedCategories = categoryResponse.data;

        if (!fetchedItem || !fetchedCategories) throw new Error("Invalid response data");

        setItem(fetchedItem);
        setCategories(fetchedCategories);

        const category = fetchedCategories.find(cat => cat.category_name === fetchedItem.category_name);

        if (category) {
          const optionsResponse = await axios.get(`http://127.0.0.1:8000/option/filter/?category_id=${category.category_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setOptions(optionsResponse.data);
        } else {
          setError("Category not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!item) return <p>Item not found</p>;

  const handleOptionClick = (option) => {
    setSelectedOptions(prev => {
      const newOptions = new Set(prev);
      if (newOptions.has(option)) {
        newOptions.delete(option);
      } else {
        newOptions.add(option);
      }
      return newOptions;
    });
  };

  const calculateTotalPrice = () => {
    const basePrice = parseFloat(item.price);
    const additionalPrice = Array.from(selectedOptions).reduce((acc, option) => acc + parseFloat(option.price), 0);
    return (basePrice + additionalPrice) * quantity;
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value));
    setQuantity(value);
  };

  const handleSubmitOrder = async () => {
    if (!item) {
      return Swal.fire({
        title: "Error",
        text: "Item not found. Please try again.",
        icon: "error",
      });
    }
  
    if (selectedOptions.size === 0) {
      return Swal.fire({
        title: "Error",
        text: "Please select at least one option.",
        icon: "error",
      });
    }
  
    const totalPrice = calculateTotalPrice(); // Calculate the total price
  
    const orderData = {
      menu_id: item.menu_id,
      menu_name: item.name, // Add menu_name
      image: item.image, // Add image URL
      qty: quantity,
      option_ids: Array.from(selectedOptions).map((option) => option.Option_id),
      category_id: categories.find((cat) => cat.category_name === item.category_name)?.category_id,
      remark: note || "",
      options: Array.from(selectedOptions), // This will include the full option object
      note,
      id: item.menu_id,
      totalPrice: calculateTotalPrice(), // Add total price here
    };
  
    // Debugging log
    console.log("Order data to add to cart:", orderData);
  
    // Add item to cart directly
    addToCart(orderData);
  
    Swal.fire({
      title: "Added to Cart",
      text: "Your item has been added to the cart successfully.",
      icon: "success",
    });
  
    navigate("/menu"); // Redirect to the cart
  };

  return (
    <div className="food-detail">
      <Navbar />
      <div className="food-detail-container">
        <div className="food-detail-image">
          <img src={`http://127.0.0.1:8000/${item.image}`} alt={item.name} />
        </div>
        <div className="food-detail-content">
          <h1>{item.name}</h1>
          <p>{item.description}</p>
          <p><strong>Price:</strong> ${parseFloat(item.price).toFixed(2)}</p>
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity" min="1" value={quantity} onChange={handleQuantityChange} />
          </div>

          <div className="options-selector">
            <label>Options:</label>
            {options.map((option) => (
              <div
                key={option.id}
                className={`option-item ${selectedOptions.has(option) ? "selected" : ""}`}
                onClick={() => handleOptionClick(option)}
              >
                {`${option.option_name} + $${parseFloat(option.price).toFixed(2)}`}
              </div>
            ))}
          </div>

          <div className="note-section">
            <label htmlFor="note">Special Instructions (sent to admin):</label>
            <textarea id="note" name="note" placeholder="Write your note here..." value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <div className="total-price">
            <h3>Total Price: ${calculateTotalPrice().toFixed(2)}</h3>
          </div>

          <button className="submit-order-button" onClick={handleSubmitOrder}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default FoodDetail;