const express = require("express");
const liveAppointmentController = require("../controllers/liveAppointmentController");
const LiveAppointmentSlot = require("../models/liveAppointmentMode");

const router = express.Router();

module.exports = function (io) {
  router.post("/generate-slots/:doctorId", async (req, res) => {
    try {
      const { doctorId } = req.params;
      const interval = 10;
      if (!doctorId || !interval) {
        return res
          .status(400)
          .json({ error: "Doctor ID or interval is missing" });
      }
      // Generate appointment slots
      await LiveAppointmentSlot.generateSlots(doctorId, interval);

      io.emit("slotsGenerated", {});
      
      res
        .status(201)
        .json({ message: "Appointment slots generated successfully" });
    } catch (error) {
      console.error("Error generating slots:", error);
      res.status(500).json({ error: "Failed to generate appointment slots" });
    }
  });
  
  router.get("/get-slots/:doctorId", liveAppointmentController.getAllSlots);
  router.get("/get-video-slots/:doctorId", liveAppointmentController.getVideoSlotsByDoctorIdAndDate);
  router.get("/get-slot/:slotId", liveAppointmentController.getSlotByID);
  router.get(
    "/get-slot/patient/:patientId",
    liveAppointmentController.getSlotByPatientId
  );

  // get by date--
  router.get("/get/date", liveAppointmentController.getSlotsByDate);

  // this was main because it differentiate --
  router.get("/get/doctorslots/:doctorId", liveAppointmentController.getSlotsByDoctorIdAndDate);


  router.patch("/complete/:slotId", async (req, res) => {
    try {
      const { slotId } = req.params;
      const { startTime } = req.body;

      if (!slotId || !startTime) {
        return res
          .status(400)
          .json({ message: "Slot ID or start time is missing" });
      }

      // Find the appointment slot by its ID
      const slot = await LiveAppointmentSlot.findById(slotId);

      if (!slot) {
        return res.status(404).json({ message: "Slot not found" });
      }

      // Update the status to "completed"
      slot.status = "completed";

      // Calculate the duration of the consultation
      const endTime = new Date();
      const start = new Date(startTime);
      const durationInMillis = endTime - start;

      // Calculate duration in minutes
      const durationInMin = durationInMillis / (1000 * 60);
      // console.log(durationInMin)

      const totalCompletedAppointments =
        await LiveAppointmentSlot.countDocuments({ status: "completed" });
      // If there are no completed appointments, set a default average consultation time
      let newAverageTime;

      // Calculate the new average time
      const existingAverageTime = slot.averageConsultationTime;
      console.log(durationInMin);
      console.log(existingAverageTime);

      // const existingAverageTimeInMillis = existingAverageTime * 60000;
      newAverageTime =
        (existingAverageTime * totalCompletedAppointments + durationInMin) /
        (totalCompletedAppointments + 1);
      console.log(newAverageTime);

      // Update the averageConsultationTime field with the new average time
      slot.averageConsultationTime = newAverageTime;

      // Update the averageConsultationTime field with the new average time for all slots
      const allSlots = await LiveAppointmentSlot.find();
      allSlots.forEach(async (slot) => {
        slot.averageConsultationTime = newAverageTime;
        await slot.save();
      });

      io.emit("appointmentCompleted", { slotId: slot._id });

      // Save the updated slot
      await slot.save();

      res.status(200).json({ message: "Appointment slot marked as completed" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  });

  router.patch(
    "/updatetime",
    liveAppointmentController.updateAppointmentTimesController
  );

  return router;
};
