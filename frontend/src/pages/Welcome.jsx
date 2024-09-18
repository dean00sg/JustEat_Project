// src/welcome/Welcome.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Welcome.css'; // หรือชื่อ CSS ที่คุณใช้
import Navbar from '../components/Navbar/Navbar'; // นำเข้า Navbar Component
import { FaArrowRight } from 'react-icons/fa'; // นำเข้าไอคอนลูกศร
import pizzapro from '../assets/picture/pizzapro.png';
import burgers from '../assets/picture/burgers.png';
import dessert from '../assets/picture/dessert.png';

const promotions = [
  {
    id: 1,
    title: 'Buy 1 Get 1 Free Pizza',
    description: 'Enjoy our special offer of buy one pizza and get one free. Valid till end of the month.',
    image: pizzapro
  },
  {
    id: 2,
    title: '20% Off on Burgers',
    description: 'Get 20% off on all our delicious burgers. Hurry, offer valid till stocks last.',
    image: burgers
  },
  {
    id: 3,
    title: 'Free Dessert with Every Meal',
    description: 'Order any meal and get a free dessert of your choice. Limited time offer.',
    image: dessert
  }
];

const Welcome = () => {
  return (
    <div className="welcome">
      <Navbar /> {/* ใช้ Navbar */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to JustEat!</h1>
          <p>Discover our latest promotions and enjoy amazing deals!</p>
          <Link to="/menu" className="home-button">
            Go to Menu <FaArrowRight className="arrow-icon" />
          </Link>
        </div>
      </div>
      <div className="promotions">
        {promotions.map((promo) => (
          <div key={promo.id} className="promotion-item">
            <img src={promo.image} alt={promo.title} className="promotion-image" />
            <div className="promotion-details">
              <h2>{promo.title}</h2>
              <p>{promo.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Welcome;
