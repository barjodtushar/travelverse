import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="travel-footer">
      <div className="footer-content">
        <div>
          <span className="footer-brand">TravelVerse</span>
          <p style={{ marginTop: '5px', fontSize: '13px' }}>
            Plan, book, and manage your journeys effortlessly.
          </p>
        </div>
        <div className="footer-links">
          <Link to="/explore" className="footer-link">Explore</Link>
          <Link to="/trips" className="footer-link">My Trips</Link>
          <Link to="/bookings" className="footer-link">Bookings</Link>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} TravelVerse. Built with MERN Stack. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;