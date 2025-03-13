const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 4005;

app.use(cors());
app.use(bodyParser.json());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(express.static(path.join(__dirname, "./public")));
// app.use(express.static(path.join(__dirname, "./public/build")));

db.sequelize
  .sync()
  .then(() => console.log("Database connected and synced"))
  .catch((err) => console.error("Database sync failed:", err));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./public/build", "index.html"));
// });

app.set("views", path.join("./src/views"));
app.set("view engine", "ejs");

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
