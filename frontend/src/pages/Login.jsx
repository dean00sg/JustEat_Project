import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext';
import '../styles/Login_regis.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    // Get stored users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
      login(); // Set authentication to true
      navigate('/admin-menu');
    } else {
      setError('Invalid email or password');
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/admin-menu');
    return null; // Prevent rendering of the login form
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <a href="/register" className="link">Don't have an account? Register</a>
    </div>
  );
}

export default Login;