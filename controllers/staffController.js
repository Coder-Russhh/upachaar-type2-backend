const Staff = require("../models/staffModel");
const bcrypt = require("bcrypt");

exports.staffLogin = async (req, res) => {
  try {
    const { email, password, doctorId } = req.body;
    const {staffId} = req.params;
    const _id = staffId
    // we can add permission here aaram se--
    const staffMember = await Staff.findOne({ _id, email });
    // Check if staff member exists
    if (!staffMember) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    };

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, staffMember.password);

    // Check if the passwords match
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, error: "Invalid pass" });
    }
    res.status(200).json({ success: true, message: "Staff member logged in successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.deleteStaffMember = async (req, res) => {
  const staffId = req.params.staffId;

  try {
    const deletedStaffMember = await Staff.findByIdAndDelete(staffId);

    if (!deletedStaffMember) {
      return res
        .status(404)
        .json({ success: false, message: "Staff member not found" });
    }

    res.status(200).json({ success: true, message: "Staff member deleted successfully" });
  } catch (error) {
    console.error("Error deleting staff member:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
