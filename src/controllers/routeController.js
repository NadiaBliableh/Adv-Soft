const { rawQuery } = require('../config/db');
const { getRoute } = require('../services/routingService');
const { getWeather } = require('../services/weatherService');

exports.estimate = async (req, res, next) => {
  try {
    const { from_lat, from_lng, to_lat, to_lng } = req.query;
    if (!from_lat || !from_lng || !to_lat || !to_lng)
      return res.status(400).json({ success: false, message: 'from_lat, from_lng, to_lat, to_lng required' });

    const route = await getRoute(from_lat, from_lng, to_lat, to_lng);

    const midLat = (+from_lat + +to_lat) / 2;
    const midLng = (+from_lng + +to_lng) / 2;
    const weather = await getWeather(midLat, midLng);

    const incidents = await rawQuery(
      `SELECT id, type, severity, title, latitude, longitude, status
       FROM incidents
       WHERE status IN ('active', 'verified')
         AND latitude  BETWEEN ? AND ?
         AND longitude BETWEEN ? AND ?`,
      [
        Math.min(+from_lat, +to_lat) - 0.05,
        Math.max(+from_lat, +to_lat) + 0.05,
        Math.min(+from_lng, +to_lng) - 0.05,
        Math.max(+from_lng, +to_lng) + 0.05
      ]
    );

    let adjustedDuration = +route.duration_min;
    const factors = [];

    if (weather.affects_travel) {
      adjustedDuration += 15;
      factors.push(`Weather: ${weather.condition}`);
    }
    incidents.forEach(inc => {
      if (inc.severity === 'critical')     { adjustedDuration += 30; factors.push(`Critical: ${inc.title}`); }
      else if (inc.severity === 'high')    { adjustedDuration += 15; factors.push(`High: ${inc.title}`); }
      else if (inc.severity === 'medium')  { adjustedDuration += 5; }
    });

    res.json({
      success: true,
      data: {
        distance_km:           route.distance_km,
        base_duration_min:     route.duration_min,
        estimated_duration_min: adjustedDuration,
        route_source:          route.source,
        weather,
        active_incidents:      incidents.length,
        factors,
        incidents_on_route:    incidents
      }
    });
  } catch (err) { next(err); }
};
// Routes Module - Nadia Bliableh