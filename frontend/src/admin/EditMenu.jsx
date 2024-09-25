import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import foodItems from '../assets/data';
import '../styles/EditMenu.css';
import Swal from 'sweetalert2';
import NavbarAdmin from '../components/Navbar/NavbarAdmin';

const EditMenu = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const itemId = parseInt(id);

  const [menuName, setMenuName] = useState('');
  const [menuImage, setMenuImage] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(false);
  const [categories] = useState(['Pizza', 'Burgers', 'Chicken', 'Salads', 'Desserts', 'Drinks']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const itemToEdit = foodItems.find(item => item.id === itemId);
    if (itemToEdit) {
      setMenuName(itemToEdit.name);
      setMenuImage(itemToEdit.image);
      setPrice(itemToEdit.price);
      setAvailable(itemToEdit.stock > 0);
      setSelectedCategory(itemToEdit.category);
      setOptions(itemToEdit.options);
    }
  }, [itemId]);

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][field] = value;
    setOptions(updatedOptions);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, { name: '', price: '' }]); // Add a new option with empty fields
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      id: itemId,
      name: menuName,
      image: menuImage,
      price: parseFloat(price),
      stock: available ? 1 : 0,
      category: selectedCategory,
      options,
    };

    const updatedItems = foodItems.map(item =>
      item.id === itemId ? formData : item
    );

    localStorage.setItem("menuItems", JSON.stringify(updatedItems));

    Swal.fire({
      title: 'Menu Updated',
      text: 'Your menu has been updated successfully!',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then(() => {
      navigate('/homeadmin');
    });
  };

  return (
    <div className="admin-menu-page">
      <NavbarAdmin />
      <div className="admin-menu-form-container">
        <h1 className="admin-menu-form-title">Edit Menu</h1>
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
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setMenuImage(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {menuImage && <img src={menuImage} alt="Menu" className="image-preview" />}
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
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="admin-menu-form-group">
            <label htmlFor="admin-options">Options</label>
            <div className="admin-option-container">
              {options.map((option, index) => (
                <div key={index} className="admin-option-item">
                  <input
                    type="text"
                    value={option.name}
                    onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                    placeholder="Option Name"
                    className="admin-form-input"
                  />
                  <input
                    type="number"
                    value={option.price}
                    onChange={(e) => handleOptionChange(index, 'price', e.target.value)}
                    placeholder="Option Price"
                    className="admin-form-input"
                  />
                  <button type="button" className="admin-remove-option-button" onClick={() => handleRemoveOption(index)}>Remove</button>
                </div>
              ))}
            </div>
            <button type="button" className="admin-button admin-add-option-button" onClick={handleAddOption}>
              Add Option
            </button>
          </div>

          <button type="submit" className="admin-button admin-submit-button">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMenu;
