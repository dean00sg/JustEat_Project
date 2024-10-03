import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import "../styles/Home.css";
import Navbar from "../components/Navbar/Navbar";

const Home = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [foodItems, setFoodItems] = useState([]); // State for food items
  const [categories, setCategories] = useState([]); // State for categories
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  // Fetch food items and categories from the APIs
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/menu/");
        setFoodItems(response.data); // Set the food items state with the fetched data
      } catch (err) {
        setError("Error fetching food items. Please try again."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after the request
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/category/");
        // Filter duplicate categories using Set
        const uniqueCategories = [...new Set(response.data.map(category => category.category_name))];
        setCategories(uniqueCategories); // Set unique categories
      } catch (err) {
        setError("Error fetching categories. Please try again."); // Set error message
      }
    };

    fetchFoodItems();
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
  };

  const filteredItems = foodItems.filter(
    (item) =>
      (selectedCategory === "All" || item.category_name === selectedCategory) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>{error}</div>; // Error state
  }

  return (
    <div className="home">
      <Navbar search={search} handleSearch={handleSearch} />

      {/* Categories */}
      <div className="categories">
        <button
          className={`category ${selectedCategory === "All" ? "active" : ""}`}
          onClick={() => filterByCategory("All")}
        >
          All
        </button>
        {categories.map((category, index) => (
          <button
            key={index} // Each category should have a unique index or id
            className={`category ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => filterByCategory(category)}
          >
            {category} {/* Display unique category name */}
          </button>
        ))}
      </div>

      {/* Food List */}
      <div className="food-list">
        {filteredItems.map((item) => (
          item.status_menu === "available" ? ( // Check for availability based on new status_menu field
            <Link key={item.menu_id} to={`/item/${item.menu_id}`} className="food-item">
              <img src={`http://127.0.0.1:8000/${item.image}`} alt={item.name} className="food-image" />
              <div className="food-details">
                <h2>{item.name}</h2>
                <p>${isNaN(parseFloat(item.price)) ? "N/A" : parseFloat(item.price).toFixed(2)}</p>
              </div>
            </Link>
          ) : (
            <div key={item.menu_id} className="food-item unavailable">
              <img src={`http://127.0.0.1:8000/${item.image}`} alt={item.name} className="food-image" />
              <div className="food-details">
                <h2>{item.name}</h2>
                <p>${isNaN(parseFloat(item.price)) ? "N/A" : parseFloat(item.price).toFixed(2)}</p>
              </div>
              <h1 className="unavailable-banner">Out of Stock</h1>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Home;