const Session = require("../models/Session");
const mongoose = require("mongoose");

// Get all missed sessions in a date range
exports.getMissedSessions = async (req, res) => {
  try {
    const { classId, startDate, endDate } = req.query;

    if (!classId || !startDate || !endDate) {
      return res.status(400).json({
        message: "classId, startDate, and endDate are required"
      });
    }

    const sessions = await Session.find({
      classId,
      date: { $gte: startDate, $lte: endDate }
    })
      .populate("subjectId", "name subjectCode")
      .populate("facultyId", "name email")
      .sort({ date: 1, periodNumber: 1 });

    res.status(200).json({
      message: "Missed sessions fetched successfully",
      totalSessions: sessions.length,
      sessions
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching missed sessions",
      error: error.message
    });
  }
};

// Get subject-wise missed count using aggregation
exports.getMissedSummary = async (req, res) => {
  try {
    const { classId, startDate, endDate } = req.query;

    if (!classId || !startDate || !endDate) {
      return res.status(400).json({
        message: "classId, startDate, and endDate are required"
      });
    }

    const summary = await Session.aggregate([
      {
        $match: {
          classId: new mongoose.Types.ObjectId(classId),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$subjectId",
          totalMissed: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "subjects",
          localField: "_id",
          foreignField: "_id",
          as: "subject"
        }
      },
      {
        $unwind: "$subject"
      },
      {
        $project: {
          _id: 0,
          subjectId: "$subject._id",
          subjectName: "$subject.name",
          subjectCode: "$subject.subjectCode",
          totalMissed: 1
        }
      },
      {
        $sort: { totalMissed: -1, subjectName: 1 }
      }
    ]);

    res.status(200).json({
      message: "Missed summary fetched successfully",
      summary
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching missed summary",
      error: error.message
    });
  }
};