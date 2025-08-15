# Local Development Setup for Ramani

This guide provides step-by-step instructions to get the entire Ramani platform running on your local machine using Docker.

## 1. Prerequisites

Before you begin, ensure you have the following software installed on your system:

- **Docker**: The containerization platform used to run the application services. [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: A tool for defining and running multi-container Docker applications. It is typically included with Docker Desktop.
- **Node.js and npm**: Required for running the mobile application locally. [Install Node.js](https://nodejs.org/en/download/)
- **Expo CLI**: The command-line tool for Expo. Install it globally by running:
  ```bash
  npm install -g expo-cli
  ```
- **Git**: For cloning the repository.

## 2. Getting the Code

First, clone the repository to your local machine:

```bash
git clone <repository-url>
cd ramani
```

## 3. Configure Environment Variables

The backend requires a set of environment variables to run. These are managed in the `backend/.env` file. A pre-configured file for the local Docker setup is already included.

The key variables are:
- `DB_URL`: The connection string for the PostgreSQL database. This is pre-configured to connect to the `db` service in Docker Compose.
- `JWT_SECRET`: A secret key for signing JSON Web Tokens.
- `POSTGRES_*`: Variables to initialize the local database service.

You can modify the `JWT_SECRET` or other values in `backend/.env` if you wish, but the default values will work out-of-the-box for local development.

## 4. Add Required Assets

This repository does not include the binary image assets. You must create the `assets` folder in the project root and add the following files:

```
ramani/
└── assets/
    ├── ramani_logo.png
    ├── ramani_splash.png
    └── favicon.png
```

These are required by the Admin Portal and Mobile App. Placeholder images can be used if you do not have the official assets.

## 5. Build and Run the Application Stack

The simplest way to run the backend and admin portal is with Docker Compose.

From the project root directory, run the following command:

```bash
docker-compose up --build
```

- `--build` tells Docker Compose to build the images from the Dockerfiles before starting the containers. You only need to use this flag the first time or after making changes to the source code or Dockerfiles.
- You can add the `-d` flag (`docker-compose up -d`) to run the containers in detached mode (in the background).

This command will:
1. Pull the PostGIS image for the database.
2. Build the Docker image for the Go backend.
3. Build the Docker image for the React admin portal.
4. Start all three containers and connect them on a shared Docker network.

### Verifying the Services:
- **Backend**: The API should be accessible at `http://localhost:8080`. You can test its health with `http://localhost:8080/api/health` (if a health check endpoint is implemented).
- **Admin Portal**: The web application should be accessible at `http://localhost:8081`.

## 6. Running the Mobile App

The mobile app is run separately using Expo.

1. **Navigate to the mobile directory**:
   ```bash
   cd mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Expo development server**:
   ```bash
   npx expo start
   ```

This will open the Expo developer tools in your browser. You can then:
- **Run on an Android or iOS emulator/simulator**.
- **Run on a physical device**: Scan the QR code using the Expo Go app on your phone.

**Note on API Connection**: The mobile app's `services/api.ts` is configured to connect to `http://localhost:8080/api`. This works for the iOS simulator. For the Android emulator, you may need to change the `API_BASE_URL` to `http://10.0.2.2:8080/api`. If running on a physical device, you must change it to your computer's local network IP address (e.g., `http://192.168.1.100:8080/api`).

## 7. Stopping the Application

To stop the Docker containers, press `Ctrl+C` in the terminal where `docker-compose` is running, or run the following command from the project root if you are in detached mode:

```bash
docker-compose down
```
