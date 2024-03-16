const express = require("express")
const doctorAvailabilityController = require("../controllers/doctorAvailabilityController")

const router = express.Router();

// routes
router.post('/:doctorId', doctorAvailabilityController.createDoctorAvailability); 
router.put('/update/:doctorId', doctorAvailabilityController.updateDoctorAvailability); 
router.get('/:doctorId', doctorAvailabilityController.getDoctorAvailabilityById); 
router.get('/', doctorAvailabilityController.getAllDoctorAvailabilities);

module.exports = router;