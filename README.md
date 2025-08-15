# The Ramani GIS Platform

**Ramani** is a comprehensive, multi-purpose GIS platform designed for incident reporting and task management in the field. It provides a robust backend, a web-based administrative portal, and a cross-platform mobile application for field agents.

## Project Overview

This repository contains the full source code for the Ramani platform, developed as a modern, containerized, full-stack application. The system is designed to be scalable, maintainable, and deployable in a cloud-native environment.

---

## Features

### 1. Backend (Go)
- **RESTful API**: A complete API for managing users, incidents, tasks, and authentication.
- **Spatial Data Support**: Leverages PostgreSQL with PostGIS for efficient storage and querying of geospatial data.
- **Authentication**: Secure user authentication using JSON Web Tokens (JWT).
- **File Handling**: Supports image uploads for incident reports, serving them via a static endpoint.
- **Containerized**: Production-ready, multi-stage Dockerfile for a lightweight and secure deployment.

### 2. Admin Portal (React)
- **Dashboard**: A central hub displaying recent incidents and a map overview.
- **Interactive Map View**: A full-page map showing the location of all reported incidents.
- **Task Management**: A full CRUD interface to create, assign, and manage tasks for field agents.
- **User Management**: An admin-only interface to manage all users of the system.
- **Modern UI**: Built with React, Vite, and TypeScript, and styled with Tailwind CSS for a clean and responsive user experience.
- **Containerized**: Served via Nginx in a Docker container for high performance.

### 3. Mobile App (React Native)
- **Cross-Platform**: Developed with Expo for seamless operation on both iOS and Android devices.
- **User Authentication**: Secure login for field agents.
- **Incident Reporting**: An intuitive form to report new incidents, including a description, photo upload (from camera or gallery), and automatic GPS coordinate capture.
- **Task List**: Displays a list of tasks assigned specifically to the logged-in user.
- **Profile Management**: A simple profile screen with a logout option.

---

## Technology Stack

- **Backend**: Go (Golang), Gin (Web Framework), GORM (ORM)
- **Database**: PostgreSQL + PostGIS
- **Admin Portal**: React, Vite, TypeScript, Tailwind CSS, Axios, React Router
- **Mobile App**: React Native, Expo, TypeScript, Styled-Components, Axios, React Navigation
- **Containerization**: Docker & Docker Compose

---

## Getting Started

For detailed instructions on how to set up and run the project locally, please see the [SETUP.md](SETUP.md) file.
