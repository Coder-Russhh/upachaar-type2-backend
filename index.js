const express = require("express");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const staffRoutes = require("./routes/staffRoutes");
const chatBotRoutes = require("./routes/chatBotRoutes");
const appointment = require("./routes/appointmentRoutes");
const doctorAvailability = require("./routes/doctorAvailabilityRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const liveAppointmentRoutes = require("./routes/liveAppointmentRoutes");
const paymentHandleRoutes = require("./routes/paymentHandleRoutes");
// patient--
const medicalHistory = require("./routes/patient/medicalHistoryRoutes");
const healthMetrics = require("./routes/patient/healthMetricsRoutes");
const prescription = require("./routes/patient/prescriptionRoutes");
// doctor--
const clinic = require("./routes/doctor/clinicRoutes");
const review = require("./routes/reviewRoutes");

dotenv.config();
const PORT = process.env.PORT;

// socket--
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

connectDb();

// CORS setup--
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true,
};

// Middleware using here
app.use(cors(corsOptions));
app.use(express.json());

// Use routes
app.use("/api", chatBotRoutes);
app.use("/patients", patientRoutes);
app.use("/doctors", doctorRoutes);
app.use("/staff", staffRoutes);
app.use("/doctor-availabilities", doctorAvailability);
app.use("/appointment", appointment);
app.use("/live-appointments", liveAppointmentRoutes(io));
app.use("/payment", paymentHandleRoutes(io));

// Patient routes
app.use("/medical-history", medicalHistory);
app.use("/health-metrics", healthMetrics);
app.use("/prescription", prescription);

// Doctor routes
app.use("/clinic", clinic);
app.use("/reviews", review);

// sample route
app.get("/", (req, res) => {
  res.send("Hello from the backend to you (client)");
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`.bgBlue);
});

// konsi emailId kis room ke ander hai--
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

// socket io connection event--
io.on("connection", (socket) => {
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });
  socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });
  socket.on("peer:nego:done", ({ to, ans }) => {
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});
