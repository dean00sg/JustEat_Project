import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import { FaShoppingCart, FaHistory } from 'react-icons/fa';
import "./NavbarAdmin.css";

const Navbar = ({ search, handleSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(search);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch({ target: { value: searchTerm } });
  };

  return (
    <nav className="navbar-admin">
      <div className="navbar-admin-container">
        <Link to="/" className="navbar-admin-logo">JustEat</Link>
        <div className="navbar-admin-icons">
          <form className="navbar-admin-search-container" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="navbar-admin-search-input"
            />
            <button type="submit" className="navbar-admin-search-button">
              <FiSearch size={18} />
            </button>
          </form>
          <div className="navbar-admin-menu-container">
            <button onClick={toggleMenu} className="navbar-admin-menu-button">
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            {isMenuOpen && (
              <div className="navbar-admin-dropdown-menu">
                <Link to="/cart" className="navbar-admin-menu-item">
                  <FaShoppingCart size={18} />
                  <span>Cart</span>
                </Link>
                <Link to="/history" className="navbar-admin-menu-item">
                  <FaHistory size={18} />
                  <span>History</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;