import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { fetchDestinations, updateTrip } from '../services/api';

function EditTrip() {
  const { tripId } = useParams();
  const location = useLocation();
  const existingTrip = location.state?.trip || {};

  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState({
    title: existingTrip.title || '',
    destinationId: existingTrip.destinationId?._id || existingTrip.destinationId || '',
    startDate: existingTrip.startDate ? existingTrip.startDate.split('T')[0] : '',
    endDate: existingTrip.endDate ? existingTrip.endDate.split('T')[0] : '',
    budget: existingTrip.budget || '',
    notes: existingTrip.notes || ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await fetchDestinations();
        setDestinations(data);
      } catch (err) {
        console.error("Error loading destinations:", err);
        setError('Failed to load destinations.');
      }
    };
    loadDestinations();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await updateTrip(tripId, formData);
      setSuccessMessage('Trip updated successfully! Redirecting...');
      setTimeout(() => navigate('/trips'), 1500);
    } catch (err) {
      console.error("Error updating trip:", err);
      setError('Failed to update trip. Please check your inputs.');
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Edit Trip</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Trip Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Destination</label>
          <select 
            name="destinationId" 
            value={formData.destinationId} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
          >
            <option value="">-- Select Destination --</option>
            {destinations.map((dest) => (
              <option key={dest._id} value={dest._id}>{dest.title} ({dest.location})</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Start Date</label>
            <input 
              type="date" 
              name="startDate" 
              value={formData.startDate} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>End Date</label>
            <input 
              type="date" 
              name="endDate" 
              value={formData.endDate} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Budget (₹)</label>
          <input 
            type="number" 
            name="budget" 
            value={formData.budget} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Notes</label>
          <textarea 
            name="notes" 
            value={formData.notes} 
            onChange={handleChange} 
            rows="3"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Update Trip
        </button>
      </form>
    </div>
  );
}

export default EditTrip;