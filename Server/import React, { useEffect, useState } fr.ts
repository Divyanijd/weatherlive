import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ForecastCard = () => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const city = 'surat';

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/weather/forecast?city=${city}`);
        setForecastData(res.data);
      } catch (err) {
        console.error("Error fetching forecast:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading 4-day forecast for {city}...</p>;
  if (!forecastData) return <p className="text-center text-red-500">Failed to load forecast.</p>;

  return (
    <div className="max-w-full mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">4-Day Forecast in {forecastData.city}</h2>
      <div className="grid grid-cols-4 gap-6 overflow-x-auto">
        {forecastData.forecast.map(day => (
          <div key={day.date} className="bg-gray-50 p-4 rounded-lg shadow min-w-[200px]">
            <h3 className="font-semibold mb-2">
              {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
            <img src={day.iconUrl} alt={day.desc} className="w-16 h-16 mx-auto" />
            <p className="text-center text-gray-700 capitalize">{day.desc}</p>
            <ul className="mt-2 text-gray-800 space-y-1">
              <li><strong>Temp:</strong> {day.temp}</li>
              <li><strong>Feels Like:</strong> {day.feels_like}</li>
              <li><strong>Humidity:</strong> {day.humidity}</li>
              <li><strong>Wind:</strong> {day.wind}</li>
              <li><strong>Pressure:</strong> {day.pressure}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;