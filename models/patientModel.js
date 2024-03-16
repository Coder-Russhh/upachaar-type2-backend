const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },
  userType: {
    type: String,
    enum: ["patient"],
    default: "patient",
  },
  medicalHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedicalHistory",
  }],
  healthMetrics: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HealthMetrics",
  },
  prescription: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription",
  }],
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
