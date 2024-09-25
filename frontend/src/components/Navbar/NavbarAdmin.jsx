import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiPlusCircle, FiTag, FiShoppingBag, FiLogOut, FiSearch } from "react-icons/fi";
import "./NavbarAdmin.css";

const NavbarAdmin = ({ search, handleSearch }) => {
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
        <Link to="/homeadmin" className="navbar-admin-logo">JustEatAdmin</Link>
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
                <Link to="/create" className="navbar-admin-menu-item">
                  <FiPlusCircle size={18} />
                  <span>Create Menu</span>
                </Link>
                <Link to="/create-promotion" className="navbar-admin-menu-item">
                  <FiTag size={18} />
                  <span>Create Promotion</span>
                </Link>
                <Link to="/orders" className="navbar-admin-menu-item">
                  <FiShoppingBag size={18} />
                  <span>Orders</span>
                </Link>
                <Link to="/" className="navbar-admin-menu-item">
                  <FiLogOut size={18} />
                  <span>Logout</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
