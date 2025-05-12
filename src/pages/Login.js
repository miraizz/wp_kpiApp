import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email && password) {
      let role = '';
      if (email.toLowerCase() === 'manager@example.com') {
        role = 'Manager';
        navigate('/manager');
      } else if (email.toLowerCase() === 'staff@example.com') {
        role = 'Staff';
        navigate('/staff');
      } else {
        role = 'Staff';
        navigate('/staff');
      }

      sessionStorage.setItem('user', email);
      sessionStorage.setItem('email', email);
      sessionStorage.setItem('role', role);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="card-header">
          <h2>Welcome to KPI Management System</h2><br></br>
          <p>Enter your credentials to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">Sign In</button>

          <p className="signup-link">
            Don't have an account? <a href="/signup">Register</a>
          </p>

          <div style={{ fontSize: '14px', textAlign: 'center', marginTop: '20px' }}>
            <span role="img" aria-label="key">🔑</span> Demo login credentials:<br />
            <strong>Manager:</strong> manager@example.com<br />
            <strong>Staff:</strong> staff@example.com
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
