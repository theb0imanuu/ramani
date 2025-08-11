# GIS MVP Starter — Runnable Scaffold (ZIP bundle)

This ZIP contains a runnable minimal GIS MVP scaffold:
- **backend/**: Go (Gin) service with auth, features and sync endpoints.
- **mobile/**: Expo React Native app (TypeScript) that collects points offline and syncs.
- **migrations/**: SQL to create PostGIS-enabled schemas.
- **docker-compose.yml** to run Postgres+PostGIS and the backend.

## Quick dev setup (local)
1. Install Docker & Docker Compose, Node.js & npm, and Expo CLI (`npm install -g expo-cli`).
2. Unpack this archive: `unzip gis-mvp-starter.zip && cd gis-mvp-starter`.
3. Start DB + backend: `docker compose up --build -d`.
4. Apply migrations inside the db container:
   ```
   docker exec -i $(docker ps -qf "ancestor=postgis/postgis:15-3.3") psql -U gisuser -d gisdb -f /app/migrations/init.sql
   ```
   Or copy migrations into the container and run `psql`.
5. Build & run the Go backend (the Dockerfile already builds and runs it). Check `http://localhost:8080/health`.
6. Start mobile app:
   ```
   cd mobile
   npm install
   npx expo start
   ```
   Use Expo Go on your device or run the emulator. Adjust `mobile/src/config.ts` `API_BASE` to point to backend (for Android emulator use `http://10.0.2.2:8080`, for iOS simulator `http://localhost:8080`, for physical device point to your machine IP).

## Production-ready high-level guidance (what to change before production)
Below are the recommended production hardening steps and design changes. The code in this bundle is intentionally minimal for learning and quick iteration — do **not** deploy it as-is to production.

### Backend (Go)
1. **Passwords & auth**
   - Replace SHA256 with `bcrypt` for password hashing: `golang.org/x/crypto/bcrypt`.
   - Implement refresh tokens (rotating refresh tokens), store refresh tokens server-side (Redis or Postgres table), and support token revocation.
   - Use `github.com/golang-jwt/jwt/v5` (already referenced) and verify signing method and claims.
2. **Input validation & sanitization**
   - Validate incoming GeoJSON thoroughly. Use a library or strict JSON schema validation.
   - Validate sizes of uploaded media, and sanitize free-text fields.
3. **GeoJSON & geometry**
   - Implement full GeoJSON parsing (Points, LineStrings, Polygons, Multi*). Use robust parsing and convert to PostGIS geometries with `ST_GeomFromGeoJSON`.
   - Use parameterized queries and prefer prepared statements.
4. **Database**
   - Run Postgres with appropriate resource sizing and backups.
   - Use connection pooling with sensible limits.
   - Add indexes on spatial columns (GIST on `geom`) and on frequently queried properties.
5. **Storage**
   - Use S3-compatible object storage for media; use presigned uploads from the client to avoid routing large files through the API.
6. **Security**
   - Serve backend behind HTTPS (TLS) — terminate TLS at a reverse proxy (NGINX, Traefik, or cloud LB).
   - Rate-limit endpoints, add IP / token throttling, and logging/monitoring.
   - Implement CORS strictly and use CSP headers where appropriate.
7. **Sync & conflicts**
   - Move from simple last-write-wins to a conflict resolution strategy. Options:
     - Server-authoritative with manual merge UI.
     - CRDT-based sync (automerge) for complex collaborative edits.
   - Keep an audit trail/version history of feature edits.
8. **Observability**
   - Add structured logging (zap/logrus), distributed tracing (OpenTelemetry), and metrics (Prometheus).
   - Add health checks and readiness probes.

### Mobile (React Native)
1. **Secure token storage**
   - Store access tokens in secure storage (Keychain on iOS, EncryptedSharedPreferences on Android) — use `react-native-keychain` or `expo-secure-store`.
   - Use refresh token flow to renew short-lived access tokens.
2. **Offline & Sync**
   - Use a robust local storage (Realm or WatermelonDB) if you expect complex queries / large local datasets.
   - Implement background sync with `react-native-background-fetch` and handle network changes reliably.
   - Cache basemap tiles for offline viewing. Consider MapLibre + MBTiles for offline vector tiles.
3. **Media & uploads**
   - Upload large media directly to S3 via presigned URLs. Keep metadata in the API.
4. **Permissions & privacy**
   - Request location permissions with clear rationale. Respect platform privacy policies.
5. **Testing & QA**
   - Add E2E tests (Detox or Appium), unit tests, and CI for mobile builds.

### Infrastructure / Deployment
1. **Containers & orchestration**
   - Build multi-stage Docker images and push to a registry.
   - Use Kubernetes (managed like GKE/EKS/AKS) or a managed App Runner for the backend and a managed Postgres (RDS/Cloud SQL/Azure Database) for production.
2. **CI/CD**
   - GitHub Actions or GitLab CI to run linters, unit tests, build images, and deploy to staging/prod.
3. **Backups & DR**
   - Automated DB backups, object storage lifecycle, and a disaster recovery plan.
4. **Scaling**
   - Use horizontal scaling for stateless backend; scale DB vertically and consider read replicas for heavy read workloads.
5. **Cost**
   - Monitor costs for tiles, storage, and CDN. Use caching layers and CDNs for tile serving.

## Files included
- docker-compose.yml
- migrations/init.sql
- backend/ (Go source)
- mobile/ (Expo app)
- README.md (this file)

