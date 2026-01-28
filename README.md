# KPI Management System

A web application for tracking team KPIs with role-based access for staff and managers. The system supports user accounts, KPI creation and updates, manager verification, and dashboard views to monitor performance.

## Features
- User authentication (sign up, login, profile, password change)
- KPI CRUD (create, view, update, delete)
- Manager verification flow for pending KPIs
- Staff and manager dashboards with KPI insights

## Tech Stack
- Frontend: React, React Router, Bootstrap
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)

## Project Structure
- `client/` React front-end
- `server/` Express + MongoDB API

## Getting Started

### Prerequisites
- Node.js and npm
- MongoDB (local or cloud)

### 1) Set up the server
```bash
cd server
npm install
```

Create a `.env` file in `server/` with your MongoDB connection string:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5050
```

Start the API:
```bash
npm run server
```

### 2) Set up the client
```bash
cd client
npm install
npm start
```

The app runs at `http://localhost:3000` and connects to the API at `http://localhost:5050`.

## Notes
- This project was built for the WIF2003 Web Programming group assignment.
- Screens and flows include Home, About, Login/Signup, Profile, Manager Dashboard, Staff Dashboard, KPI Management, and KPI Verification.

