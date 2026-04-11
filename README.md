# Wasel Palestine API 🇵🇸
Smart Mobility & Checkpoint Intelligence Platform

## System Overview
Wasel Palestine is a RESTful API platform designed to help Palestinians navigate daily movement challenges by providing real-time mobility intelligence including checkpoint status, road incidents, crowdsourced reports, and route estimation.

## Tech Stack
- **Backend:** Node.js + Express.js
- **Database:** MySQL + Sequelize ORM
- **Auth:** JWT (Access + Refresh tokens)
- **External APIs:** OSRM (OpenStreetMap), OpenWeatherMap
- **Deployment:** Docker + docker-compose
- **Testing:** k6 Load Testing, API-Dog

## Architecture
```
Client → Express.js API → MySQL Database
                       → OSRM (Routing)
                       → OpenWeatherMap (Weather)
```

## Database Schema
Tables: `users`, `checkpoints`, `incidents`, `incident_history`, `reports`, `report_votes`, `moderation_log`, `alert_subscriptions`, `alerts`

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | Register new user |
| POST | /api/v1/auth/login | Login and get tokens |
| POST | /api/v1/auth/refresh | Refresh access token |
| GET | /api/v1/incidents | Get all incidents |
| POST | /api/v1/incidents | Create incident |
| PATCH | /api/v1/incidents/:id/status | Update incident status |
| GET | /api/v1/routes/estimate | Estimate route |
| POST | /api/v1/reports | Submit report |
| POST | /api/v1/reports/:id/vote | Vote on report |
| POST | /api/v1/alerts/subscriptions | Subscribe to alerts |

## External API Integration
- **OSRM:** Route distance and duration estimation with Haversine fallback
- **OpenWeatherMap:** Weather conditions affecting travel time

## Performance Testing Results (k6)
| Test | VUs | Requests | Failed | p(95) |
|------|-----|----------|--------|-------|
| Read Heavy | 20 | 1607 | 0% | 8.82ms |
| Write Heavy | 10 | 424 | 0% | 3.39s |
| Mixed | 15 | 654 | 0% | 5.2s |
| Spike | 100 | 2057 | 0% | 12.36ms |
| Soak | 10 | 3445 | 0% | 15.12ms |

### Performance Analysis
- **Bottleneck:** Write operations slow due to per-request authentication
- **Root cause:** JWT login called on every write request in load test
- **Optimization:** Token caching would reduce write p(95) from 3.39s to ~50ms

## Setup & Installation

### Local Development
```bash
git clone https://github.com/NadiaBliableh/Adv-Soft.git
cd Adv-Soft
npm install
cp .env.example .env
# Edit .env with your credentials
node index.js
```

### Docker
```bash
docker-compose up --build
```

## Environment Variables
```env
PORT=3000
DB_HOST=localhost
DB_NAME=wasel_db
DB_USER=root
DB_PASS=your_password
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
OPENWEATHER_KEY=your_api_key
```

## Team
- **Nadia Bliableh** — Auth, Route Estimation, Alerts, External APIs
- **Walaa Abu Jafar** — Incidents, Reports, Database Schema