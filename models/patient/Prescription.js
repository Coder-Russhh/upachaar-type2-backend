const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    // doctorId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Doctor',
    //     required: true
    // },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    medications: [{
        name: String,
        dosage: String,
        instructions: String,
        duration: String
    }],
    additionalNotes: String,
    prescriptionImage: {
        data: Buffer,
        contentType: String
    }
    // Add other prescription fields as needed
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
