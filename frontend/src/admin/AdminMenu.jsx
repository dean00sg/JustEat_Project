import React, { useState } from 'react';
import '../styles/AdminMenu.css';
import { useAuth } from '../contexts/Authcontext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Swal from 'sweetalert2';
import NavbarAdmin from '../components/Navbar/NavbarAdmin';

const AdminMenu = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate(); // Create navigate instance

  // Check authentication status
  if (isAuthenticated) {
    Swal.fire({
      title: 'Unauthorized',
      text: 'You need to be logged in to access this page.',
      icon: 'error',
      confirmButtonText: 'Ok'
    }).then(() => {
      window.location.href = '/login'; 
    });
    return null;
  }

  const [menuName, setMenuName] = useState('');
  const [menuImage, setMenuImage] = useState(null);
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(false);
  const [categories, setCategories] = useState(['Category 1', 'Category 2']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [options, setOptions] = useState([]);
  const [optionName, setOptionName] = useState('');
  const [optionPrice, setOptionPrice] = useState('');

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category) => {
    setCategories(categories.filter(c => c !== category));
  };

  const handleAddOption = () => {
    if (optionName && optionPrice) {
      setOptions([...options, { name: optionName, price: optionPrice }]);
      setOptionName('');
      setOptionPrice('');
    }
  };

  const handleRemoveOption = (option) => {
    setOptions(options.filter(o => o !== option));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      menuName,
      menuImage: menuImage ? menuImage.name : null,
      price,
      available,
      category: selectedCategory,
      options,
    };

    // Save menu data to local storage
    const existingItems = JSON.parse(localStorage.getItem("menuItems")) || [];
    localStorage.setItem("menuItems", JSON.stringify([...existingItems, formData]));

    // Save categories to local storage
    const existingCategories = JSON.parse(localStorage.getItem("categories")) || [];
    if (!existingCategories.includes(selectedCategory)) {
      existingCategories.push(selectedCategory);
      localStorage.setItem("categories", JSON.stringify(existingCategories));
    }

    // Show success message
    Swal.fire({
      title: 'Menu Created',
      text: 'Your menu has been created successfully!',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then(() => {
      navigate('/homeadmin'); // Navigate to HomeAdmin
    });

    console.log('Submitted Form Data:', formData);
    // Reset form
    setMenuName('');
    setMenuImage(null);
    setPrice('');
    setAvailable(false);
    setSelectedCategory('');
    setOptions([]);
  };

  return (
    <div className="admin-menu-page">
      <NavbarAdmin />
      <div className="admin-menu-form-container">
        <h1 className="admin-menu-form-title">Create Menu</h1>
        <form className="admin-menu-form" onSubmit={handleSubmit}>
          <div className="admin-menu-form-group">
            <label htmlFor="admin-menu-name">Menu Name</label>
            <input
              type="text"
              id="admin-menu-name"
              className="admin-form-input"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              required
            />
          </div>

          <div className="admin-menu-form-group">
            <label htmlFor="admin-menu-image">Menu Image</label>
            <input
              type="file"
              id="admin-menu-image"
              className="admin-form-input"
              onChange={(e) => setMenuImage(e.target.files[0])}
              required
            />
          </div>

          <div className="admin-menu-form-group">
            <label htmlFor="admin-price">Price</label>
            <input
              type="number"
              id="admin-price"
              className="admin-form-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              required
            />
          </div>

          <div className="admin-menu-form-group">
            <label htmlFor="admin-available">Available</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={available}
                onChange={() => setAvailable(!available)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="admin-menu-form-group">
            <label htmlFor="admin-categories">Categories</label>
            <select
              id="admin-categories"
              className="admin-form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="admin-category-container">
              <input
                type="text"
                className="admin-form-input"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add new category"
              />
              <button
                type="button"
                className="admin-button admin-add-category-button"
                onClick={handleAddCategory}
              >
                Add
              </button>
              <ul className="admin-category-list">
                {categories.map(category => (
                  <li key={category} className="admin-category-item">
                    {category}
                    <button
                      type="button"
                      className="admin-button admin-remove-category-button"
                      onClick={() => handleRemoveCategory(category)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="admin-menu-form-group">
            <label htmlFor="admin-options">Options</label>
            <div className="admin-option-container">
              <input
                type="text"
                className="admin-form-input"
                value={optionName}
                onChange={(e) => setOptionName(e.target.value)}
                placeholder="Option name"
              />
              <input
                type="number"
                className="admin-form-input"
                value={optionPrice}
                onChange={(e) => setOptionPrice(e.target.value)}
                placeholder="Option price"
                min="0"
              />
              <button
                type="button"
                className="admin-button admin-add-option-button"
                onClick={handleAddOption}
              >
                Add Option
              </button>
              <ul className="admin-option-list">
                {options.map(option => (
                  <li key={option.name} className="admin-option-item">
                    {option.name} (${option.price})
                    <button
                      type="button"
                      className="admin-button admin-remove-option-button"
                      onClick={() => handleRemoveOption(option)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button type="submit" className="admin-button admin-submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminMenu;
