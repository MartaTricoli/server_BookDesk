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

/**
 * @path /api/me
 */
app.use("/me", require("./routes/me"));

/**
 * @path /api/analitics
 */
app.use("/analitics", require("./routes/analitics"));

/**
 * @path /api/books
 */
app.use("/books", require("./routes/books"));

module.exports = app;