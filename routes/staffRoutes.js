const express = require("express");
const staffController = require("../controllers/staffController");

const router = express.Router();

// staff register routes--

router.post("/staff-login/:staffId", staffController.staffLogin);
router.post("/staff-delete/:staffId", staffController.deleteStaffMember);

module.exports = router;
