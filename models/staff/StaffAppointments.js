const mongoose = require('mongoose');

// not working


const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff' // Assuming you have a Staff model
  },
  dateTime: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['online', 'offline'],
    required: true
  },
  // Add other appointment information fields as needed
});

const DoctorAppointment = mongoose.model('DoctorAppointment', appointmentSchema);

module.exports = DoctorAppointment;
