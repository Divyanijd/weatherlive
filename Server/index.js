require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

const API_KEY = process.env.OPENWEATHER_API_KEY;

app.use(cors());
app.use(express.json());

// Today's Weather Endpoint
app.get('/api/weather/today', async (req, res) => {
  const city = req.query.city || 'surat';

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const weather = response.data;

    const todayData = {
      city: weather.name,
      feels_like: `${Math.round(weather.main.feels_like)}°C`,
      humidity: `${weather.main.humidity}%`,
      wind: `${Math.round(weather.wind.speed)} m/s`,
      pressure: `${weather.main.pressure} hPa`,
      temp: `${Math.round(weather.main.temp)}°C`,
      iconUrl: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
      desc: weather.weather[0].description,
    };

    res.json(todayData);
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    res.status(500).json({ message: 'Failed to fetch today weather' });
  }
});

// 4-Day Forecast Endpoint
app.get('/api/weather/forecast', async (req, res) => {
  const city = req.query.city || 'surat';

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const forecast = response.data;

    const getDate = (dt_txt) => dt_txt.split(' ')[0];
    const dailyData = {};
    forecast.list.forEach(item => {
      const date = getDate(item.dt_txt);
      if (!dailyData[date]) dailyData[date] = [];
      dailyData[date].push(item);
    });

    const todayDate = new Date().toISOString().split('T')[0];
    const days = Object.keys(dailyData).filter(date => date > todayDate).slice(0, 4);

    const forecastData = days.map(date => {
      const dayEntries = dailyData[date];
      const middayEntry = dayEntries.find(e => e.dt_txt.includes('12:00:00')) || dayEntries[0];

      return {
        date,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temp: `${Math.round(middayEntry.main.temp)}°C`,
        feels_like: `${Math.round(middayEntry.main.feels_like)}°C`,
        humidity: `${middayEntry.main.humidity}%`,
        wind: `${Math.round(middayEntry.wind.speed)} m/s`,
        pressure: `${middayEntry.main.pressure} hPa`,
        iconUrl: `https://openweathermap.org/img/wn/${middayEntry.weather[0].icon}@2x.png`,
        desc: middayEntry.weather[0].description,
      };
    });

    res.json({ city: forecast.city.name, forecast: forecastData });
  } catch (error) {
    console.error('Error fetching forecast:', error.message);
    res.status(500).json({ message: 'Failed to fetch weather forecast' });
  }
});

app.listen(PORT, () => {
  console.log(`🌦️ Weather server running at http://localhost:${PORT}`);
});
