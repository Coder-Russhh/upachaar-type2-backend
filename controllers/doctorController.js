const bcrypt = require("bcrypt");
const Doctor = require("../models/doctorModel");
const Staff = require("../models/staffModel");
const { nanoid } = require("nanoid");

exports.doctorRegister = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      clinicAddress,
      gender,
      city,
      speciality,
      qualification,
      experience,
    } = req.body;

    // Check if the email already exists in the database
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new Doctor({
      username,
      password: hashedPassword,
      email,
      gender,
      clinicAddress,
      city,
      speciality,
      qualification,
      experience,
    });

    // Save the doctor to the database
    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully",
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the doctor by email
    const doctor = await Doctor.findOne({ email });

    // If doctor not found or password is incorrect
    if (!doctor || !(await bcrypt.compare(password, doctor.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Authentication successful
    res
      .status(200)
      .json({
        message: "Login successful",
        user: req.user,
        success: true,
        doctorId: doctor._id,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateDoctorProfile = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      clinicAddress,
      gender,
      city,
      speciality,
      qualification,
      experience,
    } = req.body;

    const doctorId = req.params.doctorId;
    const doctor = await Doctor.findById(doctorId);

    // If doctor not found
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // update full data--
    doctor.username = username;
    doctor.email = email;
    doctor.clinicAddress = clinicAddress;
    doctor.gender = gender;
    doctor.city = city;
    doctor.speciality = speciality;
    doctor.qualification = qualification;
    doctor.experience = experience;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      doctor.password = hashedPassword;
    }

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get controllers--

exports.getAllDoctors = async (req, res) => {
  try {
    // Fetch all doctors from the database
    const doctors = await Doctor.find();

    // Send the list of doctors as a response
    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getDoctorbyId = async (req, res) => {
  const doctorId = req.params.id;

  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error fetching doctor by ID.",
    });
  }
};

exports.getDoctorsBySpeciality = async (req, res) => {
  try {
    const { speciality } = req.params;

    // Perform case-insensitive search for speciality
    const doctors = await Doctor.find({
      speciality: { $regex: new RegExp(speciality, "i") },
    });

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors by speciality:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// staff controllers

// addStaffMember--
exports.addStaffMember = async (req, res) => {
  const doctorId = req.params.doctorId;
  const { username, email, password, permission } = req.body;

  if (!username || !email || !password || !doctorId || !permission) {
    console.error("Missing required fields");
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Find the doctor by ID
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      console.error("Doctor not found");
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if the staff member with the same email already exists
    const existingStaffWithEmail = await Staff.findOne({ email });

    if (existingStaffWithEmail) {
      console.error("Staff member with the same email already exists");
      return res
        .status(400)
        .json({ message: "Staff member with the same email already exists" });
    }

    const staffId = nanoid(8);

    // Create a new staff member
    const newStaffMember = new Staff({
      username,
      email,
      password,
      staffId,
      permission,
      doctorId: doctor._id, // Associate staff with this doctor
    });

    // Save the new staff member
    await newStaffMember.save();

    // Add the new staff member's ObjectId reference to the doctor's staff array
    doctor.staff.push(newStaffMember._id);

    // Save the updated doctor document
    await doctor.save();
    res.status(201).json({ message: "Staff member added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get all staff members which doctor adds--
exports.getAllStaff = async (req, res) => {
  const doctorId = req.params.doctorId;

  try {
    const doctor = await Doctor.findById(doctorId).populate("staff");

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const staffMembers = doctor.staff;
    res.status(200).json({ success: true, data: { staffMembers } });
  } catch (error) {
    console.error("Error fetching staff members:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.getStaffById = async (req, res) => {
  const staffId = req.params.staffId; // Assuming the staff ID is passed as a parameter

  try {
    // Find the staff member by ID
    const staffMember = await Staff.findById(staffId);

    if (!staffMember) {
      // If staff member with the given ID is not found, return 404
      return res
        .status(404)
        .json({ success: false, message: "Staff member not found" });
    }

    // If found, return the staff member
    res.status(200).json({ success: true, data: { staffMember } });
  } catch (error) {
    // If an error occurs during the database operation, return 500
    console.error("Error fetching staff member:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.getStaffByStaffId = async (req, res) => {
  try {
    const { staffId } = req.body; // Assuming the staff ID is passed as a parameter

    // Querying the database to find the staff member by staffId
    const staffMember = await Staff.findOne({ staffId });

    // If staff member is found
    if (staffMember) {
      res.status(200).json({ success: true, data: staffMember });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Staff member not found" });
    }
  } catch (error) {
    console.error("Error retrieving staff member:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateStaffMember = async (req, res) => {
  const doctorId = req.params.doctorId;
  const staffId = req.params.staffId;
  const { email, username, password, permission } = req.body;

  if (!email || !username || !password || !permission) {
    return res
      .status(400)
      .json({ success: false, message: "Provide all required information" });
  }

  try {
    const doctor = await Doctor.findById(doctorId).populate("staff");

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const staffMember = doctor.staff.find(
      (member) => member._id.toString() === staffId
    );
    if (!staffMember) {
      return res
        .status(404)
        .json({ success: false, message: "Staff member not found" });
    }

    // Update staff member details
    // console.log(staffMember.email);

    staffMember.email = email;
    staffMember.username = username;
    staffMember.password = password;
    staffMember.permission = permission;

    // console.log(staffMember.email);

    // Save the changes to the doctor document
    await staffMember.save();

    res
      .status(200)
      .json({ success: true, message: "Staff member updated successfully" });
  } catch (error) {
    console.error("Error updating staff member:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.deleteStaffMember = async (req, res) => {
  const doctorId = req.params.doctorId;
  const staffId = req.params.staffId;

  try {
    const doctor = await Doctor.findById(doctorId).populate("staff");

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // Find the staff member by ID and remove it
    const staffMemberIndex = doctor.staff.findIndex(
      (member) => member._id.toString() === staffId
    );

    if (staffMemberIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Staff member not found" });
    }

    doctor.staff.splice(staffMemberIndex, 1);

    // Save changes to the doctor document
    await doctor.save();

    // Now delete the staff member from the staff model
    await Staff.findByIdAndDelete(staffId);

    res
      .status(200)
      .json({ success: true, message: "Staff member deleted successfully" });
  } catch (error) {
    console.error("Error deleting staff member:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
