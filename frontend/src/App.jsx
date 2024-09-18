import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FoodDetail from './pages/FoodDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Welcome from './pages/Welcome';
import Cart from './pages/Cart';
import History from './pages/History';
import Checkout from './pages/Checkout';
import AdminMenu from './admin/AdminMenu';
import { AuthProvider } from './contexts/Authcontext';
import PrivateRoute from './admin/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/item/:id" element={<FoodDetail />} />
            <Route path="/menu" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/history" element={<History />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private Routes */}
            <Route path="/admin-menu" element={
              <PrivateRoute>
                <AdminMenu />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
