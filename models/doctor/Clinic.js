const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true,
    default: '-'
  },
  phone: {
    type: String,
    required: true,
    default: '-'
  },
  email: {
    type: String,
    required: true,
    unique: true 
  },
  specialties: {
    type: [String]
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a Clinic model from the schema
const Clinic = mongoose.model('Clinic', clinicSchema);

module.exports = Clinic;
