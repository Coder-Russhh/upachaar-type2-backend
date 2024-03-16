const express = require('express');
const { uploadMedicalHistory, getMedicalHistory, updateMedicalHistory, deleteMedicalHistory } = require('../../controllers/patient/medicalHistory');

const router = express.Router();

// Route to upload medical history
router.post('/upload/:patientId', uploadMedicalHistory);

// Route to get medical history by userId
router.get('/get/:patientId', getMedicalHistory);

// update
router.put('/update/:medicalHistoryId', updateMedicalHistory);

// delete
router.delete('/delete/:medicalHistoryId', deleteMedicalHistory);


module.exports = router;
