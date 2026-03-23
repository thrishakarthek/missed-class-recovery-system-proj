const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const classRoutes=require("./routes/classRoutes")
const subjectRoutes = require("./routes/subjectRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes")
const sessionRoutes = require("./routes/sessionRoutes")
const missedRoutes = require("./routes/missedRoutes")
const errorHandler = require("./middleware/errorMiddleware")

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes)
app.use("/api/classes",classRoutes)
app.use("/api/subjects", subjectRoutes);
app.use("/api/schedules",scheduleRoutes)
app.use("/api/sessions",sessionRoutes)
app.use("/api/missed", missedRoutes)
app.use(errorHandler)

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();