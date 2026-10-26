import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="travel-navbar">
      <Link to="/explore" className="travel-logo">TravelVerse</Link>
      <div className="travel-nav-links">
        {token ? (
          <>
            <Link to="/explore" className="travel-nav-link">Explore</Link>
            <Link to="/trips" className="travel-nav-link">My Trips</Link>
            <Link to="/bookings" className="travel-nav-link">Bookings</Link>
            <button onClick={handleLogout} className="travel-logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="travel-nav-link">Login</Link>
            <Link to="/register" className="travel-nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;