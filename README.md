# EV Charging Station Management - Frontend

This directory contains the Vue.js frontend application for the EV Charging Station Management System. It provides a user interface to interact with the backend API for managing charging stations.

## Tech Stack

-   **Vue 3**: Progressive JavaScript framework for building user interfaces.
-   **TypeScript**: Superset of JavaScript that adds static typing.
-   **Pinia**: The official state management library for Vue.js.
-   **Vue Router**: Official routing library for Vue.js.
-   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
-   **Leaflet**: An open-source JavaScript library for mobile-friendly interactive maps.
-   **Axios**: Promise-based HTTP client for the browser and Node.js.
-   **Vue3-Toastify**: A Vue 3 toast notification library.
-   **Vite**: Next-generation frontend tooling for fast development.

## Project Structure
frontend/
├── public/           # Static assets (e.g., favicon, public images)
├── src/
│   ├── assets/       # Global styles (e.g., index.css)
│   ├── components/   # Reusable Vue components (e.g., Navbar, Footer, StationCard, MapSelector)
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── map/
│   │   └── stations/
│   ├── router/       # Vue Router configuration (index.ts)
│   ├── services/     # API service integration (api.ts)
│   ├── stores/       # Pinia stores for state management (auth.ts, stations.ts)
│   ├── views/        # Page-level components (e.g., HomeView, LoginView, MapView, StationsView)
│   │   ├── auth/
│   │   ├── stations/
│   │   └── ...
│   ├── App.vue       # Root Vue component
│   ├── main.ts       # Entry point for the Vue application
│   └── vite-env.d.ts # Vite environment type definitions
├── package.json      # Project dependencies and scripts
├── postcss.config.js # PostCSS configuration for Tailwind CSS
├── tailwind.config.js# Tailwind CSS configuration
├── tsconfig.json     # TypeScript configuration
├── vite.config.ts    # Vite build configuration
└── README.md         # This file


## Key Features

-   **User Authentication**: Login and registration screens with JWT-based authentication.
-   **Dashboard**: Overview of charging station statistics and quick actions.
-   **Charging Station Listing**: Displays all stations with filtering options (status, connector type, power output).
-   **Add/Edit/Delete Stations**: Forms for managing charging station details, including location selection via an interactive map.
-   **Interactive Map View**: Shows all charging stations on a Leaflet map with custom markers and station info popups.
-   **Responsive Design**: Built with Tailwind CSS for a mobile-first approach.
-   **Global Notifications**: Uses `vue3-toastify` for user feedback.

## Getting Started

### Prerequisites

-   Node.js (v14 or later)
-   The backend server must be running and accessible.

### Installation

1.  Navigate into the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the frontend dependencies:
    ```bash
    npm install
    ```

### Configuration

The frontend expects the backend API to be accessible. By default, it tries to connect to `http://localhost:5000/api`. If your backend is running on a different URL, you'll need to configure it.

1.  Create a `.env` file in the `frontend` directory.
2.  Add the `VITE_API_URL` variable, pointing to your backend API base URL:

    Example `.env` file:
    ```
    VITE_API_URL=http://localhost:5000/api
    ```

### Running the Application

To start the frontend development server:

```bash
npm run dev
