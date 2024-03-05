const express = require("express");
const app = express.Router();

/**
 * @path /api/analitics/users
 */
app.use("/users", require("./users"));

/**
 * @path /api/analitics/publishers
 */
app.use("/publishers", require("./publishers"));

module.exports = app;