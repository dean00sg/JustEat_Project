import React, { useState, useEffect } from "react";
import "../styles/AdminMenu.css"; // Ensure this points to your CSS file
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import NavbarAdmin from "../components/Navbar/NavbarAdmin";
import axios from "axios";
import qs from "qs"; 

const AdminMenu = () => {
  const navigate = useNavigate();

  const [menuName, setMenuName] = useState("");
  const [menuImage, setMenuImage] = useState(null);
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Store category_id
  const [newCategory, setNewCategory] = useState("");
  const [options, setOptions] = useState([]);
  const [optionName, setOptionName] = useState("");
  const [optionPrice, setOptionPrice] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/category/", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        console.log("Categories fetched:", response.data); // Log the response

        const categoryData = response.data;

        if (categoryData && categoryData.length > 0) {
          setCategories(categoryData);
        }
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategories();

    const storedCategory = localStorage.getItem("selectedCategory");
    if (storedCategory) {
      const storedCategoryId = localStorage.getItem("selectedCategoryId");
      setSelectedCategory(storedCategory);
      setSelectedCategoryId(storedCategoryId);
    }
  }, []);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.some((cat) => cat.category_name === newCategory)) {
      const newCat = { category_name: newCategory, category_id: Date.now() }; // Temporary ID for frontend use
      setCategories((prev) => [...prev, newCat]);
      setNewCategory("");
    } else {
      Swal.fire({
        title: "Duplicate Category",
        text: "This category already exists.",
        icon: "warning",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleRemoveCategory = (category) => {
    setCategories((prev) => prev.filter((c) => c.category_id !== category.category_id));
  };

  const handleAddOption = () => {
    if (optionName && optionPrice) {
      setOptions((prev) => [...prev, { name: optionName, price: optionPrice }]);
      setOptionName("");
      setOptionPrice("");
    }
  };

  const handleRemoveOption = (option) => {
    setOptions((prev) => prev.filter((o) => o.name !== option.name));
  };

  // Retrieve the Bearer token from local storage
  const getToken = () => {
    return localStorage.getItem("token");
  };

  const submitMenu = async () => {
    try {
      const formData = new FormData(); // Create a FormData object

      // Append data to FormData
      formData.append("name", menuName);
      formData.append("image", menuImage); // Directly append the file
      formData.append("price", price.toString());
      formData.append("category_id", selectedCategoryId);
      formData.append("remark", ""); // Add remark if needed

      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Send the FormData object
      const response = await axios.post("http://127.0.0.1:8000/menu/", formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          // No need to set Content-Type; Axios sets it to multipart/form-data automatically
        },
        withCredentials: true,
      });

      return response; // Return response for further handling
    } catch (error) {
      console.error("Error submitting the menu:", error.message);
      throw error; // Re-throw the error for handling in handleSubmit
    }
  };

  const submitCategories = async () => {
    // Fetch existing categories from the server
    const existingCategoriesResponse = await axios.get("http://127.0.0.1:8000/category/", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const existingCategories = existingCategoriesResponse.data.map((cat) => cat.category_name);

    // Filter out categories that already exist on the server
    const newCategories = categories.filter(
      (category) => !existingCategories.includes(category.category_name)
    );

    if (newCategories.length > 0) {
      const categoryPromises = newCategories.map((category) =>
        axios.post(
          "http://127.0.0.1:8000/category/",
          { category_name: category.category_name, remark: "" },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        )
      );

      return Promise.all(categoryPromises);
    } else {
      console.log("No new categories to submit.");
    }
  };

  const submitOptions = async () => {
    const optionPromises = options.map((option) => {
      const optionData = {
        option_name: option.name,
        category_id: selectedCategoryId,
        price: option.price.toString(),
        remark: "",
      };

      console.log("Option data being sent:", optionData); // Log the data

      return axios.post(
        "http://127.0.0.1:8000/option/",
        qs.stringify(optionData), // Use qs to serialize the data
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/x-www-form-urlencoded", // Set the content type
          },
        }
      );
    });

    return Promise.all(optionPromises);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await submitCategories(); // Submit categories first
      await submitOptions(); // Then submit options
      const response = await submitMenu(); // Capture the response

      if (response.status === 201) {
        Swal.fire({
          title: "Menu Created",
          text: "Your menu has been created successfully!",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          // Save the selected category and its ID to local storage
          localStorage.setItem("selectedCategory", selectedCategory);
          localStorage.setItem("selectedCategoryId", selectedCategoryId);
          navigate("/homeadmin");
        });
      }
    } catch (error) {
      console.error("Error creating menu:", error.message);
      Swal.fire({
        title: "Created Success",
        text: "Your menu has been created successfully, but there were some errors!",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        // Save the selected category and its ID to local storage
        localStorage.setItem("selectedCategory", selectedCategory);
        localStorage.setItem("selectedCategoryId", selectedCategoryId);
        navigate("/homeadmin");
      });
    }
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
            <label htmlFor="admin-categories">Categories</label>
            <select
              id="admin-categories"
              className="admin-form-select"
              value={selectedCategory}
              onChange={(e) => {
                const selectedCat = categories.find(
                  (cat) => cat.category_name === e.target.value
                );

                if (selectedCat) {
                  setSelectedCategory(e.target.value);
                  setSelectedCategoryId(selectedCat.category_id); // Ensure category_id is set
                } else {
                  setSelectedCategoryId(null);
                }

                console.log("Selected category:", selectedCat);
              }}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_name}>
                  {category.category_name}
                </option>
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
                {categories.map((category) => (
                  <li key={category.category_id} className="admin-category-item">
                    {category.category_name}
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
            <div className="admin-options-container">
              <input
                type="text"
                className="admin-form-input"
                value={optionName}
                onChange={(e) => setOptionName(e.target.value)}
                placeholder="Option Name"
              />
              <input
                type="number"
                className="admin-form-input"
                value={optionPrice}
                onChange={(e) => setOptionPrice(e.target.value)}
                placeholder="Option Price"
                min="0"
              />
              <button
                type="button"
                className="admin-button admin-add-option-button"
                onClick={handleAddOption}
              >
                Add Option
              </button>
            </div>
            <ul className="admin-options-list">
              {options.map((option) => (
                <li key={option.name} className="admin-option-item">
                  {option.name} - {option.price}
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

          <div className="admin-menu-form-group">
            <button type="submit" className="admin-button admin-submit-button">
              Create Menu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminMenu;