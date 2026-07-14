const express = require('express');
const router = express.Router();

const {
  bookAppointment,
  getAppointmentsByUser,
  getAppointmentsByDoctor,
  updateAppointmentStatus,
  getAllAppointments
} = require('../utils/appointmentController');

const { protect, adminOnly } = require('../utils/middleware/authMiddleware');

// 🔒 Book a new appointment (user)
router.post('/book', protect, bookAppointment);

// 👤 Get appointments for a user
router.get('/user', protect, getAppointmentsByUser);

// 🩺 Doctor views their own appointments
router.get('/doctor/me', protect, getAppointmentsByDoctor);

// 🛡️ Admin views all appointments
router.get('/admin/all', protect, adminOnly, getAllAppointments);

// ✏️ Doctor updates status: approve, cancel, reschedule, etc.
router.put('/:id/status', protect, updateAppointmentStatus);

module.exports = router;
