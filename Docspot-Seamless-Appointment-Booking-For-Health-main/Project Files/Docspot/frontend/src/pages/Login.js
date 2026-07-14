import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Login user
      const res = await API.post('/users/login', form);
      const { token, role, user } = res.data;

      // 2. Store token & role
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // 3. If doctor, register doctor profile (if not already done)
      if (role === 'doctor') {
        try {
          console.log('trying doctor register...');
          await API.post('/doctor/register', {
            name: user.name,
            specialty: 'General', // default value
            location: 'Not specified',
            availability: []
          });
          console.log('doctor register success');
          console.log('✅ Doctor profile created or already exists');
        } catch (err) {
          if (
            err.response?.data?.message !== 'Doctor already registered'
          ) {
            console.error('❌ Doctor register failed:', err);
          }
        }
        navigate('/doctor-dashboard');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          className="form-control mb-3"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          className="form-control mb-4"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
      <p className="text-center mt-3">
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;