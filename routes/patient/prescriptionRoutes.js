const express = require('express');
const prescriptionController = require('../../controllers/patient/prescription');


const router = express.Router();

// Create prescription
router.post('/:patientId', prescriptionController.createPrescription);

// Get prescriptions
router.get('/:patientId', prescriptionController.getPrescription);

// Update prescription
router.put('/:patientId/:prescriptionId', prescriptionController.updatePrescription);

// Delete prescription
router.delete('/:patientId/:prescriptionId', prescriptionController.deletePrescription);

module.exports = router;
