import React from 'react';

function DestinationMap({ destinationName }) {
  if (!destinationName) return null;

  // Encoded destination string for Google Maps Embed
  const encodedLocation = encodeURIComponent(destinationName);
  const mapUrl = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div style={{ marginTop: '20px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h3 style={{ padding: '15px 20px', margin: 0, background: '#2d3748', color: '#fff', fontSize: '16px' }}>
        📍 Live Map: {destinationName}
      </h3>
      <iframe
        title="Destination Location Map"
        width="100%"
        height="350"
        src={mapUrl}
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>
    </div>
  );
}

export default DestinationMap;