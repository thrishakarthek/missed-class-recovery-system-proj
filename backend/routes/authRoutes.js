const express = require("express");
const router = express.Router();

const { signup, login, getFacultyUsers } = require("../controllers/authController");
const { auth } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/faculty-users", auth, getFacultyUsers);

module.exports = router;