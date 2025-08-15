# Stage 1: Build the React application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.25-alpine

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the nginx config file
# I will create this file next.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Also copy the assets like the logo and favicon so nginx can serve them
# The app expects them at /assets, so we place them in the root of the served directory.
COPY ../assets /usr/share/nginx/html/assets

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
