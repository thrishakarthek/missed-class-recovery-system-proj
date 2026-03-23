exports.getStudentDashboard = async (req, res) => {
  res.json({
    message: "Welcome to student dashboard",
    user: req.user
  });
};

exports.getFacultyDashboard = async (req, res) => {
  res.json({
    message: "Welcome to faculty dashboard",
    user: req.user
  });
};

exports.getCRPanel = async (req, res) => {
  res.json({
    message: "Welcome to CR panel",
    user: req.user
  });
};