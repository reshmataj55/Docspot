import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState('');
  const [rescheduleId, setRescheduleId] = useState('');
  const [newDate, setNewDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    API.get('/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        const user = res.data.user;
        setUserId(user.id);
        fetchAppointments(user.id, token);
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  const fetchAppointments = (id, token) => {
    API.get(`/appointments/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setAppointments(res.data.appointments || []))
      .catch(() => alert('Failed to fetch appointments'));
  };

  const cancelAppointment = (id) => {
    const token = localStorage.getItem('token');
    API.put(`/appointments/${id}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => fetchAppointments(userId, token))
      .catch(() => alert('Cancel failed'));
  };

  const rescheduleAppointment = () => {
    if (!newDate) return alert('Select new date');
    const token = localStorage.getItem('token');
    API.put(`/appointments/${rescheduleId}/reschedule`, { newDate }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        fetchAppointments(userId, token);
        setRescheduleId('');
        setNewDate('');
      })
      .catch(() => alert('Reschedule failed'));
  };

  return (
    <div>
      <Navbar role="user" />
      <div className="container mt-4">
        <h3 className="mb-4 text-center">My Appointments</h3>
        {appointments.length === 0 ? (
          <p className="text-center">No appointments booked.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>{appt.doctor?.name || 'N/A'}</td>
                    <td>{new Date(appt.date).toLocaleString()}</td>
                    <td>{appt.status}</td>
                    <td>
                      {appt.status !== 'cancelled' && (
                        <>
                          <button
                            className="btn btn-sm btn-danger me-2"
                            onClick={() => cancelAppointment(appt._id)}
                          >
                            Cancel
                          </button>
                          {rescheduleId === appt._id ? (
                            <>
                              <input
                                type="datetime-local"
                                className="form-control d-inline w-auto me-2"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                              />
                              <button
                                className="btn btn-sm btn-success me-2"
                                onClick={rescheduleAppointment}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => setRescheduleId('')}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => setRescheduleId(appt._id)}
                            >
                              Reschedule
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
