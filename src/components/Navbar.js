// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='navbar'>
      <h1>KPI Management System</h1>
      <div className="nav-links">
        {/* Use Link to navigate between pages */}
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Log In</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/kpi-management">KPI Management</Link>
      </div>
    </div>
  );
};

export default Navbar;
