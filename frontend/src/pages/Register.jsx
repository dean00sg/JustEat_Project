import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login_regis.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Reset error state
    setError('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Prepare the registration data
    const registrationData = {
      username,
      email,
      password,
    };

    try {
      // Send registration data to the API
      const response = await axios.post('http://127.0.0.1:8000/authentication/register', registrationData);
      
      if (response.status === 200) {
        console.log('Registered successfully:', response.data);
        // Redirect to the login page after successful registration
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      
      // Check if error response exists and set appropriate error message
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Failed to register. Please try again.');
      } else {
        setError('Failed to register. Please try again.');
      }
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Register</button>
      </form>
      <a href="/login" className="link">Already have an account? Login</a>
    </div>
  );
}

export default Register;