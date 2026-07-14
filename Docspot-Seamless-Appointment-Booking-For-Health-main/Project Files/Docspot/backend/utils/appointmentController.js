const Appointment = require('../models/appointmentModel'); // lowercase 'a' matches filename
const Doctor = require('../models/doctorModel');
const User = require('../models/User');

// 📌 Book a new appointment
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, notes } = req.body;

    if (!doctorId || !date) {
      return res.status(400).json({ message: 'Doctor and date are required' });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      doctor: doctorId,
      date,
      notes,
      status: 'pending'
    });

    res.status(201).json({ message: 'Appointment booked', appointment });
  } catch (err) {
    console.error('❌ Booking error:', err);
    res.status(500).json({ message: 'Could not book appointment' });
  }
};

// 📌 Get appointments for a specific user
const getAppointmentsByUser = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized. User not found.' });

    const appointments = await Appointment.find({ user: userId }).populate('doctor');
    res.status(200).json({ appointments });
  } catch (err) {
    console.error('❌ User appointments error:', err);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};


// 📌 Get appointments for logged-in doctor
const getAppointmentsByDoctor = async (req, res) => {
  try {
    const doctorUserId = req.user._id;

    const doctor = await Doctor.findOne({ user: doctorUserId });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('user', 'name email')
      .sort({ date: 1 });

    res.status(200).json({ appointments });
  } catch (err) {
    console.error('❌ Doctor appointments error:', err);
    res.status(500).json({ message: 'Failed to load doctor appointments' });
  }
};

// 📌 Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = status || appointment.status;
    await appointment.save();

    res.status(200).json({ message: 'Status updated', appointment });
  } catch (err) {
    console.error('❌ Status update error:', err);
    res.status(500).json({ message: 'Failed to update appointment' });
  }
};

// 📌 Get all appointments (Admin)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('user', 'name email')
      .populate('doctor', 'name specialty')
      .sort({ date: -1 });

    res.status(200).json({ appointments });
  } catch (err) {
    console.error('❌ Admin fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch all appointments' });
  }
};

module.exports = {
  bookAppointment,
  getAppointmentsByUser,
  getAppointmentsByDoctor,
  updateAppointmentStatus,
  getAllAppointments
};
