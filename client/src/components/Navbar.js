import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notification from './Notifications';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  // Parse session user
  let parsedUser = null;
  try {
    parsedUser = JSON.parse(sessionStorage.getItem('user'));
  } catch (e) {
    console.warn("Invalid user session:", e);
  }

  const role = parsedUser?.role;
  const email = parsedUser?.email;

  const handleLogout = () => {
    sessionStorage.clear();
    setNotification('You have been logged out.');
    setIsOpen(false);
    setProfileOpen(false);
    setTimeout(() => navigate('/'), 2000);
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {notification && (
        <Notification
          message={notification}
          type="success"
          onClose={() => setNotification('')}
        />
      )}

      <nav className="nav-navbar">
        <div className="nav-navbar-container">
          <Link
            to={
              role === 'Manager'
                ? '/manager'
                : role === 'Staff'
                  ? '/staff'
                  : '/'
            }
            className="nav-navbar-brand"
          >
            <h1>KPIHub</h1>
          </Link>

          <button
            className={`nav-hamburger ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <span></span><span></span><span></span>
          </button>

          <div className="nav-desktop-links">
            {!parsedUser && <Link to="/">Home</Link>}

            {role === 'Manager' && (
              <>
                <Link to="/manager">Dashboard</Link>
                <Link to="/kpi-management">KPI Management</Link>
                <Link to="/verify-kpi">KPI Verification</Link>
              </>
            )}

            {role === 'Staff' && <Link to="/staff">Dashboard</Link>}

            {parsedUser ? (
              <div
                className="nav-profile-label-wrapper"
                ref={dropdownRef}
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="nav-profile-label">
                  <span className="nav-profile-icon-label">👤</span>
                  <span className="nav-profile-email">{email}</span>
                </div>
                {profileOpen && (
                  <div className="nav-dropdown-menu">
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

      {/* Mobile Menu */}
      <div className={`nav-mobile-menu ${isOpen ? 'open' : ''}`}>
        {role === 'Manager' && (
          <>
            <Link to="/manager" onClick={() => setIsOpen(false)}>Dashboard</Link>
            <Link to="/kpi-management" onClick={() => setIsOpen(false)}>KPI Management</Link>
            <Link to="/verify-kpi" onClick={() => setIsOpen(false)}>KPI Verification</Link>
            <Link to="/profile" onClick={() => setIsOpen(false)}>Profile Settings</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {role === 'Staff' && (
          <>
            <Link to="/staff" onClick={() => setIsOpen(false)}>Dashboard</Link>
            <Link to="/profile" onClick={() => setIsOpen(false)}>Profile Settings</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {!parsedUser && (
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
