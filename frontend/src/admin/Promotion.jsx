import React, { useState } from 'react';
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPromotion({ ...newPromotion, [name]: value });
    };

    const handleImageChange = (e) => {
        setNewPromotion({ ...newPromotion, image: e.target.files[0] });
    };

    const handleAddPromotion = () => {
        if (isFormIncomplete()) {
            Swal.fire('Please fill in all fields.');
            return;
        }
        if (editingIndex !== null) {
            const updatedPromotions = promotions.map((promo, index) =>
                index === editingIndex ? newPromotion : promo
            );
            setPromotions(updatedPromotions);
            Swal.fire({
                title: 'Promotion updated successfully!',
                icon: 'success',
            });
        } else {
            setPromotions([...promotions, newPromotion]);
            Swal.fire({
                title: 'Promotion added successfully!',
                icon: 'success',
            });
        }
        resetForm();
    };

    const isFormIncomplete = () => {
        return !newPromotion.title || !newPromotion.description || !newPromotion.image || !newPromotion.dueDate;
    };

    const handleEditPromotion = (index) => {
        const promoToEdit = promotions[index];
        setNewPromotion(promoToEdit);
        setEditingIndex(index);
    };

    const handleRemovePromotion = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedPromotions = promotions.filter((_, i) => i !== index);
                setPromotions(updatedPromotions);
                Swal.fire('Deleted!', 'Your promotion has been deleted.', 'success');
            }
        });
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
                    required
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
                            <h3 className="promo-card-title">{promo.title}</h3>
                            <p className="promo-card-description">{promo.description}</p>
                            {promo.image && (
                                <img src={URL.createObjectURL(promo.image)} alt={promo.title} className="promo-card-image" />
                            )}
                            <p className="promo-card-due-date">Due Date: {promo.dueDate}</p>
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