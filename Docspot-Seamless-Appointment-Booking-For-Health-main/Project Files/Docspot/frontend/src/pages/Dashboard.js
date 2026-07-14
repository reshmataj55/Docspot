import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    API.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => setUser(res.data.user))
    .catch(() => {
      alert('Session expired. Please login again.');
      localStorage.removeItem('token');
      navigate('/login');
    });
  }, [navigate]);

  if (!user) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome, {user.name}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
};

export default Dashboard;
