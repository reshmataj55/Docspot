const Doctor = require('../models/doctorModel');
const User = require('../models/User');

// ✅ Register a doctor (only once per user)
const registerDoctor = async (req, res) => {
  try {
    const { name, specialty, availability, location } = req.body;

    if (!name || !specialty) {
      return res.status(400).json({ message: 'Name and specialty are required' });
    }

    const existing = await Doctor.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Doctor already registered' });
    }

    const doctor = await Doctor.create({
      user: req.user._id,
      name,
      specialty,
      location,
      availability,
      status: 'pending' // ✅ This line ensures the admin dashboard will pick it up!
    });
    console.log('📥 REGISTER DOCTOR BODY:', req.body);
    console.log('👤 USER from token:', req.user?._id);
    console.log('✅ Doctor created with status:', doctor.status);
    
    res.status(201).json({ message: 'Doctor profile created', doctor });
  } catch (err) {
    console.error('❌ Register Doctor Error:', err);
    res.status(500).json({ message: 'Doctor registration failed' });
  }
};


// ✅ Update logged-in doctor profile
const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const { name, specialty, availability, location } = req.body;

    if (name) doctor.name = name;
    if (specialty) doctor.specialty = specialty;
    if (location) doctor.location = location;
    if (availability) doctor.availability = availability;

    await doctor.save();

    res.status(200).json({ message: 'Profile updated successfully', doctor });
  } catch (err) {
    console.error('❌ Update Doctor Error (FULL):', err);
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

// ✅ Admin: View all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('user', 'name email');
    res.status(200).json({ doctors });
  } catch (err) {
    console.error('❌ Get Doctors Error (FULL):', err);
    res.status(500).json({ message: 'Failed to fetch doctors', error: err.message });
  }
};

// ✅ Admin: View pending requests
// ✅ Admin: View pending doctor registrations
const getPendingDoctors = async (req, res) => {
  try {
    console.log('📡 Fetching pending doctors...');

    const pendingDoctors = await Doctor.find({ status: 'pending' }).populate('user', 'name email');
    
    console.log('📦 Found pending doctors:', pendingDoctors.length);

    res.status(200).json({ doctors: pendingDoctors });
  } catch (err) {
    console.error('❌ Get Pending Doctors Error:', err);
    res.status(500).json({ message: 'Failed to fetch pending requests' });
  }
};


// ✅ Admin: Approve or reject doctor
const updateDoctorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    doctor.status = status;
    await doctor.save();

    res.status(200).json({ message: `Doctor ${status} successfully` });
  } catch (err) {
    console.error('❌ Update Status Error (FULL):', err);
    res.status(500).json({ message: 'Could not update doctor status', error: err.message });
  }
};

module.exports = {
  registerDoctor,
  updateDoctorProfile,
  getAllDoctors,
  getPendingDoctors,
  updateDoctorStatus
};
