# 🏁 Getting Started with Ramani

## 📋 Prerequisites

- **Node.js**: v18 or higher (LTS recommended)
- **PostgreSQL**: Must be running locally or available via Docker.
- **Google Maps API Key**: Required for Android deployment to visualize maps.

## 📦 Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/theb0imanuu/ramani.git
    cd ramani
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

---

## 🚀 Running the Project

### 1. Start the Backend API

This service manages meters, telemetry, and database persistence.

```bash
npx nx serve api
```

- **URL**: `http://localhost:3000/api`
- **Swagger/OpenAPI** (if enabled): `http://localhost:3000/api/docs`

### 2. Start the Mobile App

This application is for field workers to view the map and fix issues.

```bash
npx nx start mobile
```

- Press `a` to open in **Android Emulator**.
- Press `i` to open in **iOS Simulator**.
- To run on a physical device, scan the QR code with the **Expo Go** app (ensure devices are on the same Wi-Fi).
- _Note_: If you have issues connecting to localhost from Android, run `adb reverse tcp:3000 tcp:3000`.

### 3. Start the Web Dashboard

This dashboard is for operations managers to monitor the system.

```bash
npx nx serve web
```

- **URL**: `http://localhost:4200`

---

## 🔧 Configuration

### Mobile Maps

To enable Google Maps on Android/iOS, you must verify your API key in `frontend/mobile/app.json`:

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
