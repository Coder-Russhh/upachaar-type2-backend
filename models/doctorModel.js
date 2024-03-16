const mongoose = require("mongoose");
const Staff = require("./staffModel");

// Doctor schema
const doctorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },
  qualification: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  clinicAddress: {
    type: String,
    required: true,
  },
  staff: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
  ],
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic'
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;

// creating method--

// doctorSchema.methods.createStaff = async function (username, email, password, role, permissions) {
//   const staff = new Staff({
//     username,
//     email,
//     password,
//     role,
//     permissions,
//     doctorId: this._id, // Associate staff with this doctor
//   });
//   await staff.save();
//   this.staff.push(staff);
//   await this.save(); // Update doctor's staff array
//   return staff;
// };

// userType: {
//   type: String,
//   enum: ["doctor"],
//   default: "doctor",
// },
// rating: {
//   type: String,
//   default: 0,
// },
// certificate: {
//   type: String,
// },
// clinicPhotos: {
//   type: String,
//   default: 0,
// },
// appointmentFee: {
//   type: String,
// },
// videoConsultation: {
//   type: Boolean,
//   default: false,
// },
