import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import "../styles/HomeAdmin.css";
import NavbarAdmin from "../components/Navbar/NavbarAdmin";
import { FaEdit } from "react-icons/fa"; // Importing edit icon from react-icons

const HomeAdmin = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [foodItems, setFoodItems] = useState([]); // State for food items
  const [categories, setCategories] = useState([]); // State for categories
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/menu/"); // Fetch food items
        // console.log("Fetched Food Items:", response.data);
        setFoodItems(response.data); // Set the food items state with the fetched data
      } catch (err) {
        setError("Error fetching food items. Please try again."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after the request
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/category/"); // Fetch categories
        // console.log("Fetched Categories:", response.data);

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
      <NavbarAdmin search={search} handleSearch={handleSearch} />

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
          <Link key={item.menu_id} to={`/admin/edit/${item.menu_id}`} className="food-item">
            <img src={`http://127.0.0.1:8000/${item.image}`} alt={item.name} className="food-image" />
            <div className="food-details">
              <h2>{item.name}</h2>
              <p>
                ${isNaN(parseFloat(item.price)) ? "N/A" : parseFloat(item.price).toFixed(2)}
              </p> {/* Handle price safely */}
              <Link to={`/admin/edit/${item.menu_id}`} className="edit-button">
                <FaEdit /> {/* Using the edit icon */}
              </Link>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomeAdmin;