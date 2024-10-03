import React, { useState, useEffect } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import "../styles/EditMenu.css";
import Swal from "sweetalert2";
import NavbarAdmin from "../components/Navbar/NavbarAdmin";

const EditMenu = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const itemId = parseInt(id, 10); // Ensure itemId is an integer

  // State variables
  const [menuName, setMenuName] = useState("");
  const [menuImage, setMenuImage] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [options, setOptions] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch the menu item when the component mounts
  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/menu/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok)
          throw new Error(
            `Failed to fetch menu item. Status: ${response.status}`
          );

        const itemToEdit = await response.json();
        setMenuName(itemToEdit.name);
        setCurrentImage(itemToEdit.image);
        setPrice(itemToEdit.price);
        setAvailable(itemToEdit.status_menu === "available");

        // Set the selected category and fetch options for it
        const categoryId = itemToEdit.category_id;
        if (categoryId) {
          setSelectedCategory(itemToEdit.category_name);
          setSelectedCategoryId(categoryId); // Set the selected category ID
          fetchOptions(categoryId); // Fetch options for the category
        }
      } catch (error) {
        console.error("Error fetching menu item:", error);
        Swal.fire({
          title: "Error!",
          text:
            error.message || "An error occurred while fetching the menu item.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    };

    fetchMenuItem();
  }, [itemId, token]);

  // Fetch all categories from the /category/ endpoint
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/category/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok)
          throw new Error(
            `Failed to fetch categories. Status: ${response.status}`
          );

        const categoriesData = await response.json();
        setCategories(categoriesData);
        
        // If categories exist, set the selected category based on the fetched menu item
        if (categoriesData.length > 0) {
          const itemCategoryId = categoriesData.find(
            (cat) => cat.category_name === selectedCategory
          )?.category_id;

          if (itemCategoryId) {
            setSelectedCategoryId(itemCategoryId); // Set the selected category ID from the fetched categories
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        Swal.fire({
          title: "Error!",
          text: error.message || "An error occurred while fetching categories.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    };

    fetchCategories();
  }, [token, selectedCategory]);

  // Fetch options for a specific category
  const fetchOptions = async (categoryId) => {
    if (!categoryId) return; // Prevent fetching options if categoryId is undefined
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/option/filter/?category_id=${categoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok)
        throw new Error(`Failed to fetch options. Status: ${response.status}`);

      const optionsData = await response.json();
      setOptions(optionsData);
    } catch (error) {
      console.error("Error fetching options:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "An error occurred while fetching options.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  // Handle option changes in the options list
  const handleOptionChange = (index, field, value) => {
    setOptions((prevOptions) =>
      prevOptions.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
      )
    );
  };

  // Remove an option from the options list
  const handleRemoveOption = (index) => {
    setOptions((prevOptions) => prevOptions.filter((_, i) => i !== index));
  };

  // Add a new option to the options list
  const handleAddOption = () => {
    setOptions((prevOptions) => [
      ...prevOptions,
      { option_name: "", price: 0 },
    ]);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a FormData object to handle multipart/form-data
    const formData = new FormData();
    formData.append("menu_id", itemId);
    formData.append("name", menuName);
    if (menuImage) {
      const fileBlob = await fetch(menuImage).then((res) => res.blob());
      const uniqueFileName = `menu-image-${Date.now()}.png`;
      formData.append("image", fileBlob, uniqueFileName); // Append the new image
    }
    if (selectedCategoryId) {
      formData.append("category_id", selectedCategoryId);
    }
    formData.append("price", price.toString());
    formData.append("status_menu", available ? "available" : "not available");

    // Log the data being sent
    console.log("Form Data to Update Menu:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/menu/${itemId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          title: "Menu Updated",
          text: "Your menu has been updated successfully!",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          navigate("/homeadmin");
        });
      } else {
        console.error("Update failed:", response.status, response.statusText);
        Swal.fire({
          title: "Error!",
          text: "Failed to update menu item.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.error("Error updating menu item:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while updating the menu item.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
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
                  reader.onloadend = () => setMenuImage(reader.result);
                  reader.readAsDataURL(file);
                }
              }}
            />
            {menuImage ? (
              <img src={menuImage} alt="Menu" className="image-preview" />
            ) : (
              currentImage && (
                <img
                  src={`http://127.0.0.1:8000/${currentImage}`}
                  alt="Current Menu"
                  className="image-preview"
                />
              )
            )}
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
              <span className="slider round"></span>
            </label>
          </div>

          <div className="admin-menu-form-group">
            <label htmlFor="admin-category">Category</label>
            <select
              id="admin-category"
              className="admin-form-select"
              value={selectedCategory}
              onChange={(e) => {
                const category = categories.find(
                  (cat) => cat.category_name === e.target.value
                );
                if (category) {
                  setSelectedCategory(category.category_name);
                  setSelectedCategoryId(category.category_id); // Set the ID
                  fetchOptions(category.category_id); // Fetch options for the selected category
                }
              }}
            >
              {categories.map((category) => (
                <option
                  key={category.category_id}
                  value={category.category_name}
                >
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-menu-form-options">
            <h2>Options</h2>
            <div className="admin-options-container">
              {options.map((option, index) => (
                <div key={index} className="admin-option">
                  <input
                    type="text"
                    value={option.option_name}
                    onChange={(e) =>
                      handleOptionChange(index, "option_name", e.target.value)
                    }
                    placeholder="Option Name"
                    className="admin-form-input"
                  />
                  <input
                    type="number"
                    value={option.price}
                    onChange={(e) =>
                      handleOptionChange(
                        index,
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="Option Price"
                    className="admin-form-input"
                    min="0"
                  />
                  <button
                    type="button"
                    className="admin-remove-option-button"
                    onClick={() => handleRemoveOption(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="admin-button admin-add-option-button"
              onClick={handleAddOption}
            >
              Add Option
            </button>
          </div>

          <button type="submit" className="admin-form-submit">
            Update Menu
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMenu;
