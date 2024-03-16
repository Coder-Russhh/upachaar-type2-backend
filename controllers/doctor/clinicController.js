const Doctor = require("../../models/doctorModel");
const Clinic = require("../../models/doctor/Clinic");

// upload clinic information--
exports.uploadClinic = async (req, res) => {
  try {
    // Extract doctorId from request parameters
    const { doctorId } = req.params;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Extract clinic information from request body
    const { name, address, city, state, pincode, phone, email, specialties } =
      req.body;

    // Create a new clinic document
    const clinic = new Clinic({
      name,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      specialties,
      doctorId,
    });

    // Save the clinic document to the database
    await clinic.save();

    // Associate the clinic with the doctor
    doctor.clinic = clinic._id;
    await doctor.save();

    // Return success response
    res
      .status(201)
      .json({ message: "Clinic information uploaded successfully", clinic });
  } catch (error) {
    console.error("Error:", error);
    // If there is an error, return 500 Internal Server Error
    res.status(500).json({ error: "Internal server error" });
  }
};

// get clinic informaion--
exports.getClinic = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    // Find doctor by doctorId in the database
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Check if the doctor has a clinic associated
    if (!doctor.clinic) {
      return res
        .status(404)
        .json({ error: "Clinic not found for this doctor" });
    }

    // Fetch clinic information using the clinic ID
    const clinic = await Clinic.findById(doctor.clinic);

    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    // Return clinic information in the response
    res.json(clinic);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

exports.updateClinic = async (req, res) => {
  try {
    // Extract clinic ID from request parameters
    const clinicId = req.params.clinicId;

    // Find clinic by ID in the database
    let clinic = await Clinic.findById(clinicId);

    // If clinic with the provided ID is not found, return 404 Not Found
    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    // Extract updated clinic information from request body
    const { name, address, city, state, pincode, phone, email, specialties } =
      req.body;

    // Update clinic fields with new values
    clinic.name = name;
    clinic.address = address;
    clinic.city = city;
    clinic.state = state;
    clinic.pincode = pincode;
    clinic.phone = phone;
    clinic.email = email;
    clinic.specialties = specialties;

    // Save the updated clinic document
    await clinic.save();

    // Return success response
    res.json({ message: "Clinic information updated successfully", clinic });
  } catch (error) {
    console.error("Error:", error);
    // If there is an error, return 500 Internal Server Error
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteClinic = async (req, res) => {
  try {
    // Extract clinic ID from request parameters
    const clinicId = req.params.clinicId;

    // Find clinic by ID in the database and delete it
    await Clinic.findByIdAndDelete(clinicId);

    // Return success response
    res.json({ message: 'Clinic deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    // If there is an error, return 500 Internal Server Error
    res.status(500).json({ error: 'Internal server error' });
  }
};
