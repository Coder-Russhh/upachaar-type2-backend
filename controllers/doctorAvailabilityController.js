const DoctorAvailability = require("../models/doctorAvialabilityModel");

// Controller functions--

const createDoctorAvailability = async (req, res) => {
  const { doctorId } = req.params;
  const { workHours, fee, nonAvailable } = req.body;

  const doctorAvailability = new DoctorAvailability({
    doctorId,
    workHours,
    fee,
    nonAvailable,
  });

  try {
    // Save the new doctor availability to the database
    const newDoctorAvailability = await doctorAvailability.save();
    res.status(201).json(newDoctorAvailability);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateDoctorAvailability = async (req, res) => {
  const { doctorId } = req.params;

  try {
    // Find the doctor availability record
    const doctorAvailability = await DoctorAvailability.findOne({ doctorId });

    if (!doctorAvailability) {
      return res.status(404).json({ message: "Doctor availability not found" });
    }

    // Update the doctor availability record with the new data
    doctorAvailability.workHours = req.body.workHours;
    doctorAvailability.fee = req.body.fee;
    doctorAvailability.nonAvailable = req.body.nonAvailable;

    // Save the updated doctor availability record
    const updatedDoctorAvailability = await doctorAvailability.save();

    res.json({ updatedDoctorAvailability, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllDoctorAvailabilities = async (req, res) => {
  try {
    const doctorAvailabilities = await DoctorAvailability.find();
    res.json({ doctorAvailabilities, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorAvailabilityById = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const doctorAvailability = await DoctorAvailability.findOne({
      doctorId,
    });
    if (!doctorAvailability) {
      return res.status(404).json({ message: "Doctor availability not found" });
    }
    res.json({ doctorAvailability, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export controller functions
module.exports = {
  createDoctorAvailability,
  updateDoctorAvailability,
  getAllDoctorAvailabilities,
  getDoctorAvailabilityById,
};
