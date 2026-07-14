import React, { useEffect, useState } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css'; // ✅ Bootstrap CSS included

const AdminDashboard = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [message, setMessage] = useState('');

  const fetchPendingDoctors = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await API.get('/doctors/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingDoctors(res.data.doctors);
    } catch (err) {
      console.error('❌ Failed to fetch pending doctors:', err);
      setMessage('Could not load pending doctor requests.');
    }
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      await API.put(`/doctors/status/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(`Doctor ${status} successfully.`);
      setPendingDoctors(prev => prev.filter(doc => doc._id !== id));
    } catch (err) {
      console.error(`❌ Failed to update doctor ${status}:`, err);
      setMessage(`Failed to update doctor.`);
    }
  };

  return (
    <div>
      <Navbar role="admin" />
      <div className="container mt-5">
        <h3 className="mb-4">Admin Dashboard – Pending Doctor Approvals</h3>

        {message && <div className="alert alert-info">{message}</div>}

        {pendingDoctors.length === 0 ? (
          <div className="alert alert-success">✅ No pending doctor requests right now.</div>
        ) : (
          <div className="row">
            {pendingDoctors.map(doc => (
              <div key={doc._id} className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{doc.name}</h5>
                    <p className="card-text"><strong>Specialty:</strong> {doc.specialty}</p>
                    <p className="card-text"><strong>Email:</strong> {doc.user?.email || 'N/A'}</p>
                    <p className="card-text"><strong>Location:</strong> {doc.location || 'Not provided'}</p>
                    <p className="card-text"><strong>Availability:</strong> {(doc.availability || []).join(', ') || 'Not specified'}</p>
                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-success w-50" onClick={() => handleStatusUpdate(doc._id, 'approved')}>Approve</button>
                      <button className="btn btn-danger w-50" onClick={() => handleStatusUpdate(doc._id, 'rejected')}>Reject</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
