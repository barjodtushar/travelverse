import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserTrips, getUserBookings } from '../services/api';

function Home() {
  const [tripCount, setTripCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser._id || currentUser.id;
  const userName = currentUser.name || 'Traveler';

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const [tripsRes, bookingsRes] = await Promise.all([
          getUserTrips(userId),
          getUserBookings(userId)
        ]);
        setTripCount(tripsRes.data.length);
        setBookingCount(bookingsRes.data.length);
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '18px' }}>Loading your dashboard...</div>;
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, #007bff, #0056b3)', color: 'white', padding: '40px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,123,255,0.2)' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>Welcome back, {userName}! 🌍</h1>
        <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>Ready to plan your next adventure? Explore destinations, organize your itinerary, and track expenses all in one place.</p>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '15px' }}>Planned Trips</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>{tripCount}</p>
        </div>
        <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '15px' }}>Active Bookings</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>{bookingCount}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 style={{ marginBottom: '20px', color: '#333' }}>Quick Actions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <button 
          onClick={() => navigate('/explore')}
          style={{ padding: '20px', background: '#fff', border: '1px solid #007bff', borderRadius: '8px', color: '#007bff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
        >
          🔍 Explore Destinations
        </button>
        <button 
          onClick={() => navigate('/create-trip')}
          style={{ padding: '20px', background: '#fff', border: '1px solid #28a745', borderRadius: '8px', color: '#28a745', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
        >
          ✈️ Plan New Trip
        </button>
        <button 
          onClick={() => navigate('/trips')}
          style={{ padding: '20px', background: '#fff', border: '1px solid #17a2b8', borderRadius: '8px', color: '#17a2b8', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
        >
          📋 View My Trips
        </button>
      </div>
    </div>
  );
}

export default Home;