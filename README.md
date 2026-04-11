# 🗺️ Wasel Palestine API
### Smart Mobility & Checkpoint Intelligence Platform

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-backend-000000?style=flat&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=flat&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Deploy-2496ED?style=flat&logo=docker&logoColor=white)
![k6](https://img.shields.io/badge/k6-Load%20Testing-7D64FF?style=flat&logo=k6&logoColor=white)

**Wasel Palestine** is a RESTful API platform designed to support Palestinians in navigating daily movement challenges by providing real-time checkpoint status, road incidents, crowdsourced reports, and intelligent route estimation.

> [!NOTE]
> Full API documentation is available in the [API-Dog Collection](./api-dog-collection.json)

---

## 📚 Table of Contents
1. [Project Overview](#-project-overview)
2. [Tech Stack](#️-tech-stack)
3. [How to Run the Project](#-how-to-run-the-project)
   - [Local Development](#local-development)
   - [Docker](#-docker)
4. [API Endpoints](#-api-endpoints)
5. [External APIs](#-external-apis)
6. [Performance Testing](#-performance-testing-results-k6)
7. [Database Schema](#️-database-schema)
8. [Credits](#-credits)

---

## 🌍 Project Overview
Wasel Palestine helps Palestinians navigate movement restrictions through:

- 🚧 Real-time checkpoint status and road incident tracking
- 📍 Crowdsourced mobility reports with community voting
- 🗺️ Intelligent route estimation with incident-aware duration
- 🔔 Regional alert subscriptions for verified incidents
- 🌤️ Weather-aware travel intelligence

---

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- MySQL + Sequelize ORM + Raw SQL Queries
- JWT Authentication (Access + Refresh Tokens)
- Docker + docker-compose

**External APIs:**
- OSRM (OpenStreetMap Routing)
- OpenWeatherMap API

**Tools:**
- API-Dog (Documentation & Testing)
- k6 (Load & Performance Testing)
- Git & GitHub (Version Control)

---

## 🚀 How to Run the Project

### Local Development

**1️⃣ Clone the repository**
```bash
git clone https://github.com/NadiaBliableh/Adv-Soft.git
cd Adv-Soft
```

**2️⃣ Install dependencies**
```bash
npm install
```

**3️⃣ Create `.env` file**
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=wasel_db
DB_USER=root
DB_PASS=********
JWT_SECRET=wasel_jwt_secret_2026_minimum_32_characters
JWT_REFRESH_SECRET=wasel_refresh_secret_2026_min_32
OPENWEATHER_KEY=your_openweathermap_api_key
OSRM_URL=https://router.project-osrm.org
NODE_ENV=development
```

**4️⃣ Setup database**

Run the schema in MySQL Workbench:
```
src/db/schema.sql
```

**5️⃣ Start the server**
```bash
node index.js
```

You should see:
```
✅ Database connected
🚀 Wasel API running on http://localhost:3000
```

---

### 🐳 Docker

```bash
docker-compose up --build
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | ❌ |
| POST | `/api/v1/auth/login` | Login and get tokens | ❌ |
| POST | `/api/v1/auth/refresh` | Refresh access token | ❌ |
| POST | `/api/v1/auth/logout` | Logout | ✅ |
| GET | `/api/v1/auth/me` | Get current user | ✅ |

### Incidents
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/incidents` | Get all incidents | ❌ |
| GET | `/api/v1/incidents/:id` | Get incident by ID | ❌ |
| POST | `/api/v1/incidents` | Create incident | ✅ |
| PUT | `/api/v1/incidents/:id` | Update incident | ✅ Moderator |
| PATCH | `/api/v1/incidents/:id/status` | Update status | ✅ Moderator |
| DELETE | `/api/v1/incidents/:id` | Delete incident | ✅ Admin |

### Reports
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/reports` | Get all reports | ✅ Moderator |
| GET | `/api/v1/reports/:id` | Get report by ID | ✅ |
| POST | `/api/v1/reports` | Submit report | ✅ |
| POST | `/api/v1/reports/:id/vote` | Vote on report | ✅ |
| PATCH | `/api/v1/reports/:id/moderate` | Moderate report | ✅ Moderator |

### Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/routes/estimate` | Estimate route | ❌ |

### Alerts
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/alerts` | Get my alerts | ✅ |
| POST | `/api/v1/alerts/subscriptions` | Subscribe to alerts | ✅ |
| GET | `/api/v1/alerts/subscriptions` | Get my subscriptions | ✅ |
| DELETE | `/api/v1/alerts/subscriptions/:id` | Unsubscribe | ✅ |
| PATCH | `/api/v1/alerts/:id/read` | Mark as read | ✅ |

---

## 🌐 External APIs

### OSRM (OpenStreetMap Routing)
- Provides accurate route distance and duration
- Fallback: Haversine formula when OSRM unavailable
- Cache TTL: 10 minutes

### OpenWeatherMap
- Provides weather conditions at route midpoint
- Affects estimated travel duration (+15 min for bad weather)
- Cache TTL: 30 minutes

---

## 📊 Performance Testing Results (k6)

| Test | VUs | Requests | Failed | p(95) | Status |
|------|-----|----------|--------|-------|--------|
| Read Heavy | 20 | 1607 | 0% | 8.82ms | ✅ |
| Write Heavy | 10 | 424 | 0% | 3.39s | ✅ |
| Mixed | 15 | 654 | 0% | 5.2s | ✅ |
| Spike | 100 | 2057 | 0% | 12.36ms | ✅ |
| Soak (6.5 min) | 10 | 3445 | 0% | 15.12ms | ✅ |

### Analysis
- **Bottleneck:** Write p(95) = 3.39s due to per-request login in load test
- **Root cause:** JWT token expires every 15 minutes
- **Optimization applied:** Token caching reduces write latency significantly
- **Read performance:** Excellent — p(95) = 8.82ms under 20 concurrent users

---

## 🗄️ Database Schema

**Tables:**
- `users` — User accounts with roles (citizen, moderator, admin)
- `checkpoints` — Military and civilian checkpoints registry
- `incidents` — Road incidents with severity and status tracking
- `incident_history` — Full audit trail of status changes
- `reports` — Crowdsourced mobility reports
- `report_votes` — Community voting on reports
- `moderation_log` — All moderation actions audit log
- `alert_subscriptions` — User alert preferences by area/category
- `alerts` — Generated alerts for verified incidents

---

## 🤝 Credits

Developed as part of **Advanced Software Engineering Course — Spring 2026**
Under supervision of **Dr. Amjad AbuHassan**

| Name | Role |
|------|------|
| Nadia Bliableh | Auth, Route Estimation, Alerts, External APIs, Docker |
| Walaa Abu Jafar| Incidents, Reports, Database Schema |

> Built with ❤️ for Palestinian communities 🇵🇸