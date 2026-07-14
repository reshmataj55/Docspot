import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const AppointmentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar role="user" />
      <div className="container mt-5 text-center">
        <div className="alert alert-success">
          <h4 className="alert-heading">🎉 Appointment Booked Successfully!</h4>
          <p>Thank you! Your appointment has been scheduled.</p>
        </div>
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate('/user-dashboard')}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AppointmentSuccess;
