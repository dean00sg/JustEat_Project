// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHistory, FaSearch } from 'react-icons/fa';
import './Navbar.css'; // ตรวจสอบเส้นทาง CSS ที่ถูกต้อง

const Navbar = ({ search, handleSearch }) => {
  const navigate = useNavigate(); // Get the navigate function from useNavigate

  const handleCartClick = () => {
    navigate('/cart'); // Navigate to the /cart page
  };

  const handleHistoryClick = () => {
    navigate('/history'); 
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <h1>JustEat</h1>
      </Link>
      <div className="navbar-icons">
        <FaSearch className="icon" />
        <input
          type="text"
          placeholder="Search for food..."
          value={search}
          onChange={handleSearch}
        />
        <FaShoppingCart className="icon" onClick={handleCartClick} /> {/* Add onClick handler */}
        <FaHistory className="icon" onClick={handleHistoryClick}/>
      </div>
    </nav>
  );
};

export default Navbar;