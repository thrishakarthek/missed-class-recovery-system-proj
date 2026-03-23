const Session = require("../models/Session");
const Schedule = require("../models/Schedule");

// Create session (faculty only)
exports.createSession = async (req, res) => {
  try {
    const {
      classId,
      subjectId,
      date,
      periodNumber,
      summary,
      topicsCovered,
      notesUrl
    } = req.body;

    if (!classId || !subjectId || !date || !periodNumber || !summary) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }

    // Check if schedule exists
    const schedule = await Schedule.findOne({ classId, date });

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found for this class and date"
      });
    }

    // Check if that period is scheduled
    const period = schedule.periods.find(
      (p) => p.periodNumber === periodNumber
    );

    if (!period || period.status !== "scheduled") {
      return res.status(400).json({
        message: "This period is not scheduled"
      });
    }

    // Prevent duplicate session
    const existingSession = await Session.findOne({
      classId,
      date,
      periodNumber
    });

    if (existingSession) {
      return res.status(400).json({
        message: "Session already exists for this period"
      });
    }

    const session = await Session.create({
      classId,
      subjectId,
      facultyId: req.user.id,
      date,
      periodNumber,
      summary,
      topicsCovered,
      notesUrl,
      uploadedBy: req.user.id
    });

    res.status(201).json({
      message: "Session created successfully",
      session
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating session",
      error: error.message
    });
  }
};

// Get sessions by class and date
exports.getSessionsByClassAndDate = async (req, res) => {
  try {
    const { classId, date } = req.params;

    const sessions = await Session.find({ classId, date })
      .populate("subjectId", "name subjectCode")
      .populate("facultyId", "name email")
      .populate("sessionNotes.uploadedBy", "name")

    res.status(200).json({
      message: "Sessions fetched successfully",
      sessions
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching sessions",
      error: error.message
    });
  }
};

// Faculty uploads session note
exports.uploadFacultySessionNote = async (req, res) => {
  try {
    const { sessionId, title } = req.body;

    if (!sessionId || !title || !req.file) {
      return res.status(400).json({
        message: "sessionId, title, and file are required"
      });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found"
      });
    }

    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    session.sessionNotes.push({
      title,
      fileUrl,
      uploadedBy: req.user.id,
      noteType: "faculty"
    });

    await session.save();

    res.status(200).json({
      message: "Faculty session note uploaded successfully",
      session
    });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading faculty session note",
      error: error.message
    });
  }
};

// Student uploads peer note
exports.uploadPeerNote = async (req, res) => {
  try {
    const { sessionId, title } = req.body;

    if (!sessionId || !title || !req.file) {
      return res.status(400).json({
        message: "sessionId, title, and file are required"
      });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found"
      });
    }

    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    session.sessionNotes.push({
      title,
      fileUrl,
      uploadedBy: req.user.id,
      noteType: "student"
    });

    await session.save();

    res.status(200).json({
      message: "Peer note uploaded successfully",
      session
    });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading peer note",
      error: error.message
    });
  }
};