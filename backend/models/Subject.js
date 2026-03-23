const mongoose = require("mongoose");

const generalNoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    subjectCode: {
      type: String,
      trim: true
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    generalNotes: [generalNoteSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);