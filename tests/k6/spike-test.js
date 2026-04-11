import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 1 },
    { duration: '30s', target: 100 },
    { duration: '10s', target: 1 },
  ],
};

export default function () {
  const res = http.get('http://localhost:3000/api/v1/incidents');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}