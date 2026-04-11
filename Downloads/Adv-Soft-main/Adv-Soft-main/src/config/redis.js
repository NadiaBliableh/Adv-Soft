const { createClient } = require('redis');

let client = null;

const getRedis = async () => {
  if (client) return client;
  client = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379
    }
  });
  client.on('error', (err) => console.warn('Redis error:', err.message));
  try {
    await client.connect();
    console.log('Redis connected');
  } catch {
    console.warn('Redis unavailable, using fallback');
    client = null;
  }
  return client;
};

const cacheGet = async (key) => {
  try {
    const c = await getRedis();
    if (!c) return null;
    const val = await c.get(key);
    return val ? JSON.parse(val) : null;
  } catch { return null; }
};

const cacheSet = async (key, value, ttlSeconds = 600) => {
  try {
    const c = await getRedis();
    if (!c) return;
    await c.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch {}
};

module.exports = { getRedis, cacheGet, cacheSet };