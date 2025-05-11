import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notification from './Notifications';

const Navbar = () => {
  const user = sessionStorage.getItem('user');
  const role = sessionStorage.getItem('role');
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [user]);

  const handleLogout = () => {
    sessionStorage.clear();
    setNotification('You have been logged out.');
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <nav className="navbar">
      {notification && (
        <Notification
          message={notification}
          type="success"
          onClose={() => setNotification('')}
        />
      )}

      <div className="logo">
        <h1>KPIHub</h1>
      </div>

      <div className="nav-links-boxed">
        {/* Home only visible before login */}
        {!user && <Link to="/" className="nav-item">Home</Link>}

        {/* Logged in users see Dashboard first */}
        {user && (
          <Link
            to={role === 'Manager' ? '/manager-dashboard' : '/staff-dashboard'}
            className="nav-item"
          >
            Dashboard
          </Link>
        )}

        <Link to="/about" className="nav-item">About</Link>

        {!user ? (
          <>
            <Link to="/login" className="nav-item">Log In</Link>
            <Link to="/signup" className="nav-item">Sign Up</Link>
          </>
        ) : (
          <>
            <div className="nav-item notification">
              <span className="icon">🔔</span>
              <span className="badge">1</span>
            </div>

            <div
              className="nav-item user-email"
              ref={dropdownRef}
              style={{ position: 'relative' }}
            >
              <span className="icon">👤</span>
              <span onClick={() => setOpen(prev => !prev)}>{user}</span>

              {open && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setOpen(false)}>Profile Settings</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;