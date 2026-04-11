import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
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

  const payload = JSON.stringify({
    latitude: 32.2211,
    longitude: 35.2544,
    category: 'checkpoint',
    description: 'Load test report - queue at checkpoint',
  });

  const res = http.post('http://localhost:3000/api/v1/reports', payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  check(res, {
    'status is 201': (r) => r.status === 201,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  sleep(1);
}