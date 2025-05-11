import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy login logic
    if (email && password) {
      let role = '';

      // Determine role based on email
      if (email.toLowerCase() === 'manager@example.com') {
        role = 'Manager';
        navigate('/manager-dashboard');
      } else if (email.toLowerCase() === 'staff@example.com') {
        role = 'Staff';
        navigate('/staff-dashboard');
      } else {
        // Default fallback
        role = 'Staff';
        navigate('/staff-dashboard');
      }

      // Save to session
      sessionStorage.setItem('user', email);
      sessionStorage.setItem('email', email);
      sessionStorage.setItem('role', role);
    }
  };


  return (
    <section style={{ backgroundColor: '#e6f7f9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="form-container">
      <h2>Welcome to KPI Management System</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px' }}>
      Enter your credentials to access your dashboard
      </p>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign In</button>
      </form>
      <p>Don't have an account? <a href="/signup">Register</a></p>
      <div style={{ fontSize: '14px', textAlign: 'center', marginTop: '20px' }}>
        <span role="img" aria-label="key">🔑</span> Demo login credentials:<br />
        <strong>Manager:</strong> manager@example.com<br />
        <strong>Staff:</strong> staff@example.com
      </div>

    </div>
    </section>
  );
};

export default Login;
