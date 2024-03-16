const Patient = require("../models/patientModel");
const bcrypt = require("bcrypt");

exports.patientRegister = async (req, res) => {
  try {
    // Extract user input from the request body
    const { username, email, password, gender } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new patient instance
    const newPatient = new Patient({
      username,
      email,
      password: hashedPassword,
      gender,
    });

    // Save the patient to the database
    await newPatient.save();

    res
      .status(201)
      .json({ success: true, message: "Patient registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.patientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the patient by email
    const patient = await Patient.findOne({ email });

    // If patient not found or password is incorrect
    if (!patient || !(await bcrypt.compare(password, patient.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Authentication successful
    res.status(200).json({ success: true, message: "Login successful", patientId: patient._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.patientSignOut = async(req,res)=>{

};

exports.getAllPatients = async (req, res) => {
  try {
      // Query all patient documents from the database
      const patients = await Patient.find({ userType: "patient" });

      // Send the retrieved patient data in the response
      res.status(200).json({ success: true, data: patients });
  } catch (error) {
      console.error("Error getting all patients:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getPatientById = async(req,res)=>{
  try {
    const { patientId } = req.params;

    // Find the patient by ID
    const patient = await Patient.findById(patientId);

    // If patient not found
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    // If patient found, send the patient data in the response
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    console.error("Error getting patient by ID:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.updatePatientById = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { username, email, gender } = req.body;

    // Check if the patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    // Update patient data
    patient.username = username || patient.username;
    patient.email = email || patient.email;
    patient.gender = gender || patient.gender;

    // Save the updated patient data
    await patient.save();

    res.status(200).json({ success: true, message: "Patient updated successfully", data: patient });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.deletePatientById = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Find the patient by ID and delete it
    const deletedPatient = await Patient.findByIdAndDelete(patientId);

    // If patient not found
    if (!deletedPatient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.status(200).json({ success: true, message: "Patient deleted successfully", data: deletedPatient });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

