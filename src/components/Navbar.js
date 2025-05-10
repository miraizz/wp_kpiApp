import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notification from './Notifications';
import './Navbar.css';

const Navbar = () => {
  const user = sessionStorage.getItem('user');
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    setNotification('You have been logged out.');
    setIsOpen(false);
    setProfileOpen(false);

    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification}
          type="success"
          onClose={() => setNotification('')}
        />
      )}

      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <h1>{user ? 'KPI Management System' : 'KPIHub'}</h1>
          </Link>
          
          {/* Hamburger menu for mobile */}
          <button 
            className={`hamburger ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          {/* Desktop navigation */}
          <div className="nav-links desktop-links">
            <Link to="/">Home</Link>
            <Link to="/manager">Manager</Link>
            <Link to="/staff">Staff</Link>
            <Link to="/kpi-management">KPI</Link>

            {user ? (
              <div className="profile-dropdown">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="Profile"
                  className="profile-icon"
                  onClick={() => setProfileOpen(!profileOpen)}
                />
                {profileOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" onClick={() => setProfileOpen(false)}>Profile Settings</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">Log In</Link>
                <Link to="/signup">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      
      {/* Mobile menu (separate element) */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        {/* <Link to="/" onClick={() => setIsOpen(false)}>Home</Link> */}
        <Link to="/Manager" onClick={() => setIsOpen(false)}>Test</Link>
        
        {user ? (
          <>
            <Link to="/profile" onClick={() => setIsOpen(false)}>Profile Settings</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsOpen(false)}>Log In</Link>
            <Link to="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;