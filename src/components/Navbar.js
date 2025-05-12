import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notification from './Notifications';
import './Navbar.css';

const Navbar = () => {
  const user = sessionStorage.getItem('user');
  const role = sessionStorage.getItem('role');
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
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

  // Close profile dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-close mobile menu on resize to desktop
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

      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <h1>{user ? 'KPI Management System' : 'KPIHub'}</h1>
          </Link>

          {/* Hamburger menu */}
          <button
            className={`hamburger ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <span></span><span></span><span></span>
          </button>

          {/* Desktop Links */}
          <div className="nav-links desktop-links">
            {!user && <Link to="/">Home</Link>}

            {role === 'Manager' && (
              <>
                <Link to="/manager">Dashboard</Link>
                <Link to="/kpi-management">KPI Management</Link>
                <Link to="/verify-kpi">KPI Verification</Link>
              </>
            )}

            {role === 'Staff' && (
              <>
                <Link to="/staff">Dashboard</Link>
                <Link to="/verify-kpi/:staffId">View KPI</Link>
              </>
            )}

            {user ? (
              <div
                className="profile-label-wrapper"
                ref={dropdownRef}
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="profile-label">
                  <span className="profile-icon-label">👤</span>
                  <span className="profile-email">{user}</span>
                </div>
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

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
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
            <Link to="/verify-kpi/:staffId" onClick={() => setIsOpen(false)}>View KPI</Link>
            <Link to="/profile" onClick={() => setIsOpen(false)}>Profile Settings</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {!user && (
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
