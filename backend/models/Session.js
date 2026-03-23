const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: {
      type: String,
      required: true
    },
    periodNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    summary: {
      type: String,
      required: true,
      trim: true
    },
    topicsCovered: [
      {
        type: String,
        trim: true
      }
    ],
    sessionNotes: [
      {
        title: {
          type: String,
          trim: true
        },
        fileUrl: {
          type: String
        },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        noteType: {
          type: String,
          enum: ["faculty", "student"],
          default: "faculty"
        },
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);