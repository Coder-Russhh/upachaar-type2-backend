const express = require("express")
const appointmentController = require("../controllers/appointmentController")

const router = express.Router();

// router.post('/:patientId/:doctorId', appointmentController.createAppointment);
router.post('/:patientId/:doctorId', appointmentController.createAppointment);
router.post('/handle-payment', appointmentController.updateAppointmentStatus);
router.get('/update/:appointmentId', appointmentController.updateCompletedAppointmentStatus);
router.get('/:doctorId', appointmentController.getAllAppointmentsForDoctor);

module.exports = router;