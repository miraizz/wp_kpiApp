import React, { useEffect, useState } from 'react';
import './Home.css';

const Home = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/test')
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((err) => {
        console.error('Error fetching API:', err);
        setMessage('Error fetching API');
      });
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('user'));

  // Watch for changes in sessionStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!sessionStorage.getItem('user'));
    };

    window.addEventListener('storage', handleStorageChange);

    // If logout is triggered internally (not via another tab), use polling fallback:
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <section className="hero home-hero">
        <div className="hero-content">
          <h2>Welcome to <span className="highlight">KPI Management System!</span></h2>
          <p>API says: {message}</p>
          <p>Track and manage your team's performance efficiently with real-time insights.</p>

          {!isLoggedIn && (
            <a href="/signup" className="cta-button">Get Started</a>
          )}
        </div>
        <img src="/images/dashboard-preview.png" alt="Dashboard Preview" className="hero-image" />
      </section>

      <section className="section features-section">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-box">
            <img src="/images/insight-icon.jpg" alt="Insights" />
            <h3>Real-time Insights</h3>
            <p>Make informed decisions with accurate and up-to-date data visualizations.</p>
          </div>
          <div className="feature-box">
            <img src="/images/team-icon.jpg" alt="User Management" />
            <h3>User Management</h3>
            <p>Assign roles and monitor KPIs across teams with flexible user control.</p>
          </div>
          <div className="feature-box">
            <img src="/images/report-icon.jpg" alt="Reporting" />
            <h3>Automated Reporting</h3>
            <p>Save time with scheduled reports and performance summaries sent directly to your inbox.</p>
          </div>
        </div>
      </section>

      <section className="section about-section">
        <h2 className="section-title">About Us</h2>
        <p>
          We help organizations streamline KPI tracking and achieve operational excellence through modern design,
          smart automation, and intuitive tools. Join hundreds of professionals already optimizing performance.
        </p>
      </section>
    </div>
  );
};

export default Home;
