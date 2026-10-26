import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip, fetchDestinations, getAiTripEstimate } from '../services/api';
import ReactMarkdown from 'react-markdown';

function CreateTrip() {
  const [formData, setFormData] = useState({
    title: '',
    destinationId: '',
    startDate: '',
    endDate: '',
    budget: '',
    members: ''
  });
  
  const [destinations, setDestinations] = useState([]);
  const [selectedDestName, setSelectedDestName] = useState('');
  
  // AI Estimate states
  const [aiEstimate, setAiEstimate] = useState(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await fetchDestinations();
        setDestinations(data);
        if (data && data.length > 0) {
          setFormData((prev) => ({ ...prev, destinationId: data[0]._id }));
          setSelectedDestName(data[0].name || data[0].title || data[0].location || '');
        }
      } catch (err) {
        console.error('Failed to load destinations:', err);
      }
    };
    loadDestinations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'destinationId') {
      const found = destinations.find(d => d._id === value);
      if (found) {
        setSelectedDestName(found.name || found.title || found.location || '');
      }
    }
  };

  // Calculate AI Estimate before submitting
  const handleFetchAiEstimate = async () => {
    if (!selectedDestName || !formData.startDate || !formData.endDate) {
      setError('Please select Destination, Start Date, and End Date first.');
      return;
    }
    setError('');
    setLoadingEstimate(true);

    try {
      const membersList = formData.members
        ? formData.members.split(',').map(m => m.trim()).filter(m => m.length > 0)
        : [];
      
      const membersCount = membersList.length + 1; // Including user

      const res = await getAiTripEstimate({
        destinationName: selectedDestName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        membersCount: membersCount
      });

      // Handle both string response ({ estimate: "..." }) or direct object
      const estimateText = res.data?.estimate || res.data || "No estimation received.";
      setAiEstimate(estimateText);

    } catch (err) {
      console.error("AI estimation failed:", err);
      setError('Failed to fetch AI estimate. You can still enter budget manually.');
    } finally {
      setLoadingEstimate(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userString = localStorage.getItem('user');
      const userObj = userString ? JSON.parse(userString) : null;
      const userId = userObj?.id || userObj?._id;

      if (!userId) {
        setError('Session expired. Please log in again.');
        setLoading(false);
        navigate('/login');
        return;
      }

      const membersList = formData.members
        ? formData.members.split(',').map(m => m.trim()).filter(m => m.length > 0)
        : [];

      const payload = {
        userId: userId,
        destinationId: formData.destinationId,
        title: formData.title,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: Number(formData.budget),
        members: membersList
      };

      await createTrip(payload);
      setLoading(false);
      navigate('/trips');
    } catch (err) {
      console.error('Create Trip Error:', err);
      setError(err.response?.data?.message || 'Failed to create trip.');
      setLoading(false);
    }
  };

  const membersCount = (formData.members ? formData.members.split(',').filter(m => m.trim()).length : 0) + 1;

  return (
    <div className="travel-card" style={{ maxWidth: '700px', margin: '40px auto' }}>
      <h2>Plan a New Trip (AI Smart Planner)</h2>
      
      {error && <p className="travel-error-msg" style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="travel-form-group" style={{ marginBottom: '15px' }}>
          <label>Trip Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="e.g. Goa Vacation with Friends" 
            required 
            className="travel-input"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div className="travel-form-group" style={{ marginBottom: '15px' }}>
          <label>Destination</label>
          <select 
            name="destinationId" 
            value={formData.destinationId} 
            onChange={handleChange} 
            required 
            className="travel-select"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            {destinations.map((dest) => (
              <option key={dest._id} value={dest._id}>
                {dest.name || dest.title || dest.location || 'Destination'}
              </option>
            ))}
          </select>
        </div>

        <div className="travel-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div className="travel-form-group" style={{ flex: 1 }}>
            <label>Start Date</label>
            <input 
              type="date" 
              name="startDate" 
              value={formData.startDate} 
              onChange={handleChange} 
              required 
              className="travel-input"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div className="travel-form-group" style={{ flex: 1 }}>
            <label>End Date</label>
            <input 
              type="date" 
              name="endDate" 
              value={formData.endDate} 
              onChange={handleChange} 
              required 
              className="travel-input"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
        </div>

        {/* Invite Friends / Members */}
        <div className="travel-form-group" style={{ marginBottom: '15px' }}>
          <label>Invite Friends (Comma-separated emails or names)</label>
          <input 
            type="text" 
            name="members" 
            value={formData.members} 
            onChange={handleChange} 
            placeholder="e.g. rahul@gmail.com, amit@gmail.com" 
            className="travel-input"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* AI Estimate Action Button */}
        <div style={{ marginBottom: '20px' }}>
          <button 
            type="button" 
            onClick={handleFetchAiEstimate} 
            disabled={loadingEstimate}
            style={{ background: '#4a5568', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
          >
            {loadingEstimate ? 'Analyzing destination with AI... 🤖' : '✨ Get AI Budget & Nearby Places Estimate'}
          </button>
        </div>

        {/* AI Estimate Results Box */}
        {aiEstimate && (
  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
    <h4 style={{ color: '#166534', margin: '0 0 10px 0' }}>💡 AI Destination Insights</h4>
    <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
      <ReactMarkdown>{aiEstimate}</ReactMarkdown>
    </div>
  </div>
)}

        <div className="travel-form-group" style={{ marginBottom: '20px' }}>
          <label>Final Budget (₹)</label>
          <input 
            type="number" 
            name="budget" 
            value={formData.budget} 
            onChange={handleChange} 
            placeholder="15000" 
            required 
            className="travel-input"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button type="submit" disabled={loading} className="travel-btn-primary" style={{ width: '100%', padding: '12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'Creating Trip...' : 'Create Trip'}
        </button>
      </form>
    </div>
  );
}

export default CreateTrip;