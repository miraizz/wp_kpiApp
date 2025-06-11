import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const { error } = await res.json();
        setErrorMsg(error || 'Login failed');
        return;
      }

      const { email: userEmail, role } = await res.json();

      sessionStorage.setItem('user', userEmail);
      sessionStorage.setItem('email', userEmail);
      sessionStorage.setItem('role', role);

      if (role === 'Manager') {
        navigate('/manager');
      } else {
        navigate('/staff');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="card-header">
          <h2>Welcome to KPI Management System</h2><br />
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

          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <button type="submit" className="login-button">Sign In</button>

          <p className="signup-link">
            Don't have an account? <a href="/signup">Register</a>
          </p>

          <div style={{ fontSize: '14px', textAlign: 'center', marginTop: '20px' }}>
            {/* <span role="img" aria-label="key">🔑</span> Demo login credentials:<br />
            <strong>Manager:</strong> manager@example.com<br />
            <strong>Staff:</strong> staff@example.com */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
