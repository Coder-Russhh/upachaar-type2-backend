const express = require('express');
const clinicController = require('../../controllers/doctor/clinicController');


const router = express.Router();


router.post('/upload/:doctorId', clinicController.uploadClinic);
router.get('/get/:doctorId', clinicController.getClinic);
router.put('/update/:clinicId', clinicController.updateClinic);
router.delete('/delete/:clinicId', clinicController.deleteClinic);

module.exports = router;
