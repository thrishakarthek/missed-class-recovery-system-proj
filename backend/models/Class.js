const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      required: true
    },
    section: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);