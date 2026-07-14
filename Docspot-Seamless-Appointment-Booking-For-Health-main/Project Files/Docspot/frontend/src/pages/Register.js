import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users/register', form);
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input name="name" className="form-control mb-3" placeholder="Name" onChange={handleChange} required />
        <input name="email" className="form-control mb-3" placeholder="Email" type="email" onChange={handleChange} required />
        <input name="password" className="form-control mb-3" placeholder="Password" type="password" onChange={handleChange} required />
        <select name="role" className="form-select mb-4" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="btn btn-success w-100">Register</button>
      </form>
      <p className="text-center mt-3">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
