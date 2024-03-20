const express = require("express");
const useragent = require("express-useragent");
const doctorController = require("../controllers/doctorController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Middleware to parse user-agent
router.use(useragent.express());

// Redmi device check middleware
const redmiDeviceCheck = (req, res, next) => {
  const userAgent = req.useragent.source;
  const user = userAgent.includes("SM");

  if (user) {
    req.user = { user };
    next();
  } else {
    res.status(403).json({
      success: false,
      error: "Access denied. This route is for Samsung users only.",
      status: 403,
    }); 
  }
};

// post routes
router.post("/doctor-register", redmiDeviceCheck,  doctorController.doctorRegister);
router.post("/doctor-login",redmiDeviceCheck, doctorController.doctorLogin);//redmi lagana hai bhai
router.put("/doctor-update/:doctorId",  doctorController.updateDoctorProfile);


// staff --
router.post("/:doctorId/staff", doctorController.addStaffMember);
router.get("/:doctorId/staff", doctorController.getAllStaff);
router.get("/:doctorId/staff/:staffId", doctorController.getStaffById);
router.post("/staffId", doctorController.getStaffByStaffId);
router.put("/:doctorId/staff/:staffId", doctorController.updateStaffMember);
router.delete("/:doctorId/staff/:staffId", doctorController.deleteStaffMember);

// get routes
router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorbyId);
router.get("/speciality/:speciality", doctorController.getDoctorsBySpeciality);
// router.get("/login-failure", redmiDeviceCheck, doctorController.doctorLoginFailure);
module.exports = router;
