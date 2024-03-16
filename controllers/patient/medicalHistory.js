const Patient = require("../../models/patientModel");
const MedicalHistory = require("../../models/patient/MedicalHistory");

exports.uploadMedicalHistory = async (req, res) => {
  try {
    const { conditions, allergies, surgeries, medications } = req.body;
    const patientId = req.params.patientId;

    // Check if patient exists and populate medicalHistory
    const patient = await Patient.findById(patientId).populate(
      "medicalHistory"
    );
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Create medical history
    const medicalHistory = new MedicalHistory({
      patientId,
      conditions,
      allergies,
      surgeries,
      medications,
    });

    // Save medical history
    await medicalHistory.save();

    // Update patient's medical history reference
    patient.medicalHistory = medicalHistory._id; // Assigning the ObjectId of the created medical history
    await patient.save();

    return res
      .status(201)
      .json({ message: "Medical history uploaded successfully" });
  } catch (error) {
    console.error("Error uploading medical history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.getMedicalHistory = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    // Check if patient exists
    const medicalHistories = await MedicalHistory.find({ patientId });

    if (!medicalHistories || medicalHistories.length === 0) {
      return res.status(404).json({ error: "No medical history found for the patient" });
    }

    res.status(200).json({ medicalHistory: medicalHistories });
  } catch (error) {
    console.error("Error fetching medical history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateMedicalHistory = async (req, res) => {
  try {
    const medicalHistoryId = req.params.medicalHistoryId;
    const updateData = req.body;

    // Find and update medical history
    const updatedMedicalHistory = await MedicalHistory.findByIdAndUpdate(
      medicalHistoryId,
      updateData,
      { new: true }
    );

    if (!updatedMedicalHistory) {
      return res.status(404).json({ error: "Medical history not found" });
    }

    res
      .status(200)
      .json({
        message: "Medical history updated successfully",
        updatedMedicalHistory,
      });
  } catch (error) {
    console.error("Error updating medical history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteMedicalHistory = async (req, res) => {
  try {
    const medicalHistoryId = req.params.medicalHistoryId;

    // Find and delete medical history
    const deletedMedicalHistory = await MedicalHistory.findByIdAndDelete(medicalHistoryId);

    if (!deletedMedicalHistory) {
        return res.status(404).json({ error: "Medical history not found" });
    }

    // Remove medical history reference from patient
    await Patient.updateOne({ medicalHistory: medicalHistoryId }, { $pull: { medicalHistory: medicalHistoryId } });

    res.status(200).json({ message: "Medical history deleted successfully" });
} catch (error) {
    console.error("Error deleting medical history:", error);
    res.status(500).json({ error: "Internal server error" });
}
};
