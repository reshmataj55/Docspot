import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const res = await API.get('/doctors', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(res.data.doctors || []);
      } catch (err) {
        console.error('Doctor fetch failed:', err);
        alert('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!selectedDoctor || !date) return alert('Please fill all fields');

    try {
      await API.post('/appointments/book', {
        doctorId: selectedDoctor,
        date,
        notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Appointment request sent! Awaiting doctor approval.');
      navigate('/appointment-success');
    } catch (err) {
      alert('Booking failed. Try again later.');
    }
  };

  return (
    <div>
      <Navbar role="user" />
      <div className="container mt-4" style={{ maxWidth: '600px' }}>
        <h3 className="text-center mb-4">Book an Appointment</h3>
        {loading ? (
          <p className="text-center">Loading doctors...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Select Doctor:</label>
              <select
                className="form-select"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                required
              >
                <option value="">-- Choose --</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} ({doc.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label>Appointment Date & Time:</label>
              <input
                type="datetime-local"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Notes (optional):</label>
              <textarea
                className="form-control"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">Book Appointment</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
