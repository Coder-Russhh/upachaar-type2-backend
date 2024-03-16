const LiveAppointmentSlot = require("../models/liveAppointmentMode");

// router mein hai--
exports.generateSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const interval = 10;
    if (!doctorId || !interval) {
      return res.status(400).json({ error: "Doctor ID or interval is missing" });
    }
    // Generate appointment slots
    await LiveAppointmentSlot.generateSlots(doctorId, interval);

    io.emit('slotsGenerated', {});

    res.status(201).json({ message: "Appointment slots generated successfully" });
  } catch (error) {
    console.error("Error generating slots:", error);
    res.status(500).json({ error: "Failed to generate appointment slots" });
  }
};

exports.getAllSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID is missing" });
    }

    // Find all appointment slots for the specified doctor
    const slots = await LiveAppointmentSlot.find({ doctor: doctorId });

    res.status(200).json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getVideoSlotsByDoctorIdAndDate = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ message: "Doctor ID or date is missing" });
    }

    // Find all appointment slots with the provided doctorId, date, and consultation mode "video"
    const slots = await LiveAppointmentSlot.find({ doctor: doctorId, date, consultationMode: "video" });

    res.status(200).json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// that's what we required--

exports.getSlotsByDoctorIdAndDate = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    // console.log(doctorId)
    // console.log(date)

    if (!doctorId || !date) {
      return res.status(400).json({ message: "Doctor ID or date is missing" });
    }

    // Find all appointment slots with the provided doctorId and date
    const slots = await LiveAppointmentSlot.find({ doctor: doctorId, date });

    res.status(200).json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.getSlotByID = async (req, res) => {
  try {
    const { slotId } = req.params;

    if (!slotId) {
      return res.status(400).json({ message: "Slot ID is missing" });
    }

    // Find the appointment slot by its ID
    const slot = await LiveAppointmentSlot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.status(200).json(slot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getSlotByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is missing" });
    }

    // Find all appointment slots for the specified patient
    const slots = await LiveAppointmentSlot.find({ patientId });

    res.status(200).json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getSlotsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res
        .status(400)
        .json({ message: "Date is missing in the request query parameters" });
    }

    // Find all appointment slots with the provided date
    const slots = await LiveAppointmentSlot.find({ date });

    res.status(200).json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// yeh faltu hai bhai time waste
exports.completeAppointment = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { startTime } = req.body;

    const io = req.io;

    if (!slotId || !startTime) {
      return res.status(400).json({ message: "Slot ID or start time is missing" });
    }

    const slot = await LiveAppointmentSlot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    slot.status = "completed";

    // console.log(startTime)
    
    const endTime = new Date();
    console.log(endTime)
    const start = new Date(startTime);
    console.log(start)
    // const durationInMillis = endTime - start;

    // Calculate duration in minutes
    const durationInMin = durationInMillis / (1000 * 60);

    const totalCompletedAppointments = await LiveAppointmentSlot.countDocuments({ status: "completed" });

    let newAverageTime;

    if (totalCompletedAppointments === 0) {
      newAverageTime = durationInMin; // If no appointments completed yet, set the average time to the duration of this appointment
    } else {
      const existingAverageTime = slot.averageConsultationTime;
      
      // Calculate the new average consultation time
      newAverageTime = ((existingAverageTime * totalCompletedAppointments) + durationInMin) / (totalCompletedAppointments + 1);
    }

    // // Update the average consultation time in the slot
    // slot.averageConsultationTime = newAverageTime;

    // // Emit an event to indicate that appointment has been completed
    // io.emit('appointmentCompleted', { slotId: slot._id });

    // // Save the updated slot
    // await slot.save();

    // res.status(200).json({ message: "Appointment slot marked as completed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateAppointmentTimesController = async (req, res) => {
  try {
      // Find all slots
      const allSlots = await LiveAppointmentSlot.find();

      // Get the total number of slots
      const totalSlots = allSlots.length;

      // Get the average consultation time
      const averageConsultationTime = allSlots.reduce((total, slot) => total + slot.averageConsultationTime, 0) / totalSlots;

      // Update the appointment times for each slot
      allSlots.forEach((slot, index) => {
          const expectedTime = new Date(slot.appointmentTime);
          expectedTime.setMinutes(expectedTime.getMinutes() + averageConsultationTime);
          slot.appointmentTime = expectedTime;
      });

      // Save all updated slots
      await Promise.all(allSlots.map(slot => slot.save()));

      res.status(200).json({ message: "Appointment times updated successfully"});
  } catch (error) {
      console.error("Error updating appointment times:", error);
      res.status(500).json({ error: "Failed to update appointment times" });
  }
};

