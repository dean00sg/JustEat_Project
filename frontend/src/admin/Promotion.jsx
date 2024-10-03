import React, { useState, useEffect } from 'react';
import "../styles/Promotion.css"; // Import your CSS styles
import NavbarAdmin from '../components/Navbar/NavbarAdmin';
import Swal from 'sweetalert2';

const PromotionsPage = () => {
    const [promotions, setPromotions] = useState([]);
    const [newPromotion, setNewPromotion] = useState({
        title: '',
        description: '',
        image: null,
        dueDate: ''
    });
    const [editingIndex, setEditingIndex] = useState(null);

    // Fetch promotions from the server (GET request)
    useEffect(() => {
        const fetchPromotions = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch('http://127.0.0.1:8000/promotion/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                console.log(data)
                setPromotions(data);
            } catch (error) {
                console.error('Error fetching promotions:', error);
            }
        };
        fetchPromotions();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPromotion({ ...newPromotion, [name]: value });
    };

    const handleImageChange = (e) => {
        setNewPromotion({ ...newPromotion, image: e.target.files[0] });
    };

    // Add or Update Promotion (POST or PUT request)
    const handleAddPromotion = async () => {
        if (isFormIncomplete()) {
            Swal.fire('Please fill in all fields.');
            return;
        }

        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append('header', newPromotion.title);
        formData.append('description', newPromotion.description);
        formData.append('enddatetime', newPromotion.dueDate);
        formData.append('menu_id', 1); // Assuming menu_id is 1 for this example
        formData.append('image', newPromotion.image);

        try {
            let url = 'http://127.0.0.1:8000/promotion/';
            let method = 'POST';

            if (editingIndex !== null) {
                // If editing, use PUT and include the promotion ID
                url = `http://127.0.0.1:8000/promotion/${promotions[editingIndex].promotion_id}/`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (response.ok) {
                Swal.fire({
                    title: editingIndex !== null ? 'Promotion updated successfully!' : 'Promotion added successfully!',
                    icon: 'success',
                });
                const result = await response.json();

                if (editingIndex !== null) {
                    // Update the edited promotion in the list
                    const updatedPromotions = promotions.map((promo, index) =>
                        index === editingIndex ? result : promo
                    );
                    setPromotions(updatedPromotions);
                } else {
                    // Add the new promotion to the list
                    setPromotions([...promotions, result]);
                }
                resetForm();
            } else {
                Swal.fire('Error', 'Failed to submit the promotion', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to submit the promotion', 'error');
        }
    };

    const handleRemovePromotion = async (index) => {
        const token = localStorage.getItem("token");

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/promotion/${promotions[index].promotion_id}/`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        // Remove the promotion from the list
                        const updatedPromotions = promotions.filter((_, i) => i !== index);
                        setPromotions(updatedPromotions);
                        Swal.fire('Deleted!', 'Your promotion has been deleted.', 'success');
                    } else {
                        Swal.fire('Error', 'Failed to delete the promotion', 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Failed to delete the promotion', 'error');
                }
            }
        });
    };

    const isFormIncomplete = () => {
        return !newPromotion.title || !newPromotion.description || !newPromotion.image || !newPromotion.dueDate;
    };

    const handleEditPromotion = (index) => {
        const promoToEdit = promotions[index];
        setNewPromotion({
            title: promoToEdit.header,
            description: promoToEdit.description,
            image: promoToEdit.image, // If you store image as a URL, you might need a different approach
            dueDate: promoToEdit.enddatetime.split('T')[0], // Extract date part from datetime
        });
        setEditingIndex(index);
    };

    const resetForm = () => {
        setNewPromotion({ title: '', description: '', image: null, dueDate: '' });
        setEditingIndex(null);
    };

    return (
        <div className="promo-page">
            <NavbarAdmin />
            <h1 className="promo-title">{editingIndex !== null ? 'Edit Promotion' : 'Create Promotions'}</h1>
            <div className="promo-form">
                <input
                    type="text"
                    name="title"
                    value={newPromotion.title}
                    onChange={handleInputChange}
                    placeholder="Promotion Title"
                    required
                />
                <textarea
                    name="description"
                    value={newPromotion.description}
                    onChange={handleInputChange}
                    placeholder="Promotion Description"
                    required
                />
                <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    required={editingIndex === null} // Only required for new promotions
                />
                <input
                    type="date"
                    name="dueDate"
                    value={newPromotion.dueDate}
                    onChange={handleInputChange}
                    required
                />
                <div className="promo-button-container">
                    <button className="promo-button" onClick={handleAddPromotion}>
                        {editingIndex !== null ? 'Update Promotion' : 'Add Promotion'}
                    </button>
                </div>
            </div>
            <div className="promo-list">
                <h2 className="promo-list-title">Current Promotions</h2>
                <div className="promo-card-container">
                    {promotions.map((promo, index) => (
                        <div key={index} className="promo-card">
                            <h3 className="promo-card-title">{promo.header}</h3>
                            <p className="promo-card-description">{promo.description}</p>
                            {promo.image && (
                                <img src={`http://127.0.0.1:8000/${promo.image}`} alt={promo.header} className="promo-card-image" />
                            )}
                            <p className="promo-card-due-date">Due Date: {promo.enddatetime.split('T')[0]}</p>
                            <div className="promo-list-button-container">
                                <button className="promo-list-button" onClick={() => handleEditPromotion(index)}>Edit</button>
                                <button className="promo-list-button" onClick={() => handleRemovePromotion(index)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PromotionsPage;