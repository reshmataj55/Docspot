import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <Link className="navbar-brand" to="/">DocSpot</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {role === 'user' && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/user-dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/book-appointment">Book Appointment</Link>
              </li>
            </>
          )}
          {role === 'doctor' && (
            <li className="nav-item">
              <Link className="nav-link" to="/doctor-dashboard">Doctor Dashboard</Link>
            </li>
          )}
          {role === 'admin' && (
            <li className="nav-item">
              <Link className="nav-link" to="/admin-dashboard">Admin Dashboard</Link>
            </li>
          )}
        </ul>
        <button className="btn btn-light" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
