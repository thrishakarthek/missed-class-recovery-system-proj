const Schedule = require("../models/Schedule");
const Class = require("../models/Class");
const Subject = require("../models/Subject");
const User = require("../models/User");

// Create or update daily schedule
exports.createOrUpdateSchedule = async (req, res) => {
  try {
    const { classId, date, periods } = req.body;

    if (!classId || !date || !periods) {
      return res.status(400).json({
        message: "classId, date, and periods are required"
      });
    }

    if (!Array.isArray(periods) || periods.length !== 8) {
      return res.status(400).json({
        message: "Exactly 8 periods are required"
      });
    }

    const existingClass = await Class.findById(classId);
    if (!existingClass) {
      return res.status(404).json({
        message: "Class not found"
      });
    }

    for (const period of periods) {
      const { periodNumber, status, subjectId, facultyId } = period;

      if (!periodNumber || !status) {
        return res.status(400).json({
          message: "Each period must have periodNumber and status"
        });
      }

      if (status === "scheduled") {
        if (!subjectId || !facultyId) {
          return res.status(400).json({
            message: `Period ${periodNumber}: subjectId and facultyId are required for scheduled periods`
          });
        }

        const subject = await Subject.findById(subjectId);
        if (!subject) {
          return res.status(404).json({
            message: `Period ${periodNumber}: Subject not found`
          });
        }

        const faculty = await User.findById(facultyId);
        if (!faculty || faculty.role !== "faculty") {
          return res.status(404).json({
            message: `Period ${periodNumber}: Faculty not found or invalid`
          });
        }
      }
    }

    let schedule = await Schedule.findOne({ classId, date });

    if (schedule) {
      schedule.periods = periods;
      schedule.createdBy = req.user.id;
      await schedule.save();

      return res.status(200).json({
        message: "Schedule updated successfully",
        schedule
      });
    }

    schedule = await Schedule.create({
      classId,
      date,
      periods,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: "Schedule created successfully",
      schedule
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating/updating schedule",
      error: error.message
    });
  }
};

// Get schedule by class and date
exports.getScheduleByClassAndDate = async (req, res) => {
  try {
    const { classId, date } = req.params;

    const schedule = await Schedule.findOne({ classId, date })
      .populate("classId", "department year section")
      .populate("periods.subjectId", "name subjectCode")
      .populate("periods.facultyId", "name email");

    if (!schedule) {
      return res.status(404).json({
        message: "No schedule found for this class and date"
      });
    }

    res.status(200).json({
      message: "Schedule fetched successfully",
      schedule
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching schedule",
      error: error.message
    });
  }
};