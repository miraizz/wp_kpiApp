import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <h1>KPIHub</h1>
          </Link>

          <button 
            className={`hamburger ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="nav-links desktop-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/login">Log In</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/verify-kpi">Verify KPI</Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu (separate element) */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
        <Link to="/login" onClick={() => setIsOpen(false)}>Log In</Link>
        <Link to="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
        <Link to="/verify-kpi" onClick={() => setIsOpen(false)}>Verify KPI</Link>
      </div>
    </>
  );
};

export default Navbar;
