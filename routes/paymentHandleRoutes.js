const express = require("express");
const LiveAppointmentSlot = require("../models/liveAppointmentMode");
const stripe = require("stripe")(
  "sk_test_51OiHCoSE17PdorGk2Lirmcz7coyV3RB5axlrxe4vt0IIy0SwYmr9slc6TEhoxHlAC0E7L8i7sY9RpoWmfLKg0zny00cgk3Dmr0"
);
// const io = require("../index");

const router = express.Router();

module.exports = function (io) {
  router.post("/process-payment", async (req, res) => {
    try {
      const { appointmentId, fee, time } = req.body;

      // Create a Checkout session using the Stripe API
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `Appointment at ${new Date(time).toLocaleString()}`,
              },
              unit_amount: fee * 100, // Convert fee to paisa (INR has no decimal)
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: "http://localhost:5173/success", // Redirect URL after successful payment
        cancel_url: "http://localhost:5173/cancel", // Redirect URL if payment is canceled
      });

      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      console.error("Error creating Checkout session:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });

  router.post("/handle-payment", async (req, res) => {
    try {
      const {
        sessionId,
        action,
        appointmentId,
        patientUsername,
        patientId,
        appointmentMode,
      } = req.body;
      // Retrieve Checkout session details from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      // Update appointment status based on action
      let status;
      if (action === "confirmed") {
        status = "confirmed";
      } else if (action === "cancelled") {
        status = "cancelled";
      } else {
        return res.status(400).json({ message: "Invalid action" });
      }

      // console.log(appointmentMode)
      // Update appointment status and mode in the database
      await LiveAppointmentSlot.findByIdAndUpdate(appointmentId, {
        status: status,
        patient: patientUsername,
        patientId: patientId,
        consultationMode: appointmentMode,
      });

      //sending real time connection--
      io.emit("appointmentStatus", { appointmentId, status });

      // Send success response to the client
      res.status(200).json({ message: `Payment ${status}`, success: true });
    } catch (error) {
      console.error("Error handling payment confirmation:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });

  return router;
};
