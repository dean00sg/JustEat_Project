// src/home/Home.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import foodItems from "../assets/data";
import "../styles/Home.css"; // หรือชื่อ CSS ที่คุณใช้
import Navbar from "../components/Navbar/Navbar";

const Home = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = [
    "All",
    "Pizza",
    "Burgers",
    "Chicken",
    "Salads",
    "Desserts",
    "Drinks",
  ];

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
  };

  const filteredItems = foodItems.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home">
        <Navbar search={search} handleSearch={handleSearch}/>

      {/* Categories */}
      <div className="categories">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`category ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => filterByCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Food List */}
      <div className="food-list">
        {filteredItems.map((item) => (
          <Link key={item.id} to={`/item/${item.id}`} className="food-item">
            <img src={item.image} alt={item.name} className="food-image" />
            <div className="food-details">
              <h2>{item.name}</h2>
              <p>${item.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
