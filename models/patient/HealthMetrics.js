const mongoose = require("mongoose");

const healthMetricsSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  bloodPressure: {
    systolic: Number,
    diastolic: Number,
  },
  heartRate: {
    type: Number,
    min: 0,
  },
  respiratoryRate: {
    type: Number,
    min: 0,
  },
  bodyTemperature: {
    type: Number,
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  bodyMassIndex: {
    type: Number,
  },
  bloodGlucoseLevel: {
    type: Number,
  },
  cholesterolLevels: {
    LDL: Number,
    HDL: Number,
    total: Number,
  },
  hemoglobinA1c: {
    type: Number,
  },
});

const HealthMetrics = mongoose.model("HealthMetrics", healthMetricsSchema);

module.exports = HealthMetrics;
