const express = require("express");
const app = express.Router();

/**
 * @path /api/users
 */
app.use("/users", require("./routes/users"));

/**
 * @path /api/publishers
 */
app.use("/publishers", require("./routes/publishers"));

module.exports = app;