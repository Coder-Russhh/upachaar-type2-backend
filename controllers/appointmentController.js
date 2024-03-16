const stripe = require("stripe")(
  "sk_test_51OiHCoSE17PdorGk2Lirmcz7coyV3RB5axlrxe4vt0IIy0SwYmr9slc6TEhoxHlAC0E7L8i7sY9RpoWmfLKg0zny00cgk3Dmr0"
);
const Appointment = require("../models/appointmentModel");

exports.createAppointment = async (req, res) => {
  try {
    const { date, startTime, fee } = req.body;
    const { doctorId, patientId } = req.params;

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Appointment Fee",
            },
            unit_amount: fee * 100, // Amount should be in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment", // Mode should be 'payment' for one-time payments
      success_url: "http://localhost:5173/success", // Redirect URL after successful payment
      cancel_url: "http://localhost:5173/cancel", // Redirect URL after canceled payment
      metadata: {
        doctorId,
        patientId,
        date,
        startTime,
        fee,
      },
    });

    const appointment = new Appointment({
      doctorId,
      patientId,
      date,
      startTime,
      fee,
      status: "pending", // Set the status to pending
      sessionId: session.id, // Save the session ID with the appointment
    });

    await appointment.save();

    // Send the session ID back to the client
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating appointment and processing payment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { sessionId, action } = req.body;
    console.log(sessionId,action)
    // Retrieve the appointment associated with the session ID
    const appointment = await Appointment.findOne({ sessionId });

    // Check if the appointment exists
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Update the appointment status based on the action
    if (action === "confirmed") {
      // Set the appointment status to 'confirmed'
      appointment.status = "confirmed";
    } else if (action === "cancelled") {
      // Set the appointment status to 'cancelled'
      appointment.status = "cancelled";
    } else {
      // Return an error response if the action is invalid
      return res.status(400).json({ error: "Invalid action" });
    }

    // Save the updated appointment to the database
    await appointment.save();

    // Return a success response
    res.status(200).json({ message: `Appointment ${action} successfully` });
  } catch (error) {
    // Handle confirmation error
    console.error("Payment confirmation error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};

exports.updateCompletedAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  const { appointmentId } = req.params;

  try {
    // Check if appointmentId and status are provided
    if (!appointmentId || !status) {
      return res
        .status(400)
        .json({ message: "Appointment ID and status are required" });
    }

    // Find the appointment in the database
    const appointment = await Appointment.findById(appointmentId);

    // Check if appointment exists
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update appointment status to the provided status
    appointment.status = status;

    // Save the updated appointment to the database
    await appointment.save();

    // Send success response
    res
      .status(200)
      .json({
        message: "Appointment status updated successfully",
        appointment,
      });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllAppointmentsForDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res
        .status(400)
        .json({ message: "Doctor Id is required for your request" });
    }

    const allAppointents = await Appointment.find({
      doctorId,
      status: "confirmed",
    });

    res.status(200).json({ allAppointents });
  } catch (error) {
    console.error("Error fetching appointents for doctor", error);
    res.status(500).json({ message: "Internal server error hai" });
  }
};

exports.getAllAppointmentsForStaff = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res
        .status(400)
        .json({ message: "Doctor Id is required for your request" });
    }

    const allAppointents = await Appointment.find({
      doctorId,
      status: "confirmed",
    });

    res.status(200).json({ allAppointents });
  } catch (error) {
    console.error("Error fetching appointents for doctor", error);
    res.status(500).json({ message: "Internal server error hai" });
  }
};
