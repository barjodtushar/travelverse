import React, { useEffect, useState } from 'react';
import axios from 'axios';

function WeatherWidget({ destination }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const cityName = destination ? destination.split(' ')[0] : 'Goa';
        // Agar aapke paas OpenWeatherMap ki key hai toh yahan daalein
        const API_KEY = 'YOUR_API_KEY_HERE'; 
        
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
        );

        setWeather({
          temp: Math.round(res.data.main.temp),
          humidity: res.data.main.humidity,
          feelsLike: Math.round(res.data.main.feels_like),
          condition: res.data.weather[0].description
        });
      } catch (err) {
        console.error("Weather fetch error, using fallback data:", err);
        // Fallback data taaki UI kabhi blank na ho
        setWeather({
          temp: 30,
          humidity: 70,
          feelsLike: 34,
          condition: 'Sunny'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [destination]);

  return (
    <div style={{ background: '#00b4db', color: '#fff', padding: '15px', borderRadius: '8px' }}>
      <h4>Weather in {destination}</h4>
      {loading ? (
        <p>Loading weather...</p>
      ) : (
        <div>
          <h2>{weather?.temp}°C</h2>
          <p>Humidity: {weather?.humidity}% | Feels like: {weather?.feelsLike}°C</p>
          <p style={{ textTransform: 'capitalize' }}>Condition: {weather?.condition}</p>
        </div>
      )}
    </div>
  );
}

export default WeatherWidget;