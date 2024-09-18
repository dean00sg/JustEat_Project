import React, { useState } from 'react';
import '../styles/AdminMenu.css';
import Navbar from '../components/Navbar/Navbar';
import { useAuth } from '../contexts/Authcontext'; // Corrected import path
import Swal from 'sweetalert2';

const AdminMenu = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    Swal.fire({
      title: 'Unauthorized',
      text: 'You need to be logged in to access this page.',
      icon: 'error',
      confirmButtonText: 'Ok'
    }).then(() => {
      window.location.href = '/login'; // Redirect to login page
    });
    return null;
  }

  const [menuName, setMenuName] = useState('');
  const [menuImage, setMenuImage] = useState(null);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categories, setCategories] = useState(['Category 1', 'Category 2']); // Sample categories
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
      menuImage: menuImage ? menuImage.name : null, // Log file name instead of file object
      price,
      stock,
      category: selectedCategory,
      categories,
      options,
    };
    console.log('Submitted Form Data:', formData);
  };

  return (
    <div className="admin-menu-page">
      <Navbar />
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
            <label htmlFor="admin-stock">Stock</label>
            <input
              type="number"
              id="admin-stock"
              className="admin-form-input"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="0"
              required
            />
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