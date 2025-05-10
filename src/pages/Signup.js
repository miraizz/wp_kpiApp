// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const handleSubmit = (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // Save to sessionStorage
  sessionStorage.setItem("user", form.email);
  sessionStorage.setItem("email", form.email);
  sessionStorage.setItem("name", form.fullName);
  sessionStorage.setItem("phone", form.phone);
  sessionStorage.setItem("department", form.department);
  sessionStorage.setItem("role", form.role);

  alert("Account created successfully (demo)");
  navigate('/');
};


  return (
    <div className="form-container">
      <h2>Create an account</h2>
      <p>Enter your details below to create your account</p>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <div className="flex-row">
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
        </div>
        <div className="flex-row">
          <select name="role" value={form.role} onChange={handleChange} required>
            <option value="">Select role</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
          </select>
          <input type="text" name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
        </div>
        <input type="tel" name="phone" placeholder="Phone (Optional)" value={form.phone} onChange={handleChange} />
        <button type="submit">👤 Create Account</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '10px' }}>Already have an account? <a href="/login">Sign in</a></p>
    </div>
  );
};

export default Signup;