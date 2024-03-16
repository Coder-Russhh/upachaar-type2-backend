const mongoose = require('mongoose');

const doctorAvailabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  workHours: {
    type: {
      start: { type: String, default: '16:00' },
      end: { type: String, default: '20:00' }
    },
    required: true,
    default: { start: '16:00', end: '20:00' }
  },
  fee: {
    type: Number,
    required: true,
    default: 400 // Default fee amount
  },
  nonAvailable: {
    type: [Date],
    default: []
  }
});

const DoctorAvailability = mongoose.model('DoctorAvailability', doctorAvailabilitySchema);

module.exports = DoctorAvailability;
