const axios = require('axios');

const OSRM_BASE = process.env.OSRM_URL || 'https://router.project-osrm.org';
const cache = new Map();

const getRoute = async (fromLat, fromLng, toLat, toLng) => {
  const key = `${fromLat},${fromLng}-${toLat},${toLng}`;
  if (cache.has(key)) return cache.get(key);

  try {
    const url = `${OSRM_BASE}/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}`;
    const { data } = await axios.get(url, {
      params: { overview: 'false', steps: false },
      timeout: 8000
    });
    if (data.code !== 'Ok') throw new Error('No route found');

    const result = {
      distance_km:  (data.routes[0].distance / 1000).toFixed(2),
      duration_min: Math.round(data.routes[0].duration / 60),
      source:       'osrm'
    };
    cache.set(key, result);
    setTimeout(() => cache.delete(key), 10 * 60 * 1000);
    return result;
  } catch {
    return haversineFallback(fromLat, fromLng, toLat, toLng);
  }
};

const haversineFallback = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return {
    distance_km:  distance.toFixed(2),
    duration_min: Math.round(distance / 40 * 60),
    source:       'haversine_fallback'
  };
};

module.exports = { getRoute };