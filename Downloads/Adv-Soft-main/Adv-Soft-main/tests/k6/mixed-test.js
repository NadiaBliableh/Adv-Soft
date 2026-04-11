import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 15 },
    { duration: '1m', target: 15 },
    { duration: '10s', target: 0 },
  ],
};

function getToken() {
  const res = http.post('http://localhost:3000/api/v1/auth/login',
    JSON.stringify({ email: 'admin@wasel.ps', password: 'Admin@123' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.json('data.accessToken');
}

export default function () {
  const token = getToken();

  // Read
  const read = http.get('http://localhost:3000/api/v1/incidents');
  check(read, { 'read ok': (r) => r.status === 200 });
  sleep(0.5);

  // Write
  const payload = JSON.stringify({
    latitude: 32.1358,
    longitude: 35.2719,
    category: 'closure',
    description: 'Mixed load test report',
  });

  const write = http.post('http://localhost:3000/api/v1/reports', payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  check(write, { 'write ok': (r) => r.status === 201 });
  sleep(1);
}