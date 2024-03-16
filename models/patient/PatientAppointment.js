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

const PatientAppointment = mongoose.model('Appointment', appointmentSchema);

module.exports = PatientAppointment;
