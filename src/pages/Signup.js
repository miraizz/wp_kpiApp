import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    department: '',
    phone: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          role: form.role
          // You can also add fullName, department, phone if backend supports them
        })
      });

      if (!res.ok) {
        const { error } = await res.json();
        alert(error || 'Registration failed.');
        return;
      }

      const data = await res.json();
      alert('Account created successfully!');
      sessionStorage.setItem("user", data.user.email);
      sessionStorage.setItem("email", data.user.email);
      sessionStorage.setItem("role", data.user.role);

      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="card-header">
          <h2>Create an account</h2>
          <p>Enter your details below to create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Ahmad Afiq"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="user@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="password-row">
            <div className="form-group half-width">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group half-width">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="">Select role</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div className="form-group half-width">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                placeholder="e.g., Marketing"
                value={form.department}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number (Optional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="+6012-3456789"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="signup-button">
            Create Account
          </button>

          <p className="login-link">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;