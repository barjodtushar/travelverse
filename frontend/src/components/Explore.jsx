import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDestinations } from '../services/api';

const DESTINATION_IMAGES = {
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
  andaman: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
  gokarna: 'https://images.unsplash.com/photo-1614082855700-12822c5443dd?auto=format&fit=crop&w=600&q=80',
  manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
  ladakh: 'https://images.unsplash.com/photo-1581793745862-99fce1891729?auto=format&fit=crop&w=600&q=80',
  jaipur: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=600&q=80',
  agra: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
  varanasi: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=600&q=80',
  munnar: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80',
  corbett: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=600&q=80',
  darjeeling: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
  default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'
};

function Explore() {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getDestinations = async () => {
      try {
        const data = await fetchDestinations();
        setDestinations(data);
        setFilteredDestinations(data);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setError('Failed to load destinations.');
      } finally {
        setLoading(false);
      }
    };

    getDestinations();
  }, []);

  useEffect(() => {
    let results = destinations;

    if (searchTerm) {
      results = results.filter((dest) =>
        (dest.title || dest.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dest.location || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      results = results.filter((dest) => dest.category === selectedCategory);
    }

    setFilteredDestinations(results);
  }, [searchTerm, selectedCategory, destinations]);

  const handleSelectDestination = (destinationId) => {
    navigate('/create-trip', { state: { selectedDestinationId: destinationId } });
  };

  const getDestinationImage = (dest) => {
    // 1. Sabse pehle database me di gayi image ko priority dein
    if (dest.image && dest.image.trim() !== '') return dest.image;
    if (dest.imageUrl && dest.imageUrl.trim() !== '') return dest.imageUrl;

    // 2. Agar database me image na ho tabhi hardcoded fallback use ho
    const text = ((dest.title || '') + ' ' + (dest.name || '') + ' ' + (dest.location || '')).toLowerCase();

    if (text.includes('goa')) return DESTINATION_IMAGES.goasa;
    if (text.includes('andaman')) return DESTINATION_IMAGES.andaman;
    if (text.includes('gokarna')) return DESTINATION_IMAGES.gokarna;
    if (text.includes('manali')) return DESTINATION_IMAGES.manali;
    if (text.includes('ladakh')) return DESTINATION_IMAGES.ladakh;
    if (text.includes('jaipur')) return DESTINATION_IMAGES.jaipur;
    if (text.includes('agra')) return DESTINATION_IMAGES.agra;
    if (text.includes('kerala')) return DESTINATION_IMAGES.kerala;
    if (text.includes('varanasi')) return DESTINATION_IMAGES.varanasi;
    if (text.includes('munnar')) return DESTINATION_IMAGES.munnar;
    if (text.includes('corbett') || text.includes('wildlife')) return DESTINATION_IMAGES.corbett;
    if (text.includes('darjeeling')) return DESTINATION_IMAGES.darjeeling;

    return DESTINATION_IMAGES.default;
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: '#7F8C8D' }}>Loading destinations...</div>;
  }

  const categories = ['All', 'Beaches', 'Mountains', 'Heritage', 'Nature'];

  return (
    <div className="explore-container">
      <div className="page-header">
        <h2 className="page-title">TRAVELVERSE EXPLORE</h2>
        <p className="page-subtitle">Discover dynamic destinations and plan your custom itinerary.</p>
      </div>

      {error && <p style={{ color: '#E74C3C', marginBottom: '15px' }}>{error}</p>}

      <div className="controls-bar">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input-box"
        />

        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredDestinations.length === 0 ? (
        <p style={{ color: '#7F8C8D' }}>No destinations match your search.</p>
      ) : (
        <div className="destination-grid">
          {filteredDestinations.map((destination) => (
            <div key={destination._id} className="dest-card">
              <img
                src={getDestinationImage(destination)}
                alt={destination.title || destination.name}
                className="dest-card-image"
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                onError={(e) => { e.target.src = DESTINATION_IMAGES.manali; }}
              />
              <div className="dest-card-content">
                <h3 className="dest-card-title">{destination.title || destination.name}</h3>
                <div className="dest-card-location">📍 {destination.location}</div>
                <p className="dest-card-desc">{destination.description}</p>
                
                <div className="dest-card-footer">
                  <span className="dest-price">₹{destination.price || 15000}/day</span>
                  <span className="dest-rating">★ {destination.rating || 4.5}</span>
                </div>

                <button
                  onClick={() => handleSelectDestination(destination._id)}
                  className="btn-plan-trip"
                >
                  Plan Trip Here
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Explore;