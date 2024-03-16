const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const nanoid = require("nanoid")

const staffSchema = new mongoose.Schema({
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
  permission: {
    type: Boolean,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  staffId: {
    type: String,
    default: () => nanoid(8), // Generate an 8-character staff ID by default
    unique: true,
  },
});

// Hash password before saving
staffSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Instance method for password comparison
staffSchema.methods.comparePassword = async function (candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw new Error("Password comparison failed");
    }
  };

const Staff = mongoose.model("Staff", staffSchema);

module.exports = Staff;
