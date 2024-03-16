const Prescription = require("../../models/patient/Prescription");
const Patient = require("../../models/patientModel");

exports.createPrescription = async (req, res) => {
  try {
    const { patientId } = req.params;
    const prescriptionData = req.body;

    prescriptionData.patientId = patientId;

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Create new prescription
    const newPrescription = new Prescription(prescriptionData);
    await newPrescription.save();

    // Update patient's prescriptions reference
    patient.prescription.push(newPrescription._id);
    await patient.save();

    res.status(201).json({
      message: "Prescription created successfully",
      prescription: newPrescription,
    });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPrescription = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    // retrieving data
    const patient = await Patient.findById(patientId).populate("prescription");
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.status(200).json({ prescriptions: patient.prescription });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const { patientId, prescriptionId } = req.params;
    const updateData = req.body;

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Check if prescription exists
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    // Update prescription
    await Prescription.findByIdAndUpdate(prescriptionId, updateData);

    res.status(200).json({ message: "Prescription updated successfully" });
  } catch (error) {
    console.error("Error updating prescription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deletePrescription = async (req, res) => {
    try {
        const { patientId, prescriptionId } = req.params;

        // Check if patient exists
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        // Check if prescription exists
        const prescription = await Prescription.findById(prescriptionId);
        if (!prescription) {
            return res.status(404).json({ error: "Prescription not found" });
        }

        // Delete prescription
        await Prescription.findByIdAndDelete(prescriptionId);

        // Remove prescription reference from patient
        patient.prescription = patient.prescription.filter(id => id.toString() !== prescriptionId);
        await patient.save();

        res.status(200).json({ message: "Prescription deleted successfully" });
    } catch (error) {
        console.error("Error deleting prescription:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
