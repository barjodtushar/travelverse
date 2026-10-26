import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userString = localStorage.getItem('user');
        const userObj = userString ? JSON.parse(userString) : null;
        const userId = userObj?.id || userObj?._id;

        if (!userId) {
          navigate('/login');
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/bookings/user/${userId}`);
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading bookings...</div>;

  return (
    <div className="explore-container">
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h2 className="page-title">Your Bookings</h2>
        <p className="page-subtitle">Review your confirmed reservations and travel status.</p>
      </div>

      {error && <p style={{ color: '#E53E3E', textAlign: 'center' }}>{error}</p>}

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '40px', color: '#7F8C8D' }}>
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="list-card-container">
          {bookings.map((booking) => {
            const tripTitle = booking.tripId?.title || booking.destinationTitle || 'Confirmed Trip';
            
            // Safely resolve destination if it's an object, string, or ID reference
            const dest = booking.tripId?.destination;
            let destinationName = 'India';
            if (typeof dest === 'string' && !dest.match(/^[0-9a-fA-F]{24}$/)) {
              destinationName = dest;
            } else if (dest && typeof dest === 'object') {
              destinationName = dest.name || dest.title || dest.location || 'India';
            } else if (booking.destinationName) {
              destinationName = booking.destinationName;
            } else {
              // Fallback to trip title if destination field contains an unpopulated ID string
              destinationName = tripTitle;
            }

            const amount = booking.totalAmount || booking.totalPrice || booking.price || booking.tripId?.budget || 0;
            const status = booking.paymentStatus || booking.status || 'Confirmed';

            return (
              <div key={booking._id} className="theme-list-card" style={{ background: '#fff', padding: '20px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <div className="theme-list-info">
                  <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Trip: {tripTitle}</h3>
                  <p style={{ margin: '5px 0' }}><strong>Destination:</strong> {destinationName}</p>
                  <p style={{ margin: '5px 0' }}><strong>Total Amount:</strong> ₹{amount}</p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Payment Status:</strong> <span style={{ color: '#2F855A', fontWeight: '600' }}>{status}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Bookings;