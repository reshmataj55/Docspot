import React, { useEffect, useState } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [specialty, setSpecialty] = useState('');
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  const fetchDoctorProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await API.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data.doctor;
      setDoctor(data);
      setSpecialty(data.specialty || '');
      setAvailability((data.availability || []).join(', '));
      setLocation(data.location || '');
    } catch (err) {
      console.error('❌ Failed to load doctor profile:', err);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      await API.put('/doctors/update', {
        specialty,
        availability: availability.split(',').map(s => s.trim()),
        location
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Profile updated successfully!');
    } catch (err) {
      console.error('❌ Update failed:', err);
      setMessage('Update failed.');
    }
  };

  if (!doctor) return (
    <div>
      <Navbar role="doctor" />
      <div className="container mt-4">
        <p>Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar role="doctor" />
      <div className="container mt-4" style={{ maxWidth: '600px' }}>
        <h3 className="mb-4">Doctor Dashboard</h3>

        <div className="card p-4">
          <h5 className="mb-3">Edit Profile</h5>

          <div className="mb-3">
            <label>Specialty</label>
            <input
              className="form-control"
              value={specialty}
              onChange={e => setSpecialty(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Availability (comma-separated)</label>
            <input
              className="form-control"
              value={availability}
              onChange={e => setAvailability(e.target.value)}
              placeholder="e.g. Monday 9AM, Wednesday 4PM"
            />
          </div>

          <div className="mb-3">
            <label>Location</label>
            <input
              className="form-control"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100" onClick={handleUpdate}>
            Save Changes
          </button>

          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
