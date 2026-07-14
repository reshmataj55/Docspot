const Doctor = require('../models/doctorModel');
const Appointment = require('../models/appointmentModel');

// ✅ Get all pending doctor requests
const getPendingDoctors = async (req, res) => {
  try {
    const pendingDoctors = await Doctor.find({ status: 'pending' });
    res.status(200).json(pendingDoctors);
  } catch (error) {
    console.error('Error fetching pending doctors:', error);
    res.status(500).json({ message: 'Failed to fetch pending doctors' });
  }
};

// ✅ Approve or reject a doctor
const approveDoctor = async (req, res) => {
  const doctorId = req.params.id;
  const { status } = req.body; // 'approved' or 'rejected'

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.status = status;
    await doctor.save();

    res.status(200).json({ message: `Doctor ${status}` });
  } catch (error) {
    console.error('Error updating doctor status:', error);
    res.status(500).json({ message: 'Failed to update doctor status' });
  }
};

// ✅ Get all appointments (admin view)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('user', 'name email')
      .populate('doctor', 'name specialty status');

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};

module.exports = {
  getPendingDoctors,
  approveDoctor,
  getAllAppointments
};
