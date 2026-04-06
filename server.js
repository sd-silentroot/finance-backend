const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/records", require("./routes/records"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/users", require("./routes/users"));

app.get("/", (req, res) => {
  res.json({ message: "Finance Backend API Running" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
