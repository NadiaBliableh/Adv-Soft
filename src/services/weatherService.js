const axios = require('axios');

const cache = new Map();

const getWeather = async (lat, lng) => {
  const key = `${Math.round(lat * 10) / 10},${Math.round(lng * 10) / 10}`;
  if (cache.has(key)) return cache.get(key);

  try {
    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { lat, lon: lng, appid: process.env.OPENWEATHER_KEY, units: 'metric' },
      timeout: 5000
    });
    const result = {
      condition:      data.weather[0].main,
      description:    data.weather[0].description,
      temp_c:         data.main.temp,
      wind_kmh:       (data.wind.speed * 3.6).toFixed(1),
      visibility_km:  (data.visibility / 1000).toFixed(1),
      affects_travel: ['Thunderstorm', 'Snow', 'Fog', 'Rain'].includes(data.weather[0].main)
    };
    cache.set(key, result);
    setTimeout(() => cache.delete(key), 30 * 60 * 1000);
    return result;
  } catch {
    return { condition: 'Unknown', affects_travel: false, source: 'unavailable' };
  }
};

module.exports = { getWeather };