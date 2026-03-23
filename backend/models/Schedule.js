const mongoose = require("mongoose");

const periodSchema = new mongoose.Schema(
  {
    periodNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    status: {
      type: String,
      enum: ["scheduled", "free"],
      required: true
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      default: null
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { _id: false }
);

const scheduleSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },
    date: {
      type: String,
      required: true
    },
    periods: {
      type: [periodSchema],
      validate: {
        validator: function (value) {
          return value.length === 8;
        },
        message: "Schedule must contain exactly 8 periods"
      }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);