const HealthMetrics = require('../../models/patient/HealthMetrics');
const Patient = require('../../models/patientModel');

exports.uploadHealthMetrics = async (req, res) => {
    try {
        const { patientId } = req.params;
        const healthMetricsData = req.body;

        // Check if patient exists
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        // Validate healthMetricsData (add your validation logic here)

        // Add patientId to healthMetricsData
        healthMetricsData.patientId = patientId;

        // Create new health metrics entry
        const newHealthMetrics = new HealthMetrics(healthMetricsData);
        await newHealthMetrics.save();

        // Update patient's health metrics reference
        patient.healthMetrics = newHealthMetrics._id;
        await patient.save();

        res.status(201).json({ message: "Health metrics uploaded successfully", healthMetrics: newHealthMetrics });
    } catch (error) {
        console.error("Error uploading health metrics:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getHealthMetrics = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Retrieve health metrics for the specified patient
        const healthMetrics = await HealthMetrics.find({ patientId });

        res.status(200).json({ healthMetrics });
    } catch (error) {
        console.error("Error fetching health metrics:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.updateHealthMetrics = async (req, res) => {
    try {
        const { healthMetricsId } = req.params;
        const updateData = req.body;

        // Find and update health metrics
        const updatedHealthMetrics = await HealthMetrics.findByIdAndUpdate(healthMetricsId, updateData, { new: true });

        if (!updatedHealthMetrics) {
            return res.status(404).json({ error: "Health metrics not found" });
        }

        res.status(200).json({ message: "Health metrics updated successfully", updatedHealthMetrics });
    } catch (error) {
        console.error("Error updating health metrics:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteHealthMetrics = async (req, res) => {
    try {
        const { healthMetricsId } = req.params;

        // Find and delete health metrics
        const deletedHealthMetrics = await HealthMetrics.findByIdAndDelete(healthMetricsId);

        if (!deletedHealthMetrics) {
            return res.status(404).json({ error: "Health metrics not found" });
        }

        res.status(200).json({ message: "Health metrics deleted successfully" });
    } catch (error) {
        console.error("Error deleting health metrics:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
