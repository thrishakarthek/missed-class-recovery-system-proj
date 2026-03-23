const Class = require("../models/Class");

// Create class (faculty only)
exports.createClass = async (req, res) => {
  try {
    const { department, year, section } = req.body;

    if (!department || !year || !section) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Check if class already exists
    const existingClass = await Class.findOne({
      department,
      year,
      section
    });

    if (existingClass) {
      return res.status(400).json({
        message: "Class already exists"
      });
    }

    const newClass = await Class.create({
      department,
      year,
      section
    });

    res.status(201).json({
      message: "Class created successfully",
      classData: newClass
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating class",
      error: error.message
    });
  }
};

// Get all classes
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find();

    res.status(200).json({
      message: "Classes fetched successfully",
      classes
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching classes",
      error: error.message
    });
  }
};