# Ramani Water Monitoring System

Ramani is a full-stack IoT water management platform designed to monitor water flow, detect leaks in real-time, and visualize utility infrastructure.

## 🚀 Features

### 📡 Backend (NestJS)

- **RESTful API**: Manage meters and device telemetry.
- **Real-time Ingestion**: Receives flow rate data from IoT devices.
- **Leak Detection**: Automatically flags meters with abnormal flow rates (> 500 L/m).
- **Persistence**: Stores meter status and history in PostgreSQL with PostGIS support.

### 📱 Mobile App (React Native / Expo)

- **Interactive Map**: Visualizes the water pipeline network and meter locations.
- **Real-time Alerts**: Displays active leaks as red markers on the map.
- **Field Operations**: Allows field workers to "Fix" issues directly from the app.
- **User Location**: Centers map on the user's current GPS position.

### 💻 Web Dashboard (React)

- **Operational View**: Overview of all meters and system health.
- **Live Map**: Web-based map visualization using Leaflet.
- **Alert Monitoring**: Sidebar list highlighting active bursts and critical issues.

---

## 🛠️ Tech Stack

- **Monorepo**: [Nx](https://nx.dev)
- **Backend**: NestJS, TypeORM, PostgreSQL, PostGIS
- **Frontend (Mobile)**: React Native, Expo, React Native Maps
- **Frontend (Web)**: React, Vite, React-Leaflet

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (running locally or via Docker)
- Google Maps API Key (for Android deployment)

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Project

#### 1. Start the Backend

```bash
npx nx serve api
```

_The API will be available at `http://localhost:3000/api`_

#### 2. Start the Mobile App

```bash
npx nx start mobile
```

_Press `a` for Android Emulator or `i` for iOS Simulator._
_Note: Ensure your emulator/device is on the same network or use `adb reverse tcp:3000 tcp:3000` for Android._

#### 3. Start the Web Dashboard

```bash
npx nx serve web
```

_Open `http://localhost:4200` in your browser._

---

## 🔌 API Endpoints

| Method  | Endpoint         | Description                          |
| :------ | :--------------- | :----------------------------------- |
| `GET`   | `/meters`        | List all meters                      |
| `GET`   | `/meters/:id`    | Get details for a specific meter     |
| `POST`  | `/meters`        | Create a new meter                   |
| `PATCH` | `/meters/:id`    | Update meter status (e.g., fix leak) |
| `POST`  | `/iot/telemetry` | Ingest flow data from devices        |

---

## 📱 Mobile Configuration

To use Google Maps on Android/iOS, ensure your API key is configured in `frontend/mobile/app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_API_KEY"
        }
      }
    }
  }
}
```
