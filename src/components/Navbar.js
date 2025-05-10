import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notification from './Notifications';

const Navbar = () => {
  const user = sessionStorage.getItem('user');
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    setNotification('You have been logged out.');

    // Delay navigation to show toast first
    setTimeout(() => {
      navigate('/');
    }, 2000);
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
        <h1>KPI Management System</h1>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>

        {user ? (
          <div className="profile-dropdown">
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="Profile"
              className="profile-icon"
              onClick={() => setOpen(!open)}
            />
            {open && (
              <div className="dropdown-menu">
                <Link to="/profile">Profile Settings</Link>
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
    </nav>
  );
};

export default Navbar;
