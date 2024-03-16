const express = require("express");
const patientController = require("../controllers/patientController");
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router();

// Registration route
router.post("/patient-register", patientController.patientRegister);

// Login routes
router.post("/patient-login", patientController.patientLogin);

// get routes
router.get("/", patientController.getAllPatients);
router.get("/get/:patientId", patientController.getPatientById);

router.put("/update/:patientId", patientController.updatePatientById);
router.delete("/delete/:patientId", patientController.deletePatientById);





module.exports = router;
