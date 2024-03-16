const mongoose = require('mongoose');
const DoctorAvailability = require('./doctorAvialabilityModel');

const liveAppointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor', // Reference to Doctor model
    required: true
  },
  patientId: {
    type: String,
    default: null
  },
  patient: {
    type: String,
    default: null
  },
  appointmentTime: {
    type: Date,
    required: true
  },
  averageConsultationTime: {
    type: Number,
    default: 10
  },
  date: {
    type: String,
    required: true,
    default: () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed, so add 1
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  fee: {
    type: Number,
    required: true
  },
  consultationMode: {
    type: String,
    enum: ['clinic', 'video'], // Specify the allowed values for consultation mode
    default: 'clinic', // Set default value to 'clinic'
    required: true
  }
});

// Function to generate appointment slots for the given doctor and time range
liveAppointmentSchema.statics.generateSlots = async function(doctorId, interval) {
  const LiveAppointmentSlot = this;

  // Find the doctor's availability
  const doctorAvailability = await DoctorAvailability.findOne({ doctorId });

  if (!doctorAvailability) {
    throw new Error('Doctor availability not found');
  }

  const { workHours: { start, end }, fee } = doctorAvailability;

  // // Get today's date
  const today = new Date();

  // Construct start and end time strings with UTC offset for India Standard Time (IST)
  const startTime = new Date(`${today.toISOString().slice(0, 10)}T${start}+05:30`);
  const endTime = new Date(`${today.toISOString().slice(0, 10)}T${end}+05:30`);

  const slots = [];
  let currentTime = new Date(startTime);

  while (currentTime < endTime) {
    slots.push({
      doctor: doctorId,
      appointmentTime: currentTime,
      status: 'pending',
      fee: fee,
      date: today.toISOString().slice(0, 10) // Assign today's date to the slot
    });

    // Increment current time by the interval
    currentTime = new Date(currentTime.getTime() + interval * 60000); // Convert minutes to milliseconds
  }

  // Insert generated slots into the database
  await LiveAppointmentSlot.insertMany(slots);
};

const LiveAppointmentSlot = mongoose.model('LiveAppointmentSlot', liveAppointmentSchema);

module.exports = LiveAppointmentSlot;
