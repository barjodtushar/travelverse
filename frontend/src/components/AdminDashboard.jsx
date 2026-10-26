import { useState } from 'react';
import API from '../services/api';

function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [rating, setRating] = useState('4.5');
  const [message, setMessage] = useState('');

  const handleAddDestination = async (e) => {
    e.preventDefault();
    try {
      await API.post('/destinations', {
        title,
        location,
        price: Number(price),
        description,
        image,
        rating: Number(rating)
      });
      setMessage('Destination added successfully!');
      setTitle('');
      setLocation('');
      setPrice('');
      setDescription('');
      setImage('');
      setRating('4.5');
    } catch (err) {
      setMessage('Failed to add destination');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '25px', background: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Admin Dashboard - Add Destination</h2>
      <form onSubmit={handleAddDestination} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input type="text" placeholder="Destination Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
        <input type="text" placeholder="Location (e.g. Goa)" value={location} onChange={(e) => setLocation(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
        <input type="number" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
        <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
        <input type="number" step="0.1" placeholder="Rating (e.g. 4.8)" value={rating} onChange={(e) => setRating(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
        <button type="submit" style={{ padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Add Destination</button>
      </form>
      {message && <p style={{ marginTop: '15px', color: 'green', textAlign: 'center' }}>{message}</p>}
    </div>
  );
}

export default AdminDashboard;