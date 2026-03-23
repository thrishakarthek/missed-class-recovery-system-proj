const Subject = require("../models/Subject");
const Class = require("../models/Class");
const User = require("../models/User");

// Create subject
exports.createSubject = async (req, res) => {
  try {
    const { name, subjectCode, classId, facultyId } = req.body;

    if (!name || !classId || !facultyId) {
      return res.status(400).json({
        message: "Name, classId, and facultyId are required"
      });
    }

    const existingClass = await Class.findById(classId);
    if (!existingClass) {
      return res.status(404).json({
        message: "Class not found"
      });
    }

    const faculty = await User.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found"
      });
    }

    if (faculty.role !== "faculty") {
      return res.status(400).json({
        message: "Selected user is not a faculty"
      });
    }

    const existingSubject = await Subject.findOne({
      name,
      classId
    });

    if (existingSubject) {
      return res.status(400).json({
        message: "Subject already exists for this class"
      });
    }

    const subject = await Subject.create({
      name,
      subjectCode,
      classId,
      facultyId
    });

    res.status(201).json({
      message: "Subject created successfully",
      subject
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating subject",
      error: error.message
    });
  }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("classId", "department year section")
      .populate("facultyId", "name email role");

    res.status(200).json({
      message: "Subjects fetched successfully",
      subjects
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching subjects",
      error: error.message
    });
  }
};

// Get subjects by class
exports.getSubjectsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const subjects = await Subject.find({ classId })
      .populate("classId", "department year section")
      .populate("facultyId", "name email role")
      .populate("generalNotes.uploadedBy", "name");

    res.status(200).json({
      message: "Subjects for class fetched successfully",
      subjects
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching subjects by class",
      error: error.message
    });
  }
};

exports.uploadGeneralNote = async (req, res) => {
  try {
    const { subjectId, title } = req.body;

    // validation
    if (!subjectId || !title || !req.file) {
      return res.status(400).json({
        message: "subjectId, title, and file are required"
      });
    }

    // find subject
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found"
      });
    }

    // file URL
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    // push into generalNotes
    subject.generalNotes.push({
      title,
      fileUrl,
      uploadedBy: req.user.id
    });

    await subject.save();

    res.status(200).json({
      message: "General note uploaded successfully",
      subject
    });

  } catch (error) {
    res.status(500).json({
      message: "Error uploading general note",
      error: error.message
    });
  }
};