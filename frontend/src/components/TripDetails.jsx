import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserTrips, createBooking, deleteTrip } from '../services/api';
import WeatherWidget from '../components/WeatherWidget';
import DestinationMap from '../components/DestinationMap';

function TripDetails() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser._id || currentUser.id;
  const userEmail = currentUser.email; // Extracted email for member lookup

  const loadTrips = async () => {
    if (!userId && !userEmail) {
      setError('User not logged in properly.');
      setLoading(false);
      return;
    }

    try {
      // Pass both userId and email (if supported by your api endpoint)
      const response = await getUserTrips(userId || userEmail);
      setTrips(response.data);
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError('Failed to load your trips.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, [userId, userEmail]);

  const handleBookTrip = async (trip) => {
    try {
      await createBooking({
        userId,
        tripId: trip._id,
        totalAmount: trip.budget,
        paymentStatus: 'Pending'
      });
      setMessage(`Booking initialized for ${trip.title}!`);
      setTimeout(() => navigate('/bookings'), 1500);
    } catch (err) {
      console.error("Error creating booking:", err);
      setError('Failed to book trip. Please try again.');
    }
  };

  const handleViewExpenses = (trip) => {
    navigate(`/trips/${trip._id}/expenses`, { state: { trip } });
  };

  const handleEditTrip = (trip) => {
    navigate(`/trips/edit/${trip._id}`, { state: { trip } });
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      await deleteTrip(tripId);
      setMessage('Trip deleted successfully.');
      loadTrips();
    } catch (err) {
      console.error("Error deleting trip:", err);
      setError('Failed to delete trip.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '18px' }}>Loading your trips...</div>;
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Your Planned Trips</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {message && <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>{message}</p>}

      {trips.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>You have not planned any trips yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {trips.map((trip) => {
            const destName = trip.destinationId?.title || trip.destinationId?.name || trip.destination?.name || 'Goa';

            return (
              <div key={trip._id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                
                {/* Trip Header & Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ flex: '1', minWidth: '250px' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{trip.title}</h3>
                    <p style={{ margin: '0 0 5px 0', color: '#555' }}><strong>Destination:</strong> {destName}</p>
                    <p style={{ margin: '0 0 5px 0', color: '#555' }}><strong>Dates:</strong> {new Date(trip.startDate).toLocaleDateString()} to {new Date(trip.endDate).toLocaleDateString()}</p>
                    <p style={{ margin: '0 0 5px 0', color: '#333', fontWeight: 'bold' }}>Budget: ₹{trip.budget}</p>
                    
                    {/* 🔥 MEMBER DISPLAY ADDED HERE */}
                    <div style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '14px', color: '#444' }}>Trip Members:</strong>
                      {trip.members && trip.members.length > 0 ? (
                        trip.members.map((member, idx) => (
                          <span 
                            key={idx} 
                            style={{ 
                              background: '#e9ecef', 
                              color: '#495057', 
                              padding: '3px 10px', 
                              borderRadius: '15px', 
                              fontSize: '12px',
                              fontWeight: '600' 
                            }}
                          >
                            👤 {typeof member === 'string' ? member : member.email}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '13px', color: '#888' }}>Solo Trip</span>
                      )}
                    </div>

                    {trip.notes && <p style={{ margin: '5px 0 0 0', color: '#666', fontStyle: 'italic', fontSize: '14px' }}>Notes: {trip.notes}</p>}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handleViewExpenses(trip)} 
                      style={{ padding: '8px 12px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Expenses
                    </button>
                    <button 
                      onClick={() => handleEditTrip(trip)} 
                      style={{ padding: '8px 12px', background: '#ffc107', color: '#333', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleBookTrip(trip)} 
                      style={{ padding: '8px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Book
                    </button>
                    <button 
                      onClick={() => handleDeleteTrip(trip._id)} 
                      style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '15px 0' }} />

                {/* Live Weather & Interactive Map Widgets */}
                <div style={{ marginTop: '15px' }}>
                  <WeatherWidget city={destName} />
                  <DestinationMap destinationName={destName} />
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TripDetails;