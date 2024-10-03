import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext';
import '../styles/Login_regis.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Create form data in x-www-form-urlencoded format
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/authentication/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        const accessToken = data.access_token;
        localStorage.setItem('token', accessToken);
        login();
        setUsername('');
        setPassword('');
        navigate('/homeadmin');
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('Error logging in. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    navigate('/homeadmin');
    return null;
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <a href="/register" className="link">Don't have an account? Register</a>
    </div>
  );
}

export default Login;