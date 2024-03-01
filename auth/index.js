const express = require("express");
const app = express.Router();

/**
 * @path /auth/users
 */
app.use("/users", require("./routes/users"));

/**
 * @path /auth/publishers
 */
app.use("/publishers", require("./routes/publishers"));

module.exports = app;