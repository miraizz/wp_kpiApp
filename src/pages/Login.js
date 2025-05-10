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
      sessionStorage.setItem('user', email);
      sessionStorage.setItem('email', email);
      navigate('/');
    }
  };

  return (
    <div className="form-container">
      <h2>Welcome to KPI Management System</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign In</button>
      </form>
      <p>Don't have an account? <a href="/signup">Register</a></p>
    </div>
  );
};

export default Login;
