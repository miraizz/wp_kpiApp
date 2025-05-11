import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Logout from './pages/Logout';
import SessionManager from './components/SessionManager';
import ManagerDashboard from './pages/ManagerDashboard';
import StaffDashboard from './pages/StaffDashboard';

function App() {
  const user = sessionStorage.getItem('user');
  const role = sessionStorage.getItem('role');

  // Helper function to determine where to redirect
  const getRedirectPath = () => {
    if (role === 'Manager') return '/manager-dashboard';
    if (role === 'Staff') return '/staff-dashboard';
    return '/';
  };

  return (
    <Router>
      <SessionManager />
      <div className="App">
        <Navbar />

        <Routes>
          {/* Home: only visible if not logged in */}
          <Route path="/" element={
            user ? <Navigate to={getRedirectPath()} /> : <Home />
          } />

          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />

          {/* Dashboards */}
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />

          {/* Optional fallback */}
          <Route path="*" element={<Navigate to={user ? getRedirectPath() : "/"} />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
