const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    conditions: [{
        type: String
    }],
    allergies: [{
        type: String
    }],
    surgeries: [{
        name: String,
        date: Date
    }],
    medications: [{
        name: String,
        dosage: String,
        startDate: Date,
        endDate: Date
    }],
});

const MedicalHistory = mongoose.model("MedicalHistory", medicalHistorySchema);

module.exports = MedicalHistory;
